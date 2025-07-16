import express from 'express';
import {
  signup,
  login,
  getUserProfile,
  uploadProfileImage,
  deleteProfileImage,
  updateProfile,
  getAllUsers,
  deleteUserById
} from '../../controllers/userController.js';

import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { uploadFields } from '../../middlewares/multerConfig.js'; // ✅ handles "image" and "thumbnails"

const router = express.Router();

// Register a new user
router.post('/signup', signup);

// Login an existing user
router.post('/login', login);

// Get current user's profile
router.get('/profile', authenticateToken, getUserProfile);

router.put('/profile/update', authenticateToken, updateProfile);

router.delete('/profile/delete-image', authenticateToken, deleteProfileImage);

// Upload profile picture
router.post('/profile/upload', authenticateToken, uploadFields, uploadProfileImage);

// Protect route so only admin can fetch users (optional)
router.get('/all', authenticateToken, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}, getAllUsers);

// DELETE user by ID - protect route, maybe admin only
router.delete('/:id', authenticateToken, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}, deleteUserById);

export default router;
