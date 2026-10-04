import readline from 'readline';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User, UserRole } from '../modules/auth/user.model.js';
import logger from '../utils/logger.js';

/**
 * Prompts user for text input with optional masking (for passwords).
 */
export function promptInput(question: string, mask = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (!mask) {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
      return;
    }

    // Masked input handling
    process.stdout.write(question);

    const onData = (char: Buffer) => {
      const str = char.toString('utf-8');

      switch (str) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.removeListener('data', onData);
          process.stdin.setRawMode(false);
          rl.close();
          process.stdout.write('\n');
          resolve(buf.trim());
          break;
        case '\u0003': // Ctrl+C
          process.stdin.removeListener('data', onData);
          process.stdin.setRawMode(false);
          rl.close();
          process.exit(1);
          break;
        case '\u0008':
        case '\x7f': // Backspace / Delete
          if (buf.length > 0) {
            buf = buf.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          buf += str;
          process.stdout.write('*');
          break;
      }
    };

    let buf = '';
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', onData);
  });
}

/**
 * Shared CLI user creation logic for Admin and Editor roles.
 */
export async function createUserCli(role: UserRole) {
  const roleTitle = role === 'admin' ? 'Admin' : 'Editor';

  try {
    const username = await promptInput('Username: ');
    if (!username) {
      console.error('\nError: Username is required.');
      process.exit(1);
    }

    const email = await promptInput('Email: ');
    if (!email) {
      console.error('\nError: Email is required.');
      process.exit(1);
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('\nError: Invalid email format.');
      process.exit(1);
    }

    const password = await promptInput('Password: ', true);
    if (!password) {
      console.error('\nError: Password is required.');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('\nError: Password must be at least 6 characters long.');
      process.exit(1);
    }

    // Connect to database using existing connection configuration
    await connectDB();

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.trim();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === cleanEmail) {
        console.error(`\nError: A user with email '${cleanEmail}' already exists.`);
      } else {
        console.error(`\nError: A user with username '${cleanUsername}' already exists.`);
      }
      await mongoose.disconnect();
      process.exit(1);
    }

    // Create user (password will be automatically hashed by UserSchema pre-save hook)
    const user = new User({
      username: cleanUsername,
      email: cleanEmail,
      password: password,
      role: role,
    });

    await user.save();

    console.log(`\n${roleTitle} user created successfully.`);
    console.log(`Username: ${user.username}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${roleTitle}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err: any) {
    logger.error(`Failed to create ${role} user: ${err.message}`);
    console.error(`\nError: ${err.message}`);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
}
