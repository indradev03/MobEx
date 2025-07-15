import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import "./OrderHistoryPage.css";

const formatNPR = (amount) => {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 2,
  }).format(amount);
};

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

const deleteOrder = async (orderId) => {
  if (!window.confirm(`Are you sure you want to delete this order?`)) return;

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

    setTimeout(() => {
      setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId));
      setDeletingOrderId(null);

      // Dispatch event to notify header about order count update
      window.dispatchEvent(new Event('order-updated'));
    }, 400);
  } catch (err) {
    setError(err.message);
    setDeletingOrderId(null);
  }
};

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
    
    // Dispatch event to notify header about order count update
    window.dispatchEvent(new Event('order-updated'));
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
      <div className="orderHistory-loadingContainer">
        <p className="orderHistory-loadingText">Loading your order history...</p>
      </div>
    );

  return (
    <div className="orderHistory-container">
      <h1 className="orderHistory-title">Order History</h1>

      {error && (
        <div className="orderHistory-errorContainer">
          <p className="orderHistory-errorMessage">⚠️ Error: {error}</p>
        </div>
      )}

      {orders.length > 0 && (
        <button
          className="orderHistory-deleteAllButton"
          onClick={deleteAllOrders}
          disabled={deletingAll}
          style={{ marginBottom: "20px" }}
        >
          {deletingAll ? "Deleting All..." : "Clear History"}
        </button>
      )}

      {orders.length === 0 && !loading && (
        <div className="orderHistory-emptyMessage">
          <p>You have no orders yet.</p>
        </div>
      )}

      <div className="orderHistory-cardsRow">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className={`orderHistory-cardWrapper ${
              deletingOrderId === order.order_id ? "orderHistory-deleting" : ""
            }`}
          >
            <div className="orderHistory-card">
              <div className="orderHistory-header">
                <span className="orderHistory-date">
                  {order.created_at ? new Date(order.created_at).toLocaleString() : "Date N/A"}
                </span>

                <button
                  className="orderHistory-deleteOrderButton"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteOrder(order.order_id);
                  }}
                  disabled={deletingOrderId === order.order_id}
                  title="Delete this order"
                  aria-label={`Delete order`}
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

              <div className="orderHistory-content">
                <div className="orderHistory-userDetails">
                  <h4 className="orderHistory-subtitle">User Details</h4>
                  <div className="orderHistory-userDetailsInfo">
                    <label className="orderHistory-label name">Name:</label>
                    <span className="orderHistory-value">{order.name}</span>

                    <label className="orderHistory-label phone">Phone:</label>
                    <span className="orderHistory-value">{order.phone}</span>

                    <label className="orderHistory-label address">Address:</label>
                    <span className="orderHistory-value">{order.address}</span>

                    <label className="orderHistory-label payment">Payment Method:</label>
                    <span className="orderHistory-value">{order.payment_method}</span>

                    <label className="orderHistory-label status">Status:</label>
                    <span className={`orderHistory-value order-status ${order.status?.toLowerCase()}`}>
                      {order.status || "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="orderHistory-productDetails">
                  <h4 className="orderHistory-subtitle">Products</h4>
                  {order.items && order.items.length > 0 ? (
                    <table className="orderHistory-itemsTable">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.item_id}>
                            <td>
                              <img
                                src={item.image_url || "/placeholder.png"}
                                alt={item.product_name || "Product Image"}
                                className="orderHistory-productImage"
                              />
                            </td>
                            <td>{item.product_name || "Unknown Product"}</td>
                            <td>{item.quantity}</td>
                            <td>
                              {typeof item.product_price === "number"
                                ? formatNPR(item.product_price)
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No items found for this order.</p>
                  )}
                </div>
              </div>

              <p className="orderHistory-totalPrice" style={{ marginTop: "1rem", fontWeight: "600", fontSize: "1.1rem" , color: "green" }}>
                Total Price:{" "}
                {typeof order.total_price === "number" ? formatNPR(order.total_price) : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
