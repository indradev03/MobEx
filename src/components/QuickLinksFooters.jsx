    import React from 'react';
    import { Link } from 'react-router-dom';
    import './QuickLinksFooters.css';
    import BottomLogo from "../assets/indeximages/Bottomlogo.svg";

    const QuickLinksFooters = () => {
    // Define brand list with id, name, and slug
    const brands = [
        { id: 1, name: 'iPhones', slug: 'iphones' },
        { id: 2, name: 'Samsung', slug: 'samsung' },
        { id: 3, name: 'Xiaomi', slug: 'xiaomi' },
        { id: 4, name: 'OnePlus', slug: 'OnePlus' },
        { id: 5, name: 'Realme', slug: 'Realme' },
    ];

    return (
        <div className="quicklink_bottom-section">
        <div className="page-width footerLinks">
            <div className="footer-row">
            {/* Logo and About */}
            <div className="footer-column">
                <img src={BottomLogo} alt="logo" />
                <p>
                MobEx is your one-stop destination for all your mobile needs.
                Whether you're looking to buy, sell, or exchange smartphones,
                we provide a seamless and secure platform to connect buyers and sellers.
                </p>
            </div>

            {/* New Phones */}
            <div className="footer-column">
                <h2>New Phones</h2>
                <ul>
                {brands.map((brand) => (
                    <li key={brand.id}>
                    {/* Link to brand page with brand ID in URL */}
                    <Link to={`/brands/${brand.id}`}>{brand.name}</Link>
                    </li>
                ))}
                </ul>
            </div>

            {/* Inside MobEx */}
            <div className="footer-column">
                <h2>Inside MobEx</h2>
                <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/special-offers">Specail Offers</Link></li>
                </ul>
            </div>

            {/* Support */}
            <div className="footer-column">
                <h2>Support</h2>
                <ul>
                <li><Link to="/terms">Terms and Conditions</Link></li>
                <li><Link to="/support">Customer Support</Link></li>
                <li><Link to="/faq">FAQs</Link></li>
                </ul>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default QuickLinksFooters;
