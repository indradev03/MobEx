import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ProductDetailsPage.css";

const ProductDetailsPage = () => {
  const { search } = useLocation();
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

  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details-page">
      <button className="back-button" onClick={() => window.history.back()}>
        &larr; Back to Products
      </button>

      <div className="product-main-content">
        {/* Left Side - Images */}
        <div className="product-images">
          <img
            src={mainImage}
            alt={product.name}
            className="product-main-image"
            onError={(e) => (e.target.src = "/fallback-image.png")}
          />

          <div className="product-thumbnails">
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
                    className={`thumbnail ${isActive ? "active" : ""}`}
                    onClick={() => handleThumbnailClick(thumbUrl)}
                    onError={(e) => (e.target.src = "/fallback-image.png")}
                  />
                );
              })
            ) : (
              <p>No thumbnails available</p>
            )}
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="details">{product.details}</p>

          <p className="price">
            {product.old_price && (
              <span className="old-price">NPR {parseFloat(product.old_price).toLocaleString()}</span>
            )}
            <span className="new-price">NPR {parseFloat(product.new_price).toLocaleString()}</span>
            {product.discount && <span className="discount">{product.discount}</span>}
          </p>
          <p><strong>Condition:</strong> {product.condition || "N/A"}</p>
          <p><strong>Storage:</strong> {product.storage ? `${product.storage} GB` : "N/A"}</p>
          <p><strong>Battery Health:</strong> {product.battery_health ? `${product.battery_health}%` : "N/A"}</p>

          <div className="button-group">
            <button
              className={product.status?.toLowerCase().includes("sold out") ? "sold-out" : "buy-now"}
              disabled={product.status?.toLowerCase().includes("sold out")}
            >
              {product.status || "Unavailable"}
            </button>
            <button className="wishlist">Add to Wishlist</button>
            <button className="exchange">Exchange Your Smartphone</button>
          </div>
        </div>
      </div>

      {/* Features */}
      {product.features?.length > 0 && (
        <div className="section">
          <h3>Top Features</h3>
          <ul>{product.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
        </div>
      )}

      {/* Technical Specs */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="section">
          <h3>Technical Specifications</h3>
          <table className="specs-table">
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
