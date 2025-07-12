// backend/route/brand/index.js
import express from "express";
import {
  getBrands,
  addBrand,
  deleteBrand,
  updateBrand,
} from "../../../controllers/brandController.js";
import { uploadFields } from "../../../middlewares/multerConfig.js"; // path depends on your project

const router = express.Router();

router.get("/", getBrands);
router.post("/", uploadFields, addBrand); // ⬅️ Add middleware here
router.delete("/:id", deleteBrand);
router.put("/:id", uploadFields, updateBrand); // ⬅️ Also here

export default router;
