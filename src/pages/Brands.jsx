import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Brands.css';

// Import images
import apple from '../assets/Brandimage/apple.png';
import samsung from '../assets/Brandimage/samsung.png';
import realme from '../assets/Brandimage/realme.png';
import oneplus from '../assets/Brandimage/oneplus.png';
import xiaomi from '../assets/Brandimage/xiaomi.png';
import vivo from '../assets/Brandimage/vivo.png';
import honor from '../assets/Brandimage/honor.png';
import infinix from '../assets/Brandimage/infinix.png';

const brands = [
  { name: 'Apple', img: apple, text: 'Amazing Apple', route: '/brands/apple' },
  { name: 'Samsung', img: samsung, text: 'Sensational Samsung', route: '/brands/samsung' },
  { name: 'Realme', img: realme, text: 'Ravishing Realme', route: '/brands/realme' },
  { name: 'OnePlus', img: oneplus, text: 'Wonderful OnePlus', route: '/brands/oneplus' },
  { name: 'Xiaomi', img: xiaomi, text: 'Sophisticated Xiaomi', route: '/brands/xiaomi' },
  { name: 'Vivo', img: vivo, text: 'Virtuous Vivo', route: '/brands/vivo' },
  { name: 'Honor', img: honor, text: 'Heroic Honor', route: '/brands/honor' },
  { name: 'Infinix', img: infinix, text: 'Infinix', route: '/brands/infinix' },
];

const Brands = () => {
  const navigate = useNavigate();

  return (
    <div className="brands-page">
      <div className="brands-header">
        <h1>Explore Top Mobile Brands</h1>
        <p>Click on a brand to explore their latest models</p>
      </div>

      <div className="brand-container">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="brand-card"
            onClick={() => navigate(brand.route)}
          >
            <img src={brand.img} alt={brand.name} />
            <p>{brand.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
