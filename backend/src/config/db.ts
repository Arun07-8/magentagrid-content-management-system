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
    throw error;
  }
};