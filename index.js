    let slideIndex = 0;

    function initSlideshow() {
        const slides = document.getElementsByClassName("slide");
        const numberContainer = document.getElementById("numberButtons");

        for (let i = 0; i < slides.length; i++) {
            const btn = document.createElement("button");
            btn.innerText = i + 1;
            btn.onclick = () => showSlide(i);
            numberContainer.appendChild(btn);
        }

        showSlide(slideIndex);
    }

    function showSlide(index) {
        const slides = document.getElementsByClassName("slide");
        const buttons = document.getElementById("numberButtons").getElementsByTagName("button");

        if (index >= slides.length) slideIndex = 0;
        else if (index < 0) slideIndex = slides.length - 1;
        else slideIndex = index;

        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove("active-slide");
            buttons[i].classList.remove("active");
        }

        slides[slideIndex].classList.add("active-slide");
        buttons[slideIndex].classList.add("active");
    }

    function changeSlide(n) {
        showSlide(slideIndex + n);
    }

    window.onload = initSlideshow;

    const scrollContainer = document.getElementById("draggableScroll");
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollContainer.classList.add('active');
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.classList.remove('active');
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.classList.remove('active');
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 1.5; // Adjust scroll speed
        scrollContainer.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    scrollContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 1.5;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });



    const modal = document.getElementById("videoModal");
    const popupVideo = document.getElementById("popupVideo");
    const modalContent = document.getElementById("modalContent");

    // When a video is clicked, open the modal and play the clicked video
    document.querySelectorAll(".video-item video").forEach((vid) => {
        vid.addEventListener("click", function (e) {
            e.preventDefault();
            popupVideo.src = this.currentSrc || this.src;
            popupVideo.load();
            popupVideo.play();
            modal.style.display = "flex";
        });
    });


    // Close modal when clicking outside the video
    modal.addEventListener("click", function (e) {
        if (!modalContent.contains(e.target)) {
            modal.style.display = "none";
            popupVideo.pause();
            popupVideo.src = ""; // Clear video
        }
    });


    