import pool from '../database/db.js';

// === Add to Cart ===
export const addToCart = async (req, res) => {
  const userId = req.user?.userId;
  const { productId } = req.body;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!productId) return res.status(400).json({ error: 'Product ID is required' });

  try {
    const existing = await pool.query(
      'SELECT cart_id, quantity FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existing.rows.length > 0) {
      const newQuantity = existing.rows[0].quantity + 1;
      await pool.query(
        'UPDATE cart SET quantity = $1 WHERE cart_id = $2',
        [newQuantity, existing.rows[0].cart_id]
      );
      return res.json({ message: 'Cart item quantity updated' });
    }

    await pool.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, 1)',
      [userId, productId]
    );

    return res.status(201).json({ message: 'Product added to cart successfully' });
  } catch (err) {
    console.error('Error adding to cart:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// === Get Cart Items ===
export const getCartItems = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      `SELECT c.cart_id, c.product_id, c.quantity, p.name, p.image_url, p.new_price
       FROM cart c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = $1`,
      [userId]
    );

    return res.status(200).json({ cartItems: result.rows });
  } catch (err) {
    console.error('Error fetching cart items:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// === Update Cart Quantity ===
export const updateCartQuantity = async (req, res) => {
  const userId = req.user?.userId;
  const { cartId } = req.params;
  const { quantity } = req.body;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!cartId || !quantity || quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }

  try {
    await pool.query(
      'UPDATE cart SET quantity = $1 WHERE cart_id = $2 AND user_id = $3',
      [quantity, cartId, userId]
    );
    return res.json({ message: 'Cart quantity updated' });
  } catch (err) {
    console.error('Error updating cart quantity:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// === Remove Cart Item ===
export const removeCartItem = async (req, res) => {
  const userId = req.user?.userId;
  const { cartId } = req.params;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      'DELETE FROM cart WHERE cart_id = $1 AND user_id = $2',
      [cartId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    return res.json({ message: 'Cart item removed successfully' });
  } catch (err) {
    console.error('Error removing cart item:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
