import express from 'express';
import upload from '../middlewares/upload';
import { uploadAvatar, createUser } from '../controller/userController';
import prisma from '../prisma/client'; // Connecting Prisma to work with the database

const router = express.Router();

// Avatar upload route
router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);

// Route for creating a user
router.post('/create', createUser);

// Route for creating a user
router.post('/create', async (req, res) => {
    const { email, name } = req.body;
  
    try {
      const user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
  
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Unable to create user' });
    }
  });
  

export default router;
