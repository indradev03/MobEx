import pool from '../database/db.js';
import jwt from 'jsonwebtoken';

// Middleware to extract userId from Authorization header JWT token
export const getUserIdFromReq = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    return decoded.userId;
  } catch {
    return null;
  }
};

export const getWishlist = async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      `SELECT w.wishlist_id, w.product_id, p.name, p.image_url, p.new_price
       FROM wishlist w
       JOIN products p ON w.product_id = p.product_id
       WHERE w.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get wishlist' });
  }
};

export const addToWishlist = async (req, res) => {
    
  const userId = req.user.userId; // get from authenticate middleware


  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'Product ID is required' });

  try {
    const exists = await pool.query(
      'SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2',
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
    console.error(err);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};


// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { productId } = req.params;
  if (!productId) return res.status(400).json({ error: 'Product ID is required' });

  try {
    const result = await pool.query(
      'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found in wishlist' });
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};


