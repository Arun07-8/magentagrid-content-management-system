import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, IUser, UserRole } from './user.model.js';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/error.middleware.js';
import logger from '../../utils/logger.js';

export interface AuthUserResponse {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export class AuthService {
  private isDbConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Authenticate user with email and password
   */
  async login(identifier: string, password: string): Promise<{ user: AuthUserResponse; token: string }> {
    const cleanEmail = identifier.toLowerCase().trim();

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
        username: user.username,
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
    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return this.formatUser(user);
  }

  /**
   * Formats user document for client response
   */
  formatUser(user: IUser): AuthUserResponse {
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}

export const authService = new AuthService();
