import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const API_BASE = 'http://localhost:5000/api';
const MONGODB_URI = "mongodb://arun08kkv_db_user:RnRCekbuHTnypu0W@ac-zv997xk-shard-00-00.ynf43hd.mongodb.net:27017,ac-zv997xk-shard-00-01.ynf43hd.mongodb.net:27017,ac-zv997xk-shard-00-02.ynf43hd.mongodb.net:27017/?ssl=true&replicaSet=atlas-3tgvkr-shard-0&authSource=admin&appName=Cluster0";

async function runAuthTests() {
  console.log('=== STARTING AUTHENTICATION VERIFICATION TESTS ===\n');

  // Set up editor user in DB to test compatibility
  await mongoose.connect(MONGODB_URI);
  const salt = await bcrypt.genSalt(10);
  const editorHash = await bcrypt.hash('Editor123!', salt);
  await mongoose.connection.db.collection('users').updateOne(
    { email: 'test.editor@example.com' },
    {
      $set: {
        username: 'testeditor',
        email: 'test.editor@example.com',
        password: editorHash,
        role: 'editor',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );

  // We need to rename any existing user's 'name' to 'username' to align with the schema
  await mongoose.connection.db.collection('users').updateMany(
    { name: { $exists: true } },
    [{ $set: { username: "$name" } }, { $unset: "name" }]
  );

  await mongoose.disconnect();
  console.log('✅ Prepared test editor user and migrated existing names to usernames\n');

  async function tryLogin(identifier, email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, email, password })
    });
    const data = await res.json();
    return { status: res.status, data };
  }

  // TEST 1: Login with valid email + password
  console.log('--- TEST 1: Login with valid email + password ---');
  let result = await tryLogin('arunadmin@gmail.com', 'arunadmin@gmail.com', 'Admin123!');
  console.log(result.status, result.data.success);
  if (result.status !== 200 || !result.data.success) throw new Error('Test 1 failed');
  const adminToken = result.data.data.token;

  // TEST 2: Login with valid username + password
  console.log('--- TEST 2: Login with valid username + password ---');
  result = await tryLogin('admin', 'admin', 'Admin123!');
  console.log(result.status, result.data.success);
  if (result.status !== 200 || !result.data.success) throw new Error('Test 2 failed');

  // TEST 3: Editor user login with username
  console.log('--- TEST 3: Editor login with username ---');
  result = await tryLogin('testeditor', 'testeditor', 'Editor123!');
  console.log(result.status, result.data.success);
  if (result.status !== 200 || !result.data.success) throw new Error('Test 3 failed');

  // TEST 4: Wrong email
  console.log('--- TEST 4: Wrong email ---');
  result = await tryLogin('wrong@example.com', 'wrong@example.com', 'Admin123!');
  console.log(result.status, result.data.success);
  if (result.status !== 401) throw new Error('Test 4 failed');

  // TEST 5: Wrong username
  console.log('--- TEST 5: Wrong username ---');
  result = await tryLogin('wrongadmin', 'wrongadmin', 'Admin123!');
  console.log(result.status, result.data.success);
  if (result.status !== 401) throw new Error('Test 5 failed');

  // TEST 6: Wrong password
  console.log('--- TEST 6: Wrong password ---');
  result = await tryLogin('admin', 'admin', 'WrongPass!');
  console.log(result.status, result.data.success);
  if (result.status !== 401) throw new Error('Test 6 failed');

  // TEST 7: Empty identifier
  console.log('--- TEST 7: Empty identifier ---');
  result = await tryLogin('', '', 'Admin123!');
  console.log(result.status, result.data.success);
  if (result.status !== 400) throw new Error('Test 7 failed');

  // TEST 8: Protected endpoint
  console.log('--- TEST 8: Verify token with /auth/me ---');
  const meRes = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const meData = await meRes.json();
  console.log(meRes.status, meData.success);
  if (meRes.status !== 200 || !meData.success) throw new Error('Test 8 failed');

  console.log('\n✅ ALL TESTS PASSED SUCCESSFULLY!');
}

runAuthTests().catch(console.error);
