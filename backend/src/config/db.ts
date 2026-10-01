import mongoose from 'mongoose';
import { env } from './env.js';
import logger from '../utils/logger.ts';

export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);

        logger.info('MongoDB connected');
    } catch (error) {
        logger.error('MongoDB connection failed');
        process.exit(1);
    }
};