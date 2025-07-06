import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutSection.css';
import aboutusimg from "../assets/indeximages/Aboutus.png"

const AboutSection = () => {
    const navigate = useNavigate();

    const handleLearnMore = () => {
        navigate('/about'); // This will go to the /about page
    };

    return (
        <div className="about_sections">
        <div className="about099">
            <div className="row00111">
            <div className="Text-section001">
                    <h2>Our Mision</h2>
                    <p>
                    Welcome to MobEx, your trusted platform for buying,
                    selling, and exchanging smartphones with ease and confidence.
                    </p>
                    <p>
                    Our mission is to simplify the mobile device market by connecting
                    buyers and sellers through a secure, user-friendly
                    system that ensures transparency and value for everyone.
                    </p>
                    <p>
                    We understand that upgrading or exchanging your phone can be a hassle.
                    That's why we offer a seamless experience, from listing your device to finding the perfect match.
                    </p>
                <button id="learnmore" onClick={handleLearnMore}>Learn More</button>
            </div>
            <div className="image-section001">
                <img src= {aboutusimg} alt="About MobEx" />
            </div>
            </div>
        </div>
        </div>
    );
};

export default AboutSection;
