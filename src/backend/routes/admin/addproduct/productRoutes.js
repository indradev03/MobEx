import express from 'express';
import {
  fetchProducts,
  fetchProductById,
  addProduct,
  editProduct,
  removeProduct,
  fetchProductsByBrand
} from '../../../controllers/productController.js';

import { uploadFields } from '../../../middlewares/multerConfig.js';

const router = express.Router();

router.get('/', fetchProducts);
router.get('/brand/:brandId', fetchProductsByBrand);
router.get('/:id', fetchProductById);

router.post('/', uploadFields, addProduct);
router.put('/:id', uploadFields, editProduct);
router.delete('/:id', removeProduct);

export default router;
