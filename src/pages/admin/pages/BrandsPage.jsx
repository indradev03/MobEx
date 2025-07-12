import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./BrandsPage.css";

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandImage, setNewBrandImage] = useState(null);
  const [newBrandImagePreview, setNewBrandImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch(() => setError("Failed to load brands"));
  }, []);

  const openModalForAdd = () => {
    setIsEditing(false);
    setEditingBrand(null);
    setNewBrandName("");
    setNewBrandImage(null);
    setNewBrandImagePreview(null);
    setError("");
    setShowModal(true);
  };

  const openModalForEdit = (brand) => {
    setIsEditing(true);
    setEditingBrand(brand);
    setNewBrandName(brand.name);
    setNewBrandImage(null);
    setNewBrandImagePreview(`http://localhost:5000${brand.image}`);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingBrand(null);
    setNewBrandName("");
    setNewBrandImage(null);
    setNewBrandImagePreview(null);
    setError("");
  };

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
    if (!newBrandImage && !isEditing)
      return setError("Please upload a brand image");

    try {
      const formData = new FormData();
      formData.append("name", trimmedName);
      if (newBrandImage) formData.append("image", newBrandImage);

      const url = isEditing
        ? `http://localhost:5000/api/brands/${editingBrand.brand_id}`
        : "http://localhost:5000/api/brands";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed to save brand");

      if (isEditing) {
        setBrands((prev) =>
          prev.map((b) => (b.brand_id === editingBrand.brand_id ? data : b))
        );
      } else {
        setBrands((prev) => [...prev, data]);
      }

      closeModal();
    } catch (err) {
      setError(isEditing ? "Error updating brand" : "Error adding brand");
    }
  };

  const handleDeleteBrand = async (brandId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this brand?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/brands/${brandId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete brand");
        return;
      }

      setBrands((prev) => prev.filter((b) => b.brand_id !== brandId));
    } catch (err) {
      setError("Error deleting brand");
    }
  };

  return (
    <div className="brands-container">
      <div className="header-with-button">
        <div className="headings">
          <h1>Brands</h1>
          <h3>Manage your mobile phone brands</h3>
        </div>
        <button className="brands-open-modal-button" onClick={openModalForAdd}>
          + Add Brand
        </button>
      </div>

      {showModal && (
        <div className="brands-modal-overlay" onClick={closeModal}>
          <div
            className="brands-modal-content"
            onClick={(e) => e.stopPropagation()} // prevent closing modal on content click
          >
            <h3>{isEditing ? "Edit Brand" : "Add Brand"}</h3>

            <form onSubmit={handleAddBrand} className="brands-form">
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Enter brand name"
                className="brands-input-text"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="brands-file-input"
              />

              {newBrandImagePreview && (
                <img
                  src={newBrandImagePreview}
                  alt="Brand Preview"
                  className="brands-preview-image"
                />
              )}

              <div className="brands-button-group">
                <button type="submit" className="brands-add-button">
                  {isEditing ? "Update Brand" : "Add Brand"}
                </button>

                <button
                  type="button"
                  className="brands-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>

              {error && <p className="brands-error-text">{error}</p>}
            </form>
          </div>
        </div>
      )}

      <div className="brands-grid-wrapper">
        <h3>All Brands</h3>
        <div className="brands-grid">
          {brands.map((brand) => (
            <div
              key={brand.brand_id}
              className="brand-card"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                if (e.target.tagName.toLowerCase() !== "button") {
                  navigate(`/admindashboard/brands/${brand.brand_id}`);
                }
              }}
              onKeyDown={(e) => {
                if (
                  (e.key === "Enter" || e.key === " ") &&
                  e.target.tagName.toLowerCase() !== "button"
                ) {
                  navigate(`/admindashboard/brands/${brand.brand_id}`);
                }
              }}
            >
              <img
                src={`http://localhost:5000${brand.image}`}
                alt={`${brand.name} logo`}
                className="brand-image"
                loading="lazy"
              />
              <p className="brand-name">{brand.name}</p>

              <button
                className="brand-edit-button"
                onClick={(e) => {
                  e.stopPropagation();
                  openModalForEdit(brand);
                }}
              >
                <FaEdit
                  style={{ marginRight: "6px", verticalAlign: "middle" }}
                />
                Edit
              </button>

              <button
                className="brand-delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBrand(brand.brand_id);
                }}
              >
                <FaTrashAlt
                  style={{ marginRight: "6px", verticalAlign: "middle" }}
                />
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;
