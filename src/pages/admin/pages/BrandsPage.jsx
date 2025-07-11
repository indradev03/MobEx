import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrandsPage.css";

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandImage, setNewBrandImage] = useState(null);
  const [newBrandImagePreview, setNewBrandImagePreview] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch brands from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch(() => setError("Failed to load brands"));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBrandImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBrandImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setNewBrandImage(null);
      setNewBrandImagePreview(null);
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();

    const trimmedName = newBrandName.trim();
    if (!trimmedName) return setError("Brand name cannot be empty");
    if (!newBrandImagePreview) return setError("Please upload a brand image");

    try {
      const res = await fetch("http://localhost:5000/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          image: newBrandImagePreview, // base64
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add brand");
        return;
      }

      setBrands((prev) => [...prev, data]);
      setNewBrandName("");
      setNewBrandImage(null);
      setNewBrandImagePreview(null);
      setError("");
    } catch (err) {
      setError("Error adding brand");
    }
  };

  return (
    <div className="brands-container">
      <h2 className="brands-title">Manage Brands</h2>

      <form onSubmit={handleAddBrand} className="brands-form" aria-label="Add new brand form">
        <input
          type="text"
          value={newBrandName}
          onChange={(e) => setNewBrandName(e.target.value)}
          placeholder="Enter new brand name"
          className="brands-input-text"
          aria-label="New brand name"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="brands-file-input"
          aria-label="Upload brand image"
        />

        {newBrandImagePreview && (
          <img
            src={newBrandImagePreview}
            alt="Brand Preview"
            className="brands-preview-image"
          />
        )}

        <button type="submit" className="brands-add-button">
          Add Brand
        </button>

        {error && <p className="brands-error-text">{error}</p>}
      </form>

      <div className="brands-grid" aria-label="List of brands">
        {brands.map((brand) => (
          <div
            key={brand.brand_id} // NOTE: brand_id from PostgreSQL
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/admindashboard/brands/${brand.brand_id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(`/admindashboard/brands/${brand.brand_id}`);
              }
            }}
            className="brand-card"
            aria-label={`View products for brand ${brand.name}`}
          >
            <img
              src={brand.image}
              alt={`${brand.name} logo`}
              className="brand-image"
              loading="lazy"
            />
            <p className="brand-name">{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsPage;
