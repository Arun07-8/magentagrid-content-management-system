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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  token: string;
}

export interface AuthResult extends AuthTokens {
  user: AuthUserResponse;
}

export class AuthService {
  private isDbConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Authenticate user with email and password
   */
  async login(identifier: string, password: string): Promise<AuthResult> {
    const cleanEmail = identifier.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: this.formatUser(user),
      accessToken,
      refreshToken,
      token: accessToken,
    };
  }

  /**
   * Generate JWT access token
   */
  generateAccessToken(user: IUser | { id: string; email: string; role: UserRole; username: string }): string {
    const id = typeof (user as IUser)._id !== 'undefined' ? (user as IUser)._id.toString() : (user as { id: string }).id;
    return jwt.sign(
      {
        id,
        email: user.email,
        role: user.role,
        username: user.username,
      },
      env.JWT_ACCESS_SECRET,
      {
        expiresIn: (env.ACCESS_TOKEN_TTL || '15m') as jwt.SignOptions['expiresIn'],
      }
    );
  }

  /**
   * Generate JWT refresh token
   */
  generateRefreshToken(user: IUser | { id: string; email: string; role: UserRole; username: string }): string {
    const id = typeof (user as IUser)._id !== 'undefined' ? (user as IUser)._id.toString() : (user as { id: string }).id;
    return jwt.sign(
      {
        id,
        email: user.email,
        role: user.role,
        username: user.username,
      },
      env.JWT_REFRESH_SECRET,
      {
        expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS || 7}d`,
      }
    );
  }

  /**
   * Refresh access token using a valid refresh token
   */
  async refresh(refreshToken: string): Promise<AuthResult> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
        id: string;
        email: string;
        role: UserRole;
        username: string;
      };

      const user = await User.findById(decoded.id);
      if (!user) {
        throw new AppError('User not found or account deactivated', 401);
      }

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        user: this.formatUser(user),
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        token: newAccessToken,
      };
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  /**
   * Backward-compatible alias for generateAccessToken
   */
  generateToken(user: IUser): string {
    return this.generateAccessToken(user);
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
