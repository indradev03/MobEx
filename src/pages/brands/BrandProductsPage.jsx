import React from "react";
import { useParams } from "react-router-dom";
import BrandSlideshow from "./BrandSlideshow";
import BrandProductsList from "./BrandProductsList";
import './BrandProductsPage.css'

const brandIdToSlugMap = {
  "1": "apple",
  "2": "samsung",
  "3": "xiaomi",
  // add more as needed
};

const brandMap = {
  apple: "Apple",
  samsung: "Samsung",
  xiaomi: "Xiaomi",
  // add more as needed
};

const BrandProductsPage = () => {
  const { brandId } = useParams(); // from route param

  const brandSlug = brandIdToSlugMap[brandId] || "";
  const brandDisplayName = brandMap[brandSlug] || "Unknown Brand";

  return (
    <div className="brand-products-page-user">
      <h2 className="brand-title">Showing Products for {brandDisplayName}</h2>
      <BrandSlideshow brandId={brandId} />
      <BrandProductsList brandId={brandId} />
    </div>
  );
};

export default BrandProductsPage;
