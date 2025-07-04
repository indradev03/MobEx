import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import "./ProductDetails.css"; // Optional: For styling
import iphone16purple from "../assets/productsimages/iphone16purple.png";
import Iphone16Pink from '../assets/productsimages/Iphoen16Pink.png';
import Iphone16Black from '../assets/productsimages/Iphone16Black.png';
import Iphone16Green from '../assets/productsimages/iphone16Green.png';
import Iphone16Purple from '../assets/productsimages/iphone16purple.png';

import Iphone13MiniBlue1 from '../assets/productsimages/Iphone13miniblue1.svg';
import Iphone13MiniBlue2 from '../assets/productsimages/Iphone13miniblue2.svg';
import Iphone13MiniBlue3 from '../assets/productsimages/Iphone13miniblue3.svg';
import Iphone13MiniBlue4 from '../assets/productsimages/Iphone13miniblue4.svg';

import iPhonePurple1 from '../assets/productsimages/Iphone14promaxpurple1.svg';
import iPhonePurple2 from '../assets/productsimages/Iphone14promaxpurple2.svg';
import iPhonePurple3 from '../assets/productsimages/Iphone14promaxpurple3.svg';
import iPhonePurple4 from '../assets/productsimages/Iphone14promaxpurple4.svg';

import SamsungS25Ultragold01 from '../assets/productsimages/SamsungS25Ultragold01.svg';
import SamsungS25Ultragold02 from '../assets/productsimages/SamsungS25Ultragold02.svg';
import SamsungS25Ultragold03 from '../assets/productsimages/SamsungS25Ultragold03.svg';

import Xiaomi15UltraSilverchrome01 from '../assets/productsimages/Xiaomi15UltraSilverchrome01.svg';
import Xiaomi15UltraSilverchrome02 from '../assets/productsimages/Xiaomi15UltraSilverchrome02.svg';
import Xiaomi15UltraSilverchrome03 from '../assets/productsimages/Xiaomi15UltraSilverchrome03.svg';

import Iphone15promaxblue2 from '../assets/productsimages/Iphone15promaxblue2.svg';
import Iphone15promaxblue3 from '../assets/productsimages/Iphone15promaxblue3.svg';
import Iphone15promaxblue4 from '../assets/productsimages/Iphone15promaxblue4.svg';

import Iphone12promaxpacificblue01 from '../assets/productsimages/Iphone12promaxpacificblue01.svg';
import Iphone12promaxpacificblue02 from '../assets/productsimages/Iphone12promaxpacificblue02.svg';
import Iphone12promaxpacificblue03 from '../assets/productsimages/Iphone12promaxpacificblue03.svg';
import Iphone12promaxpacificblue04 from '../assets/productsimages/Iphone12promaxpacificblue04.svg';

import Xiaomi14jadegreen01 from '../assets/productsimages/Xiaomi14jadegreen01.svg';
import Xiaomi14jadegreen02 from '../assets/productsimages/Xiaomi14jadegreen02.svg';
import Xiaomi14jadegreen03 from '../assets/productsimages/Xiaomi14jadegreen03.svg';
import Xiaomi14jadegreen04 from '../assets/productsimages/Xiaomi14jadegreen04.svg';

import SamsungS25Silver01 from '../assets/productsimages/SamsungS25Silver01.svg';
import SamsungS25Silver02 from '../assets/productsimages/SamsungS25Silver02.svg';
import SamsungS25Silver03 from '../assets/productsimages/SamsungS25Silver03.svg';
import SamsungS25Silver04 from '../assets/productsimages/SamsungS25Silver04.svg';

import SamsungS25plusmint01 from '../assets/productsimages/SamsungS25plusmint01.svg';
import SamsungS25plusmint02 from '../assets/productsimages/SamsungS25plusmint02.svg';
import SamsungS25plusmint03 from '../assets/productsimages/SamsungS25plusmint03.svg';
import SamsungS25plusmint04 from '../assets/productsimages/SamsungS25plusmint04.svg';

const products = {
        1: {
        name: "Apple iPhone 16 Plus",
        image:  iphone16purple,
        details: "Like New Apple iPhone 16 Plus [128GB | 100%] (10 Months Warranty Left)",
        oldPrice: "NPR 171,500.00",
        newPrice: "NPR 154,500.00",
        discount: "-10%",
        status: "Sold Out",
        statusClass: "sold-out",
        thumbnails:[Iphone16Pink, Iphone16Black, Iphone16Green, Iphone16Purple],
        condition: "Like New",
        storage: "128GB",
        batteryHealth: "100%",
        features: [
            "Stunning Display: The iPhone 16 Plus boasts a large and vibrant Super Retina XDR display with a ProMotion refresh rate of 120Hz. This means that the display is incredibly smooth and responsive, making it perfect for gaming, watching videos, and browsing the web.",
            "A16 Bionic chip for lightning-fast performance",
            "Exceptional battery life with fast charging",
            "Advanced camera system with 48MP sensor",
            "5G connectivity for ultra-fast internet"
        ],
        specs: {
            Network: "GSM / CDMA / HSPA / EVDO / LTE / 5G",
            Dimensions: "160.8 x 78.1 x 7.7 mm",
            Weight: "210g",
            SIM: "Nano-SIM and eSIM",
            Display: "OLED Super Retina XDR, 6.7 inches",
            Resolution: "1290 x 2796 pixels",
            Memory: "128GB",
            Camera: "48 MP dual + 12 MP front",
            "Battery": "Li-Ion 4325 mAh, non-removable, 50% in 30 min, 15W wireless (Qi/PMA), 7.5W reverse wireless charging",
            "Operating System": "iOS 16, upgradable to iOS 16.1.2",
            "CPU": "Hexa-core (2x Cortex-A76 + 4x Cortex-A55)",
            "GPU": "Apple GPU (4-core graphics)",
            "Sensors": "Face ID, accelerometer, gyro, proximity, compass, barometer",
            "Audio": "Stereo speakers",
            "Charging": "20W wired, PD 3.0, 50% in 30 min, 15W wireless (Qi/PMA), 7.5W reverse wireless charging",

        }
        },

        2: {
        name: "Apple iPhone 13",
        image: Iphone13MiniBlue4,
        details: "Apple iPhone 13 [256GB | 80%]",
        oldPrice: "NPR 86,500.00",
        newPrice: "NPR 54,500.00",
        discount: "-37%",
        status: "In Stock",
        statusClass: "sale",
        thumbnails: [
            Iphone13MiniBlue4,
            Iphone13MiniBlue1,
            Iphone13MiniBlue2,
            Iphone13MiniBlue3
        ],
        condition: "Used (Good Condition)",
        storage: "256GB",
        batteryHealth: "80%",
        features: [
            "Super Retina XDR display with True Tone",
            "A15 Bionic chip for smooth performance",
            "Decent battery life with optimized power management",
            "Dual 12MP camera system for stunning photos",
            "5G support for fast data speeds"
        ],
        specs: {
            Network: "GSM / CDMA / HSPA / EVDO / LTE / 5G",
            Dimensions: "146.7 x 71.5 x 7.7 mm",
            Weight: "174g",
            SIM: "Nano-SIM and eSIM",
            Display: "Super Retina XDR OLED, 6.1 inches",
            Resolution: "1170 x 2532 pixels",
            Memory: "256GB",
            Camera: "12 MP dual + 12 MP front",
            "Battery": "Li-Ion 3240 mAh, non-removable, 50% in 30 min, 15W wireless (Qi/PMA), 7.5W reverse wireless charging",
            "Operating System": "iOS 15, upgradable to iOS 16.1.2",
            "Chipset": "Apple A15 Bionic (5 nm)",
            "CPU": "Hexa-core (2x3.23 GHz Avalanche + 4x1.82 GHz Blizzard)",
            "GPU": "Apple GPU (4-core graphics)",
            "Sensors": "Face ID, accelerometer, gyro, proximity, compass, barometer",
            "Audio": "Stereo speakers",
            "Charging": "20W wired, PD 3.0, 50% in 30 min, 15W wireless (Qi/PMA), 7.5W reverse wireless charging"
        }
        },
        
        3: {
            name: "Apple iPhone 14 Pro Max",
            image: iPhonePurple1,
            details: "Apple iPhone 14 Pro Max [128GB | 85%]",
            oldPrice: "NPR 247,990.00",
            newPrice: "NPR 115,500.00",
            discount: "-53%",
            status: "In Stock",
            statusClass: "sale",
            thumbnails: [
                    iPhonePurple1,
                    iPhonePurple2,
                    iPhonePurple3,
                    iPhonePurple4,
            ],
            condition: "Used (Good Condition)",
            storage: "128GB",
            batteryHealth: "85%",
            
            features: [
                "Super Retina XDR display with ProMotion technology",
                "A16 Bionic chip for exceptional performance",
                "Advanced camera system with ProRAW and ProRes video recording",
                "Long-lasting battery life with fast charging support",
                "5G connectivity for ultra-fast internet speeds"
            ],
            specs: {
                Network: "GSM / CDMA / HSPA / EVDO / LTE / 5G",
                Dimensions: "160.8 x 77.6 x 7.85 mm",
                Weight: "240g",
                SIM: "Nano-SIM and eSIM",
                Display: "Super Retina XDR OLED, 6.7 inches",
                Resolution: "1290 x 2796 pixels",
                Memory: "128GB",
                Camera: "48 MP triple + 12 MP front"
            }
        },

        4: {
            name: "Samsung Galaxy S25 Ultra",
            image: SamsungS25Ultragold01,
            details: "Samsung Galaxy S25 Ultra [256GB | 90%]",
            oldPrice: "NPR 240,500.00",
            newPrice: "NPR 179,600.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
                    SamsungS25Ultragold01,
                    SamsungS25Ultragold02,
                    SamsungS25Ultragold03,
            ],
            condition: "",
            storage: "256GB",
            batteryHealth: "90%",
            features: [],
            specs: {
                Network: "GSM / CDMA / HSPA / EVDO / LTE / 5G",
                Dimensions: "163.3 x 78.1 x 8.9 mm",
                Weight: "227g",
                SIM: "Nano-SIM and eSIM",
                Display: "Dynamic AMOLED 2X, 6.8 inches",
                Resolution: "1440 x 3200 pixels",
                Memory: "256GB",
                Camera: "108 MP quad + 40 MP front",
                "Battery": "Li-Ion 5000 mAh, non-removable, 45W wired, 15W wireless",
                "Operating System": "Android 14, One UI 6",
                "Chipset": "Exynos 2400 (4 nm)",
                "CPU": "Octa-core (4x3.0 GHz Cortex-X4 + 4x2.6 GHz Cortex-A720 + 4x2.0 GHz Cortex-A520)",
                "GPU": "Mali-G715 MP16",
                "Sensors": "Fingerprint (under display, ultrasonic), accelerometer, gyro, proximity, compass, barometer",
                "Audio": "Stereo speakers",
                "Charging": "45W wired, PD3.0, 50% in 30 min, 15W wireless (Qi/PMA), 4.5W reverse wireless charging"
            }
        },

        5: {
            name: "Xiaomi 15 Ultra",
            image: Xiaomi15UltraSilverchrome01,
            details: "Xiaomi 15 Ultra [512GB | 80%]",
            oldPrice: "NPR 180,400.00",
            newPrice: "NPR 141,500.00",
            discount: "",
            status: "Sold Out",
            statusClass: "sold-out",
            thumbnails: [
                    Xiaomi15UltraSilverchrome01,
                    Xiaomi15UltraSilverchrome02,
                    Xiaomi15UltraSilverchrome03,
            ],
            condition: "",
            storage: "512GB",
            batteryHealth: "80%",
            features: [],
            specs: {
                Network: "GSM / CDMA / HSPA / EVDO / LTE / 5G",
                Dimensions: "152.8 x 71.5 x 7.8 mm (6.02 x 2.81 x 0.31 in)",
                Weight: "188 g (6.35 oz)",
                SIM: "Nano-SIM and eSIM or eSIM only",
                Display: "OLED, HDR10+, Dolby Vision, 120Hz, 1900 nits (peak)",
                Resolution:	"1224 x 2712 pixels, 19.5:9 ratio (~522 ppi density)",
                Size:	"6.36 inches, 98.9 cm2 (~90.1% screen-to-body ratio)",
                Memory: "128GB 8GB RAM, 256GB 8GB RAM, 512GB 12GB RAM",
                Cardslot:	"No",
                Camera: "50 MP (wide), 50 MP (ultrawide), 50 MP (telephoto)",
                "Video": "8K@24fps, 4K@30/60fps, 1080p@30/60/120fps, gyro-EIS",
                "Selfie Camera": "32 MP (wide), HDR",
                "Battery": "Li-Po 4500 mAh, non-removable, 90W wired, PD3.0, PPS, 100% in 42 min"


            }
        },

        6: {
            name: "Apple iPhone 15 Pro Max",
            image: Iphone15promaxblue2,
            details: "Apple iPhone 15 Pro Max [256GB | 89%]",
            oldPrice: "NPR 206,000.00",
            newPrice: "NPR 133,500.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
                    Iphone15promaxblue2,
                    Iphone15promaxblue3,
                    Iphone15promaxblue4
            ],
            condition: "",
            storage: "256GB",
            batteryHealth: "89%",
            features: [],
            specs: {

                Network: "GSM / CDMA / HSPA / EVDO / LTE / 5G",
                Dimensions: "159.9 x 76.7 x 8.25 mm (6.30 x 3.02 x 0.32 in)",
                Weight: "221 g (7.76 oz)",
                Display: "6.7 inches, 1125 x 1284 pixels, 19.5:9 ratio (~460 ppi density)",
                SIM: "Nano-SIM and eSIM or eSIM only",
                "Protection": "Ceramic Shield glass front, glass back (Corning-made glass), titanium frame",
                "Resolution": "1290 x 2796 pixels, 19.5:9 ratio (~460 ppi density)",
                "Memory": "256GB 8GB RAM, 512GB 8GB RAM, 1TB 8GB RAM",
                "Rear Camera": "48 MP, f/1.78, 24mm (wide), 12 MP, f/2.2, 13mm (ultrawide), 12 MP, f/2.8, 65mm (telephoto)",
                "Front Camera": "12 MP, f/2.2, 23mm (wide), 12 MP, f/2.4, 120˚, 23mm (ultrawide)",
                "Battery": "5124mAh battery, Fast charging 20W, Fast wireless charging 15W (Qi/PMA), 7.5W reverse wireless charging",
                "Operating System": "iOS 16, upgradable to iOS 16.1.2",
                "Chipset": "Apple A17 Pro (3 nm)",
                "CPU": "Hexa-core (2x3.78 GHz Avalanche + 4x2.0 GHz Blizzard)",
                "GPU": "Apple GPU (6-core graphics)",
                "Sensors": "Face ID, accelerometer, gyro, proximity, compass, barometer",
                "Audio": "Stereo speakers",
                "Charging": "20W wired, PD 3.0, 50% in 30 min, 15W wireless (Qi/PMA), 7.5W reverse wireless charging"
            }
        },

        7: {
            name: "Apple iPhone 12 Pro Max",
            image: Iphone12promaxpacificblue01,
            details: "Iphone 12 Pro Max [128GB | 91%]",
            oldPrice: "NPR 172,000.00",
            newPrice: "NPR 112,800.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
                    Iphone12promaxpacificblue01,
                    Iphone12promaxpacificblue02,
                    Iphone12promaxpacificblue03,
                    Iphone12promaxpacificblue04
            ],
            condition: "",
            storage: "128GB",
            batteryHealth: "91%",
            features: [],
            specs: {
                Network: "GSM / CDMA / HSPA / EVDO / LTE / 5G",
                Dimensions: "160.8 x 78.1 x 7.4 mm (6.33 x 3.07 x 0.29 in)",
                Weight: "228 g (8.04 oz)",
                SIM: "Nano-SIM and eSIM or eSIM only",
                Display: "6.7 inches, 1125 x 1284 pixels, 19.5:9 ratio (~458 ppi density)",
                Protection:	"Ceramic Shield glass front, glass back (Corning-made glass), stainless steel frame",
                "Resolution": "1179 x 2556 pixels, 19.5:9 ratio (~458 ppi density)",
                Memory: "128GB 6GB RAM, 256GB 6GB RAM, 512GB 6GB RAM",
                "Main Camera": "Dual: 48 MP, f/1.8, 24mm (wide), 12 MP, f/2.2, 52mm (telephoto), 12 MP, f/2.4, 120˚, 13mm (ultrawide)",
                "Selfie Camera": "12 MP, f/1.9, 23mm (wide), 12 MP, f/2.4, 120˚, 23mm (ultrawide)",
                "Battery": "Li-Ion 3687 mAh, non-removable, 20W wired, PD 3.0, 50% in 30 min, 15W wireless (Qi/PMA), 7.5W reverse wireless charging"

            }
        },

        8: {
            name: "Xiaomi 14",
            image: Xiaomi14jadegreen01,
            details: "Xiaomi 14 Brand New",
            oldPrice: "",
            newPrice: "NPR 99,999.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
                    Xiaomi14jadegreen01,
                    Xiaomi14jadegreen02,
                    Xiaomi14jadegreen03,
                    Xiaomi14jadegreen04
            ],
            condition: "Brand New",
            storage: "",
            batteryHealth: "",
            features: [],
            specs: {
                Network: "GSM / CDMA / HSPA / EVDO / LTE / 5G",
                Dimensions: "152.8 x 71.5 x 7.8 mm (6.02 x 2.81 x 0.31 in)",
                Weight: "188 g (6.35 oz)",
                SIM: "Nano-SIM and eSIM or eSIM only",
                Display: "OLED, HDR10+, Dolby Vision, 120Hz, 1900 nits (peak)",
                Resolution:	"1224 x 2712 pixels, 19.5:9 ratio (~522 ppi density)",
                Size:	"6.36 inches, 98.9 cm2 (~90.1% screen-to-body ratio)",
                Memory: "128GB 8GB RAM, 256GB 8GB RAM, 512GB 12GB RAM",
                Cardslot:	"No",
                Camera: "50 MP (wide), 50 MP (ultrawide), 50 MP (telephoto)",
                "Video": "8K@24fps, 4K@30/60fps, 1080p@30/60/120fps, gyro-EIS",
                "Selfie Camera": "32 MP (wide), HDR",
                "Battery": "Li-Po 4500 mAh, non-removable, 90W wired, PD3.0, PPS, 100% in 42 min"
            }
        },

        9: {
            name: "Samsung Galaxy S25",
            image: SamsungS25Silver01,
            details: "Samsung Galaxy S25 Brand New",
            oldPrice: "",
            newPrice: "NPR 104,999.00",
            discount: "0%",
            status: "Sold Out",
            statusClass: "sold-out",
            thumbnails: [
                    SamsungS25Silver01,
                    SamsungS25Silver02,
                    SamsungS25Silver03,
                    SamsungS25Silver04
            ],
            condition: "Brand New",
            storage: "128GB",
            batteryHealth: "100%",
            features: [ ],
            specs: {
                Network: "GSM / CDMA / HSPA / EVDO / LTE / 5G",
                Dimensions: "146.9 x 70.5 x 7.2 mm (5.78 x 2.78 x 0.28 in)",
                Weight: "162 g (5.71 oz)",
                SIM: "Nano-SIM and eSIM or eSIM only",
                Display: "Dynamic LTPO AMOLED 2X, 120Hz, HDR10+, 2600 nits (peak)",
                Resolution:	"1080 x 2340 pixels, 19.5:9 ratio (~416 ppi density)",
                Size:	"6.2 inches, 94.4 cm2 (~91.1% screen-to-body ratio)",
                Memory: "128GB 8GB RAM, 256GB 8GB RAM, 512GB 8GB RAM",
                Camera: "50 MP (wide), 12 MP (ultrawide), 10 MP (telephoto)",
                "Video": "4K@30/60fps, 1080p@30/60/240fps, gyro-EIS",
                "Selfie Camera": "12 MP (wide), 4K@30/60fps, 1080p@30fps",
                "Battery": "Li-Ion 4000 mAh, non-removable 25W wired, PD3.0, 50% in 30 min15W wireless (Qi2 Ready)4.5W reverse wireless",

            }
        },
        
        10: {
            name: "Samsung Galaxy S25+",
            image: SamsungS25plusmint01,
            details: "Samsung Galaxy S25+ Brand New",
            oldPrice: "",
            newPrice: "NPR 141,900.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
                    SamsungS25plusmint01,
                    SamsungS25plusmint02,
                    SamsungS25plusmint03,
                    SamsungS25plusmint04
            ],
            condition: "Brand New",
            storage: "",
            batteryHealth: "",
            features: [],
            specs: {
                Network: "GSM / CDMA / HSPA / EVDO / LTE / 5G",
                Dimensions: "150.9 x 70.5 x 7.2 mm (5.78 x 2.78 x 0.28 in)",
                Weight: "166 g (5.71 oz)",
                SIM: "Nano-SIM and eSIM or eSIM only",
                Display: "Dynamic LTPO AMOLED 2X, 120Hz, HDR10+, 2600 nits (peak)",
                Resolution:	"1080 x 2340 pixels, 19.5:9 ratio (~416 ppi density)",
                Size:	"6.2 inches, 94.4 cm2 (~91.1% screen-to-body ratio)",
                Memory: "128GB 8GB RAM, 256GB 8GB RAM, 512GB 8GB RAM",
                Camera: "50 MP (wide), 12 MP (ultrawide), 10 MP (telephoto)",
                "Video": "4K@30/60fps, 1080p@30/60/240fps, gyro-EIS",
                "Selfie Camera": "12 MP (wide), 4K@30/60fps, 1080p@30fps",
                "Battery": "Li-Ion 4000 mAh, non-removable 25W wired, PD3.0, 50% in 30 min15W wireless (Qi2 Ready)4.5W reverse wireless",

            }
        }
};


const ProductDetails = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");

    useEffect(() => {
    const id = searchParams.get("id") || "9";
    const productData = products[id];
    if (productData) {
        setProduct(productData);
        setMainImage(productData.image);
    }
    }, [searchParams]);

    if (!product) return <p>Product not found.</p>;

    return (
    <div className="product-details-wrapper">
        <div className="back-button-container">
                <button className="backbutton" onClick={() => navigate('/')}>
            &#8592; Back to Products
        </button>
        </div>

        <div className="product-details-container">
        <div className="product-gallery">
            <img src={mainImage} alt={product.name} className="main-image" width="300" />
            <div className="thumbnail-images">
                {product.thumbnails.map((src, idx) => (
                    <img
                    key={idx}
                    src={src}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="thumbnail"
                    onClick={() => setMainImage(src)}
                />
            ))}
            </div>
        </div>

        <div className="product-info-section">
            <h1>{product.name}</h1>

            <p className="detailspageprice">
                <span className="new-price">{product.newPrice}</span>&nbsp;
                <span className="old-price">{product.oldPrice}</span>&nbsp;
                <span className="discount">{product.discount || "No Discount"}</span>
            </p>

            <p><strong>Condition:</strong> {product.condition}</p>
            <p><strong>Storage:</strong> {product.storage || "N/A"}</p>
            <p><strong>Battery Health:</strong> {product.batteryHealth || "N/A"}</p>

            <div className="actions">
                <button
                className={product.statusClass}
                disabled={product.status.toLowerCase() === "sold out"}
                >
                {product.status}
                </button>
                <button className="wishlist">Add to Wishlist</button>
                <button className="exchange">Exchange Your Smartphone</button>
            </div>

            <div className="features">
                <h2>Best Features</h2>
                <ol>
                {product.features.length ? (
                    product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                    ))
                ) : (
                    <li>No special features listed.</li>
                )}
                </ol>
            </div>

            <div className="specs-table">
                <h2>Specifications</h2>
                <table cellPadding={5} cellSpacing={0}>
                <tbody>
                    {Object.entries(product.specs).map(([key, value], idx) => (
                    <tr key={idx}>
                        <th>{key}</th>
                        <td>{value}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>
    );
    };

export default ProductDetails;
