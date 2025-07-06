import React from 'react';
import './Banner.css'; // Optional: Link your CSS file here
import Bannerimage from  "../assets/indeximages/Banner.webp"

const Banner = () => {
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
            <button className="shop-now">Shop Now</button>
            <button className="sell-now">Sell Now</button>
        </div>
        </div>
    </div>
    );
};

export default Banner;
