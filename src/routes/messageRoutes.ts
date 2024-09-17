import express from 'express';
import { createMessage } from '../controller/messageController';
import { Server } from 'socket.io';

const router = express.Router();

// Let's determine the route for creating a message
router.post('/create', (req, res) => {
  const io: Server = req.app.get('io'); // We get an instance of Socket. io from the application
  createMessage(req, res, io);
});

export default router;
