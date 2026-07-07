document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("[data-projects-carousel]");

  if (!carousel) {
    return;
  }

  const track = carousel.querySelector(".projects-carousel__track");
  const slides = Array.from(carousel.querySelectorAll(".projects-carousel__slide"));
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const dotsContainer = carousel.querySelector(".projects-carousel__dots");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const intervalDelay = 5200;
  let activeIndex = 0;
  let autoplayId = null;

  if (!track || !slides.length || !previousButton || !nextButton || !dotsContainer) {
    return;
  }

  const dots = slides.map((slide, index) => {
    const dot = document.createElement("button");
    dot.className = "projects-carousel__dot";
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Ver proyecto ${index + 1}`);
    dot.addEventListener("click", () => {
      goToSlide(index);
      restartAutoplay();
    });
    dotsContainer.append(dot);
    return dot;
  });

  function updateCarousel() {
    track.style.transform = `translateX(-${activeIndex * 100}%)`;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
      dot.tabIndex = isActive ? 0 : -1;
    });
  }

  function goToSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    updateCarousel();
  }

  function startAutoplay() {
    if (prefersReducedMotion || autoplayId) {
      return;
    }

    autoplayId = window.setInterval(() => {
      goToSlide(activeIndex + 1);
    }, intervalDelay);
  }

  function stopAutoplay() {
    if (!autoplayId) {
      return;
    }

    window.clearInterval(autoplayId);
    autoplayId = null;
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  previousButton.addEventListener("click", () => {
    goToSlide(activeIndex - 1);
    restartAutoplay();
  });

  nextButton.addEventListener("click", () => {
    goToSlide(activeIndex + 1);
    restartAutoplay();
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(activeIndex - 1);
      restartAutoplay();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(activeIndex + 1);
      restartAutoplay();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
      return;
    }

    startAutoplay();
  });

  updateCarousel();
  startAutoplay();
});
