import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { authService } from '../modules/auth/auth.service.js';
import { postService } from '../modules/posts/post.service.js';
import logger from './logger.js';

export const runSeed = async () => {
  try {
    await connectDB();
    logger.info('Starting seed process...');
    await authService.seedInitialUsers();
    await postService.seedInitialPosts();
    logger.info('Seed process finished successfully');
  } catch (error: any) {
    logger.error(`Seed process failed: ${error.message}`);
  }
};

// If run directly via CLI
if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/')) {
  runSeed().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
