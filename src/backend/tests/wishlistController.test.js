// src/backend/tests/wishlistController.test.js
import { jest } from '@jest/globals';

// Mock the pool module
jest.unstable_mockModule('../database/db.js', () => ({
  default: {
    query: jest.fn(),
  },
}));

const pool = (await import('../database/db.js')).default;
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = await import('../controllers/wishlistController.js');

describe('Wishlist Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockStatusJson = () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    return { status, json };
  };

  // --- getWishlist ---
  describe('getWishlist', () => {
    it('should return wishlist items', async () => {
      const req = { user: { userId: 1 } };
      const res = mockStatusJson();

      const fakeRows = [{ wishlist_id: 1, product_id: 2, name: 'Product' }];
      pool.query.mockResolvedValue({ rows: fakeRows });

      await getWishlist(req, res);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [1]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeRows);
    });

    it('should return 401 if no user', async () => {
      const req = { user: null };
      const res = mockStatusJson();

      await getWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should handle errors', async () => {
      const req = { user: { userId: 1 } };
      const res = mockStatusJson();

      pool.query.mockRejectedValue(new Error('DB error'));

      await getWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to get wishlist' });
    });
  });

  // --- addToWishlist ---
  describe('addToWishlist', () => {
    it('should add product to wishlist', async () => {
      const req = { user: { userId: 1 }, body: { productId: 99 } };
      const res = mockStatusJson();

      pool.query
        .mockResolvedValueOnce({ rows: [] }) // check exists returns empty
        .mockResolvedValueOnce({}); // insert success

      await addToWishlist(req, res);

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        'SELECT 1 FROM wishlist WHERE user_id = $1 AND product_id = $2',
        [1, 99]
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)',
        [1, 99]
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Added to wishlist' });
    });

    it('should return 409 if product already in wishlist', async () => {
      const req = { user: { userId: 1 }, body: { productId: 99 } };
      const res = mockStatusJson();

      pool.query.mockResolvedValueOnce({ rows: [1] });

      await addToWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product already in wishlist' });
    });

    it('should return 400 if productId missing', async () => {
      const req = { user: { userId: 1 }, body: {} };
      const res = mockStatusJson();

      await addToWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product ID is required' });
    });

    it('should return 401 if user not authenticated', async () => {
      const req = { user: null, body: { productId: 99 } };
      const res = mockStatusJson();

      await addToWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should handle DB errors', async () => {
      const req = { user: { userId: 1 }, body: { productId: 99 } };
      const res = mockStatusJson();

      pool.query.mockRejectedValue(new Error('DB error'));

      await addToWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add to wishlist' });
    });
  });

  // --- removeFromWishlist ---
  describe('removeFromWishlist', () => {
    it('should remove product from wishlist', async () => {
      const req = { user: { userId: 1 }, params: { productId: '99' } };
      const res = mockStatusJson();

      pool.query.mockResolvedValueOnce({ rowCount: 1 });

      await removeFromWishlist(req, res);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2',
        [1, '99']
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Removed from wishlist' });
    });

    it('should return 404 if product not found in wishlist', async () => {
      const req = { user: { userId: 1 }, params: { productId: '99' } };
      const res = mockStatusJson();

      pool.query.mockResolvedValueOnce({ rowCount: 0 });

      await removeFromWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found in wishlist' });
    });

    it('should return 400 if productId missing', async () => {
      const req = { user: { userId: 1 }, params: {} };
      const res = mockStatusJson();

      await removeFromWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product ID is required' });
    });

    it('should return 401 if user not authenticated', async () => {
      const req = { user: null, params: { productId: '99' } };
      const res = mockStatusJson();

      await removeFromWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should handle DB errors', async () => {
      const req = { user: { userId: 1 }, params: { productId: '99' } };
      const res = mockStatusJson();

      pool.query.mockRejectedValue(new Error('DB error'));

      await removeFromWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to remove from wishlist' });
    });
  });
});
