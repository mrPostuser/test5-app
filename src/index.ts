import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes'; // Importing message routes

dotenv.config();

const app = express();
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Allow all domains for CORS (during development)
  },
});

// We save the Socket instance. io in the application so that you can use it in controllers
app.set('io', io);

// Connecting routes for users and messages
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes); // Connecting routes for messages

// Handling WebSocket connections
io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

// Basic route to check
app.get('/', (req, res) => {
  res.send('API is running');
});

// Starting the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
