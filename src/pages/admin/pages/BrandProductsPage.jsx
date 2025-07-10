import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const products = [
  { id: 1, brandId: 1, name: "iPhone 14 Pro Max" },
  { id: 2, brandId: 1, name: "iPhone 13" },
  { id: 3, brandId: 2, name: "Samsung Galaxy S22" },
  { id: 4, brandId: 3, name: "Xiaomi Redmi Note 11" },
];

const brands = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Samsung" },
  { id: 3, name: "Xiaomi" },
];

const BrandProductsPage = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();

  const brandProducts = products.filter(p => p.brandId === parseInt(brandId));
  const brand = brands.find(b => b.id === parseInt(brandId));

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ← Back to Brands
      </button>

      <h2>Products for Brand: {brand ? brand.name : "Unknown"}</h2>

      {brandProducts.length === 0 ? (
        <p>No products found for this brand.</p>
      ) : (
        <ul>
          {brandProducts.map(product => (
            <li key={product.id} style={{ marginBottom: "0.5rem" }}>
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BrandProductsPage;
