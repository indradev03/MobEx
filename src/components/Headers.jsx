import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import MobexLogo from "../assets/indeximages/Mobex_logo.svg";
import CheckoutIcon from "../assets/indeximages/checkout.png";
import FavouriteIcon from "../assets/indeximages/favourite.png";
import ProfileIcon from "../assets/indeximages/people.png";

import { FaUser, FaSignOutAlt, FaHistory } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";         // Added
import "react-toastify/dist/ReactToastify.css";                 // Added
import "./Headers.css";

const Headers = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  const fetchWishlistCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setWishlistCount(0);

    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      setWishlistCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error("Failed to load wishlist", err);
      setWishlistCount(0);
    }
  };

  const fetchCartCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setCartCount(0);

    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      if (Array.isArray(data.cartItems)) {
        const totalQuantity = data.cartItems.reduce(
          (acc, item) => acc + (item.quantity || 1),
          0
        );
        setCartCount(totalQuantity);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Failed to load cart", err);
      setCartCount(0);
    }
  };

  const fetchOrderCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setOrderCount(0);

    try {
      const res = await fetch("http://localhost:5000/api/orders/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrderCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error("Order history error:", err);
      setOrderCount(0);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || "");
      } catch {
        setUserName("");
      }
    }

    if (token) {
      fetchWishlistCount();
      fetchCartCount();
      fetchOrderCount();
    }

    const handleLoginEvent = () => {
      setIsLoggedIn(true);
      fetchWishlistCount();
      fetchCartCount();
      fetchOrderCount();
    };

    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setUserName("");
      setWishlistCount(0);
      setCartCount(0);
      setOrderCount(0);
    };

    const handleWishlistUpdate = () => fetchWishlistCount();
    const handleCartUpdate = () => fetchCartCount();
    const handleOrderUpdate = () => fetchOrderCount();

    window.addEventListener("login", handleLoginEvent);
    window.addEventListener("logout", handleLogoutEvent);
    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    window.addEventListener("cart-updated", handleCartUpdate);
    window.addEventListener("order-updated", handleOrderUpdate);

    return () => {
      window.removeEventListener("login", handleLoginEvent);
      window.removeEventListener("logout", handleLogoutEvent);
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
      window.removeEventListener("cart-updated", handleCartUpdate);
      window.removeEventListener("order-updated", handleOrderUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
    setWishlistCount(0);
    setCartCount(0);
    setOrderCount(0);
    window.dispatchEvent(new Event("logout"));
    navigate("/login");
  };

  const handleProtectedNavigation = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      toast.info("Please log in first.");  // replaced alert with toast
      navigate("/login");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="header-container">
        <div className="header-logo">
          <Link to="/">
            <img src={MobexLogo} alt="Mobex Logo" />
          </Link>
        </div>

        <nav className="header-nav">
          <ul className="header-nav-links">
            <li>
              <Link
                to="/brands"
                className={location.pathname === "/brands" ? "active-link" : ""}
              >
                Brands
              </Link>
            </li>
            <li>
              <Link
                to="/exchange"
                className={location.pathname === "/exchange" ? "active-link" : ""}
              >
                Exchange
              </Link>
            </li>
            <li>
              <Link
                to="/special-offers"
                className={location.pathname === "/special-offers" ? "active-link" : ""}
              >
                Special Offers
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={location.pathname === "/about" ? "active-link" : ""}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={location.pathname === "/contact" ? "active-link" : ""}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className={location.pathname === "/faq" ? "active-link" : ""}
              >
                FAQ
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-auth">
          {!isLoggedIn && (
            <>
              <button className="auth-login" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="auth-signup" onClick={() => navigate("/signup")}>
                Sign Up
              </button>
            </>
          )}
        </div>

        <div className="header-icons">
          <button
            onClick={() => handleProtectedNavigation("/cart")}
            aria-label="Cart"
            className="header-cart-icon"
          >
            <img src={CheckoutIcon} alt="Cart Icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button
            onClick={() => handleProtectedNavigation("/favourites")}
            aria-label="Favourites"
            className="header-wishlist-icon"
          >
            <img src={FavouriteIcon} alt="Favourite Icon" />
            {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
          </button>

          {isLoggedIn && (
            <button
              onClick={() => handleProtectedNavigation("/order-history")}
              aria-label="Order History"
              className="header-history-icon"
            >
              <FaHistory size={22} />
              {orderCount > 0 && <span className="history-badge">{orderCount}</span>}
            </button>
          )}

          {isLoggedIn && (
            <div
              className="header-profile-wrapper"
              onMouseEnter={() => setProfileMenuOpen(true)}
              onMouseLeave={() => setProfileMenuOpen(false)}
            >
              <button aria-label="Profile">
                <img src={ProfileIcon} alt="Profile Icon" />
              </button>
              {profileMenuOpen && (
                <div className="header-profile-dropdown">
                  <button className="dropdown-item" onClick={() => navigate("/profile")}>
                    <FaUser className="dropdown-icon" /> Profile
                  </button>
                  <button className="dropdown-item-logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Headers;
