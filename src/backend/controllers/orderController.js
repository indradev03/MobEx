import pool from "../database/db.js";

// Create Order Controller
export const createOrder = async (req, res) => {
  const userId = req.user.userId; // from authenticated token
  const {
    name,
    phone,
    address,
    paymentMethod,
    totalPrice,
    items, // [{ product_id, cart_id, quantity }]
  } = req.body;

  if (!name || !phone || !address || !paymentMethod || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert into orders
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, name, phone, address, payment_method, total_price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING order_id`,
      [userId, name, phone, address, paymentMethod, totalPrice]
    );

    const orderId = orderResult.rows[0].order_id;

    // Insert order items
    const orderItemsQuery = `
      INSERT INTO order_items (order_id, product_id, cart_id, quantity)
      VALUES ($1, $2, $3, $4)
    `;

    for (const item of items) {
      await client.query(orderItemsQuery, [
        orderId,
        item.product_id,
        item.cart_id || null,
        item.quantity || 1,
      ]);
    }

    await client.query("COMMIT");

    res.status(201).json({ message: "Order placed successfully", orderId });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Order error:", error.message);
    res.status(500).json({ error: "Failed to place order" });
  } finally {
    client.release();
  }
};
