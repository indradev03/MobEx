import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SpecialOffers.css";

const brandIds = {
  apple: 1,
  samsung: 2,
  xiaomi: 3,
};

const SpecialOffers = () => {
  const [offers, setOffers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const baseURL = "http://localhost:5000/api/products/brand";
        const [appleRes, samsungRes, xiaomiRes] = await Promise.all([
          fetch(`${baseURL}/${brandIds.apple}?limit=5`).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch Apple products");
            return res.json();
          }),
          fetch(`${baseURL}/${brandIds.samsung}?limit=3`).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch Samsung products");
            return res.json();
          }),
          fetch(`${baseURL}/${brandIds.xiaomi}?limit=2`).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch Xiaomi products");
            return res.json();
          }),
        ]);

        const tagOptions = ["HOT DEAL", "LIMITED", "EXCLUSIVE", "TOP PICK", "FLASH", "NEW"];

        const merged = [...appleRes, ...samsungRes, ...xiaomiRes].map((item, index) => ({
          id: item._id,
          name: item.name,
          image: item.image_url,
          originalPrice: item.old_price,
          offerPrice: item.new_price,
          cashback: Math.floor(item.new_price * 0.1),
          tag: tagOptions[index % tagOptions.length],
        }));

        setOffers(merged);
      } catch (err) {
        console.error("Failed to fetch offers:", err);
        setError("Unable to load special offers. Please try again later.");
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const handleShopNowClick = () => {
    navigate("/brands");
  };

  return (
    <div className="special-offers-container">
      {/* Hero */}
      <section className="offers-hero">
        <h1>🔥 Special Offers on Top Smartphones</h1>
        <p>Buy, exchange, and save big — only for a limited time!</p>
        <button onClick={handleShopNowClick} className="cta-button">
          Shop Now
        </button>
      </section>

      {/* Countdown */}
      <section className="flash-sale">
        <h2>
          ⚡ Flash Sale Ends In: <span>{formatTime(timeLeft)}</span>
        </h2>
      </section>

      {/* Product Grid */}
      <section id="offers-grid" className="offers-grid">
        {error && <p className="error-message">{error}</p>}
        {!error && offers.length === 0 && <p>Loading special offers...</p>}
        {offers.map((offer, index) => (
          <div
            key={offer.id ? offer.id : `offer-${index}`}
            className="offer-card"
          >
            <div className="tag">{offer.tag}</div>
            <img src={offer.image} alt={offer.name} />
            <h3>{offer.name}</h3>
            <p className="price">
              <span className="original">₨ {offer.originalPrice?.toLocaleString()}</span>
              <span className="offer">₨ {offer.offerPrice?.toLocaleString()}</span>
            </p>
            <p className="cashback">
              Cashback: <strong>₨ {offer.cashback?.toLocaleString()}</strong>
            </p>
          </div>
        ))}
      </section>

      {/* Updated Info Text */}
      <section className="exchange-highlight">
        <h2>Interested in grabbing these offers?</h2>
        <p>
          Explore the brands on our <button className="link-button" onClick={handleShopNowClick}>Brands Page</button> to find your favorite deals.
        </p>
      </section>
    </div>
  );
};

export default SpecialOffers;
