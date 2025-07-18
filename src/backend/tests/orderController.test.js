// orderController.test.js
import { jest } from '@jest/globals';
import request from 'supertest';

// Mock the database
jest.unstable_mockModule('../database/db.js', () => {
  const mockQuery = jest.fn();
  const mockClient = {
    query: mockQuery,
    release: jest.fn(),
  };
  return {
    default: {
      connect: jest.fn(() => Promise.resolve(mockClient)),
      query: mockQuery,
    },
  };
});

// Import after mocking
const pool = (await import('../database/db.js')).default;
const app = (await import('../app.js')).default; // Your Express app
const {
  createOrder,
  getOrderHistory,
  deleteOrderById,
  getAllOrdersForAdmin,
  placeOrderByAdmin,
} = await import('../controllers/orderController.js');

// Sample token-protected middleware mock
const mockUser = {
  userId: 1,
  role: 'admin',
};

// Sample request setup
const getMockReqRes = () => {
  const req = {
    user: mockUser,
    body: {},
    params: {},
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return { req, res };
};
test("createOrder should insert order and items and return 201", async () => {
  const { req, res } = getMockReqRes();
  req.body = {
    name: "John Doe",
    phone: "123456789",
    address: "Test Street",
    paymentMethod: "Cash",
    totalPrice: 100,
    items: [{ product_id: 1, cart_id: 2, quantity: 1 }],
  };

  const mockClient = {
    query: jest
      .fn()
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({ rows: [{ order_id: 123 }] }) // Insert into orders
      .mockResolvedValueOnce({}) // Insert into order_items
      .mockResolvedValueOnce({}), // COMMIT
    release: jest.fn(),
  };

  pool.connect.mockResolvedValue(mockClient);

  await createOrder(req, res);

  expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    message: "Order placed successfully",
    orderId: 123,
  });
});


test("getOrderHistory should return orders with items", async () => {
  const { req, res } = getMockReqRes();

  pool.query
    .mockResolvedValueOnce({
      rows: [
        { order_id: 1, name: "John", phone: "123", address: "Test", payment_method: "Cash", total_price: "100", created_at: new Date(), status: "Pending" },
      ],
    })
    .mockResolvedValueOnce({
      rows: [
        {
          item_id: 1,
          order_id: 1,
          product_id: 1,
          quantity: 2,
          product_name: "iPhone",
          image_url: "image.jpg",
          product_price: "999",
        },
      ],
    });

  await getOrderHistory(req, res);

  expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
    expect.objectContaining({
      items: expect.arrayContaining([
        expect.objectContaining({ product_name: "iPhone" }),
      ]),
    }),
  ]));
});


test("deleteOrderById should delete an order and its items", async () => {
  const { req, res } = getMockReqRes();
  req.params.orderId = 1;

  const mockClient = {
    query: jest.fn()
      .mockResolvedValueOnce({ rowCount: 1 }) // Check order exists
      .mockResolvedValueOnce({}) // Delete items
      .mockResolvedValueOnce({}), // Delete order
    release: jest.fn(),
  };

  pool.connect.mockResolvedValue(mockClient);

  await deleteOrderById(req, res);

  expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM order_items"), [1]);
  expect(res.json).toHaveBeenCalledWith({ message: "Order deleted successfully" });
});


test("getAllOrdersForAdmin should return all orders for admin", async () => {
  const { req, res } = getMockReqRes();

  pool.query
    .mockResolvedValueOnce({
      rows: [
        {
          order_id: 1,
          user_id: 1,
          name: "Admin",
          phone: "000",
          address: "HQ",
          payment_method: "Card",
          total_price: "300",
          created_at: new Date(),
          status: "Pending",
          customer_name: "Admin",
          customer_email: "admin@example.com",
        },
      ],
    })
    .mockResolvedValueOnce({
      rows: [
        {
          order_id: 1,
          product_id: 1,
          quantity: 1,
          product_name: "Xiaomi",
          image_url: "img.png",
          product_price: "300",
        },
      ],
    });

  await getAllOrdersForAdmin(req, res);

  expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
    expect.objectContaining({
      items: expect.arrayContaining([
        expect.objectContaining({ product_name: "Xiaomi" }),
      ]),
    }),
  ]));
});


test("placeOrderByAdmin should update order status", async () => {
  const { req, res } = getMockReqRes();
  req.params.orderId = 1;
  req.body.status = "Completed";

  pool.query.mockResolvedValueOnce({ rowCount: 1 });

  await placeOrderByAdmin(req, res);

  expect(pool.query).toHaveBeenCalledWith(
    expect.stringContaining("UPDATE orders SET status"),
    ["Completed", 1]
  );
  expect(res.json).toHaveBeenCalledWith({
    message: `Order #1 status updated to 'Completed'.`,
  });
});
