import React from "react";
import {
  FaShieldAlt,
  FaBolt,
  FaUsers,
  FaTag,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./About.css";

// Brand logos
import AppleLogo from "../assets/Brandimage/apple.png";
import SamsungLogo from "../assets/Brandimage/samsung.png";
import XiaomiLogo from "../assets/Brandimage/xiaomi.png";
import OnePlusLogo from "../assets/Brandimage/oneplus.png";
import GooglePixelLogo from "../assets/Brandimage/honor.png";
import OppoLogo from "../assets/Brandimage/vivo.png";

// Images
import SarojImg from "../assets/indeximages/IMG_5805.jpg";
import AnmolImg from "../assets/indeximages/anmol.jpg";
import BinishaImg from "../assets/indeximages/Binisha.png";
import JoshnaImg from "../assets/indeximages/joshna.jpg";


import SustainabilityImage from "../assets/indeximages/SustainabilityImage.jpg";

// Testimonial avatars
import User1 from "../assets/indeximages/pratyush.png";
import User2 from "../assets/indeximages/shivraj.png";

const team = [
  { name: "Saroj Ayer", role: "CEO & Founder", img: SarojImg },
  { name: "Binisha Adhikari", role: "CTO", img: BinishaImg },
  { name: "Joshna Thapa", role: "Head of Operations", img: JoshnaImg },
  { name: "Anmol Shrestha", role: "Security Lead", img: AnmolImg },
];

const brands = [
  { name: "Apple", img: AppleLogo },
  { name: "Samsung", img: SamsungLogo },
  { name: "Xiaomi", img: XiaomiLogo },
  { name: "OnePlus", img: OnePlusLogo },
  { name: "Google Pixel", img: GooglePixelLogo },
  { name: "Oppo", img: OppoLogo },
];

const testimonials = [
  {
    name: "Pratyush Khatiwada",
    quote:
      "MobEx made exchanging my old phone so easy. I got a great deal and the process was super smooth!",
    img: User1,
  },
  {
    name: "Shivraj Joshi",
    quote:
      "Their secure platform and instant exchange gave me confidence. Highly recommend!",
    img: User2,
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-container">
      {/* Hero Section */}
      <section className="mx-hero-section">
        <h1>About MobEx</h1>
        <p className="mx-hero-subtitle">
          Revolutionizing the way you buy, sell, and exchange mobile devices.
          Connect globally with a secure, efficient marketplace.
        </p>
      </section>

      {/* Story & Mission */}
      <section className="mx-story-mission-wrapper">
        <div className="mx-story-section fade-in">
          <h2>Our Story</h2>
          <p>
            Founded in 2010, Mobile Exchange began with a passion to connect
            users with authentic and reliable mobile brands. We've grown into a
            trusted marketplace offering the latest smartphones, unbeatable
            exchange deals, and value-driven purchases. We empower tech lovers
            and everyday users alike with trusted choices and expert advice.
          </p>
        </div>
      </section>

      {/* Brands */}
      <section className="mx-brands-section">
        <h2>Brands We Offer</h2>
        <div className="mx-brands-grid">
          {brands.map(({ name, img }) => (
            <div key={name} className="mx-brand-card">
              <img src={img} alt={name} loading="lazy" />
              <p>{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-whyus-section">
        <h2>Why Choose Us</h2>
        <div className="mx-whyus-grid">
          <div className="mx-whyus-card">
            <FaShieldAlt className="mx-icon" />
            <h3>Secure Trading</h3>
            <p>Encrypted transactions and verified users ensure your safety.</p>
          </div>
          <div className="mx-whyus-card">
            <FaBolt className="mx-icon" />
            <h3>Instant Exchange</h3>
            <p>Real-time price matching and quick payments.</p>
          </div>
          <div className="mx-whyus-card">
            <FaUsers className="mx-icon" />
            <h3>Trusted Community</h3>
            <p>Thousands of verified users create a safe marketplace.</p>
          </div>
          <div className="mx-whyus-card">
            <FaTag className="mx-icon" />
            <h3>Best Prices</h3>
            <p>AI-powered valuation for competitive deals.</p>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
        <section className="mx-team-section">
        <h2>Meet Our Team</h2>
        <div className="mx-team-grid">
            {team.map(({ name, role, img }) => (
            <div key={name} className="mx-team-card">
                <img src={img} alt={name} className="mx-team-avatar" />
                <h4>{name}</h4>
                <p>{role}</p>
            </div>
            ))}
        </div>
        </section>


      {/* Testimonials */}
      <section className="mx-testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="mx-testimonials-grid">
          {testimonials.map(({ name, quote, img }) => (
            <div key={name} className="mx-testimonial-card fade-in">
              <img src={img} alt={name} className="mx-user-avatar" />
              <p className="mx-quote">"{quote}"</p>
              <h4 className="mx-user-name">— {name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Sustainability Impact */}
      <section className="mx-sustainability-section">
        <div className="mx-sustainability-content">
          <div className="mx-sustainability-text">
            <h2>🌿 Our Environmental Impact</h2>
            <p>
              At MobEx, we’re not just about business — we’re about building a
              better, more sustainable future. Since our founding in 2010,
              we've made it our mission to reduce electronic waste and
              encourage smarter, greener technology usage across the globe. 🌍
            </p>
            <p>
              Through our innovative phone exchange model, we've helped over{" "}
              <strong>🌱 10,000 devices</strong> find a new home, keeping them
              out of landfills and extending their lifecycle. This effort alone
              has saved more than <strong>♻️ 500 tons of e-waste</strong> from
              polluting the environment.
            </p>
            <p>
              Our platform has positively impacted users in over{" "}
              <strong>🌐 80 countries</strong>, spreading awareness about reuse,
              recycling, and responsible tech habits. We’re proud to be driving
              change toward a more circular, tech-friendly world. 💡
            </p>
          </div>
          <div className="mx-sustainability-image">
            <img
              src={SustainabilityImage}
              alt="Sustainable Tech Impact"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-cta-section">
        <h2>Ready to Upgrade?</h2>
        <p>
          Explore our marketplace or exchange your device today and experience
          hassle-free mobile deals.
        </p>
        <div className="mx-cta-buttons">
          <button className="mx-btn" onClick={() => navigate("/brands")}>
            Explore Brands
          </button>
        </div>
      </section>

      {/* Contact Info */}
      <section className="mx-contact-section">
        <div className="mx-contact-info">

            <div>
                Contact us at:
            </div>
          <div>
            <FaPhone /> +977 9845441519
          </div>
          <div>
            <FaEnvelope /> indradev03@gmail.com
          </div>
          <div>
            <FaMapMarkerAlt /> Kathmandu, Nepal
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
