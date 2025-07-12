import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Brands.css";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/brands")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch brands");
        return res.json();
      })
      .then((data) => setBrands(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="brands-page">
      <div className="brands-header">
        <h1>Explore Top Mobile Brands</h1>
        <p>Click on a brand to explore their latest models</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="brand-container">
        {brands.map((brand) => (
          <div
            key={brand.brand_id}
            className="brand-card"
            onClick={() => navigate(`/brands/${brand.brand_id}`)} // Or use brand.name for route if you prefer
          >
            {/* Assuming brand.image is a path like "/uploads/brand-image.png" */}
            <img
              src={`http://localhost:5000${brand.image}`}
              alt={brand.name}
              loading="lazy"
            />
            <p>{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
