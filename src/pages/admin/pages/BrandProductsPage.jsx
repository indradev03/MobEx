import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BrandProductsPage.css";
import { ArrowLeft } from "lucide-react";

const BrandProductsPage = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/brand/${brandId}`);
        if (!res.ok) throw new Error("Products not found");
        const data = await res.json();
        setProducts(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load products for this brand");
      }
    };

    fetchProducts();
  }, [brandId]);

  return (
    <div className="brand-products-page">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={18} /> Back
      </button>

      <h2>Product based on brands</h2>

      {error && <p className="error">{error}</p>}

      {products.length === 0 ? (
        <p>No products found for this brand.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.product_id}
              className="product-card"
            >
              <div className="image-wrapper">
                {product.discount && (
                  <span className="discount-badge">
                    {product.discount.replace("%", "")}% off
                  </span>
                )}
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-image"
                />
              </div>

              <h3>{product.name}</h3>

              {product.details && (
                <p className="product-details">{product.details}</p>
              )}

              <p className="product-price">
                {product.old_price && (
                  <span className="old-price">
                    NPR {parseFloat(product.old_price).toLocaleString()}
                  </span>
                )}
                <span className="new-price">
                  NPR {parseFloat(product.new_price).toLocaleString()}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandProductsPage;
