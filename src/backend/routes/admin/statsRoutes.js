import express from "express";
import {
  getOrderCount,
  getProductCount,
  getUserCount,
  getBrandCount,
} from "../../controllers/statsController.js";

const router = express.Router();

router.get("/orders/count", getOrderCount);
router.get("/products/count", getProductCount);
router.get("/users/count", getUserCount);
router.get("/brands/count", getBrandCount);

export default router;
