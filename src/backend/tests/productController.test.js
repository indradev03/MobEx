// src/backend/tests/productController.test.js
import { jest } from '@jest/globals';
import express from 'express';
import bodyParser from 'body-parser';
import supertest from 'supertest';

// --- Mock the ProductModel module ---
jest.unstable_mockModule('../models/ProductModel.js', () => ({
  getAllProducts: jest.fn(),
  getProductById: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = await import('../models/ProductModel.js');

const productController = await import('../controllers/productController.js');

const app = express();
app.use(bodyParser.json());

// Setup routes for testing
app.get('/products', productController.fetchProducts);
app.get('/products/:id', productController.fetchProductById);
app.post(
  '/products',
  (req, res, next) => {
    // simulate multer files for testing
    req.files = req.files || {};
    next();
  },
  productController.addProduct
);
app.put(
  '/products/:id',
  (req, res, next) => {
    req.files = req.files || {};
    next();
  },
  productController.editProduct
);
app.delete('/products/:id', productController.removeProduct);

// Extra route to support brand filtering test
app.get('/products/brand/:brandId', productController.fetchProductsByBrand);

const request = supertest(app);

describe('Product Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProducts', () => {
    it('should return products list filtered by brandId query param', async () => {
      const fakeProducts = [{ id: 1, name: 'Product A' }];
      getAllProducts.mockResolvedValue(fakeProducts);

      const res = await request.get('/products?brandId=2');

      expect(getAllProducts).toHaveBeenCalledWith(2);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(fakeProducts);
    });

    it('should handle errors', async () => {
      getAllProducts.mockRejectedValue(new Error('DB failure'));

      const res = await request.get('/products');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'Failed to fetch products');
    });
  });

  describe('fetchProductById', () => {
    it('should return product when found', async () => {
      const product = { id: 1, name: 'Product A' };
      getProductById.mockResolvedValue(product);

      const res = await request.get('/products/1');

      expect(getProductById).toHaveBeenCalledWith('1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(product);
    });

    it('should return 404 if not found', async () => {
      getProductById.mockResolvedValue(null);

      const res = await request.get('/products/999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Product not found');
    });

    it('should handle errors', async () => {
      getProductById.mockRejectedValue(new Error('DB error'));

      const res = await request.get('/products/1');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'Failed to fetch product');
    });
  });

  describe('addProduct', () => {
    const validPayload = {
      name: 'Phone X',
      brand_id: 1,
      details: 'Some details',
      new_price: '500',
      status: 'available',
      condition: 'new',
      storage: '128GB',
      battery_health: '90%',
      features: JSON.stringify(['feature1', 'feature2']),
      specs: JSON.stringify({ cpu: 'A14', ram: '6GB' }),
    };

    it('should create product successfully with valid data and files', async () => {
      createProduct.mockResolvedValue({ id: 123, ...validPayload });

      // Instead of using supertest for multipart form-data with files,
      // we directly call controller with mocked req/res to set files easily.

      const req = {
        body: validPayload,
        files: {
          image: [{ filename: 'image.jpg' }],
          thumbnails: [{ filename: 'thumb1.jpg' }, { filename: 'thumb2.jpg' }],
        },
      };
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await productController.addProduct(req, { status, json });

      expect(createProduct).toHaveBeenCalled();
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ id: 123 }));
    });

    it('should return 400 if required fields missing', async () => {
      const req = { body: {}, files: {} };
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await productController.addProduct(req, { status, json });

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });

    it('should handle errors', async () => {
      createProduct.mockRejectedValue(new Error('DB error'));

      const req = {
        body: { ...validPayload },
        files: { image: [{ filename: 'img.jpg' }], thumbnails: [] },
      };
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await productController.addProduct(req, { status, json });

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ error: 'Failed to create product' });
    });
  });

  describe('editProduct', () => {
    const productId = '123';
    const existingProduct = {
      name: 'Old Phone',
      brand_id: 1,
      image_url: '/uploads/old.jpg',
      thumbnail_urls: ['/uploads/old1.jpg'],
      features: ['old feature'],
      specs: { cpu: 'old' },
    };

    const updatePayload = {
      name: 'Updated Phone',
      brand_id: '2',
      new_price: '600',
      features: JSON.stringify(['new feature']),
      specs: JSON.stringify({ cpu: 'new' }),
    };

    it('should update product with new image and thumbnails', async () => {
      getProductById.mockResolvedValue(existingProduct);
      updateProduct.mockResolvedValue({ id: productId, ...updatePayload });

      const req = {
        params: { id: productId },
        body: updatePayload,
        files: {
          image: [{ filename: 'newimage.jpg' }],
          thumbnails: [{ filename: 'thumb1.jpg' }],
        },
      };

      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await productController.editProduct(req, { status, json });

      expect(updateProduct).toHaveBeenCalled();
      expect(json).toHaveBeenCalledWith(expect.objectContaining({ id: productId }));
      expect(status).toHaveBeenCalledWith(200);
    });

    it('should fallback to existing images and features if not provided', async () => {
      getProductById.mockResolvedValue(existingProduct);
      updateProduct.mockResolvedValue({ id: productId, ...updatePayload });

      const req = {
        params: { id: productId },
        body: updatePayload,
        files: {}, // no new images
      };

      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await productController.editProduct(req, { status, json });

      expect(updateProduct).toHaveBeenCalledWith(
        productId,
        expect.objectContaining({
          image_url: existingProduct.image_url,
          thumbnail_urls: existingProduct.thumbnail_urls,
          features: existingProduct.features,
          specs: existingProduct.specs,
        })
      );

      expect(json).toHaveBeenCalledWith(expect.objectContaining({ id: productId }));
      expect(status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if product not found', async () => {
      getProductById.mockResolvedValue(null);

      const req = {
        params: { id: productId },
        body: updatePayload,
        files: {},
      };

      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await productController.editProduct(req, { status, json });

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should handle errors', async () => {
      getProductById.mockResolvedValue(existingProduct);
      updateProduct.mockRejectedValue(new Error('DB failure'));

      const req = {
        params: { id: productId },
        body: updatePayload,
        files: {},
      };

      const json = jest.fn();
      const status = jest.fn(() => ({ json }));

      await productController.editProduct(req, { status, json });

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ error: 'Failed to update product' });
    });
  });

  describe('removeProduct', () => {
    it('should delete product successfully', async () => {
      deleteProduct.mockResolvedValue();

      const req = { params: { id: '123' } };
      const json = jest.fn();
      const res = { json };

      await productController.removeProduct(req, res);

      expect(deleteProduct).toHaveBeenCalledWith('123');
      expect(json).toHaveBeenCalledWith({ message: 'Product deleted' });
    });

    it('should handle errors', async () => {
      deleteProduct.mockRejectedValue(new Error('DB failure'));

      const req = { params: { id: '123' } };
      const json = jest.fn();
      const status = jest.fn(() => ({ json }));
      const res = { status, json };

      await productController.removeProduct(req, res);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ error: 'Failed to delete product' });
    });
  });

  describe('fetchProductsByBrand', () => {
    it('should return limited products by brand', async () => {
      const fakeProducts = Array(5)
        .fill(0)
        .map((_, i) => ({ id: i + 1 }));
      getAllProducts.mockResolvedValue(fakeProducts);

      const res = await request.get('/products/brand/1?limit=3');

      expect(getAllProducts).toHaveBeenCalledWith('1');
      expect(res.status).toBe(200);
      // Ensure response array length respects limit param (simulate controller slicing)
      expect(res.body.length).toBeLessThanOrEqual(3);
    });

    it('should handle errors', async () => {
      getAllProducts.mockRejectedValue(new Error('DB failure'));

      const res = await request.get('/products/brand/1');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message', 'Failed to fetch products');
    });
  });
});
