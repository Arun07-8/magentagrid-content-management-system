import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';
import { authService } from './modules/auth/auth.service.js';
import { postService } from './modules/posts/post.service.js';
import logger from './utils/logger.js';

const startServer = async () => {
  const app = createApp();
  const server = http.createServer(app);

  // Initialize Socket.IO
  initSocket(server);

  // Start HTTP + Socket.IO Server immediately so API & health check are instantly available
  server.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
    logger.info(`API Base URL: http://localhost:${env.PORT}/api`);
  });

  // Connect to Database asynchronously without blocking server start
  connectDB()
    .then(async () => {
      try {
        await authService.seedInitialUsers();
        await postService.seedInitialPosts();
      } catch (error: any) {
        logger.warn(`Could not seed initial MongoDB data: ${error.message}`);
      }
    })
    .catch((error) => {
      logger.warn(`Database connection attempt failed: ${error.message}`);
    });

  // Graceful shutdown handlers
  const shutdown = () => {
    logger.info('Shutting down server gracefully...');
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch((error) => {
  logger.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});
