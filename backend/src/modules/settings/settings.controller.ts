import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service.js';

const settingsService = new SettingsService();

export class SettingsController {
  async getPublicSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await settingsService.getPublicSettings();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await settingsService.getSettings();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { logo, navigationItems, footer, isPublishing } = req.body;
      const data = await settingsService.updateSettings({ logo, navigationItems, footer, isPublishing });
      res.status(200).json({
        success: true,
        message: isPublishing ? 'Settings published live!' : 'Draft settings saved',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController = new SettingsController();
