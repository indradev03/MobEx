import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import MobexLogo from '../assets/indeximages/Mobex_logo.svg';
import CheckoutIcon from '../assets/indeximages/checkout.png';
import FavouriteIcon from '../assets/indeximages/favourite.png';
import ProfileIcon from '../assets/indeximages/people.png';

import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Headers.css';

const Headers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlistCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return setWishlistCount(0);

    try {
      const res = await fetch('http://localhost:5000/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      const data = await res.json();
      if (Array.isArray(data)) setWishlistCount(data.length);
      else setWishlistCount(0);
    } catch (err) {
      console.error('Failed to load wishlist', err);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || '');
      } catch {
        setUserName('');
      }
    }

    if (token) fetchWishlistCount();

    const handleLoginEvent = () => {
      setIsLoggedIn(true);
      fetchWishlistCount();
    };
    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setUserName('');
      setWishlistCount(0);
    };

    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener('login', handleLoginEvent);
    window.addEventListener('logout', handleLogoutEvent);
    window.addEventListener('wishlist-updated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('login', handleLoginEvent);
      window.removeEventListener('logout', handleLogoutEvent);
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName('');
    setWishlistCount(0);
    window.dispatchEvent(new Event('logout'));
    navigate('/login');
  };

  const handleProtectedNavigation = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      alert('Please log in first.');
      navigate('/login');
    }
  };

  return (
    <div className="header-container">
      <div className="header-logo">
        <Link to="/">
          <img src={MobexLogo} alt="Mobex Logo" />
        </Link>
      </div>

      <nav className="header-nav">
        <ul className="header-nav-links">
          <li><Link to="/brands" className={location.pathname === '/brands' ? 'active-link' : ''}>Brands</Link></li>
          <li><Link to="/exchange" className={location.pathname === '/exchange' ? 'active-link' : ''}>Exchange</Link></li>
          <li><Link to="/special-offers" className={location.pathname === '/special-offers' ? 'active-link' : ''}>Special Offers</Link></li>
          <li><Link to="/about" className={location.pathname === '/about' ? 'active-link' : ''}>About</Link></li>
          <li><Link to="/contact" className={location.pathname === '/contact' ? 'active-link' : ''}>Contact</Link></li>
          <li><Link to="/faq" className={location.pathname === '/faq' ? 'active-link' : ''}>FAQ</Link></li>
        </ul>
      </nav>

      <div className="header-auth">
        {!isLoggedIn && (
          <>
            <button className="auth-login" onClick={() => navigate('/login')}>Login</button>
            <button className="auth-signup" onClick={() => navigate('/signup')}>Sign Up</button>
          </>
        )}
      </div>

      <div className="header-icons">
        <button onClick={() => handleProtectedNavigation('/checkout')} aria-label="Checkout">
          <img src={CheckoutIcon} alt="Checkout Icon" />
        </button>

        <button onClick={() => handleProtectedNavigation('/favourites')} aria-label="Favourites" className="header-wishlist-icon">
          <img src={FavouriteIcon} alt="Favourite Icon" />
          {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
        </button>

        {isLoggedIn && (
          <div
            className="header-profile-wrapper"
            onMouseEnter={() => setProfileMenuOpen(true)}
            onMouseLeave={() => setProfileMenuOpen(false)}
          >
            <button aria-label="Profile">
              <img src={ProfileIcon} alt="Profile Icon" />
            </button>
            {profileMenuOpen && (
              <div className="header-profile-dropdown">
                <button className="dropdown-item" onClick={() => navigate('/profile')}>
                  <FaUser className="dropdown-icon" /> Profile
                </button>
                <button className="dropdown-item-logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt className="dropdown-icon" /> Logout
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
