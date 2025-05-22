// product-details.js
    // product-details.js

    // Function to load product details based on ID
    // Sample product data

const products = {
        1: {
        name: "Apple iPhone 16 Plus",
        image:  "./productsimages/iphone16purple.png",
        details: "Like New Apple iPhone 16 Plus [128GB | 100%] (10 Months Warranty Left)",
        oldPrice: "NPR 171,500.00",
        newPrice: "NPR 154,500.00",
        discount: "-10%",
        status: "Sold Out",
        statusClass: "sold-out",
        thumbnails: [
            "./productsimages/Iphoen16Pink.png",
            "./productsimages/Iphone16Black.png",
            "./productsimages/iphone16Green.png",
            "./productsimages/iphone16purple.png"
        ],
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
        image: "productsimages/Iphone13miniblue4.svg",
        details: "Apple iPhone 13 [256GB | 80%]",
        oldPrice: "NPR 86,500.00",
        newPrice: "NPR 54,500.00",
        discount: "-37%",
        status: "In Stock",
        statusClass: "sale",
        thumbnails: [
            "productsimages/Iphone13miniblue4.svg",
            "productsimages/Iphone13miniblue1.svg",
            "productsimages/Iphone13miniblue2.svg",
            "productsimages/Iphone13miniblue3.svg",
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
            image: "productsimages/Iphone14promaxpurple1.svg",
            details: "Apple iPhone 14 Pro Max [128GB | 85%]",
            oldPrice: "NPR 247,990.00",
            newPrice: "NPR 115,500.00",
            discount: "-53%",
            status: "In Stock",
            statusClass: "sale",
            thumbnails: [
                "productsimages/Iphone14promaxpurple1.svg",
                "productsimages/Iphone14promaxpurple2.svg",
                "productsimages/Iphone14promaxpurple3.svg",     
                "productsimages/Iphone14promaxpurple4.svg"
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
            image: "productsimages/SamsungS25Ultragold01.svg",
            details: "Samsung Galaxy S25 Ultra [256GB | 90%]",
            oldPrice: "NPR 240,500.00",
            newPrice: "NPR 179,600.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
            "productsimages/SamsungS25Ultragold01.svg",
            "productsimages/SamsungS25Ultragold02.svg",
            "productsimages/SamsungS25Ultragold03.svg",
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
            image: "productsimages/Xiaomi15UltraSilverchrome01.svg",
            details: "Xiaomi 15 Ultra [512GB | 80%]",
            oldPrice: "NPR 180,400.00",
            newPrice: "NPR 141,500.00",
            discount: "",
            status: "Sold Out",
            statusClass: "sold-out",
            thumbnails: [
            "productsimages/Xiaomi15UltraSilverchrome01.svg",
            "productsimages/Xiaomi15UltraSilverchrome02.svg",
            "productsimages/Xiaomi15UltraSilverchrome03.svg",
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
            image:"productsimages/Iphone15promaxblue2.svg",
            details: "Apple iPhone 15 Pro Max [256GB | 89%]",
            oldPrice: "NPR 206,000.00",
            newPrice: "NPR 133,500.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
            "productsimages/Iphone15promaxblue2.svg",
            "productsimages/Iphone15promaxblue3.svg",
            "productsimages/Iphone15promaxblue4.svg"
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
            image: "productsimages/Iphone12promaxpacificblue01.svg",
            details: "Iphone 12 Pro Max [128GB | 91%]",
            oldPrice: "NPR 172,000.00",
            newPrice: "NPR 112,800.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
            "productsimages/Iphone12promaxpacificblue01.svg",
            "productsimages/Iphone12promaxpacificblue02.svg",
            "productsimages/Iphone12promaxpacificblue03.svg",
            "productsimages/Iphone12promaxpacificblue04.svg"
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
            image: "productsimages/Xiaomi14jadegreen01.svg",
            details: "Xiaomi 14 Brand New",
            oldPrice: "",
            newPrice: "NPR 99,999.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
            "productsimages/Xiaomi14jadegreen01.svg",
            "productsimages/Xiaomi14jadegreen02.svg",
            "productsimages/Xiaomi14jadegreen03.svg",
            "productsimages/Xiaomi14jadegreen04.svg"
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
            image: "productsimages/SamsungS25Silver01.svg",
            details: "Samsung Galaxy S25 Brand New",
            oldPrice: "",
            newPrice: "NPR 104,999.00",
            discount: "0%",
            status: "Sold Out",
            statusClass: "sold-out",
            thumbnails: [
            "productsimages/SamsungS25Silver01.svg",
            "productsimages/SamsungS25Silver02.svg",
            "productsimages/SamsungS25Silver03.svg",
            "productsimages/SamsungS25Silver04.svg"
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
            image: "productsimages/SamsungS25plusmint01.svg",
            details: "Samsung Galaxy S25+ Brand New",
            oldPrice: "",
            newPrice: "NPR 141,900.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
            "productsimages/SamsungS25plusmint01.svg",
            "productsimages/SamsungS25plusmint02.svg",
            "productsimages/SamsungS25plusmint03.svg",
            "productsimages/SamsungS25plusmint04.svg"
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

    function loadProductDetails(productId) {
        const product = products[productId];
        if (!product) {
        alert("Product not found");
        return;
        }

        document.getElementById("productImage").src = product.image;
        document.getElementById("productImage").alt = product.name;
        document.getElementById("productDetails").textContent = product.name;
        document.getElementById("newPrice").textContent = product.newPrice;
        document.getElementById("oldPrice").textContent = product.oldPrice || "";
        document.getElementById("discountLabel").textContent = product.discount || "";

        document.getElementById("condition").textContent = product.condition;
        document.getElementById("storage").textContent = product.storage;
        document.getElementById("batteryHealth").textContent = product.batteryHealth;
        document.getElementById("discountLabel").textContent = product.discount || "No Discount";


        // Status button text and state
        const statusButton = document.getElementById("statusButton");
        statusButton.textContent = product.status;
        statusButton.disabled = product.status.toLowerCase() === "sold out";
        statusButton.className = product.statusClass;

        // Thumbnails
        const thumbnailsDiv = document.querySelector(".thumbnail-images");
        thumbnailsDiv.innerHTML = "";
        product.thumbnails.forEach(src => {
        const thumb = document.createElement("img");
        thumb.src = src;
        thumb.alt = product.name + " thumbnail";
        thumb.classList.add("thumbnail");
        thumb.addEventListener("click", () => {
            document.getElementById("productImage").src = src;
        });
        thumbnailsDiv.appendChild(thumb);
        });

        // Features List
        const featuresList = document.getElementById("featuresList");
        featuresList.innerHTML = "";
        product.features.forEach(feature => {
        const li = document.createElement("li");
        li.textContent = feature;
        featuresList.appendChild(li);
        });

        // Specs Table
        const specsTable = document.getElementById("specsTable");
        specsTable.innerHTML = "";
        for (const [key, value] of Object.entries(product.specs)) {
        const row = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = key;
        const td = document.createElement("td");
        td.textContent = value;
        row.appendChild(th);
        row.appendChild(td);
        specsTable.appendChild(row);
        }
    }

    // Load product based on URL param id
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "1"; // Default to 1 if no id provided
    loadProductDetails(id);