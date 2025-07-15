import express from "express";
import {
  createOrder,
  getOrderHistory,
  deleteOrderById,
  deleteAllOrdersForUser,
} from "../../controllers/orderController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { requireRole } from "../../middlewares/roleMiddleware.js"; // Import role middleware

const router = express.Router();

// Create a new order
router.post("/", authenticateToken, createOrder);

// Get order history for authenticated user
router.get("/history", authenticateToken,requireRole("user") , getOrderHistory);

// Delete a specific order by ID
router.delete("/history/:orderId", authenticateToken, deleteOrderById);

// Delete all orders for authenticated user
router.delete("/history", authenticateToken, deleteAllOrdersForUser);

export default router;
