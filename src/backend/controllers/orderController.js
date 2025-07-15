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


export const getOrderHistory = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    console.warn("Unauthorized access attempt: missing userId in request");
    return res.status(401).json({ error: "Unauthorized: userId missing" });
  }

  console.log("Fetching order history for userId:", userId);

  try {
    // Get all orders for user
    const ordersResult = await pool.query(
      `SELECT order_id, name, phone, address, payment_method, total_price, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    const orders = ordersResult.rows;

    if (orders.length === 0) {
      console.log(`No orders found for userId: ${userId}`);
      return res.json([]);
    }

    const orderIds = orders.map(o => o.order_id);

    // Join order_items with products to get product info
    const itemsResult = await pool.query(
      `SELECT oi.item_id, oi.order_id, oi.product_id, oi.cart_id, oi.quantity,
              p.name AS product_name,
              p.image_url,
              p.new_price AS product_price
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ANY($1::int[])`,
      [orderIds]
    );

    const orderItems = itemsResult.rows;

    // Convert prices to numbers (in case they come as strings)
    orders.forEach(order => {
      order.total_price = Number(order.total_price);
    });
    orderItems.forEach(item => {
      item.product_price = Number(item.product_price);
    });

    // Combine items into orders
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: orderItems.filter(item => item.order_id === order.order_id),
    }));

    console.log(`Returning ${ordersWithItems.length} orders for userId: ${userId}`);

    res.json(ordersWithItems);
  } catch (error) {
    console.error("Get orders error:", error.message);
    res.status(500).json({ error: "Failed to fetch order history" });
  }
};





export const deleteOrderById = async (req, res) => {
  const userId = req.user.userId;
  const { orderId } = req.params;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Verify order belongs to user
    const orderCheck = await client.query(
      `SELECT order_id FROM orders WHERE order_id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (orderCheck.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Order not found or unauthorized" });
    }

    // Delete order items
    await client.query(`DELETE FROM order_items WHERE order_id = $1`, [orderId]);

    // Delete the order itself
    await client.query(`DELETE FROM orders WHERE order_id = $1`, [orderId]);

    await client.query("COMMIT");
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete order error:", error.message);
    res.status(500).json({ error: "Failed to delete order" });
  } finally {
    client.release();
  }
};

export const deleteAllOrdersForUser = async (req, res) => {
  const userId = req.user.userId;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Get all order IDs for the user
    const ordersResult = await client.query(
      `SELECT order_id FROM orders WHERE user_id = $1`,
      [userId]
    );
    const orderIds = ordersResult.rows.map(row => row.order_id);

    if (orderIds.length > 0) {
      // Delete order items for these orders
      await client.query(
        `DELETE FROM order_items WHERE order_id = ANY($1::int[])`,
        [orderIds]
      );

      // Delete orders
      await client.query(`DELETE FROM orders WHERE user_id = $1`, [userId]);
    }

    await client.query("COMMIT");
    res.json({ message: "All orders deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete all orders error:", error.message);
    res.status(500).json({ error: "Failed to delete orders" });
  } finally {
    client.release();
  }
};


export const getAllOrdersForAdmin = async (req, res) => {
  // ✅ Optional admin check
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }

  try {
    const ordersResult = await pool.query(
      `SELECT o.order_id, o.user_id, o.name, o.phone, o.address, o.payment_method, o.total_price, o.created_at,
              u.name AS customer_name, u.email AS customer_email
       FROM orders o
       JOIN mobex_users u ON o.user_id = u.user_id
       ORDER BY o.created_at DESC`
    );

    const orders = ordersResult.rows;
    const orderIds = orders.map(order => order.order_id);

    if (orderIds.length === 0) {
      return res.json([]);
    }

    const itemsResult = await pool.query(
      `SELECT oi.order_id, oi.product_id, oi.quantity, 
              p.name AS product_name, p.image_url, p.new_price AS product_price
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ANY($1::int[])`,
      [orderIds]
    );

    const orderItems = itemsResult.rows;

    const ordersWithItems = orders.map(order => ({
      ...order,
      total_price: Number(order.total_price),
      items: orderItems
        .filter(item => item.order_id === order.order_id)
        .map(item => ({
          ...item,
          product_price: Number(item.product_price),
        })),
    }));

    res.json(ordersWithItems);
  } catch (error) {
    console.error("Admin get all orders error:", error.message);
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
};

