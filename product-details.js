// product-details.js
    // product-details.js

    // Function to load product details based on ID
    // Sample product data

const products = {
        1: {
        name: "Apple iPhone 16 Plus",
        image: "./indeximages/PreLovediPhone16Plus128GBWhite2.webp",
        details: "Like New Apple iPhone 16 Plus [128GB | 100%] (10 Months Warranty Left)",
        oldPrice: "NPR 171,500.00",
        newPrice: "NPR 121,500.00",
        discount: "-29%",
        status: "Sold Out",
        statusClass: "sold-out",
        thumbnails: [
            "./indeximages/PreLovediPhone14ProMax128GBPurple03.webp",
            "./indeximages/PreLovediPhone16Plus128GBWhite2.webp",
            "./indeximages/XAOMIULTRA15.png"
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
            Camera: "48 MP dual + 12 MP front"
        }
        },

        2: {
        name: "Apple iPhone 13",
        image: "./indeximages/PreLovediPhone13Blue3.webp",
        details: "Apple iPhone 13 [256GB | 80%]",
        oldPrice: "NPR 86,500.00",
        newPrice: "NPR 54,500.00",
        discount: "-37%",
        status: "In Stock",
        statusClass: "sale",
        thumbnails: [
            "./indeximages/PreLovediPhone13Thumb1.webp",
            "./indeximages/PreLovediPhone13Thumb2.webp"
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
            Camera: "12 MP dual + 12 MP front"
        }
        },
        3: {
            name: "Apple iPhone 14 Pro Max",
            image: "./indeximages/PreLovediPhone14ProMax128GBPurple03.webp",
            details: "Apple iPhone 14 Pro Max [128GB | 85%]",
            oldPrice: "NPR 247,990.00",
            newPrice: "NPR 115,500.00",
            discount: "-53%",
            status: "In Stock",
            statusClass: "sale",
            thumbnails: [
                "./indeximages/PreLovediPhone14ProMax128GBPurple03.webp"
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
            image: "./indeximages/S25Ultra.png",
            details: "Samsung Galaxy S25 Ultra [256GB | 90%]",
            oldPrice: "NPR 240,500.00",
            newPrice: "NPR 179,600.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
            "./indeximages/S25Ultra.png"
            ],
            condition: "",
            storage: "256GB",
            batteryHealth: "90%",
            features: [],
            specs: {}
        },
        5: {
            name: "Xiaomi 15 Ultra",
            image: "./indeximages/XAOMIULTRA15.png",
            details: "Xiaomi 15 Ultra [512GB | 80%]",
            oldPrice: "NPR 180,400.00",
            newPrice: "NPR 141,500.00",
            discount: "",
            status: "Sold Out",
            statusClass: "sold-out",
            thumbnails: [
            "./indeximages/XAOMIULTRA15.png"
            ],
            condition: "",
            storage: "512GB",
            batteryHealth: "80%",
            features: [],
            specs: {}
        },
        6: {
            name: "Apple iPhone 15 Pro Max",
            image: "./indeximages/PreLovediPhone15ProMaxBlue256GB.webp",
            details: "Apple iPhone 15 Pro Max [256GB | 89%]",
            oldPrice: "NPR 206,000.00",
            newPrice: "NPR 133,500.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
            "./indeximages/PreLovediPhone15ProMaxBlue256GB.webp"
            ],
            condition: "",
            storage: "256GB",
            batteryHealth: "89%",
            features: [],
            specs: {}
        },
        7: {
            name: "Apple iPhone 12 Pro Max",
            image: "./indeximages/PreLovediPhone12ProMax01_f94bd3d1-2070-47fa-bcef-77a9b7478717.webp",
            details: "Iphone 12 Pro Max [128GB | 91%]",
            oldPrice: "NPR 172,000.00",
            newPrice: "NPR 112,800.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
            "./index images/PreLovediPhone12ProMax01_f94bd3d1-2070-47fa-bcef-77a9b7478717.webp"
            ],
            condition: "",
            storage: "128GB",
            batteryHealth: "91%",
            features: [],
            specs: {}
        },
        8: {
            name: "Xiaomi 14",
            image: "./index images/Xiaomi 14.png",
            details: "Xiaomi 14 Brand New",
            oldPrice: "",
            newPrice: "NPR 99,999.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
            "./index images/Xiaomi 14.png"
            ],
            condition: "Brand New",
            storage: "",
            batteryHealth: "",
            features: [],
            specs: {}
        },
        9: {
            name: "Samsung Galaxy S25",
            image: "./index images/S25.png",
            details: "Samsung Galaxy S25 Brand New",
            oldPrice: "",
            newPrice: "NPR 104,999.00",
            discount: "",
            status: "Sold Out",
            statusClass: "sold-out",
            thumbnails: [
            "./index images/S25.png"
            ],
            condition: "Brand New",
            storage: "",
            batteryHealth: "",
            features: [],
            specs: {}
        },
        10: {
            name: "Samsung Galaxy S25+",
            image: "./index images/S25+.png",
            details: "Samsung Galaxy S25+ Brand New",
            oldPrice: "",
            newPrice: "NPR 141,900.00",
            discount: "",
            status: "On Sale",
            statusClass: "sale",
            thumbnails: [
            "./index images/S25+.png"
            ],
            condition: "Brand New",
            storage: "",
            batteryHealth: "",
            features: [],
            specs: {}
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