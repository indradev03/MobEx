import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        toast.error("Failed to load products for this brand");
      }
    };

    fetchProducts();
  }, [brandId]);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    console.log("Token used for addToCart:", token);

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

      if (res.status === 401) {
        toast.error("Unauthorized! Please login again.");
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to add product to cart");

      toast.success(data.message || "Product added to cart!");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Format price with 2 decimal places
  const formatPrice = (price) =>
    parseFloat(price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="bp-page">
        <button onClick={() => navigate(-1)} className="bp-back-button">
          <ArrowLeft size={18} /> Back
        </button>

        <h2 className="bp-heading">
          Explore {products.length > 0 ? products[0].brand_name || "Products" : "Products"}
        </h2>
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

                {product.details && (
                  <p className="bp-product-details">{product.details}</p>
                )}

                <p className="bp-product-price">
                  {product.old_price && (
                    <span className="bp-old-price">
                      NPR {formatPrice(product.old_price)}
                    </span>
                  )}
                  <span className="bp-new-price">
                    NPR {formatPrice(product.new_price)}
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
    </>
  );
};

export default BrandProductsList;
