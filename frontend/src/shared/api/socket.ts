import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Real-time Socket.IO connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Real-time Socket.IO disconnected');
    });
  }

  return socket;
};
