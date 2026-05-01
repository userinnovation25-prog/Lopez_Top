/**
 * Scroll Reveal Animation
 * Anima elementos cuando entran al viewport
 */

document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar todos los elementos con clase scroll-reveal
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
  scrollRevealElements.forEach(el => {
    observer.observe(el);
  });
});
