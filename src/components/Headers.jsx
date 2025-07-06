import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MobexLogo from '../assets/indeximages/Mobex_logo.svg';
import SearchIcon from '../assets/indeximages/search-interface-symbol.png';
import CheckoutIcon from '../assets/indeximages/checkout.png';
import FavouriteIcon from '../assets/indeximages/favourite.png';
import ProfileIcon from '../assets/indeximages/people.png';
import './Headers.css';

const Headers = () => {
    const navigate = useNavigate();
    const [searchVisible, setSearchVisible] = useState(false);
    const searchInputRef = useRef(null);

    const toggleSearch = () => {
        setSearchVisible(prev => !prev);
        setTimeout(() => {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, 100); // slight delay ensures visibility before focusing
    };

    return (
        <div className="Navbar">
            <div className="Main_Logo">
                <Link to="/">
                    <img src={MobexLogo} alt="Mobex Logo" />
                </Link>
            </div>

            <nav className="nav-links">
                <ul className="header-links">
                    <li><Link to="/brands">Brands</Link></li>
                    <li><Link to="/exchange">Exchange</Link></li>
                    <li><Link to="/special-offers">Special Offers</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/faq">FAQ</Link></li>
                </ul>
            </nav>

            <div className="auth-buttons">
                <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
                <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>

            <div className="header-icons">
                <button type="button" onClick={toggleSearch} id="menuButton">
                    <img src={SearchIcon} alt="Search Icon" />
                </button>

                <form
                    className={`search-form ${searchVisible ? 'show' : ''}`}
                    id="searchForm"
                    action="#"
                    method="GET"
                >
                    <input
                        type="text"
                        name="query"
                        placeholder="Search..."
                        ref={searchInputRef}
                        id="searchInput"
                    />
                    <button type="submit" className="submit-search">Go</button>
                </form>

                <button id="menuButton" ><img src={CheckoutIcon} alt="Checkout Icon" /></button>
                <button id="menuButton" ><img src={FavouriteIcon} alt="Favourite Icon" /></button>
                <button id="menuButton" ><img src={ProfileIcon} alt="Profile Icon" /></button>
            </div>
        </div>
    );
};

export default Headers;
