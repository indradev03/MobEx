import express from 'express';
import {
  addToCart,
  getCartItems,
  updateCartQuantity,
  removeCartItem
} from '../../controllers/cartController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { requireRole } from '../../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticateToken, requireRole("user"));

router.get('/', getCartItems);
router.post('/', addToCart);
router.put('/:cartId', updateCartQuantity);
router.delete('/:cartId', removeCartItem);

export default router;
