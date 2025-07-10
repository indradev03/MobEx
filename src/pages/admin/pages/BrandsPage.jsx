import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialBrands = [
  {
    id: 1,
    name: "Apple",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    id: 2,
    name: "Samsung",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  },
  {
    id: 3,
    name: "Xiaomi",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg",
  },
];

// Styles outside the component for cleaner code
const styles = {
  container: {
    maxWidth: 700,
    margin: "2rem auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "2rem",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
    backgroundColor: "#fff",
  },
  inputText: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  fileInput: {
    fontSize: "1rem",
  },
  previewImage: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  addButton: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "1.5rem",
  },
  brandCard: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "1rem",
    textAlign: "center",
    boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
    backgroundColor: "#fff",
    cursor: "pointer",
    userSelect: "none",
    transition: "transform 0.2s ease",
  },
  brandImage: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
    marginBottom: "0.5rem",
  },
  brandName: {
    fontWeight: "600",
    fontSize: "1.1rem",
  },
};

const BrandsPage = () => {
  const [brands, setBrands] = useState(initialBrands);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandImage, setNewBrandImage] = useState(null);
  const [newBrandImagePreview, setNewBrandImagePreview] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

  const handleAddBrand = (e) => {
    e.preventDefault();

    const trimmedName = newBrandName.trim();

    if (!trimmedName) {
      setError("Brand name cannot be empty");
      return;
    }
    if (brands.some((b) => b.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError("Brand already exists");
      return;
    }
    if (!newBrandImage) {
      setError("Please upload a brand image");
      return;
    }

    const newBrand = {
      id: brands.length > 0 ? brands[brands.length - 1].id + 1 : 1,
      name: trimmedName,
      image: newBrandImagePreview,
    };

    setBrands((prev) => [...prev, newBrand]);
    setNewBrandName("");
    setNewBrandImage(null);
    setNewBrandImagePreview(null);
    setError("");
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Manage Brands</h2>

      <form onSubmit={handleAddBrand} style={styles.form} aria-label="Add new brand form">
        <input
          type="text"
          value={newBrandName}
          onChange={(e) => setNewBrandName(e.target.value)}
          placeholder="Enter new brand name"
          style={styles.inputText}
          aria-label="New brand name"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.fileInput}
          aria-label="Upload brand image"
        />

        {newBrandImagePreview && (
          <img
            src={newBrandImagePreview}
            alt="Brand Preview"
            style={styles.previewImage}
          />
        )}

        <button
          type="submit"
          style={styles.addButton}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
        >
          Add Brand
        </button>

        {error && <p style={styles.errorText}>{error}</p>}
      </form>

      <div style={styles.grid} aria-label="List of brands">
        {brands.map((brand) => (
          <div
            key={brand.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/admindashboard/brands/${brand.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(`/admindashboard/brands/${brand.id}`);
              }
            }}
            style={styles.brandCard}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            aria-label={`View products for brand ${brand.name}`}
          >
            <img
              src={brand.image}
              alt={`${brand.name} logo`}
              style={styles.brandImage}
              loading="lazy"
            />
            <p style={styles.brandName}>{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsPage;
