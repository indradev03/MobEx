import { jest } from '@jest/globals'; // ✅ Import jest explicitly
import express from 'express';
import request from 'supertest';

// ✅ Mock controller functions
const mockCreateOrder = jest.fn((req, res) => res.status(201).json({ message: 'createOrder called' }));
const mockGetOrderHistory = jest.fn((req, res) => res.status(200).json({ message: 'getOrderHistory called' }));
const mockDeleteOrderById = jest.fn((req, res) => res.status(200).json({ message: 'deleteOrderById called' }));
const mockDeleteAllOrdersForUser = jest.fn((req, res) => res.status(200).json({ message: 'deleteAllOrdersForUser called' }));

// ✅ Mock controller module
jest.unstable_mockModule('../controllers/orderController.js', () => ({
  createOrder: (req, res) => mockCreateOrder(req, res),
  getOrderHistory: (req, res) => mockGetOrderHistory(req, res),
  deleteOrderById: (req, res) => mockDeleteOrderById(req, res),
  deleteAllOrdersForUser: (req, res) => mockDeleteAllOrdersForUser(req, res),
}));

// ✅ Mock middleware modules
jest.unstable_mockModule('../middlewares/authMiddleware.js', () => ({
  authenticateToken: (req, res, next) => next(),
}));

jest.unstable_mockModule('../middlewares/roleMiddleware.js', () => ({
  requireRole: () => (req, res, next) => next(),
}));

// ✅ Import the router AFTER mocks
const orderRouter = (await import('../routes/order/orderRoutes.js')).default;

describe('Order Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/orders', orderRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /orders calls createOrder with authentication', async () => {
    const res = await request(app).post('/orders').send({ foo: 'bar' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ message: 'createOrder called' });
    expect(mockCreateOrder).toHaveBeenCalled();
  });

  test('GET /orders/history calls getOrderHistory with auth and role', async () => {
    const res = await request(app).get('/orders/history');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'getOrderHistory called' });
    expect(mockGetOrderHistory).toHaveBeenCalled();
  });

  test('DELETE /orders/history/:orderId calls deleteOrderById with auth', async () => {
    const res = await request(app).delete('/orders/history/123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'deleteOrderById called' });
    expect(mockDeleteOrderById).toHaveBeenCalled();
  });

  test('DELETE /orders/history calls deleteAllOrdersForUser with auth', async () => {
    const res = await request(app).delete('/orders/history');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'deleteAllOrdersForUser called' });
    expect(mockDeleteAllOrdersForUser).toHaveBeenCalled();
  });
});
