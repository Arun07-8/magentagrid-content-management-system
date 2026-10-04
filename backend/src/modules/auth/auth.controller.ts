import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/error.middleware.js';

const isProduction = process.env.NODE_ENV === 'production';

const getAccessCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ('strict' as const) : ('lax' as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
});

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ('strict' as const) : ('lax' as const),
  maxAge: (env.REFRESH_TOKEN_TTL_DAYS || 7) * 24 * 60 * 60 * 1000,
  path: '/',
});

const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ('strict' as const) : ('lax' as const),
  path: '/',
});

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.cookie('cms_token', result.accessToken, getAccessCookieOptions());
      res.cookie('cms_refresh_token', result.refreshToken, getRefreshCookieOptions());

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.cms_refresh_token || req.body?.refreshToken;
      if (!refreshToken) {
        throw new AppError('Refresh token required', 401);
      }

      const result = await authService.refresh(refreshToken);

      res.cookie('cms_token', result.accessToken, getAccessCookieOptions());
      res.cookie('cms_refresh_token', result.refreshToken, getRefreshCookieOptions());

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    const clearOpts = getClearCookieOptions();
    res.clearCookie('cms_token', clearOpts);
    res.clearCookie('cms_refresh_token', clearOpts);
    res.clearCookie('token', clearOpts);
    res.clearCookie('cms_access_token', clearOpts);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getUserById(req.user!.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();

