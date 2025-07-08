import express from 'express';
import { signup, login } from '../../controllers/userController.js';

const router = express.Router();

// Register a new user
router.post('/signup', signup);

// Login an existing user
router.post('/login', login);

export default router;
