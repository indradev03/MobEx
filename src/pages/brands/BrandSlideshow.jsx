import React, { useEffect, useState } from "react";

import apple1 from "../../assets/slideshowimg/Apple01.png";
import apple2 from "../../assets/slideshowimg/Apple02.png";
import apple3 from "../../assets/slideshowimg/Apple03.png";
import apple4 from "../../assets/slideshowimg/Apple04.png";
import apple5 from "../../assets/slideshowimg/Apple05.png";
import apple6 from "../../assets/slideshowimg/Apple06.png";
import apple7 from "../../assets/slideshowimg/Apple07.png";


import samsung1 from "../../assets/slideshowimg/samsung1.png";
import samsung2 from "../../assets/slideshowimg/samsung2.png";
import samsung3 from "../../assets/slideshowimg/samsung3.png";
import samsung4 from "../../assets/slideshowimg/samsung4.jpg";
import samsung5 from "../../assets/slideshowimg/samsung5.jpg";
import samsung6 from "../../assets/slideshowimg/samsung6.jpg";

import xiaomi1 from "../../assets/indeximages/exchange.jpg";
import xiaomi2 from "../../assets/indeximages/Bottomlogo.svg";

import "./BrandSlideshow.css";

// Your slideshow images keyed by brand slug
const brandSlides = {
  apple: [apple7, apple1, apple2,apple3,apple4,apple5,apple6],
  samsung: [samsung1,samsung4,samsung5,samsung3, samsung6, samsung2],
  xiaomi: [xiaomi1, xiaomi2],
};

// Map numeric brand IDs to slug keys here
const brandIdToSlugMap = {
  "1": "apple",
  "2": "samsung",
  "3": "xiaomi",
  // Add more mappings as needed
};

const BrandSlideshow = ({ brandId }) => {
  // Map numeric ID to slug key
  const brandKey = brandIdToSlugMap[brandId] || "";

  console.log("BrandSlideshow brandId (raw):", brandId);
  console.log("Mapped brandKey:", brandKey);

  const slides = brandSlides[brandKey];
  console.log("Slides array:", slides);

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setCurrent(0);
  }, [brandKey]);

  useEffect(() => {
    if (!isPaused && slides && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPaused, slides]);

  const goToSlide = (index) => {
    if (slides && slides.length > 0) {
      setCurrent((index + slides.length) % slides.length);
    }
  };

    if (!slides || slides.length === 0) {
      return (
        <div>
          No slides found for <strong>{brandKey || brandId || "unknown brand"}</strong>
        </div>
      );
    }


  return (
    <div className="bs-wrapper">
      <div className="bs-slideshow-container" aria-label="Slideshow">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`bs-slide ${index === current ? "bs-active-slide" : ""}`}
            aria-hidden={index !== current}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${slides.length}`}
          >
            <img
              src={slide}
              alt={`Slide ${index + 1}`}
              className="bs-slide-img"
              onClick={() => setIsPaused((prev) => !prev)}
              style={{ cursor: "pointer" }}
              loading="lazy"
            />
            {index === current && (
              <button
                className="bs-pause-play-btn bs-overlay"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
              >
                {isPaused ? "▶️" : "⏸️"}
              </button>
            )}
          </div>
        ))}

        <button
          className="bs-nav-arrow bs-left-arrow"
          onClick={() => goToSlide(current - 1)}
          aria-label="Previous slide"
        >
          <svg
            viewBox="0 0 24 24"
            width="30"
            height="30"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          className="bs-nav-arrow bs-right-arrow"
          onClick={() => goToSlide(current + 1)}
          aria-label="Next slide"
        >
          <svg
            viewBox="0 0 24 24"
            width="30"
            height="30"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="bs-controls-container">
        <div className="bs-numbered-buttons">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`bs-number-btn ${index === current ? "bs-active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandSlideshow;
