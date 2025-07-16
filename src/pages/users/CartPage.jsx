import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      toast.error(err.message || "Could not load cart");
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
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(err.message);
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
      toast.success("Quantity updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSelectToggle = (cartId) => {
    setSelectedItems((prev) =>
      prev.includes(cartId) ? prev.filter((id) => id !== cartId) : [...prev, cartId]
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
          <button className="cart-btn-select-toggle" onClick={handleSelectAllToggle}>
            {selectedItems.length === cartItems.length ? "Deselect All" : "Select All"}
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
            {cartItems.map(
              ({
                cart_id,
                product_id,
                name,
                image_url,
                new_price,
                quantity,
                exchange_applied,
                estimated_exchange_price,
                final_price,
              }) => {
                const imageUrl =
                  image_url && (image_url.startsWith("http") || image_url.startsWith("data"))
                    ? image_url
                    : `http://localhost:5000${image_url}`;

                const unitPrice = exchange_applied ? final_price : new_price;
                const subtotal = (parseFloat(unitPrice) || 0) * (quantity || 1);
                const discount = exchange_applied ? parseFloat(estimated_exchange_price) : 0;

                const formatPrice = (price) =>
                  parseFloat(price).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });

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
                        {exchange_applied ? (
                          <>
                            <span className="line-through">NPR {formatPrice(new_price)}</span>{" "}
                            <span className="highlight">NPR {formatPrice(final_price)}</span>
                          </>
                        ) : (
                          <>NPR {formatPrice(new_price)}</>
                        )}
                      </p>

                      {exchange_applied && (
                        <p className="exchange-note">
                          Exchange Applied ✓ — Trade-in Discount: NPR {formatPrice(discount)}
                        </p>
                      )}

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
                        Subtotal: NPR {formatPrice(subtotal)}
                      </p>

                      <div className="btn-group">
                        <button onClick={() => handleRemove(cart_id)} className="btn-remove">
                          Remove
                        </button>
                        <button
                          onClick={() =>
                            handleCheckoutSingle({
                              cart_id,
                              product_id,
                              name,
                              image_url,
                              new_price: unitPrice,
                              quantity,
                            })
                          }
                          className="btn-checkout-single"
                          disabled={!selectedItems.includes(cart_id)}
                        >
                          Checkout This Item
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default CartPage;
