    import React, { useEffect, useState } from 'react';
    import slide1 from '../assets/indeximages/exchange.jpg';
    import slide2 from '../assets/indeximages/Slide2.png';
    import './Slideshow.css';

    const slides = [slide1, slide2];

    const Slideshow = () => {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!isPaused) {
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
        }
    }, [isPaused]);

    const goToSlide = (index) => {
        setCurrent((index + slides.length) % slides.length);
    };

    return (
        <>
        <div className="slideshow-container" aria-label="Slideshow">
            {slides.map((slide, index) => (
            <div
                key={index}
                className={`slide ${index === current ? 'active-slide' : ''}`}
                aria-hidden={index !== current}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${slides.length}`}
            >
                <img src={slide} alt={`Slide ${index + 1}`} />

                {/* Pause/Play button overlay only on active slide */}
                {index === current && (
                <button
                    className="pause-play-btn"
                    onClick={() => setIsPaused(prev => !prev)}
                    aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                    aria-pressed={isPaused}
                >
                    {isPaused ? "▶️" : "⏸️"}
                </button>
                )}
            </div>
            ))}
        </div>

        {/* Controls below the slideshow */}
            <div className="controls-container">

            {/* Pause/Play button here */}
            <button
                className="pause-play-btn"
                onClick={() => setIsPaused(prev => !prev)}
                aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                aria-pressed={isPaused}
            >
                {isPaused ? "▶️" : "⏸️"}
            </button>

            <button className="prev-btn" onClick={() => goToSlide(current - 1)}>Previous</button>

            <div className="numbered-buttons">
                {slides.map((_, index) => (
                <button
                    key={index}
                    className={`number-btn ${index === current ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                >
                    {index + 1}
                </button>
                ))}
            </div>

            <button className="next-btn" onClick={() => goToSlide(current + 1)}>Next</button>
            </div>

        </>
    );
    };

    export default Slideshow;
