import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../../controllers/wishlistController.js';
import { authenticate } from '../../middlewares/authenticate.js';

const router = express.Router();

// All routes use authenticate middleware
router.get('/', authenticate, getWishlist);
router.post('/', authenticate, addToWishlist);
router.delete('/:productId', authenticate, removeFromWishlist);

export default router;
