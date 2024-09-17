import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { Server } from 'socket.io';

// Function for sending notifications
const sendNotification = (io: Server, receiverId: number, message: string) => {
  io.to(receiverId.toString()).emit('notification', message);
};

// Controller for creating a message
export const createMessage = async (req: Request, res: Response, io: Server) => {
  const { senderId, receiverId, content } = req.body;

  // Checking the correctness of the data
  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Convert senderId and receiverId to numbers
    const parsedSenderId = parseInt(senderId, 10);
    const parsedReceiverId = parseInt(receiverId, 10);

    // Checking whether users with such IDs exist
    const sender = await prisma.user.findUnique({ where: { id: parsedSenderId } });
    const receiver = await prisma.user.findUnique({ where: { id: parsedReceiverId } });

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'Sender or receiver not found' });
    }

    // Create a new message in the database
    const message = await prisma.message.create({
      data: {
        content,
        senderId: parsedSenderId,
        receiverId: parsedReceiverId,
      },
    });

    // Sending a notification to the recipient
    sendNotification(io, parsedReceiverId, `You have a new message from user ${parsedSenderId}`);

    res.status(200).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Unable to send message' });
  }
};
