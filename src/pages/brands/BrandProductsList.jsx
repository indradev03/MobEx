import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import "./BrandProductsList.css";

const BrandProductsList = ({ brandId }) => {
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

  const handleAddToCart = (product) => {
    alert(`Added "${product.name}" to cart!`);
    // TODO: integrate with your cart system
  };

  return (
    <div className="bp-page">
      <button onClick={() => navigate(-1)} className="bp-back-button">
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="bp-heading">Explore {products.length > 0 ? products[0].brand_name || "Products" : "Products"}</h2>
        <p className="bp-subheading">Find the best deals and latest arrivals from this brand.</p>

      {error && <p className="bp-error">{error}</p>}

      {products.length === 0 ? (
        <p>No products found for this brand.</p>
      ) : (
        <div className="bp-products-grid">
          {products.map((product) => (
            <div
              key={product.product_id}
              className="bp-product-card"
              onClick={() => navigate(`/productdetails?id=${product.product_id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="bp-image-wrapper">
                {product.discount && (
                  <span className="bp-discount-badge">
                    {product.discount.replace("%", "")}% off
                  </span>
                )}
                <img
                  src={
                    product.image_url.startsWith("http")
                      ? product.image_url
                      : `http://localhost:5000${product.image_url}`
                  }
                  alt={product.name}
                  className="bp-product-image"
                />
              </div>

              <h3>{product.name}</h3>

              {product.details && <p className="bp-product-details">{product.details}</p>}

              <p className="bp-product-price">
                {product.old_price && (
                  <span className="bp-old-price">
                    NPR {parseFloat(product.old_price).toLocaleString()}
                  </span>
                )}
                <span className="bp-new-price">
                  NPR {parseFloat(product.new_price).toLocaleString()}
                </span>
              </p>

              <button
                className="bp-add-to-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                <ShoppingCart />
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandProductsList;
