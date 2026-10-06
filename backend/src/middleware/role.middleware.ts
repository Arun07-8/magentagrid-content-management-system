import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../modules/auth/user.model.js';
import { AppError } from './error.middleware.js';

export const requireRole = (...allowedRoles: (UserRole | string)[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      return next(new AppError('Authentication required.', 401));
    }

    const userRoleNormalized = String(req.user.role).toLowerCase().trim();
    const allowedNormalized = allowedRoles.map((r) => String(r).toLowerCase().trim());

    if (!allowedNormalized.includes(userRoleNormalized)) {
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
