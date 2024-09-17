import { Server } from 'socket.io';

// Exporting a function that sends a notification
export const sendNotification = (io: Server, userId: string, message: string) => {
  // Logic to send a notification to a specific user
  io.to(userId).emit('notification', message);
};
