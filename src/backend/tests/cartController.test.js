import { jest } from '@jest/globals';

// Silence console.error during tests to keep output clean
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

// Mock the database pool
jest.unstable_mockModule('../database/db.js', () => {
  const mockQuery = jest.fn();
  return {
    default: {
      query: mockQuery,
    },
  };
});

const pool = (await import('../database/db.js')).default;
const {
  addToCart,
  getCartItems,
  updateCartQuantity,
  removeCartItem,
} = await import('../controllers/cartController.js');

// Helper to create mock req and res
function createReqRes(overrides = {}) {
  const req = {
    user: { userId: 1, role: 'user' },
    body: {},
    params: {},
    ...overrides.req,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    ...overrides.res,
  };
  return { req, res };
}

describe('Cart Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    test('returns 401 if no user', async () => {
      const { req, res } = createReqRes({ req: { user: null } });
      await addToCart(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    test('returns 400 if no productId', async () => {
      const { req, res } = createReqRes();
      await addToCart(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product ID is required' });
    });

    test('returns 404 if product not found', async () => {
      const { req, res } = createReqRes({ req: { body: { productId: 123 } } });
      pool.query.mockResolvedValueOnce({ rows: [] }); // product query returns empty
      await addToCart(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    test('updates quantity if product already in cart', async () => {
      const { req, res } = createReqRes({
        req: { body: { productId: 123, exchangeApplied: true, estimatedExchangePrice: 10 } },
      });

      // Mock product price query
      pool.query.mockResolvedValueOnce({ rows: [{ new_price: '100' }] });

      // Mock existing cart item found
      pool.query.mockResolvedValueOnce({ rows: [{ cart_id: 5, quantity: 2 }] });

      // Mock update query
      pool.query.mockResolvedValueOnce({});

      await addToCart(req, res);

      expect(pool.query).toHaveBeenCalledTimes(3);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Cart item quantity updated with exchange',
      });
    });

    test('inserts new cart item if not existing', async () => {
      const { req, res } = createReqRes({
        req: { body: { productId: 123, exchangeApplied: false } },
      });

      pool.query.mockResolvedValueOnce({ rows: [{ new_price: '50' }] }); // product query

      pool.query.mockResolvedValueOnce({ rows: [] }); // existing check returns empty

      pool.query.mockResolvedValueOnce({}); // insert cart item

      await addToCart(req, res);

      expect(pool.query).toHaveBeenCalledTimes(3);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product added to cart successfully' });
    });

    test('returns 500 on error', async () => {
      const { req, res } = createReqRes({
        req: { body: { productId: 1 } },
      });

      pool.query.mockRejectedValueOnce(new Error('DB failure'));

      await addToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getCartItems', () => {
    test('returns 401 if no user', async () => {
      const { req, res } = createReqRes({ req: { user: null } });
      await getCartItems(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('returns cart items', async () => {
      const { req, res } = createReqRes();
      const fakeItems = [{ cart_id: 1, product_id: 2, quantity: 3 }];
      pool.query.mockResolvedValueOnce({ rows: fakeItems });

      await getCartItems(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ cartItems: fakeItems });
    });

    test('returns 500 on error', async () => {
      const { req, res } = createReqRes();
      pool.query.mockRejectedValueOnce(new Error('fail'));
      await getCartItems(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateCartQuantity', () => {
    test('returns 401 if no user', async () => {
      const { req, res } = createReqRes({ req: { user: null } });
      await updateCartQuantity(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('returns 400 if quantity invalid', async () => {
      const { req, res } = createReqRes({
        req: { params: { cartId: '1' }, body: { quantity: 0 } },
      });
      await updateCartQuantity(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('updates quantity successfully', async () => {
      const { req, res } = createReqRes({
        req: { params: { cartId: '1' }, body: { quantity: 2 } },
      });
      pool.query.mockResolvedValueOnce({});
      await updateCartQuantity(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart quantity updated' });
    });

    test('returns 500 on error', async () => {
      const { req, res } = createReqRes({
        req: { params: { cartId: '1' }, body: { quantity: 2 } },
      });
      pool.query.mockRejectedValueOnce(new Error('fail'));
      await updateCartQuantity(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('removeCartItem', () => {
    test('returns 401 if no user', async () => {
      const { req, res } = createReqRes({ req: { user: null } });
      await removeCartItem(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('returns 404 if cart item not found', async () => {
      const { req, res } = createReqRes({ req: { params: { cartId: '1' } } });
      pool.query.mockResolvedValueOnce({ rowCount: 0 });
      await removeCartItem(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('removes cart item successfully', async () => {
      const { req, res } = createReqRes({ req: { params: { cartId: '1' } } });
      pool.query.mockResolvedValueOnce({ rowCount: 1 });
      await removeCartItem(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart item removed successfully' });
    });

    test('returns 500 on error', async () => {
      const { req, res } = createReqRes({ req: { params: { cartId: '1' } } });
      pool.query.mockRejectedValueOnce(new Error('fail'));
      await removeCartItem(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
