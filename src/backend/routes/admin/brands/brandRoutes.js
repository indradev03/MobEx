// backend/routes/brandRoutes.js
import express from 'express';
import { getBrands, addBrand } from '../../../controllers/brandController.js';

const router = express.Router();

router.get('/', getBrands);
router.post('/', addBrand);

export default router;
