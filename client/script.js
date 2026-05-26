/* ================================
   PHOTO SLIDER
================================ */

const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach(function(dot) {
        dot.classList.remove("active");
    });

    dots[currentSlide].classList.add("active");
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 4000);
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

nextBtn.addEventListener("click", function() {
    nextSlide();
    resetAutoSlide();
});

prevBtn.addEventListener("click", function() {
    prevSlide();
    resetAutoSlide();
});

dots.forEach(function(dot, index) {
    dot.addEventListener("click", function() {
        showSlide(index);
        resetAutoSlide();
    });
});

startAutoSlide();


/* ================================
   STATS COUNT-UP ANIMATION
================================ */

const counters = document.querySelectorAll(".counter");
const statsSection = document.querySelector("#stats");

let hasCounted = false;

function countUp() {
    counters.forEach(function(counter) {
        const target = Number(counter.getAttribute("data-target"));
        let count = 0;

        const duration = 1600;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(function() {
            count += increment;

            if (count >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(count);
            }
        }, stepTime);
    });
}

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting && hasCounted === false) {
            countUp();
            hasCounted = true;
        }
    });
}, {
    threshold: 0.35
});

observer.observe(statsSection);