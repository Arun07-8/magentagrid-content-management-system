import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UserRole } from '../modules/auth/user.model.js';
import { AppError } from './error.middleware.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  let token: string | undefined;

  // 1. Check cookies first
  if (req.cookies && (req.cookies.cms_token || req.cookies.token)) {
    token = req.cookies.cms_token || req.cookies.token;
  }

  // 2. Fallback to Authorization: Bearer header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return next(new AppError('Authentication required. No token provided.', 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (error: any) {
    return next(new AppError('Invalid or expired token', 401));
  }
};
