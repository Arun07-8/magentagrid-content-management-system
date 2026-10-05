import { Router } from 'express';
import { settingsController } from './settings.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

const router = Router();

// Public route to read published navigation & logo
router.get('/public', (req, res, next) =>
  settingsController.getSettings(req, res, next)
);

// Protected routes (Admin & Editor)
router.use(authenticate);

router.get('/', (req, res, next) =>
  settingsController.getSettings(req, res, next)
);

router.put('/', requireRole('admin', 'editor'), (req, res, next) =>
  settingsController.updateSettings(req, res, next)
);

export default router;
