import React from 'react';
import './Banner.css';
import Bannerimage from "../assets/indeximages/Banner.webp";
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate(); // ✅ Add this

  return (
    <div className="banner-conatainer">
      <div className="banner">
        <img
          src={Bannerimage}
          alt="Banner Image"
        />
        <div className="banner-text">
          <h2>Exclusive Offers</h2>
          <p>Get the best deals on the latest smartphones.</p>
          <button onClick={() => navigate("/brands")} className="shop-now">
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
