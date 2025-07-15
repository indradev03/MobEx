import pool from '../database/db.js';

// === Get Wishlist ===
export const getWishlist = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      `SELECT w.wishlist_id, w.product_id, p.name, p.image_url, p.new_price
       FROM wishlist w
       JOIN products p ON w.product_id = p.product_id
       WHERE w.user_id = $1`,
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Get Wishlist Error:', err);
    res.status(500).json({ error: 'Failed to get wishlist' });
  }
};

// === Add to Wishlist ===
export const addToWishlist = async (req, res) => {
  const userId = req.user?.userId;
  const { productId } = req.body;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!productId) return res.status(400).json({ error: 'Product ID is required' });

  try {
    const exists = await pool.query(
      'SELECT 1 FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Product already in wishlist' });
    }

    await pool.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)',
      [userId, productId]
    );

    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    console.error('Add Wishlist Error:', err);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

// === Remove from Wishlist ===
export const removeFromWishlist = async (req, res) => {
  const userId = req.user?.userId;
  const { productId } = req.params;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!productId) return res.status(400).json({ error: 'Product ID is required' });

  try {
    const result = await pool.query(
      'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found in wishlist' });
    }

    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Remove Wishlist Error:', err);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};
