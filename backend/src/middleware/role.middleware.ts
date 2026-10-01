import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../modules/auth/user.model.js';
import { AppError } from './error.middleware.js';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access forbidden: '${req.user.role}' role is not authorized to perform this action.`,
          403
        )
      );
    }

    next();
  };
};
