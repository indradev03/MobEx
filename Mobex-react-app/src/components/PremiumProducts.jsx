    import React, { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";

    import filter from "../assets/indeximages/filter.png"

    import iphone16 from "../assets/indeximages/PreLovediPhone16Plus128GBblue.svg";
    import iphone13 from "../assets/indeximages/PreLovediPhone13Blue3.svg";
    import iphone14pro from "../assets/indeximages/PreLovediPhone14ProMax128GBPurple03.svg";
    import samsungUltra from "../assets/indeximages/S25Ultra.svg";
    import xiaomiUltra from "../assets/indeximages/XAOMIULTRA15.svg";
    import iphone15pro from "../assets/indeximages/PreLovediPhone15ProMaxBlue256GB.svg";
    import iphone12pro from "../assets/indeximages/PreLovediPhone12ProMax01_f94bd3d1-2070-47fa-bcef-77a9b7478717.svg";
    import xiaomi14 from "../assets/indeximages/Xiaomi 14.svg";
    import samsungS25 from "../assets/indeximages/S25.svg";
    import samsungS25plus from "../assets/indeximages/S25+.svg";
    import './PremiumProducts.css';


    const productsData = [
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
        name: "Samsung Galaxy S25 Ultra",
        brand: "samsung",
        status: "sale",
        details: "Samsung Galaxy S25 Ultra [256GB | 90%]",
        oldPrice: 240500,
        newPrice: 179600,
        image: samsungUltra,
        disabled: false,
    },
    {
        id: 5,
        name: "Xiaomi 15 Ultra",
        brand: "xiaomi",
        status: "sold-out",
        details: "Xiaomi 15 Ultra [512GB | 80%]",
        oldPrice: 180400,
        newPrice: 141500,
        image: xiaomiUltra,
        disabled: true,
    },
    {
        id: 6,
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
        id: 7,
        name: "Apple iPhone 12 Pro Max",
        brand: "iphone",
        status: "sale",
        details: "Iphone 12 Pro Max [128GB | 91%]",
        oldPrice: 172000,
        newPrice: 112800,
        image: iphone12pro,
        disabled: false,
    },
    {
        id: 8,
        name: "Xiaomi 14",
        brand: "xiaomi",
        status: "sale",
        details: "Xiaomi 14 Brand New",
        oldPrice: null,
        newPrice: 99999,
        image: xiaomi14,
        disabled: false,
    },
    {
        id: 9,
        name: "Samsung Galaxy S25",
        brand: "samsung",
        status: "sold-out",
        details: "Samsung Galaxy S25 Brand New",
        oldPrice: null,
        newPrice: 104999,
        image: samsungS25,
        disabled: true,
    },
    {
        id: 10,
        name: "Samsung Galaxy S25+",
        brand: "samsung",
        status: "sale",
        details: "Samsung Galaxy S25+ Brand New",
        oldPrice: null,
        newPrice: 119900,
        image: samsungS25plus,
        disabled: false,
    },
    ];

    export default function Premium() {
    const [filterVisible, setFilterVisible] = useState(false);
    const [filters, setFilters] = useState({
        brand: "all",
        status: "all",
        search: "",
        sort: "default",
    });

    const [products, setProducts] = useState(productsData);

    const toggleFilter = () => setFilterVisible((v) => !v);

    // Filter and sort logic
    useEffect(() => {
        let filtered = [...productsData];

        if (filters.brand !== "all") {
        filtered = filtered.filter((p) =>
            p.brand.toLowerCase().includes(filters.brand.toLowerCase())
        );
        }

        if (filters.status !== "all") {
        filtered = filtered.filter((p) =>
            p.status.toLowerCase().includes(filters.status.toLowerCase())
        );
        }

        if (filters.search.trim() !== "") {
        filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            p.details.toLowerCase().includes(filters.search.toLowerCase())
        );
        }

        if (filters.sort === "price-asc") {
        filtered.sort((a, b) => a.newPrice - b.newPrice);
        } else if (filters.sort === "price-desc") {
        filtered.sort((a, b) => b.newPrice - a.newPrice);
        }

        setProducts(filtered);
    }, [filters]);

    // Navigate to product detail page
    const navigate = useNavigate();
    const handleProductClick = (id) => {
        navigate(`/productdetails?id=${id}`);
    };

    // Add to cart alert
    const handleAddToCart = (e) => {
        e.stopPropagation();
        alert("Product added to cart!");
    };

    return (
        <div className="premium-products">
        <h2>Hot Sale</h2>

        <button className="filer-btn" id="filterButton" onClick={toggleFilter}>
            <img src={filter} alt="Filter Icon" />
            Filter Products
        </button>

        {filterVisible && (
            <div
            className="filter-container"
            id="filterControls"
            style={{ display: "flex" }}
            >
            <div className="filter-bar">
                <label htmlFor="brand">Brand:</label>
                <select
                id="brand"
                value={filters.brand}
                onChange={(e) =>
                    setFilters((f) => ({ ...f, brand: e.target.value }))
                }
                >
                <option value="all">All</option>
                <option value="iphone">Apple</option>
                <option value="samsung">Samsung</option>
                <option value="xiaomi">Xiaomi</option>
                </select>

                <label htmlFor="status">Status:</label>
                <select
                id="status"
                value={filters.status}
                onChange={(e) =>
                    setFilters((f) => ({ ...f, status: e.target.value }))
                }
                >
                <option value="all">All</option>
                <option value="sale">Sale</option>
                <option value="sold-out">Sold Out</option>
                </select>
            </div>

            <div className="sort-bar">
                <label htmlFor="sort">Sort By:</label>
                <select
                id="sort"
                value={filters.sort}
                onChange={(e) =>
                    setFilters((f) => ({ ...f, sort: e.target.value }))
                }
                >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                </select>
            </div>

            <div className="search-bar">
                <input
                type="text"
                id="search"
                placeholder="Search for products..."
                value={filters.search}
                onChange={(e) =>
                    setFilters((f) => ({ ...f, search: e.target.value }))
                }
                />
                <button onClick={() => {}}>Search</button>
            </div>
            </div>
        )}





        <div className="product-grid">
            {products.map((product) => (
            <div
                key={product.id}
                className="premium-product-item"
                data-id={product.id}
                data-brand={product.brand}
                onClick={() => handleProductClick(product.id)}
                style={{ cursor: "pointer" }}
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
                    NPR{" "}
                    {product.oldPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                    </span>
                )}
                <span className="new-price">
                    NPR{" "}
                    {product.newPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    })}
                </span>
                </p>
                <button
                className="add-to-cart"
                disabled={product.disabled}
                onClick={(e) => handleAddToCart(e)}
                >
                    Add to Cart
                </button>
            </div>
            ))}
        </div>
        </div>
    );
    }
