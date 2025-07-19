import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FavouritesPage.css";

const FavouritesPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("Unauthorized access. Please log in again.");
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch wishlist");
      }

      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error("Wishlist Fetch Error:", err);
      setError(err.message || "Could not load wishlist");
      toast.error(err.message || "Could not load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove from wishlist");
      }

      setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
      toast.success("Removed from wishlist");
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to add products to your cart");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.product_id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      await handleRemove(product.product_id);

      toast.success("Added to cart and removed from wishlist");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const formatPrice = (price) =>
    parseFloat(price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="favourites-page">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="favourites-title">❤️ My Wishlist</h1>

      {loading && <p className="wishlist-loading">Loading your wishlist...</p>}
      {error && <p className="wishlist-error">{error}</p>}
      {!loading && wishlist.length === 0 && !error && (
        <p className="wishlist-empty">Your wishlist is currently empty.</p>
      )}

      <div className="favourites-grid">
        {wishlist.map((item) => {
          const imageUrl =
            item.image_url?.startsWith("http") || item.image_url?.startsWith("data")
              ? item.image_url
              : `http://localhost:5000${item.image_url}`;

          return (
            <div key={item.product_id} className="favourite-card">
              <div className="favourite-img-wrapper">
                <img src={imageUrl} alt={item.name} className="favourite-img" />
              </div>
              <div className="favourite-content">
                <h3 className="favourite-name">{item.name}</h3>
                <p className="favourite-price">
                  NPR {formatPrice(item.new_price)}
                </p>
                <p className="favourite-status">
                  Status:{" "}
                  <span className={item.status === "Sold Out" ? "sold-out" : "available"}>
                    {item.status}
                  </span>
                </p>
                <div className="favourite-actions">
                  <button
                    className="favourite-btn remove"
                    onClick={() => handleRemove(item.product_id)}
                  >
                    Remove
                  </button>
                  <button
                    className="favourite-btn cart"
                    onClick={() => handleAddToCart(item)}
                    disabled={item.status === "Sold Out"}
                  >
                    {item.status === "Sold Out" ? "Sold Out" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavouritesPage;
