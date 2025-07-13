import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      setError("");
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch cart items");
      const data = await res.json();
      setCartItems(Array.isArray(data.cartItems) ? data.cartItems : []);
    } catch (err) {
      setError(err.message || "Could not load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (cartId) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove item");
      }
      setCartItems((prev) => prev.filter((item) => item.cart_id !== cartId));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleQuantityChange = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update quantity");
      }

      // Update local state only
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cart_id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );

      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      alert(err.message);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.new_price) || 0;
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);

  return (
    <div className="cart-container">
      <h1 className="cart-header">🛒 Your Cart</h1>

      {loading ? (
        <p className="cart-loading">Loading cart items...</p>
      ) : error ? (
        <p className="cart-error">{error}</p>
      ) : cartItems.length === 0 ? (
        <p className="cart-empty">
            Your cart is empty.
            <br />
                <button onClick={() => navigate("/brands")} className="btn-shop-now">
                    Start Shopping
                </button>
        </p>

      ) : (
        <div className="cart-content-wrapper">
          <div className="cart-items-list">
            {cartItems.map(({ cart_id, name, image_url, new_price, quantity }) => {
              const imageUrl =
                image_url && (image_url.startsWith("http") || image_url.startsWith("data"))
                  ? image_url
                  : `http://localhost:5000${image_url}`;

              const subtotal = (parseFloat(new_price) || 0) * (quantity || 1);

              return (
                <div key={cart_id} className="cart-item-card">
                  <img src={imageUrl} alt={name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h3 className="item-title">{name}</h3>
                    <p className="item-price">Price: NPR {parseFloat(new_price).toLocaleString()}</p>
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(cart_id, quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <span className="qty-value">{quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(cart_id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="item-subtotal">Subtotal: NPR {subtotal.toLocaleString()}</p>
                    <button onClick={() => handleRemove(cart_id)} className="btn-remove">
                      ✕ Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-detail">
              <span>Items:</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="summary-detail total">
              <span>Total:</span>
              <span>NPR {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <button className="btn-checkout" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
