    import React, { useRef, useState, useEffect } from 'react';
    import './NewArrivals.css';

    // Import video assets
    import Iphone16 from '../assets/indeximages/Iphone16series.mp4';
    import S25Ultra from '../assets/indeximages/S25 Ultra.mp4';
    import Nothing03 from '../assets/indeximages/Nothing03.mp4';
    import MI from '../assets/indeximages/MI.mp4';
    import Iphone16Webm from '../assets/indeximages/Iphone16.webm';
    import Iphone16a from '../assets/indeximages/iphone16a.mp4';
    import GooglePixel from '../assets/indeximages/googlepixel.mp4';

    const NewArrivals = () => {
    const scrollRef = useRef(null);
    const modalRef = useRef(null);
    const [modalVideo, setModalVideo] = useState(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;

        let isDown = false;
        let startX;
        let scrollLeft;

        const handleMouseDown = (e) => {
        isDown = true;
        scrollContainer.classList.add('active');
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
        };

        const handleMouseLeave = () => {
        isDown = false;
        scrollContainer.classList.remove('active');
        };

        const handleMouseUp = () => {
        isDown = false;
        scrollContainer.classList.remove('active');
        };

        const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollContainer.scrollLeft = scrollLeft - walk;
        };

        const handleTouchStart = (e) => {
        startX = e.touches[0].pageX;
        scrollLeft = scrollContainer.scrollLeft;
        };

        const handleTouchMove = (e) => {
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 1.5;
        scrollContainer.scrollLeft = scrollLeft - walk;
        };

        scrollContainer.addEventListener('mousedown', handleMouseDown);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);
        scrollContainer.addEventListener('mouseup', handleMouseUp);
        scrollContainer.addEventListener('mousemove', handleMouseMove);
        scrollContainer.addEventListener('touchstart', handleTouchStart);
        scrollContainer.addEventListener('touchmove', handleTouchMove);

        return () => {
        scrollContainer.removeEventListener('mousedown', handleMouseDown);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        scrollContainer.removeEventListener('mouseup', handleMouseUp);
        scrollContainer.removeEventListener('mousemove', handleMouseMove);
        scrollContainer.removeEventListener('touchstart', handleTouchStart);
        scrollContainer.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    const openModal = (src) => {
        setModalVideo(src);
    };

    const closeModal = (e) => {
        if (!modalRef.current.contains(e.target)) {
        setModalVideo(null);
        }
    };

    const videoSources = [Iphone16, S25Ultra, Nothing03, MI, Iphone16Webm, Iphone16a, GooglePixel];

    return (
        <div className="new-arrivals">
        <h2>New Arrivals</h2>
        <div className="video-scroll-container" ref={scrollRef}>
            {videoSources.map((src, index) => (
            <div className="video-item" key={index}>
                <video autoPlay muted loop onClick={() => openModal(src)}>
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
                </video>
            </div>
            ))}
        </div>

        {modalVideo && (
            <div className="video-modal show" onClick={closeModal}>
            <div className="video-modal-content" ref={modalRef}>
                <video controls autoPlay>
                <source src={modalVideo} type="video/mp4" />
                Your browser does not support the video tag.
                </video>
            </div>
            </div>
        )}
        </div>
    );
    };

    export default NewArrivals;
