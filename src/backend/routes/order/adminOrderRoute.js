import express from "express";
import { getAllOrdersForAdmin,placeOrderByAdmin } from "../../controllers/orderController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { requireRole } from "../../middlewares/roleMiddleware.js"; // ✅ Add this

const router = express.Router();

// ✅ Use both auth + admin role middleware
router.get("/admin-order-page", authenticateToken, requireRole("admin"), getAllOrdersForAdmin);
// In your admorders route file, e.g. admorders.js or admorderRoute.js
router.post('/place-order/:orderId', authenticateToken, requireRole("admin"), placeOrderByAdmin);


export default router;
