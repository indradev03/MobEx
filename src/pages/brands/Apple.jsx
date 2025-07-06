import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import appleLogo from '../../assets/Brandimage/apple.png';
import slide1 from '../../assets/indeximages/exchange.jpg';
import slide2 from '../../assets/indeximages/Slide2.png';
import slide3 from '../../assets/indeximages/exchange.jpg';
import filterIcon from '../../assets/indeximages/filter.png';
import './Apple.css';
import '../../components/PremiumProducts.css'; // Reuse existing Premium style

// Apple product images
import iphone16 from "../../assets/indeximages/PreLovediPhone16Plus128GBblue.svg";
import iphone13 from "../../assets/indeximages/PreLovediPhone13Blue3.svg";
import iphone14pro from "../../assets/indeximages/PreLovediPhone14ProMax128GBPurple03.svg";
import iphone15pro from "../../assets/indeximages/PreLovediPhone15ProMaxBlue256GB.svg";
import iphone12pro from "../../assets/indeximages/PreLovediPhone12ProMax01_f94bd3d1-2070-47fa-bcef-77a9b7478717.svg";

// All products (only Apple extracted)
const allProducts = [
  {
    id: 1,
    name: "Apple iPhone 16 Plus",
    brand: "iphone",
    status: "sale",
    details: "Like New Apple iPhone 16 Plus [128GB | 100%] Brand New",
    oldPrice: 171500,
    newPrice: 154500,
    image: iphone16,
    disabled: false,
  },
  {
    id: 2,
    name: "Apple iPhone 13",
    brand: "iphone",
    status: "sale",
    details: "Apple iPhone 13 [256GB | 80%]",
    oldPrice: 86500,
    newPrice: 54500,
    image: iphone13,
    disabled: false,
  },
  {
    id: 3,
    name: "Apple iPhone 14 Pro Max",
    brand: "iphone",
    status: "sold-out",
    details: "Apple iPhone 14 Pro Max [512GB | 85%]",
    oldPrice: 247990,
    newPrice: 115500,
    image: iphone14pro,
    disabled: true,
  },
  {
    id: 4,
    name: "Apple iPhone 15 Pro Max",
    brand: "iphone",
    status: "sale",
    details: "Apple iPhone 15 Pro Max [256GB | 89%]",
    oldPrice: 206000,
    newPrice: 133500,
    image: iphone15pro,
    disabled: false,
  },
  {
    id: 5,
    name: "Apple iPhone 12 Pro Max",
    brand: "iphone",
    status: "sale",
    details: "Iphone 12 Pro Max [128GB | 91%]",
    oldPrice: 172000,
    newPrice: 112800,
    image: iphone12pro,
    disabled: false,
  },
];

const slides = [slide1, slide2, slide3];

const Apple = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Product filters
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    sort: 'default',
    search: '',
  });
  const [products, setProducts] = useState(allProducts);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const goToSlide = (index) => {
    setCurrent((index + slides.length) % slides.length);
  };

  // Filter + Sort Logic
  useEffect(() => {
    let filtered = [...allProducts];

    if (filters.status !== 'all') {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    if (filters.search.trim() !== '') {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.details.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.sort === 'price-asc') {
      filtered.sort((a, b) => a.newPrice - b.newPrice);
    } else if (filters.sort === 'price-desc') {
      filtered.sort((a, b) => b.newPrice - a.newPrice);
    }

    setProducts(filtered);
  }, [filters]);

  const handleProductClick = (id) => {
    navigate(`/productdetails?id=${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    alert('Product added to cart!');
  };

  return (
    <div className="brand-detail-page">
      {/* === Slideshow Section === */}
      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === current ? 'active-slide' : ''}`}
          >
            <img src={slide} alt={`Slide ${index + 1}`} className="slide-img" />
            {index === current && (
              <button
                className="pause-play-btn overlay"
                onClick={() => setIsPaused((prev) => !prev)}
              >
                {isPaused ? '▶️' : '⏸️'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* === Slideshow Controls === */}
      <div className="controls-container">
        <button className="prev-btn" onClick={() => goToSlide(current - 1)}>Previous</button>
        <div className="numbered-buttons">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`number-btn ${index === current ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button className="next-btn" onClick={() => goToSlide(current + 1)}>Next</button>
      </div>


      {/* === Product Filter === */}
      <div className="premium-products">
        <h2>Apple iPhones</h2>
        <button className="filer-btn" onClick={() => setFilterVisible((v) => !v)}>
          <img src={filterIcon} alt="Filter" />
          Filter Products
        </button>

        {filterVisible && (
          <div className="filter-container">
            <div className="filter-bar">
              <label>Status:</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="all">All</option>
                <option value="sale">Sale</option>
                <option value="sold-out">Sold Out</option>
              </select>
            </div>
            <div className="sort-bar">
              <label>Sort:</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* === Product Grid === */}
        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="premium-product-item"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="image-wrapper">
                <img src={product.image} alt={product.name} />
                <p className={`status ${product.status}`}>{product.status}</p>
              </div>
              <h3>{product.name}</h3>
              <p className="details">{product.details}</p>
              <p className="price">
                {product.oldPrice && (
                  <span className="old-price">
                    NPR {product.oldPrice.toLocaleString()}
                  </span>
                )}
                <span className="new-price">
                  NPR {product.newPrice.toLocaleString()}
                </span>
              </p>
              <button
                className="add-to-cart"
                disabled={product.disabled}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Apple;
