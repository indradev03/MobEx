import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa"; // make sure to install react-icons
import "./OrderHistoryPage.css";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    if (!token) {
      setError("No authentication token found. Please login.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orders/history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errMsg = response.statusText;
        try {
          const errData = await response.json();
          if (errData?.error) errMsg = errData.error;
        } catch {}
        throw new Error(`Failed to fetch orders: ${errMsg}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Unexpected server response: ${text}`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete single order with fade out
  const deleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderId}?`)) return;

    setDeletingOrderId(orderId);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/orders/history/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errMsg = response.statusText;
        try {
          const errData = await response.json();
          if (errData?.error) errMsg = errData.error;
        } catch {}
        throw new Error(`Failed to delete order: ${errMsg}`);
      }

      // Animate fade-out before removing from state
      setTimeout(() => {
        setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId));
        setDeletingOrderId(null);
      }, 400);
    } catch (err) {
      setError(err.message);
      setDeletingOrderId(null);
    }
  };

  // Delete all orders immediately
  const deleteAllOrders = async () => {
    if (!window.confirm("Are you sure you want to delete ALL your orders?")) return;

    setDeletingAll(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/orders/history", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errMsg = response.statusText;
        try {
          const errData = await response.json();
          if (errData?.error) errMsg = errData.error;
        } catch {}
        throw new Error(`Failed to delete all orders: ${errMsg}`);
      }

      setOrders([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingAll(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="loading-container">
        <p className="loading-text">Loading your order history...</p>
      </div>
    );

  return (
    <div className="order-history-container">
      <h1>Order History</h1>

      {error && (
        <div className="error-container">
          <p className="error-message">⚠️ Error: {error}</p>
        </div>
      )}

      {orders.length > 0 && (
        <button
          className="delete-all-button"
          onClick={deleteAllOrders}
          disabled={deletingAll}
          style={{ marginBottom: "20px" }}
        >
          {deletingAll ? "Deleting All..." : "Clear History"}
        </button>
      )}

      {orders.length === 0 && !loading && (
        <div className="empty-message">
          <p>You have no orders yet.</p>
        </div>
      )}

      <div className="order-cards-row">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className={`order-card-wrapper ${deletingOrderId === order.order_id ? "deleting" : ""}`}
          >
            <div className="order-card">
              <div className="order-header">
                <h3>Order #{order.order_id}</h3>
                <span className="order-date">
                  {order.created_at ? new Date(order.created_at).toLocaleString() : "Date N/A"}
                </span>

                <button
                  className="delete-order-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteOrder(order.order_id);
                  }}
                  disabled={deletingOrderId === order.order_id}
                  title="Delete this order"
                  aria-label={`Delete order #${order.order_id}`}
                >
                  {deletingOrderId === order.order_id ? (
                    "Deleting..."
                  ) : (
                    <>
                      <FaTrashAlt style={{ marginRight: "6px", verticalAlign: "middle" }} />
                      Delete
                    </>
                  )}
                </button>
              </div>

              <div className="order-details">
                <div>
                  <p>
                    <strong>Name:</strong> {order.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.address}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Payment Method:</strong> {order.payment_method}
                  </p>
                  <p>
                    <strong>Total Price:</strong>{" "}
                    {typeof order.total_price === "number"
                      ? `$${order.total_price.toFixed(2)}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <h4>Items:</h4>
              {order.items && order.items.length > 0 ? (
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.item_id}>
                        <td>{item.product_id}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items found for this order.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
