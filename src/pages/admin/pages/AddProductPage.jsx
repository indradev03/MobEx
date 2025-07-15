import React, { useState, useEffect } from "react";
import "./AddProductPage.css";
import { FaEdit, FaTrashAlt, FaSearch, FaFilter } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "http://localhost:5000/api/products";

const AddProductPage = () => {
  const statuses = ["Available", "Sold Out", "Pre-Order"];
  const conditions = ["New", "Like New", "Used", "Refurbished"];
  const brands = [
    { brand_id: 1, name: "Apple" },
    { brand_id: 2, name: "Samsung" },
    { brand_id: 3, name: "Xiaomi" },
    { brand_id: 4, name: "OnePlus" },
    { brand_id: 5, name: "Realme" },
    { brand_id: 6, name: "Honor" },
    { brand_id: 7, name: "Infinix" },
    { brand_id: 8, name: "Vivo" }
  ];

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [details, setDetails] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [status, setStatus] = useState(statuses[0]);
  const [condition, setCondition] = useState(conditions[0]);
  const [storage, setStorage] = useState("");
  const [batteryHealth, setBatteryHealth] = useState("");
  const [thumbnailsFiles, setThumbnailsFiles] = useState([]);
  const [thumbnailsPreview, setThumbnailsPreview] = useState([]);
  const [features, setFeatures] = useState([""]);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [brandId, setBrandId] = useState(brands[0].brand_id);

  const [filterBrandId, setFilterBrandId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts(filterBrandId);
  }, [filterBrandId]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    if (thumbnailsFiles.length === 0) {
      setThumbnailsPreview([]);
      return;
    }
    const previews = thumbnailsFiles.map((file) => URL.createObjectURL(file));
    setThumbnailsPreview(previews);
    return () => previews.forEach(URL.revokeObjectURL);
  }, [thumbnailsFiles]);

  const fetchProducts = async (brandId = null) => {
    try {
      const url = brandId ? `${API_URL}/brand/${brandId}` : API_URL;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetForm = () => {
    setName("");
    setImageFile(null);
    setImagePreview("");
    setDetails("");
    setOldPrice("");
    setNewPrice("");
    setDiscount("");
    setStatus(statuses[0]);
    setCondition(conditions[0]);
    setStorage("");
    setBatteryHealth("");
    setThumbnailsFiles([]);
    setThumbnailsPreview([]);
    setFeatures([""]);
    setSpecs([{ key: "", value: "" }]);
    setBrandId(brands[0].brand_id);
    setEditId(null);
  };

  const openModalForAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openModalForEdit = (product) => {
    setEditId(product.product_id);
    setName(product.name);
    setImagePreview(product.image || "");
    setImageFile(null);
    setDetails(product.details || "");
    setOldPrice(product.old_price || "");
    setNewPrice(product.new_price || "");
    setDiscount(product.discount || "");
    setStatus(product.status || statuses[0]);
    setCondition(product.condition || conditions[0]);
    setStorage(product.storage || "");
    setBatteryHealth(product.battery_health || "");
    setThumbnailsFiles([]);
    setThumbnailsPreview(product.thumbnails || []);
    setFeatures(product.features?.length ? product.features : [""]);
    setSpecs(product.specs ? Object.entries(product.specs).map(([key, value]) => ({ key, value })) : [{ key: "", value: "" }]);
    setBrandId(product.brand_id || brands[0].brand_id);
    setIsModalOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !newPrice || !brandId) {
      toast.warn("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("brand_id", brandId);
      formData.append("new_price", newPrice);
      if (oldPrice) formData.append("old_price", oldPrice);
      if (discount) formData.append("discount", discount);
      formData.append("status", status);
      formData.append("condition", condition);
      if (details) formData.append("details", details);
      if (storage) formData.append("storage", storage);
      if (batteryHealth) formData.append("battery_health", batteryHealth);
      formData.append("features", JSON.stringify(features.filter((f) => f.trim() !== "")));
      formData.append("specs", JSON.stringify(specs.reduce((acc, item) => {
        if (item.key.trim()) acc[item.key] = item.value;
        return acc;
      }, {})));

      if (imageFile) formData.append("image", imageFile);
      thumbnailsFiles.forEach((file) => formData.append("thumbnails", file));

      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_URL}/${editId}` : API_URL;

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to ${editId ? "update" : "add"} product: ${errorText}`);
      }

      toast.success(`Product ${editId ? "updated" : "added"} successfully!`);
      resetForm();
      setIsModalOpen(false);
      fetchProducts(filterBrandId);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      toast.success("Product deleted successfully!");
      fetchProducts(filterBrandId);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesBrand = filterBrandId ? p.brand_id === filterBrandId : true;
    const matchesSearch = searchTerm
      ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesBrand && matchesSearch;
  });

  return (
    <div className="addproduct-wrapper">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="header-with-button">
        <div className="headings">
          <h1>Product</h1>
          <h3>Manage your mobile phone inventory</h3>
        </div>
        <button className="addproduct-open-button" onClick={openModalForAdd}>
          + Add Product
        </button>
      </div>
<div className="filter-search-container">
  {/* Search Section */}
  <div className="search-group">
    <div className="input-with-icon">
      <FaSearch className="icon-inside-input" />
      <input
        id="searchInput"
        type="text"
        placeholder="Search mobiles..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="filter-input with-icon"
      />
    </div>
    <button
      type="button"
      className="search-btn"
      onClick={() => setSearchTerm(searchInput.trim())}
    >
      Search
    </button>
  </div>

  {/* Filter Section */}
  <div className="filter-group">
    <div className="select-with-icon">
      <FaFilter className="icon-inside-select" />
      <select
        id="brandFilterSelect"
        value={filterBrandId || ""}
        onChange={(e) => {
          const val = e.target.value;
          setFilterBrandId(val ? parseInt(val) : null);
        }}
        className="filter-select with-icon"
      >
        <option value="">All Brands</option>
        {brands.map((b) => (
          <option key={b.brand_id} value={b.brand_id}>
            {b.name}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

      {/* Products Table */}
      <div className="products-table-container">
        <h3>All Products</h3>
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>New Price</th>
                <th>Old Price</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Condition</th>
                <th>Storage</th>
                <th>Battery</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.product_id}>
                  <td>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>₨ {parseFloat(p.new_price).toLocaleString()}</td>
                  <td>
                    {p.old_price
                      ? `₨ ${parseFloat(p.old_price).toLocaleString()}`
                      : "-"}
                  </td>
                  <td>{p.discount ? `${p.discount.replace("%", "")}%` : "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        p.status.toLowerCase().replace(/\s+/g, "-")
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>{p.condition}</td>
                  <td>{p.storage ? `${p.storage.replace(/GB/i, "")}GB` : "-"}</td>
                  <td>{p.battery_health ? `${p.battery_health.replace(/%/g, "")}%` : "-"}</td>
                  <td className="action-buttons">
                    <button
                      className="action-button edit"
                      onClick={() => openModalForEdit(p)}
                    >
                      <FaEdit className="icon" /> Edit
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => handleDelete(p.product_id)}
                    >
                      <FaTrashAlt className="icon" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>
              &times;
            </button>
            <h2>{editId ? "Edit Product" : "Add New Product"}</h2>

            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="addproduct-form"
            >
              {/* Text Inputs */}
              <div className="addproduct__section">
                <label>Product Name*</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="addproduct__section">
                <label>Old Price</label>
                <input
                  type="text"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div className="addproduct__section">
                <label>New Price*</label>
                <input
                  type="number"
                  min="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                />
              </div>

              <div className="addproduct__section">
                <label>Discount</label>
                <input
                  type="text"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="e.g. -10%"
                />
              </div>

              <div className="addproduct__section">
                <label>Storage</label>
                <input
                  type="text"
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  placeholder="e.g. 128GB"
                />
              </div>

              <div className="addproduct__section">
                <label>Battery Health</label>
                <input
                  type="text"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(e.target.value)}
                  placeholder="e.g. 100%"
                />
              </div>

              {/* Brand Select */}
              <div className="addproduct__section">
                <label>Brand*</label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(parseInt(e.target.value))}
                  required
                >
                  {brands.map((b) => (
                    <option key={b.brand_id} value={b.brand_id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status and Condition */}
              <div className="addproduct__section">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="addproduct__section">
                <label>Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  {conditions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Details */}
              <div className="addproduct__section">
                <label>Details</label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div className="addproduct__section">
                <label>
                  Main Image {editId ? "(leave empty to keep current)" : "*"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  required={!editId}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: "120px", marginTop: "10px" }}
                  />
                )}
              </div>

              {/* Thumbnails Upload */}
              <div className="addproduct__section">
                <label>Thumbnails (multiple images)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setThumbnailsFiles(Array.from(e.target.files))}
                />
                {thumbnailsPreview.length > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    {thumbnailsPreview.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Thumbnail ${i + 1}`}
                        style={{ maxWidth: "70px", marginRight: "5px" }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="addproduct__section">
                <label>Features</label>
                {features.map((feature, idx) => (
                  <div key={idx} className="feature-group">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const updated = [...features];
                        updated[idx] = e.target.value;
                        setFeatures(updated);
                      }}
                      placeholder={`Feature #${idx + 1}`}
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() =>
                          setFeatures(features.filter((_, i) => i !== idx))
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => setFeatures([...features, ""])}
                >
                  Add Feature
                </button>
              </div>

              {/* Specs */}
              <div className="addproduct__section">
                <label>Technical Specs</label>
                {specs.map((spec, idx) => (
                  <div key={idx} className="spec-group">
                    <input
                      type="text"
                      placeholder="Key"
                      value={spec.key}
                      onChange={(e) => {
                        const updated = [...specs];
                        updated[idx].key = e.target.value;
                        setSpecs(updated);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) => {
                        const updated = [...specs];
                        updated[idx].value = e.target.value;
                        setSpecs(updated);
                      }}
                    />
                    {specs.length > 1 && (
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() =>
                          setSpecs(specs.filter((_, i) => i !== idx))
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => setSpecs([...specs, { key: "", value: "" }])}
                >
                  Add Spec
                </button>
              </div>

              <button type="submit" className="addproduct-submit-button">
                {editId ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductPage;
