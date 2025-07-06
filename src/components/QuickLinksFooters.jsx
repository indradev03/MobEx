import React from 'react';
import { Link } from 'react-router-dom';
import './QuickLinksFooters.css'; // Optional: Import your styles
import BottomLogo from "../assets/indeximages/Bottomlogo.svg"

const QuickLinksFooters = () => {
    return (
        <div className="quicklink_bottom-section">
            <div className="page-width footerLinks">
                    <div className="footer-row">
                    {/* Logo and About */}
                    <div className="footer-column">
                        <img src= {BottomLogo} alt="logo" />
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
                            <li><Link to="/iphones">iPhones</Link></li>
                            <li><Link to="/samsung">Samsung</Link></li>
                            <li><Link to="/xiaomi">Xiaomi</Link></li>
                            <li><Link to="/google-pixel">Google Pixel</Link></li>
                            <li><Link to="/oneplus">OnePlus</Link></li>
                        </ul>
                    </div>

                    {/* Inside MobEx */}
                    <div className="footer-column">
                        <h2>Inside MobEx</h2>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/why-us">Why Us</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="footer-column">
                        <h2>Support</h2>
                        <ul>
                            <li><Link to="/terms">Terms and Conditions</Link></li>
                            <li><Link to="/support">Customer Support</Link></li>
                            <li><Link to="/faqs">FAQs</Link></li>
                            <li><Link to="/returns">Return Policy</Link></li>
                            <li><Link to="/payments">Payment Options</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
    };

export default QuickLinksFooters;
