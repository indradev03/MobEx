import { jest } from '@jest/globals'; // ✅ Required for ESM
import express from 'express';
import request from 'supertest';

// ✅ Mock controller functions
const mockGetAllOrdersForAdmin = jest.fn((req, res) =>
  res.status(200).json({ message: 'getAllOrdersForAdmin called' })
);

const mockPlaceOrderByAdmin = jest.fn((req, res) =>
  res.status(201).json({ message: 'placeOrderByAdmin called' })
);

// ✅ Mock the controller module
jest.unstable_mockModule('../controllers/orderController.js', () => ({
  getAllOrdersForAdmin: (req, res) => mockGetAllOrdersForAdmin(req, res),
  placeOrderByAdmin: (req, res) => mockPlaceOrderByAdmin(req, res),
}));

// ✅ Mock middleware modules
jest.unstable_mockModule('../middlewares/authMiddleware.js', () => ({
  authenticateToken: (req, res, next) => next(),
}));

jest.unstable_mockModule('../middlewares/roleMiddleware.js', () => ({
  requireRole: () => (req, res, next) => next(),
}));

// ✅ Import router AFTER mocking
const adminOrderRouter = (await import('../routes/order/adminOrderRoute.js')).default;

describe('Admin Order Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/admin/orders', adminOrderRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /admin/orders/admin-order-page calls getAllOrdersForAdmin with auth and role', async () => {
    const res = await request(app).get('/admin/orders/admin-order-page');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'getAllOrdersForAdmin called' });
    expect(mockGetAllOrdersForAdmin).toHaveBeenCalled();
  });

  test('POST /admin/orders/place-order/:orderId calls placeOrderByAdmin with auth and role', async () => {
    const res = await request(app)
      .post('/admin/orders/place-order/123')
      .send({ status: 'confirmed' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ message: 'placeOrderByAdmin called' });
    expect(mockPlaceOrderByAdmin).toHaveBeenCalled();
  });
});
