import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
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
      setSelectedItems((prev) => prev.filter((id) => id !== cartId));
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

  const handleSelectToggle = (cartId) => {
    setSelectedItems((prev) =>
      prev.includes(cartId)
        ? prev.filter((id) => id !== cartId)
        : [...prev, cartId]
    );
  };

  const handleSelectAllToggle = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.cart_id));
    }
  };

  const handleCheckoutSingle = (cartItem) => {
    navigate("/userbooking", { state: { checkoutItems: [cartItem] } });
  };

  return (
    <div className="cart-container">
      <h1 className="cart-header">🛒 My Cart</h1>

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
          <button className="btn-select-toggle" onClick={handleSelectAllToggle}>
            {selectedItems.length === cartItems.length
              ? "Deselect All"
              : "Select All"}
          </button>

          <button
            className="btn-checkout-selected"
            disabled={selectedItems.length === 0}
            onClick={() => {
              const selectedCartItems = cartItems.filter((item) =>
                selectedItems.includes(item.cart_id)
              );
              navigate("/userbooking", { state: { checkoutItems: selectedCartItems } });
            }}
          >
            Checkout Selected Items ({selectedItems.length})
          </button>

          <div className="cart-items-list">
            {cartItems.map(({ cart_id, product_id, name, image_url, new_price, quantity }) => {
              const imageUrl =
                image_url && (image_url.startsWith("http") || image_url.startsWith("data"))
                  ? image_url
                  : `http://localhost:5000${image_url}`;

              const subtotal = (parseFloat(new_price) || 0) * (quantity || 1);

              return (
                <div key={cart_id} className="cart-item-card">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(cart_id)}
                    onChange={() => handleSelectToggle(cart_id)}
                    className="cart-item-checkbox"
                  />
                  <img src={imageUrl} alt={name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h3 className="item-title">{name}</h3>
                    <p className="item-price">
                      Price: NPR {parseFloat(new_price).toLocaleString()}
                    </p>
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
                    <p className="item-subtotal">
                      Subtotal: NPR {subtotal.toLocaleString()}
                    </p>
                    <div className="btn-group">
                      <button
                        onClick={() => handleRemove(cart_id)}
                        className="btn-remove"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() =>
                          handleCheckoutSingle({
                            cart_id,
                            product_id, // ✅ Ensure this is included
                            name,
                            image_url,
                            new_price,
                            quantity,
                          })
                        }
                        className="btn-checkout-single"
                        disabled={!selectedItems.includes(cart_id)} // Disabled unless selected
                      >
                        Checkout This Item
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
