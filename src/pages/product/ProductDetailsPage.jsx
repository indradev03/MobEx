import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProductDetailsPage.css";

const ProductDetailsPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const productId = new URLSearchParams(search).get("id");
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError("");
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);

        // Determine initial main image
        const getInitialImage = () => {
          if (data.image_url)
            return data.image_url.startsWith("http") || data.image_url.startsWith("data")
              ? data.image_url
              : `http://localhost:5000${data.image_url}`;
          if (data.thumbnails?.length)
            return data.thumbnails[0].startsWith("http") || data.thumbnails[0].startsWith("data")
              ? data.thumbnails[0]
              : `http://localhost:5000${data.thumbnails[0]}`;
          return "";
        };

        setMainImage(getInitialImage());
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product details");
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handleThumbnailClick = (thumb) => {
    const url =
      thumb.startsWith("http") || thumb.startsWith("data")
        ? thumb
        : `http://localhost:5000${thumb}`;
    setMainImage(url);
  };

    // inside your component
    const handleAddToCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add products to your cart");
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

        if (!res.ok) throw new Error(data.error || "Failed to add product to cart");

        alert(data.message || "Product added to cart!");
        window.dispatchEvent(new Event('cart-updated'));
      } catch (err) {
        alert(err.message);
      }
    };


  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Note: Changed product_id to productId to match backend expectation
        body: JSON.stringify({ productId: product.product_id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to add to wishlist");
      alert(data.message || "Product added to wishlist!");
      // Optionally dispatch event to update wishlist count elsewhere
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p className="pd-error">{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="pd-container">
      <button className="pd-back-btn" onClick={() => window.history.back()}>
        &larr; Back to Products
      </button>

      <div className="pd-main-content">
        <div className="pd-images">
          <img
            src={mainImage}
            alt={product.name}
            className="pd-main-img"
            onError={(e) => (e.target.src = "/fallback-image.png")}
          />

          <div className="pd-thumbnails">
            {product.thumbnails?.length ? (
              product.thumbnails.map((thumb, i) => {
                const thumbUrl =
                  thumb.startsWith("http") || thumb.startsWith("data")
                    ? thumb
                    : `http://localhost:5000${thumb.startsWith("/") ? thumb : "/" + thumb}`;
                const isActive = mainImage === thumbUrl;
                return (
                  <img
                    key={i}
                    src={thumbUrl}
                    alt={`Thumbnail ${i + 1}`}
                    className={`pd-thumb ${isActive ? "pd-thumb-active" : ""}`}
                    onClick={() => handleThumbnailClick(thumbUrl)}
                    onError={(e) => (e.target.src = "/fallback-image.png")}
                    style={{ cursor: "pointer" }}
                  />
                );
              })
            ) : (
              <p>No thumbnails available</p>
            )}
          </div>
        </div>

        <div className="pd-info">
          <h2>{product.name}</h2>
          <p className="pd-details">{product.details}</p>

          <p className="pd-price">
            {product.old_price && (
              <span className="pd-old-price">
                NPR {parseFloat(product.old_price).toLocaleString()}
              </span>
            )}
            <span className="pd-new-price">
              NPR {parseFloat(product.new_price).toLocaleString()}
            </span>
            {product.discount && <span className="pd-discount">{product.discount}</span>}
          </p>

          <p>
            <strong>Condition:</strong> {product.condition || "N/A"}
          </p>
          <p>
            <strong>Storage:</strong> {product.storage ? `${product.storage} GB` : "N/A"}
          </p>
          <p>
            <strong>Battery Health:</strong> {product.battery_health ? `${product.battery_health}%` : "N/A"}
          </p>

          <div className="pd-buttons">
            <button
              className={product.status?.toLowerCase().includes("sold out") ? "pd-btn-sold" : "pd-btn-buy"}
              disabled={product.status?.toLowerCase().includes("sold out")}
            >
              {product.status || "Unavailable"}
            </button>
            <button className="pd-btn-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="pd-btn-wishlist" onClick={handleAddToWishlist}>
              Add to Wishlist
            </button>
            <button className="pd-btn-exchange" onClick={() => navigate("/exchange")}>
              Exchange Your Smartphone
            </button>
          </div>
        </div>
      </div>

      {product.features?.length > 0 && (
        <div className="pd-section">
          <h3>Top Features</h3>
          <ul>{product.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
        </div>
      )}

      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="pd-section">
          <h3>Technical Specifications</h3>
          <table className="pd-specs">
            <tbody>
              {Object.entries(product.specs).map(([key, value], i) => (
                <tr key={i}>
                  <th>{key}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
