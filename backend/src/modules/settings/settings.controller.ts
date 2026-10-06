import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service.js';

const settingsService = new SettingsService();

export class SettingsController {
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
      const { logo, navigationItems, footer } = req.body;
      const data = await settingsService.updateSettings({ logo, navigationItems, footer });
      res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController = new SettingsController();
