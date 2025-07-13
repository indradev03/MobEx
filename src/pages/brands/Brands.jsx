import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Brands.css";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/brands")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch brands");
        return res.json();
      })
      .then((data) => {
        setBrands(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="brands-page">
      <div className="brands-header">
        <h1>Explore Top Mobile Brands</h1>
        <p>Click on a brand to explore their latest models</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <div className="loading-brands">Loading brands...</div>
      ) : (
        <div className="brand-container">
          {brands.map((brand) => (
            <div
              key={brand.brand_id}
              className="brand-card"
              onClick={() => navigate(`/brands/${brand.brand_id}`)}
            >
              <img
                src={`http://localhost:5000${brand.image}`}
                alt={brand.name}
                loading="lazy"
              />
              <p>{brand.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Brands;
