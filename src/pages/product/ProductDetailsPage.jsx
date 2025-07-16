import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetailsPage.css";

const ProductDetailsPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const productId = new URLSearchParams(search).get("id");

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [error, setError] = useState("");

  // Exchange popup state
  const [showExchangePopup, setShowExchangePopup] = useState(false);

  // Exchange form state
  const [exchangeForm, setExchangeForm] = useState({
    brand: "",
    model: "",
    condition: "",     // New, Good, Fair, Poor
    age: "",           // Less than 6 months, 6 months - 1 year, etc.
    storage: "",       // in GB
    batteryHealth: "", // in %
  });

  const [formErrors, setFormErrors] = useState({});
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const brandModelsMap = {
    Samsung: ["Galaxy S10", "Galaxy S20", "Galaxy S21", "Galaxy S22", "Galaxy Note 10"],
    Apple: ["iPhone 8", "iPhone X", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14"],
    Xiaomi: ["Redmi Note 10", "Mi 11", "Mi 12", "Poco X3"],
    OnePlus: ["OnePlus 7", "OnePlus 8", "OnePlus 9"],
    Oppo: ["Oppo F19", "Oppo Reno 5", "Oppo Find X3"],
  };

  // Price base values by brand & model (example values)
  const basePrices = {
    Samsung: {
      "Galaxy S10": 20000,
      "Galaxy S20": 30000,
      "Galaxy S21": 35000,
      "Galaxy S22": 40000,
      "Galaxy Note 10": 28000,
    },
    Apple: {
      "iPhone 8": 18000,
      "iPhone X": 30000,
      "iPhone 11": 35000,
      "iPhone 12": 40000,
      "iPhone 13": 45000,
      "iPhone 14": 50000,
    },
    Xiaomi: {
      "Redmi Note 10": 12000,
      "Mi 11": 20000,
      "Mi 12": 25000,
      "Poco X3": 15000,
    },
    OnePlus: {
      "OnePlus 7": 15000,
      "OnePlus 8": 20000,
      "OnePlus 9": 25000,
    },
    Oppo: {
      "Oppo F19": 12000,
      "Oppo Reno 5": 18000,
      "Oppo Find X3": 25000,
    },
  };

  // Calculate estimated price based on form data
  const calculatePrice = () => {
    if (!exchangeForm.brand || !exchangeForm.model) return 0;

    let price = basePrices[exchangeForm.brand]?.[exchangeForm.model] || 0;

    // Adjust price based on condition
    switch (exchangeForm.condition) {
      case "New":
        price *= 1.0;
        break;
      case "Good":
        price *= 0.8;
        break;
      case "Fair":
        price *= 0.6;
        break;
      case "Poor":
        price *= 0.4;
        break;
      default:
        break;
    }

    // Adjust price based on age
    switch (exchangeForm.age) {
      case "Less than 6 months":
        price *= 1.0;
        break;
      case "6 months - 1 year":
        price *= 0.9;
        break;
      case "1-2 years":
        price *= 0.7;
        break;
      case "More than 2 years":
        price *= 0.5;
        break;
      default:
        break;
    }

    // Adjust price based on battery health
    const batteryHealthNum = parseInt(exchangeForm.batteryHealth, 10);
    if (batteryHealthNum) {
      if (batteryHealthNum >= 90) price *= 1.0;
      else if (batteryHealthNum >= 80) price *= 0.9;
      else if (batteryHealthNum >= 70) price *= 0.75;
      else price *= 0.5;
    }

    // Adjust price based on storage (more storage, more price)
    const storageNum = parseInt(exchangeForm.storage, 10);
    if (storageNum) {
      if (storageNum >= 256) price *= 1.2;
      else if (storageNum >= 128) price *= 1.1;
      else if (storageNum >= 64) price *= 1.05;
      else price *= 1.0;
    }

    return Math.round(price);
  };

  useEffect(() => {
    setEstimatedPrice(calculatePrice());
  }, [exchangeForm]);

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

  const handleAddToCart = async () => {
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

      if (!res.ok) throw new Error(data.error || "Failed to add product to cart");

      toast.success(data.message || "Product added to cart!");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to add to wishlist");
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
        body: JSON.stringify({ productId: product.product_id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to add to wishlist");
      toast.success(data.message || "Product added to wishlist!");
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openExchangePopup = () => {
    setShowExchangePopup(true);
  };

  const closeExchangePopup = () => {
    setShowExchangePopup(false);
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setExchangeForm((prev) => {
      if (name === "brand") {
        return { ...prev, brand: value, model: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!exchangeForm.brand.trim()) errors.brand = "Brand is required";
    if (!exchangeForm.model.trim()) errors.model = "Model is required";
    if (!exchangeForm.condition) errors.condition = "Condition is required";
    if (!exchangeForm.age) errors.age = "Age is required";
    if (!exchangeForm.storage.trim()) errors.storage = "Storage is required";
    if (!exchangeForm.batteryHealth.trim()) errors.batteryHealth = "Battery health is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- Updated handleExchangeSubmit with full exchange details passed ---
  const handleExchangeSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill all the fields correctly");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to add to cart");
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
        body: JSON.stringify({
          productId: product.product_id,
          exchangeApplied: true,
          estimatedExchangePrice: estimatedPrice,
          brand: exchangeForm.brand,
          model: exchangeForm.model,
          condition: exchangeForm.condition,
          age: exchangeForm.age,
          storage: exchangeForm.storage,
          batteryHealth: exchangeForm.batteryHealth,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      toast.success(
        `Product added to cart with exchange applied! Discount: NPR ${estimatedPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      );

      window.dispatchEvent(new Event("cart-updated"));

      setShowExchangePopup(false);
      setTimeout(() => {
        navigate("/cart");
      }, 1200);
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
    }
  };

  if (error) return <p className="pd-error">{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

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
                <p></p>
              )}
            </div>
          </div>

          <div className="pd-info">
            <h2>{product.name}</h2>
            <p className="pd-details">{product.details}</p>
                <p className="pd-price">
                  {product.old_price && (
                    <span className="pd-old-price">
                      NPR {parseFloat(product.old_price).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  )}
                  <span className="pd-new-price">
                    NPR {parseFloat(product.new_price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
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
              <strong>Battery Health:</strong> {product.battery_health ? `${product.battery_health}` : "N/A"}
            </p>

            <div className="pd-buttons">
              <button
                className={product.status?.toLowerCase().includes("sold out") ? "pd-btn-sold" : "pd-btn-buy"}
                disabled
              >
                {product.status || "Unavailable"}
              </button>

              <button
                className="pd-btn-cart"
                onClick={handleAddToCart}
                disabled={product.status?.toLowerCase().includes("sold out")}
              >
                Add to Cart
              </button>

              <button
                className="pd-btn-wishlist"
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </button>

              <button
                className="pd-btn-exchange"
                onClick={openExchangePopup}
                disabled={product.status?.toLowerCase().includes("sold out")}
              >
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

        {/* Exchange Popup */}
        {showExchangePopup && (
          <div className="exchange-popup">
            <div className="exchange-popup-content">
              <button className="exchange-popup-close" onClick={closeExchangePopup}>
                &times;
              </button>
              <h2>Exchange Your Old Smartphone</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExchangeSubmit();
                }}
              >
                <label>
                  1. What is the brand of your old phone?
                  <select
                    name="brand"
                    value={exchangeForm.brand}
                    onChange={handleFormChange}
                    className={formErrors.brand ? "input-error" : ""}
                  >
                    <option value="">Select brand</option>
                    {Object.keys(brandModelsMap).map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  {formErrors.brand && <small className="error-text">{formErrors.brand}</small>}
                </label>

                <label>
                  2. What is the model of your old phone?
                  <select
                    name="model"
                    value={exchangeForm.model}
                    onChange={handleFormChange}
                    className={formErrors.model ? "input-error" : ""}
                    disabled={!exchangeForm.brand}
                  >
                    <option value="">Select model</option>
                    {exchangeForm.brand &&
                      brandModelsMap[exchangeForm.brand].map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                  </select>
                  {formErrors.model && <small className="error-text">{formErrors.model}</small>}
                </label>

                <label>
                  3. What is the condition of your old phone?
                  <select
                    name="condition"
                    value={exchangeForm.condition}
                    onChange={handleFormChange}
                    className={formErrors.condition ? "input-error" : ""}
                  >
                    <option value="">Select condition</option>
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                  {formErrors.condition && <small className="error-text">{formErrors.condition}</small>}
                </label>

                <label>
                  4. How old is your old phone?
                  <select
                    name="age"
                    value={exchangeForm.age}
                    onChange={handleFormChange}
                    className={formErrors.age ? "input-error" : ""}
                  >
                    <option value="">Select age range</option>
                    <option value="Less than 6 months">Less than 6 months</option>
                    <option value="6 months - 1 year">6 months - 1 year</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="More than 2 years">More than 2 years</option>
                  </select>
                  {formErrors.age && <small className="error-text">{formErrors.age}</small>}
                </label>

                <label>
                  5. What is the storage capacity of your old phone? (GB)
                  <input
                    type="number"
                    name="storage"
                    min="1"
                    value={exchangeForm.storage}
                    onChange={handleFormChange}
                    className={formErrors.storage ? "input-error" : ""}
                    placeholder="e.g., 64, 128, 256"
                  />
                  {formErrors.storage && <small className="error-text">{formErrors.storage}</small>}
                </label>

                <label>
                  6. What is the battery health of your old phone? (%)
                  <input
                    type="number"
                    name="batteryHealth"
                    min="1"
                    max="100"
                    value={exchangeForm.batteryHealth}
                    onChange={handleFormChange}
                    className={formErrors.batteryHealth ? "input-error" : ""}
                    placeholder="e.g., 85"
                  />
                  {formErrors.batteryHealth && <small className="error-text">{formErrors.batteryHealth}</small>}
                </label>
                  <p>
                    <strong>Estimated Trade-in Price: </strong> NPR {estimatedPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                <button type="submit" className="exchange-submit-btn">
                  Submit Exchange Details
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetailsPage;
