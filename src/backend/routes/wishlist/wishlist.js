import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../../controllers/wishlistController.js';
import { requireRole } from '../../middlewares/roleMiddleware.js'; // Import role middleware
import { authenticateToken } from '../../middlewares/authMiddleware.js'; // Ensure user is authenticated

const router = express.Router();

// All routes use authenticate middleware
router.get('/', authenticateToken, requireRole("user"), getWishlist);
router.post('/', authenticateToken, requireRole("user"), addToWishlist);
router.delete('/:productId', authenticateToken, requireRole("user"), removeFromWishlist);

export default router;
