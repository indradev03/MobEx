import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MobexLogo from '../assets/indeximages/Mobex_logo.svg';
import SearchIcon from '../assets/indeximages/search-interface-symbol.png';
import CheckoutIcon from '../assets/indeximages/checkout.png';
import FavouriteIcon from '../assets/indeximages/favourite.png';
import ProfileIcon from '../assets/indeximages/people.png';

import { FaUser, FaSignOutAlt } from 'react-icons/fa'; // Import icons

import './Headers.css';

const Headers = () => {
  const navigate = useNavigate();
  const [searchVisible, setSearchVisible] = useState(false);
  const searchInputRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleLoginEvent = () => setIsLoggedIn(true);
    const handleLogoutEvent = () => setIsLoggedIn(false);

    window.addEventListener('login', handleLoginEvent);
    window.addEventListener('logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('login', handleLoginEvent);
      window.removeEventListener('logout', handleLogoutEvent);
    };
  }, []);

  const toggleSearch = () => {
    setSearchVisible(prev => !prev);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('logout'));
    navigate('/login');
  };

  const handleProtectedNavigation = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate('/login');
    }
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
        {!isLoggedIn && (
          <>
            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
          </>
        )}
      </div>

      <div className="header-icons">
        <button type="button" onClick={toggleSearch} id="menuButton" aria-label="Toggle search">
          <img src={SearchIcon} alt="Search Icon" />
        </button>

        <form className={`search-form ${searchVisible ? 'show' : ''}`} onSubmit={e => e.preventDefault()}>
          <input type="text" placeholder="Search..." ref={searchInputRef} autoComplete="off" />
          <button type="submit" className="submit-search">Go</button>
        </form>

        <button
          id="menuButton"
          aria-label="Checkout"
          onClick={() => handleProtectedNavigation('/checkout')}
        >
          <img src={CheckoutIcon} alt="Checkout Icon" />
        </button>

        <button
          id="menuButton"
          aria-label="Favourites"
          onClick={() => handleProtectedNavigation('/favourites')}
        >
          <img src={FavouriteIcon} alt="Favourite Icon" />
        </button>

        {isLoggedIn && (
          <div
            className="profile-dropdown-wrapper"
            onMouseEnter={() => setProfileMenuOpen(true)}
            onMouseLeave={() => setProfileMenuOpen(false)}
          >
            <button id="menuButton" aria-label="Profile">
              <img src={ProfileIcon} alt="Profile Icon" />
            </button>

            {profileMenuOpen && (
              <div className="profile-dropdown">
                <button className="dropdown-item" onClick={() => navigate('/profile')}>
                  <FaUser className="dropdown-icon" />
                  Profile
                </button>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt className="dropdown-icon" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Headers;
