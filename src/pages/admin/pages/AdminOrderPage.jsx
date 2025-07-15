import React, { useEffect, useState } from "react";
import "./AdminOrderPage.css";

const formatNPR = (amount) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 2,
  }).format(amount);

const allowedStatuses = ["Pending", "Processing", "Completed", "Cancelled"];

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [selectedStatusByOrder, setSelectedStatusByOrder] = useState({});

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, status) => {
    setSelectedStatusByOrder((prev) => ({
      ...prev,
      [orderId]: status,
    }));
  };

  const handleUpdateStatus = async (order) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized. Please login.");

    const newStatus = selectedStatusByOrder[order.order_id];
    if (!newStatus || newStatus === order.status) {
      alert("Please select a different status to update.");
      return;
    }

    setUpdatingOrderId(order.order_id);

    try {
      const res = await fetch(
        `http://localhost:5000/api/admorders/place-order/${order.order_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update order status.");
      }

      alert(`✅ Order #${order.order_id} status updated to '${newStatus}'.`);

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === order.order_id ? { ...o, status: newStatus } : o
        )
      );

      setSelectedStatusByOrder((prev) => {
        const copy = { ...prev };
        delete copy[order.order_id];
        return copy;
      });
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="aop-admin-order-page">
      <h1>Orders</h1>
      <p className="aop-admin-order-description">
        This page provides a centralized overview of all customer orders placed through the platform.
      </p>

      {error && <p className="aop-error-message">❌ {error}</p>}

      {!error && orders.length === 0 && <p className="aop-no-orders">No orders found.</p>}

      {orders.length > 0 && (
        <table className="aop-admin-orders-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Payment</th>
              <th>Total Price</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const selectedStatus = selectedStatusByOrder[order.order_id] || order.status || "Pending";
              const statusClass = order.status?.toLowerCase() || "pending";

              return (
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
                    <td className={`aop-status-badge ${statusClass}`}>
                      {order.status || "Pending"}
                    </td>
                    <td>
                      <select
                        value={selectedStatus}
                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                        disabled={updatingOrderId === order.order_id}
                        className="aop-status-select"
                      >
                        {allowedStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        className="aop-place-order-button"
                        disabled={
                          updatingOrderId === order.order_id ||
                          selectedStatus === order.status
                        }
                        onClick={() => handleUpdateStatus(order)}
                        style={{ marginLeft: "8px" }}
                      >
                        {updatingOrderId === order.order_id ? "Updating..." : "Update"}
                      </button>
                    </td>
                  </tr>
                  <tr className="aop-order-items-row">
                    <td colSpan={9}>
                      <div className="aop-order-items-container">
                        <h4>Items:</h4>
                        <ul className="aop-order-items-list">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="aop-order-item">
                              <img
                                src={item.image || item.image_url || "https://via.placeholder.com/50"}
                                alt={item.product_name || "Product Image"}
                                className="aop-order-item-image"
                                loading="lazy"
                                width={50}
                                height={50}
                              />
                              <div className="aop-order-item-details">
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
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrderPage;
