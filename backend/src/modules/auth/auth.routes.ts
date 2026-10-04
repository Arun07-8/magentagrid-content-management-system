import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { loginSchema } from './auth.validation.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/login', validateRequest(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

router.post('/refresh', (req, res, next) =>
  authController.refresh(req, res, next)
);

router.post('/logout', (req, res) => authController.logout(req, res));

router.get('/me', authenticate, (req, res, next) =>
  authController.getMe(req, res, next)
);

export default router;
