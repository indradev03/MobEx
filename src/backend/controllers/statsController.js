import pool from '../database/db.js';

export const getOrderCount = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM orders');
    const count = parseInt(result.rows[0].count, 10);
    res.json({ count });
  } catch (error) {
    console.error('Failed to fetch order count:', error);
    res.status(500).json({ error: 'Failed to fetch order count' });
  }
};

export const getProductCount = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM products');
    const count = parseInt(result.rows[0].count, 10);
    res.json({ count });
  } catch (error) {
    console.error('Failed to fetch product count:', error);
    res.status(500).json({ error: 'Failed to fetch product count' });
  }
};

export const getUserCount = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM mobex_users');
    const count = parseInt(result.rows[0].count, 10);
    res.json({ count });
  } catch (error) {
    console.error('Failed to fetch user count:', error);
    res.status(500).json({ error: 'Failed to fetch user count' });
  }
};

export const getBrandCount = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM brands');
    const count = parseInt(result.rows[0].count, 10);
    res.json({ count });
  } catch (error) {
    console.error('Failed to fetch brand count:', error);
    res.status(500).json({ error: 'Failed to fetch brand count' });
  }
};
