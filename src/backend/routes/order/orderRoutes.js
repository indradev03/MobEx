import express from "express";
import { createOrder } from "../../controllers/orderController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/orders
router.post("/", authenticateToken, createOrder);

export default router;
