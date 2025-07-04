import React from 'react';
import './WhyUsSection.css'; // Optional: your CSS file
import trust from '../assets/indeximages/trust.svg'
import quality from "../assets/indeximages/quality.svg"
import freepurchase from "../assets/indeximages/freePurchases.svg"
import quickeasy from "../assets/indeximages/quickEasy.svg"

const WhyUsSection = () => {
        return (
            <div className="whyus-section">
                <div className="whyuss001">
                    <div className="us001">
                        <div className="whysuuus999">
                                <h2>Why Us</h2>
                                <p>
                                    The products we sell are professionally inspected and thoroughly 
                                    tested using a full diagnostic testing software.
                                    Our skilled professionals make sure that the products 
                                    that reach your doorsteps are always in a pristine condition.
                                </p>
                        </div>

                        <div className="whyuss000">
                            <ul>
                                <li>
                                    <img src={trust} alt="trust" />
                                    <div className="Why01">
                                        <h4>Product you can trust</h4>
                                        <p>
                                            You'll always have a tested and certified latest piece of tech and a Happy Wallet all the time.
                                        </p>
                                    </div>
                                </li>

                                <li>
                                    <img src= {quality} alt="quality" />
                                    <div className="Why01">
                                        <h4>Quality you can rely on</h4>
                                        <p>
                                            Our working professionals make sure that the utmost quality products are always in a top-notch condition.
                                        </p>
                                    </div>
                                </li>

                                <li>
                                    <img src={freepurchase} alt="purchase" />
                                        <div className="Why01">
                                        <h4>Hassle-free purchase</h4>
                                        <p>
                                            You like it, You buy it, You get it. As simple as that. There are no extra or hidden costs whatsoever.
                                        </p>
                                    </div>
                                </li>

                                <li>
                                    <img src= {quickeasy} alt="easy return" />
                                    <div className="Why01">
                                        <h4>Quick delivery and easy return</h4>
                                        <p>
                                            We’re confident that combination of timely service and convenience will ensure your satisfaction with every order.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

export default WhyUsSection;
