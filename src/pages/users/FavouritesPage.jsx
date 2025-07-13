import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FavouritesPage.css";

const FavouritesPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      setError("");
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error(err);
      setError("Could not load wishlist");
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
      fetchWishlist();
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddToCart = (product) => {
    alert(`Added ${product.name} to cart!`);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="favourites-page">
      <h1 className="favourites-title">❤️ Your Wishlist</h1>

      {loading && <p className="wishlist-loading">Loading your wishlist...</p>}
      {error && <p className="wishlist-error">{error}</p>}
      {!loading && wishlist.length === 0 && (
        <p className="wishlist-empty">Your wishlist is currently empty.</p>
      )}

      <div className="favourites-grid">
        {wishlist.map((item) => {
          const imageUrl =
            item.image_url.startsWith("http") || item.image_url.startsWith("data")
              ? item.image_url
              : `http://localhost:5000${item.image_url}`;
          return (
            <div key={item.product_id} className="favourite-card">
              <div
                className="favourite-img-wrapper"
                onClick={() => navigate(`/product-details?id=${item.product_id}`)}
              >
                <img src={imageUrl} alt={item.name} className="favourite-img" />
              </div>
              <div className="favourite-content">
                <h3 className="favourite-name">{item.name}</h3>
                <p className="favourite-price">
                  NPR {parseFloat(item.new_price).toLocaleString()}
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
                  >
                    Add to Cart
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
