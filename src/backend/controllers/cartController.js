import pool from '../database/db.js';

// === Add to Cart ===
// === Add to Cart with Exchange Support ===
export const addToCart = async (req, res) => {
  const userId = req.user?.userId;
  const { productId, exchangeApplied, estimatedExchangePrice } = req.body;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!productId) return res.status(400).json({ error: 'Product ID is required' });

  try {
    // Get the product price
    const productRes = await pool.query(
      'SELECT new_price FROM products WHERE product_id = $1',
      [productId]
    );

    if (productRes.rows.length === 0)
      return res.status(404).json({ error: 'Product not found' });

    const newPrice = parseFloat(productRes.rows[0].new_price);
    const exchangePrice = exchangeApplied ? parseFloat(estimatedExchangePrice) || 0 : 0;
    const finalPrice = Math.max(newPrice - exchangePrice, 0);

    console.log("Adding to cart:", {
      userId,
      productId,
      exchangeApplied: !!exchangeApplied,
      estimatedExchangePrice: exchangePrice,
      finalPrice,
    });

    // Check if already in cart
    const existing = await pool.query(
      'SELECT cart_id, quantity FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existing.rows.length > 0) {
      const newQuantity = existing.rows[0].quantity + 1;
      await pool.query(
        `UPDATE cart
         SET quantity = $1,
             exchange_applied = $2,
             estimated_exchange_price = $3,
             final_price = $4
         WHERE cart_id = $5`,
        [newQuantity, !!exchangeApplied, exchangePrice, finalPrice, existing.rows[0].cart_id]
      );
      return res.json({ message: 'Cart item quantity updated with exchange' });
    }

    // Insert new cart item
    await pool.query(
      `INSERT INTO cart
        (user_id, product_id, quantity, exchange_applied, estimated_exchange_price, final_price)
       VALUES ($1, $2, 1, $3, $4, $5)`,
      [userId, productId, !!exchangeApplied, exchangePrice, finalPrice]
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
      `SELECT 
         c.cart_id, 
         c.product_id, 
         c.quantity, 
         c.exchange_applied, 
         c.estimated_exchange_price, 
         c.final_price,
         p.name, 
         p.image_url, 
         p.new_price
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
