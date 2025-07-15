import express from "express";
import { getAllOrdersForAdmin } from "../../controllers/orderController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { requireRole } from "../../middlewares/roleMiddleware.js"; // ✅ Add this

const router = express.Router();

// ✅ Use both auth + admin role middleware
router.get("/admin-order-page", authenticateToken, requireRole("admin"), getAllOrdersForAdmin);

export default router;
