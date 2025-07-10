import React, { useState } from "react";
import "./AddProductPage.css";

const AddProductPage = () => {
  const statuses = ["Available", "Sold Out", "Pre-Order"];
  const conditions = ["New", "Like New", "Used", "Refurbished"];
  const brands = ["Apple", "Samsung", "Xiaomi", "OnePlus", "Google"];

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [details, setDetails] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [status, setStatus] = useState(statuses[0]);
  const [condition, setCondition] = useState(conditions[0]);
  const [storage, setStorage] = useState("");
  const [batteryHealth, setBatteryHealth] = useState("");
  const [thumbnails, setThumbnails] = useState([]);
  const [features, setFeatures] = useState([""]);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [brand, setBrand] = useState(brands[0]);

  // Notification state
  const [notification, setNotification] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image || !newPrice) {
      return alert("Please fill required fields: Name, Image, New Price");
    }

    const formattedSpecs = specs.reduce((acc, item) => {
      if (item.key.trim()) acc[item.key] = item.value;
      return acc;
    }, {});

    const productData = {
      name,
      brand,
      image,
      details,
      oldPrice,
      newPrice,
      discount,
      status,
      condition,
      storage,
      batteryHealth,
      thumbnails,
      features: features.filter((f) => f.trim() !== ""),
      specs: formattedSpecs,
    };

    console.log("Submitting product data:", productData);

    // Show notification instead of alert
    setNotification("Product added successfully!");
    setTimeout(() => setNotification(""), 3000);

    // Reset all fields
    setName("");
    setImage(null);
    setDetails("");
    setOldPrice("");
    setNewPrice("");
    setDiscount("");
    setStatus(statuses[0]);
    setCondition(conditions[0]);
    setStorage("");
    setBatteryHealth("");
    setThumbnails([]);
    setFeatures([""]);
    setSpecs([{ key: "", value: "" }]);
    setBrand(brands[0]);
  };

  return (
    <div className="addproduct-wrapper">
      {/* Notification popup */}
      {notification && (
        <div className="addproduct-notification">
          {notification}
        </div>
      )}

      <div className="addproduct-container">
        <h2 className="addproduct__title">Add New Product</h2>
        <form
          onSubmit={handleSubmit}
          className="addproduct-form"
          encType="multipart/form-data"
        >
          {/* Text Inputs */}
          {[
            { label: "Product Name*", value: name, setValue: setName, required: true },
            { label: "Old Price", value: oldPrice, setValue: setOldPrice },
            { label: "New Price*", value: newPrice, setValue: setNewPrice, required: true },
            { label: "Discount", value: discount, setValue: setDiscount, placeholder: "e.g. -10%" },
            { label: "Storage", value: storage, setValue: setStorage, placeholder: "e.g. 128GB" },
            { label: "Battery Health", value: batteryHealth, setValue: setBatteryHealth, placeholder: "e.g. 100%" }
          ].map((field, i) => (
            <div className="addproduct__section" key={i}>
              <label className="addproduct__label">{field.label}</label>
              <input
                className="addproduct__input"
                type="text"
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                placeholder={field.placeholder || ""}
                required={field.required}
              />
            </div>
          ))}

          {/* Brand Selector Dropdown */}
          <div className="addproduct__section">
            <label className="addproduct__label">Brand</label>
            <select
              className="addproduct__select"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Image Inputs */}
          <div className="addproduct__section">
            <label className="addproduct__label">Main Image*</label>
            <input
              className="addproduct__input"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>

          <div className="addproduct__section">
            <label className="addproduct__label">Thumbnails (multiple images)</label>
            <input
              className="addproduct__input"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setThumbnails(Array.from(e.target.files))}
            />
          </div>

          {/* Details Textarea */}
          <div className="addproduct__section">
            <label className="addproduct__label">Details</label>
            <textarea
              className="addproduct__textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>

          {/* Status & Condition Dropdowns */}
          {[
            { label: "Status", value: status, setValue: setStatus, options: statuses },
            { label: "Condition", value: condition, setValue: setCondition, options: conditions }
          ].map((field, i) => (
            <div className="addproduct__section" key={i}>
              <label className="addproduct__label">{field.label}</label>
              <select
                className="addproduct__select"
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          {/* Features */}
          <div className="addproduct__section">
            <label className="addproduct__label">Features</label>
            {features.map((feature, idx) => (
              <div key={idx} className="addproduct__feature-group">
                <input
                  className="addproduct__input"
                  type="text"
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...features];
                    newFeatures[idx] = e.target.value;
                    setFeatures(newFeatures);
                  }}
                  placeholder={`Feature #${idx + 1}`}
                />
                {features.length > 1 && (
                  <button
                    className="addproduct__button remove"
                    type="button"
                    onClick={() => {
                      const updated = features.filter((_, i) => i !== idx);
                      setFeatures(updated);
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              className="addproduct__button add"
              type="button"
              onClick={() => setFeatures([...features, ""])}
            >
              Add Feature
            </button>
          </div>

          {/* Specs */}
          <div className="addproduct__section">
            <label className="addproduct__label">Specs (Key - Value)</label>
            {specs.map((spec, idx) => (
              <div key={idx} className="addproduct__spec-group">
                <input
                  className="addproduct__input"
                  type="text"
                  placeholder="Spec Key"
                  value={spec.key}
                  onChange={(e) => {
                    const updated = [...specs];
                    updated[idx].key = e.target.value;
                    setSpecs(updated);
                  }}
                />
                <input
                  className="addproduct__input"
                  type="text"
                  placeholder="Spec Value"
                  value={spec.value}
                  onChange={(e) => {
                    const updated = [...specs];
                    updated[idx].value = e.target.value;
                    setSpecs(updated);
                  }}
                />
                <button
                  className="addproduct__button remove"
                  type="button"
                  onClick={() => {
                    const updated = specs.filter((_, i) => i !== idx);
                    setSpecs(updated);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="addproduct__button add"
              type="button"
              onClick={() => setSpecs([...specs, { key: "", value: "" }])}
            >
              Add Spec
            </button>
          </div>

          <button className="addproduct__submit-button" type="submit">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
