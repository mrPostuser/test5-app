import { Request, Response } from 'express';
import prisma from '../prisma/client';

// Controller for creating a user
export const createUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  // Checking that both fields have been transmitted
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required' });
  }

  try {
    // Checking if a user with this email exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Creating a user in the database
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
};

// Controller for loading avatar
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    // Let's check that the file has been downloaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Let's check if a user with this userId exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Save the link to the avatar
    const avatarUrl = `/uploads/${req.file.filename}`;
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { avatarUrl },
    });

    res.status(200).json({
      message: 'Avatar uploaded successfully',
      avatarUrl: updatedUser.avatarUrl,
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
