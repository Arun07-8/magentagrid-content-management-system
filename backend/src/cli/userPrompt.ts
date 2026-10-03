import readline from 'node:readline';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '../config/db.js';
import { User, UserRole } from '../modules/auth/user.model.js';

export type CliRole = Extract<UserRole, 'admin' | 'editor'>;

const cliUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username is required.')
    .min(2, 'Username must be at least 2 characters.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Invalid email address.'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['admin', 'editor']),
});

function askMaskedPassword(promptText: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(promptText);
    let password = '';

    if (!process.stdin.setRawMode) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question('', (answer) => {
        rl.close();
        resolve(answer);
      });
      return;
    }

    const wasRaw = process.stdin.isRaw;
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf-8');

    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === '\r' || char === '\n') {
          process.stdin.setRawMode(wasRaw ?? false);
          process.stdin.pause();
          process.stdin.removeListener('data', onData);
          process.stdout.write('\n');
          resolve(password);
          return;
        } else if (char === '\u0003') {
          // Ctrl+C
          process.stdin.setRawMode(wasRaw ?? false);
          process.stdout.write('\n');
          process.exit(130);
        } else if (char === '\u0004') {
          // Ctrl+D
          if (password.length === 0) {
            process.stdin.setRawMode(wasRaw ?? false);
            process.stdout.write('\n');
            process.exit(0);
          }
        } else if (char === '\b' || char === '\x7f' || char === '\x08') {
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
        } else if (char >= ' ') {
          password += char;
          process.stdout.write('*');
        }
      }
    };

    process.stdin.on('data', onData);
  });
}

export async function promptCredentials(
  _role: CliRole
): Promise<{ username: string; email: string; password: string }> {
  if (!process.stdin.isTTY) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    const lines: string[] = [];
    for await (const line of rl) {
      lines.push(line.trim());
      if (lines.length === 3) break;
    }
    rl.close();

    const username = lines[0] ?? '';
    const email = lines[1] ?? '';
    const password = lines[2] ?? '';

    process.stdout.write(`Username: ${username}\n`);
    process.stdout.write(`Email: ${email}\n`);
    process.stdout.write(`Password: ${'*'.repeat(password.length)}\n`);

    return { username, email, password };
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('SIGINT', () => {
    rl.close();
    process.exit(130);
  });

  const ask = (promptText: string): Promise<string> =>
    new Promise((resolve) => rl.question(promptText, (ans) => resolve(ans.trim())));

  const username = await ask('Username: ');
  const email = await ask('Email: ');
  rl.close();

  const password = await askMaskedPassword('Password: ');

  return { username, email, password };
}

export async function createUserWithPrompt(role: CliRole): Promise<void> {
  const roleTitle = role === 'admin' ? 'Admin' : 'Editor';
  const actionLabel = role === 'admin' ? 'admin' : 'editor';
  const roleUpper = role.toUpperCase(); // 'ADMIN' or 'EDITOR'

  process.on('SIGINT', async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close().catch(() => { });
    }
    process.exit(130);
  });

  // Step 1: Prompt credentials
  const rawInput = await promptCredentials(role);

  // Step 2: Validate values
  const validation = cliUserSchema.safeParse({
    username: rawInput.username,
    email: rawInput.email,
    password: rawInput.password,
    role,
  });

  if (!validation.success) {
    const firstIssue = validation.error.issues[0];
    console.error(`\n${firstIssue.message}`);
    process.exit(1);
  }

  const { username, email, password } = validation.data;
  const cleanEmail = email.toLowerCase().trim();

  // Step 3: Connect to MongoDB
  try {
    await connectDB();
  } catch (_error) {
    console.error('\nFailed to connect to database.');
    process.exit(1);
  }

  // Step 4: Check duplicate email & create user
  try {
    const cleanUsername = username.trim().toLowerCase();
    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }]
    });

    if (existingUser) {
      console.error('\nA user with this email or username already exists.');
      await mongoose.connection.close();
      process.exit(1);
    }

    const user = await User.create({
      username: username,
      email: cleanEmail,
      password,
      role,
    });

    console.log(`\n${roleTitle} created successfully.`);
    console.log(`Username: ${user.username}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${roleUpper}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    if (error?.code === 11000) {
      console.error('\nA user with this email already exists.');
    } else {
      console.error(`\nFailed to create ${actionLabel} user.`);
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close().catch(() => { });
    }
    process.exit(1);
  }
}
