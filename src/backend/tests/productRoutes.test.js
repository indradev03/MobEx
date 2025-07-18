// src/backend/tests/productRoutes.test.js
import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock controller functions
const mockFetchProducts = jest.fn((req, res) => res.status(200).json({ called: 'fetchProducts' }));
const mockFetchProductById = jest.fn((req, res) => res.status(200).json({ called: 'fetchProductById', id: req.params.id }));
const mockAddProduct = jest.fn((req, res) => res.status(201).json({ called: 'addProduct' }));
const mockEditProduct = jest.fn((req, res) => res.status(200).json({ called: 'editProduct', id: req.params.id }));
const mockRemoveProduct = jest.fn((req, res) => res.status(200).json({ called: 'removeProduct', id: req.params.id }));
const mockFetchProductsByBrand = jest.fn((req, res) => res.status(200).json({ called: 'fetchProductsByBrand', brandId: req.params.brandId }));

// Mock multer middleware just passes control
const mockUploadFields = (req, res, next) => next();

// Dynamically mock the import of the router module
jest.unstable_mockModule('../controllers/productController.js', () => ({
  fetchProducts: mockFetchProducts,
  fetchProductById: mockFetchProductById,
  addProduct: mockAddProduct,
  editProduct: mockEditProduct,
  removeProduct: mockRemoveProduct,
  fetchProductsByBrand: mockFetchProductsByBrand,
}));

jest.unstable_mockModule('../middlewares/multerConfig.js', () => ({
  uploadFields: mockUploadFields,
}));

const routerModule = await import('../routes/admin/addproduct/productRoutes.js');
const router = routerModule.default;

describe('Product Routes', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/products', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/products calls fetchProducts', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ called: 'fetchProducts' });
    expect(mockFetchProducts).toHaveBeenCalled();
  });

  test('GET /api/products/brand/:brandId calls fetchProductsByBrand', async () => {
    const res = await request(app).get('/api/products/brand/42');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ called: 'fetchProductsByBrand', brandId: '42' });
    expect(mockFetchProductsByBrand).toHaveBeenCalled();
  });

  test('GET /api/products/:id calls fetchProductById', async () => {
    const res = await request(app).get('/api/products/7');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ called: 'fetchProductById', id: '7' });
    expect(mockFetchProductById).toHaveBeenCalled();
  });

  test('POST /api/products calls addProduct', async () => {
    const res = await request(app).post('/api/products').send({ name: 'New Product' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ called: 'addProduct' });
    expect(mockAddProduct).toHaveBeenCalled();
  });

  test('PUT /api/products/:id calls editProduct', async () => {
    const res = await request(app).put('/api/products/10').send({ name: 'Updated Product' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ called: 'editProduct', id: '10' });
    expect(mockEditProduct).toHaveBeenCalled();
  });

  test('DELETE /api/products/:id calls removeProduct', async () => {
    const res = await request(app).delete('/api/products/10');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ called: 'removeProduct', id: '10' });
    expect(mockRemoveProduct).toHaveBeenCalled();
  });
});
