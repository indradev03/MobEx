// src/backend/tests/cartRouter.test.js
import express from 'express';
import request from 'supertest';

// Mock database pool before importing router and controllers
jest.mock('../database/db.js', () => ({
  default: {
    query: jest.fn(),
  },
}));

// Mock auth middleware BEFORE importing router
jest.mock('../middlewares/authMiddleware.js', () => ({
  authenticateToken: (req, res, next) => {
    // Simulate authenticated user
    req.user = { userId: 1, role: 'user' };
    next();
  },
}));

jest.mock('../middlewares/roleMiddleware.js', () => ({
  requireRole: () => (req, res, next) => next(),
}));

import pool from '../database/db.js';
import cartRouter from '../routes/cart/cartRoutes.js';

describe('Cart Router', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/cart', cartRouter);
  });

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('GET /cart calls getCartItems and returns 200', async () => {
    // Mock DB query returning some cart items
    pool.query.mockResolvedValueOnce({
      rows: [{ cart_id: 1, product_id: 2, quantity: 3 }],
    });

    const res = await request(app).get('/cart');
    expect(res.statusCode).toBe(200);
    expect(res.body.cartItems).toBeDefined();
    expect(Array.isArray(res.body.cartItems)).toBe(true);
  });

  test('POST /cart calls addToCart and returns 400 if missing productId', async () => {
    const res = await request(app).post('/cart').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Product ID is required');
  });

  test('POST /cart adds product to cart successfully', async () => {
    // Mock product price query
    pool.query.mockResolvedValueOnce({
      rows: [{ new_price: '50' }],
    });
    // Mock check for existing cart item (none found)
    pool.query.mockResolvedValueOnce({ rows: [] });
    // Mock insert query success
    pool.query.mockResolvedValueOnce({});

    const res = await request(app)
      .post('/cart')
      .send({ productId: 123, exchangeApplied: false });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Product added to cart successfully');
  });

  test('PUT /cart/:cartId updates quantity and returns 200', async () => {
    pool.query.mockResolvedValueOnce({});

    const res = await request(app).put('/cart/1').send({ quantity: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Cart quantity updated');
  });

  test('DELETE /cart/:cartId removes cart item', async () => {
    // Simulate one row affected (cart item removed)
    pool.query.mockResolvedValueOnce({ rowCount: 1 });

    const res = await request(app).delete('/cart/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Cart item removed successfully');
  });

  test('DELETE /cart/:cartId returns 404 if item not found', async () => {
    // Simulate no rows affected
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app).delete('/cart/999');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Cart item not found');
  });

  // Add more tests to handle error cases as needed
});
