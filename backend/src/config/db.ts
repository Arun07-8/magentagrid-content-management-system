import mongoose from 'mongoose';
import { env } from './env.js';
import logger from '../utils/logger.js';

export const connectDB = async () => {
  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    logger.info('MongoDB connected successfully');
  } catch (error: any) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    logger.error(
      'NOTE: If using MongoDB Atlas, ensure your current IP address is whitelisted in Atlas Network Access (or 0.0.0.0/0 for testing).'
    );
    // Attempt local fallback if running locally
    try {
      logger.info('Attempting fallback to local MongoDB instance (mongodb://127.0.0.1:27017/magentagrid)...');
      await mongoose.connect('mongodb://127.0.0.1:27017/magentagrid', {
        serverSelectionTimeoutMS: 2000,
      });
      logger.info('Connected to local MongoDB fallback successfully');
    } catch (localError: any) {
      logger.error('Local fallback unavailable as well. Please check MongoDB configuration.');
      // Do not exit process immediately so server can still serve health check / helpful status
    }
  }
};