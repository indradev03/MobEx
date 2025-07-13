import express from 'express';
import {
  addToCart,
  getCartItems,
  updateCartQuantity,
  removeCartItem
} from '../../controllers/cartController.js';

const router = express.Router();

// Add product to cart
router.post('/', addToCart);

// Get all cart items for the user
router.get('/', getCartItems);

// Update quantity of a specific cart item
router.put('/:cartId', updateCartQuantity);

// Remove a cart item (optional but useful)
router.delete('/:cartId', removeCartItem);

export default router;
