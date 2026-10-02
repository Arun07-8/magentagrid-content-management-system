import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, IUser, UserRole } from './user.model.js';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/error.middleware.js';
import logger from '../../utils/logger.js';

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// In-memory fallback users for zero-config evaluation if MongoDB is unreachable
const IN_MEMORY_USERS: Array<{
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}> = [
  {
    _id: '662b2e8a1d5a8b001f3e1a01',
    name: 'CMS Administrator',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'admin',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
  },
  {
    _id: '662b2e8a1d5a8b001f3e1a02',
    name: 'CMS Content Editor',
    email: 'editor@example.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'editor',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
  },
];

export class AuthService {
  private isDbConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string): Promise<{ user: AuthUserResponse; token: string }> {
    const cleanEmail = email.toLowerCase().trim();

    if (this.isDbConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new AppError('Invalid email or password', 401);
      }

      const token = this.generateToken(user);
      return {
        user: this.formatUser(user),
        token,
      };
    } else {
      // In-Memory Fallback
      logger.info('Using in-memory user authentication (Database disconnected)');
      const memUser = IN_MEMORY_USERS.find((u) => u.email === cleanEmail);
      if (!memUser) {
        throw new AppError('Invalid email or password', 401);
      }

      const isMatch = await bcrypt.compare(password, memUser.passwordHash);
      if (!isMatch) {
        throw new AppError('Invalid email or password', 401);
      }

      const token = jwt.sign(
        {
          id: memUser._id,
          email: memUser.email,
          role: memUser.role,
          name: memUser.name,
        },
        env.JWT_ACCESS_SECRET,
        {
          expiresIn: (env.ACCESS_TOKEN_TTL || '7d') as jwt.SignOptions['expiresIn'],
        }
      );

      return {
        user: {
          id: memUser._id,
          name: memUser.name,
          email: memUser.email,
          role: memUser.role,
          createdAt: memUser.createdAt.toISOString(),
        },
        token,
      };
    }
  }

  /**
   * Generate JWT access token
   */
  generateToken(user: IUser): string {
    return jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
      env.JWT_ACCESS_SECRET,
      {
        expiresIn: (env.ACCESS_TOKEN_TTL || '7d') as jwt.SignOptions['expiresIn'],
      }
    );
  }

  /**
   * Get user by ID without password
   */
  async getUserById(id: string): Promise<AuthUserResponse> {
    if (this.isDbConnected()) {
      const user = await User.findById(id).select('-password');
      if (!user) {
        throw new AppError('User not found', 404);
      }
      return this.formatUser(user);
    } else {
      const memUser = IN_MEMORY_USERS.find((u) => u._id === id);
      if (!memUser) {
        throw new AppError('User not found', 404);
      }
      return {
        id: memUser._id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        createdAt: memUser.createdAt.toISOString(),
      };
    }
  }

  /**
   * Formats user document for client response
   */
  formatUser(user: IUser): AuthUserResponse {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }

  /**
   * Seed default Admin and Editor accounts in MongoDB if present
   */
  async seedInitialUsers(): Promise<void> {
    if (!this.isDbConnected()) return;

    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      await User.create({
        name: 'CMS Administrator',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });
      logger.info('Default Admin user created: admin@example.com / password123');
    }

    const editorExists = await User.findOne({ email: 'editor@example.com' });
    if (!editorExists) {
      await User.create({
        name: 'CMS Content Editor',
        email: 'editor@example.com',
        password: 'password123',
        role: 'editor',
      });
      logger.info('Default Editor user created: editor@example.com / password123');
    }
  }
}

export const authService = new AuthService();
