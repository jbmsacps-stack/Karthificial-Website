/* ================================
   PHOTO SLIDER
================================ */

/* ================================
   HOME PAGE SLIDER + FULLSCREEN VIEWER
================================ */

const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

let currentSlide = 0;
let sliderInterval = null;
let isFullscreenOpen = false;

function showSlide(index) {
    if (!slidesContainer || slides.length === 0) return;

    currentSlide = (index + slides.length) % slides.length;

    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot) => dot.classList.remove("active"));
    slides.forEach((slide) => slide.classList.remove("active"));

    if (dots[currentSlide]) dots[currentSlide].classList.add("active");
    if (slides[currentSlide]) slides[currentSlide].classList.add("active");

    updateFullscreenImage();
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startSliderAutoPlay() {
    stopSliderAutoPlay();

    sliderInterval = setInterval(() => {
        if (!isFullscreenOpen) {
            nextSlide();
        }
    }, 4500);
}

function stopSliderAutoPlay() {
    if (sliderInterval) {
        clearInterval(sliderInterval);
        sliderInterval = null;
    }
}

/* Normal slider controls */
if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        nextSlide();
        startSliderAutoPlay();
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        prevSlide();
        startSliderAutoPlay();
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showSlide(index);
        startSliderAutoPlay();
    });
});

/* ================================
   STATS COUNT-UP ANIMATION
================================ */

const counters = document.querySelectorAll(".counter");
const statsSection = document.querySelector("#stats");

let hasCounted = false;

function countUp() {
    counters.forEach(function (counter) {
        const target = Number(counter.getAttribute("data-target"));
        let count = 0;

        const duration = 1600;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(function () {
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

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting && hasCounted === false) {
            countUp();
            hasCounted = true;
        }
    });
}, {
    threshold: 0.35
});

observer.observe(statsSection);

/* ================================
   YOUTUBE-STYLE REAL FULLSCREEN SLIDER
================================ */

const sliderElement = document.querySelector(".slider");
const sliderImages = document.querySelectorAll(".slide img");

let fullscreenIdleTimer = null;
let exitButtonTimer = null;
let wasFullscreenOpenedBySlider = false;

/* Create fullscreen exit button */
let fullscreenExitBtn = document.querySelector(".fullscreen-exit-btn");

if (sliderElement && !fullscreenExitBtn) {
    fullscreenExitBtn = document.createElement("button");
    fullscreenExitBtn.className = "fullscreen-exit-btn";
    fullscreenExitBtn.type = "button";
    fullscreenExitBtn.innerHTML = "⛶";
    fullscreenExitBtn.setAttribute("aria-label", "Exit fullscreen");
    sliderElement.appendChild(fullscreenExitBtn);
}

function isSliderFullscreen() {
    return (
        document.fullscreenElement === sliderElement ||
        document.webkitFullscreenElement === sliderElement
    );
}

function pauseSliderForFullscreen() {
    if (typeof stopSliderAutoPlay === "function") {
        stopSliderAutoPlay();
    }
}

function resumeSliderAfterFullscreen() {
    if (typeof startSliderAutoPlay === "function") {
        startSliderAutoPlay();
    }
}

/* Show arrows/dots when cursor moves, then hide */
function showFullscreenControlsTemporarily() {
    if (!sliderElement || !isSliderFullscreen()) return;

    sliderElement.classList.remove("fullscreen-idle");

    clearTimeout(fullscreenIdleTimer);

    fullscreenIdleTimer = setTimeout(() => {
        if (isSliderFullscreen()) {
            sliderElement.classList.add("fullscreen-idle");
        }
    }, 1800);
}

/* Show exit only near top-right corner */
function handleFullscreenMouseMove(event) {
    if (!sliderElement || !isSliderFullscreen()) return;

    showFullscreenControlsTemporarily();

    const nearBottom = window.innerHeight - event.clientY <= 150;
    const nearRight = window.innerWidth - event.clientX <= 150;

    if (nearBottom && nearRight) {
        sliderElement.classList.add("show-exit-button");

        clearTimeout(exitButtonTimer);

        exitButtonTimer = setTimeout(() => {
            sliderElement.classList.remove("show-exit-button");
        }, 1800);
    } else {
        sliderElement.classList.remove("show-exit-button");
    }
}

function enterSliderFullscreen() {
    if (!sliderElement) return;

    wasFullscreenOpenedBySlider = true;
    pauseSliderForFullscreen();

    document.body.style.overflow = "hidden";
    sliderElement.classList.remove("fullscreen-idle");
    sliderElement.classList.remove("show-exit-button");

    if (sliderElement.requestFullscreen) {
        sliderElement.requestFullscreen();
    } else if (sliderElement.webkitRequestFullscreen) {
        sliderElement.webkitRequestFullscreen();
    }

    showFullscreenControlsTemporarily();
}

function exitSliderFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else if (document.webkitFullscreenElement) {
        document.webkitExitFullscreen();
    }
}

function cleanUpAfterFullscreenExit() {
    clearTimeout(fullscreenIdleTimer);
    clearTimeout(exitButtonTimer);

    if (sliderElement) {
        sliderElement.classList.remove("fullscreen-idle");
        sliderElement.classList.remove("show-exit-button");
    }

    document.body.style.overflow = "";

    if (wasFullscreenOpenedBySlider) {
        wasFullscreenOpenedBySlider = false;
        resumeSliderAfterFullscreen();
    }
}

/* Click slider image to enter fullscreen */
sliderImages.forEach((img) => {
    img.addEventListener("click", () => {
        if (!isSliderFullscreen()) {
            enterSliderFullscreen();
        }
    });
});

/* Exit fullscreen button */
if (fullscreenExitBtn) {
    fullscreenExitBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        exitSliderFullscreen();
    });
}

/* Mouse movement behavior */
if (sliderElement) {
    sliderElement.addEventListener("mousemove", handleFullscreenMouseMove);

    sliderElement.addEventListener("touchstart", () => {
        if (!isSliderFullscreen()) return;

        showFullscreenControlsTemporarily();
        sliderElement.classList.add("show-exit-button");

        clearTimeout(exitButtonTimer);

        exitButtonTimer = setTimeout(() => {
            sliderElement.classList.remove("show-exit-button");
        }, 2200);
    });
}

/* Fullscreen state change */
document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        cleanUpAfterFullscreenExit();
    } else if (isSliderFullscreen()) {
        pauseSliderForFullscreen();
        showFullscreenControlsTemporarily();
    }
});

document.addEventListener("webkitfullscreenchange", () => {
    if (!document.webkitFullscreenElement) {
        cleanUpAfterFullscreenExit();
    } else if (isSliderFullscreen()) {
        pauseSliderForFullscreen();
        showFullscreenControlsTemporarily();
    }
});

/* Keyboard support */
document.addEventListener("keydown", (event) => {
    if (!isSliderFullscreen()) return;

    showFullscreenControlsTemporarily();

    if (event.key === "ArrowRight" && typeof nextSlide === "function") {
        nextSlide();
    }

    if (event.key === "ArrowLeft" && typeof prevSlide === "function") {
        prevSlide();
    }

    if (event.key === "Escape") {
        cleanUpAfterFullscreenExit();
    }
});
