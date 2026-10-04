import path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes.js';
import postRoutes from './modules/posts/post.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import logger from './utils/logger.js';

export const createApp = () => {
  const app = express();

  // Middlewares
  app.use(
    cors({
      origin: (origin, callback) => {
        // Echo calling origin back so credentials / cookies work seamlessly
        callback(null, origin || true);
      },
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));


  // Static uploads directory
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // HTTP Request Logging
  app.use((req: Request, _res: Response, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'cms-backend',
      timestamp: new Date().toISOString(),
    });
  });

  // Module Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postRoutes);

  // 404 for unhandled API routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `API route not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
