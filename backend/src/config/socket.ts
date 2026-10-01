import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import logger from '../utils/logger.js';

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*', // Or frontend origin
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    logger.info(`Real-time client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`Real-time client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized yet');
  }
  return io;
};

export const broadcastEvent = (event: string, payload: unknown): void => {
  if (io) {
    io.emit(event, payload);
    logger.info(`Broadcasted real-time event: ${event}`);
  }
};
