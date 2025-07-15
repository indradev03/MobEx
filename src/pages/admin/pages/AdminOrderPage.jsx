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
          console.error("Raw error:", text);
          try {
            const errData = JSON.parse(text);
            setError(errData.error || "Failed to load admin orders.");
          } catch {
            setError(text); // fallback for plain text errors like "Forbidden"
          }
          return;
        }

        const data = JSON.parse(text);
        setOrders(data);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError("Unable to fetch orders. Please try again later.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="admin-order-page">
      <h1>Admin Order Page</h1>
      <p className="admin-order-description">
        This Admin Order Page provides a centralized overview of all customer orders placed through the platform.
      </p>

      {error && <p className="error-message">❌ {error}</p>}

      {!error && orders.length === 0 && (
        <p className="no-orders">No orders found.</p>
      )}

      {orders.map((order) => (
        <div key={order.order_id} className="order-card">
          <h3>Order ID: {order.order_id}</h3>
          <p><strong>Customer:</strong> {order.customer_name} ({order.customer_email})</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Payment:</strong> {order.payment_method}</p>
          <p><strong>Total:</strong> {formatNPR(order.total_price)}</p>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
          <h4>Items:</h4>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx} className="order-item">
                <img 
                  src={item.image || "https://via.placeholder.com/50"} 
                  alt={item.product_name} 
                  className="order-item-image" 
                  loading="lazy" 
                  width={50} 
                  height={50}
                />
                <span>
                  {item.product_name} — Qty: {item.quantity}, Price: {formatNPR(item.product_price)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminOrderPage;
