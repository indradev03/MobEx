import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "./UserBooking.css";

const UserBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get selected checkout items passed from CartPage or empty array
  const passedCheckoutItems = location.state?.checkoutItems || [];

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Fetch full cart as fallback if no passed items
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
    if (passedCheckoutItems.length > 0) {
      setCartItems(passedCheckoutItems);
      setLoading(false);
    } else {
      fetchCart();
    }
  }, [passedCheckoutItems]);

  useEffect(() => {
    setShowPaymentPopup(paymentMethod === "card");
  }, [paymentMethod]);

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.new_price) || 0;
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);

  const validatePaymentInfo = () => {
    if (paymentMethod === "cod") return true;
    return (
      cardNumber.trim().length >= 12 &&
      cardName.trim().length > 0 &&
      expiryDate.trim().length > 0 &&
      cvv.trim().length >= 3
    );
  };

  const handleSavePaymentInfo = () => {
    if (!validatePaymentInfo()) {
      setSubmitError("Please fill valid card information before saving.");
      return;
    }
    setSubmitError("");
    setShowPaymentPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !address) {
      setSubmitError("Please fill all required fields");
      return;
    }
    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty");
      return;
    }
    if (!validatePaymentInfo()) {
      setSubmitError("Please fill valid payment information");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const paymentDetails =
        paymentMethod === "cod"
          ? null
          : { cardNumber, cardName, expiryDate, cvv };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          phone,
          address,
          paymentMethod,
          paymentDetails,
          items: cartItems.map(({ cart_id, product_id, quantity }) => ({
            cart_id,
            product_id,
            quantity,
          })),
          totalPrice,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place order");
      }

      // Notify other components (e.g., header) about order update
      window.dispatchEvent(new Event('order-updated'));

      // Clear input & show success
      setName("");
      setPhone("");
      setAddress("");
      setPaymentMethod("cod");
      setCardNumber("");
      setCardName("");
      setExpiryDate("");
      setCvv("");
      setShowPaymentPopup(false);
      setOrderPlaced(true);
      setCartItems([]); // optionally clear cart locally here
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="userbooking__empty-page">
        <h2>🎉 Your order has been placed!</h2>
        <p>Thank you for your purchase. We’re preparing your order for delivery.</p>
        <button
          onClick={() => {
            setOrderPlaced(false);
            navigate("/cart");
          }}
          className="userbooking__go-cart-btn"
        >
          <FaShoppingCart />
          Go to My Cart
        </button>
      </div>
    );
  }

  return (
    <div className="userbooking">
      <h1 className="userbooking__title">User Booking</h1>

      {/* Back to Cart Button */}
      <button
        className="userbooking__back-btn"
        onClick={() => navigate("/cart")}
        type="button"
      >
        ← Back to Cart
      </button>

      {loading ? (
        <p className="userbooking__loading">Loading your cart...</p>
      ) : error ? (
        <p className="userbooking__error">{error}</p>
      ) : cartItems.length === 0 ? (
        <p className="userbooking__empty">
          Your cart is empty. Please add some products before checkout.
        </p>
      ) : (
        <div className="userbooking__content">
          <form onSubmit={handleSubmit} className="userbooking__form" noValidate>
            <h2 className="userbooking__form-title">Enter Your Details</h2>

            <label className="userbooking__label" data-label="Name:">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="userbooking__input"
              />
            </label>

            <label className="userbooking__label" data-label="Phone:">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="userbooking__input"
              />
            </label>

            <label className="userbooking__label" data-label="Address:">
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
                className="userbooking__textarea"
              />
            </label>

            <label className="userbooking__label" data-label="Payment:">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="userbooking__select"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </label>

            {paymentMethod === "cod" && (
              <p className="userbooking__info">
                You will pay the full amount on delivery.
              </p>
            )}

            {submitError && (
              <p className="userbooking__submit-error">{submitError}</p>
            )}

            {successMessage && (
              <p
                className="userbooking__submit-success"
                onAnimationEnd={() => setSuccessMessage("")}
              >
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || cartItems.length === 0}
              className="userbooking__submit-btn"
            >
              {submitting ? "Placing order..." : "Confirm Order"}
            </button>
          </form>

          <div className="userbooking__summary">
            <h2 className="userbooking__summary-title">Order Summary</h2>
            {cartItems.map(
              ({ cart_id, product_id, name, image_url, new_price, quantity }) => {
                const imageUrl =
                  image_url &&
                  (image_url.startsWith("http") || image_url.startsWith("data"))
                    ? image_url
                    : `http://localhost:5000${image_url}`;

                return (
                  <div key={cart_id} className="userbooking__summary-item">
                    <img
                      src={imageUrl}
                      alt={name}
                      className="userbooking__summary-img"
                    />
                    <div className="userbooking__summary-details">
                      <p className="userbooking__summary-name">
                        {name}
                        <span className="qty-badge">× {quantity}</span>
                      </p>
                      <p className="userbooking__summary-qty-price">
                        Qty: {quantity} × NPR {parseFloat(new_price).toLocaleString()}
                      </p>
                      <p className="userbooking__summary-subtotal">
                        Subtotal: NPR {(parseFloat(new_price) * quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
            <h3 className="userbooking__summary-total">
              Total: NPR {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentPopup && (
        <div className="userbooking__modal-overlay">
          <div className="userbooking__modal">
            <h3>Enter Card Details</h3>

            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="userbooking__input"
              maxLength={19}
              inputMode="numeric"
              autoComplete="cc-number"
              required
            />
            <input
              type="text"
              placeholder="Name on Card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="userbooking__input"
              autoComplete="cc-name"
              required
            />
            <div className="userbooking__card-row">
              <input
                type="text"
                placeholder="Expiry Date (MM/YY)"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="userbooking__input"
                maxLength={5}
                required
                autoComplete="cc-exp"
              />
              <input
                type="password"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="userbooking__input"
                maxLength={4}
                required
                autoComplete="cc-csc"
              />
            </div>

            {submitError && (
              <p className="userbooking__submit-error">{submitError}</p>
            )}

            <div className="userbooking__modal-buttons">
              <button
                type="button"
                onClick={handleSavePaymentInfo}
                className="userbooking__save-btn"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentPopup(false)}
                className="userbooking__close-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBooking;
