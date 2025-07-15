import React, { useEffect, useState } from "react";
import "./AdminOrderPage.css";

const formatNPR = (amount) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 2,
  }).format(amount);

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in as admin to view this page.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/admorders/admin-order-page", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await res.text();

        if (!res.ok) {
          try {
            const errData = JSON.parse(text);
            setError(errData.error || "Failed to load admin orders.");
          } catch {
            setError(text);
          }
          return;
        }

        const data = JSON.parse(text);
        setOrders(data);
      } catch (err) {
        setError("Unable to fetch orders. Please try again later.");
      }
    };

    fetchOrders();
  }, []);

  const handlePlaceOrder = (order) => {
    alert(`Place order clicked for order #${order.order_id}`);
    // Your place order logic here...
  };

  return (
    <div className="admin-order-page">
      <h1>Orders</h1>
      <p className="admin-order-description">
        This Page provides a centralized overview of all customer orders placed through the platform.
      </p>

      {error && <p className="error-message">❌ {error}</p>}

      {!error && orders.length === 0 && <p className="no-orders">No orders found.</p>}

      {orders.length > 0 && (
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Payment</th>
              <th>Total Price</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <React.Fragment key={order.order_id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    {order.customer_name} <br />
                    <small>{order.customer_email}</small>
                  </td>
                  <td>{order.phone}</td>
                  <td>{order.address}</td>
                  <td>{order.payment_method}</td>
                  <td>{formatNPR(order.total_price)}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td>
                    <button
                      className="place-order-button"
                      onClick={() => handlePlaceOrder(order)}
                    >
                      Place Order
                    </button>
                  </td>
                </tr>
                <tr className="order-items-row">
                  <td colSpan={8}>
                    <div className="order-items-container">
                      <h4>Items:</h4>
                      <ul className="order-items-list">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="order-item">
                            <img
                              src={item.image || item.image_url || "https://via.placeholder.com/50"}
                              alt={item.product_name || "Product Image"}
                              className="order-item-image"
                              loading="lazy"
                              width={50}
                              height={50}
                            />
                            <div className="order-item-details">
                              <strong>{item.product_name || "Unknown Product"}</strong>
                              <span>Qty: {item.quantity}</span>
                              <span>Price: {formatNPR(item.product_price)}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrderPage;
