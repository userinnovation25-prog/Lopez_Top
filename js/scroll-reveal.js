/**
 * SCROLL REVEAL ANIMATIONS
 * Sistema modular de animaciones al scroll usando IntersectionObserver API
 * Compatible con cualquier CSS, sin dependencias externas
 */

document.addEventListener('DOMContentLoaded', function() {
  // Deshabilitar en móvil < 600px para optimizar performance
  if (window.innerWidth <= 600) {
    return;
  }

  initScrollReveal();
});

/**
 * Inicializa el observador de intersección
 * Detecta elementos .scroll-reveal y agrega clase .scroll-reveal-active
 */
function initScrollReveal() {
  // Configuración del observador
  const observerOptions = {
    threshold: 0.1,           // Trigger cuando 10% del elemento es visible
    rootMargin: '0px 0px -50px 0px'  // Trigger 50px antes de ser completamente visible
  };

  // Crear observador
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Si el elemento entra al viewport
      if (entry.isIntersecting) {
        // Agregar clase de animación
        entry.target.classList.add('scroll-reveal-active');
        
        // Dejar de observar (animación solo una vez)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Obtener todos los elementos con clase .scroll-reveal
  const revealElements = document.querySelectorAll('.scroll-reveal');

  // Observar cada elemento
  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Función para reinicializar (útil si el contenido se carga dinámicamente)
 */
function reinitScrollReveal() {
  if (window.innerWidth <= 600) {
    return;
  }
  initScrollReveal();
}

// Opcionalmente, reinicializar en resize si cambia de breakpoint
window.addEventListener('resize', function() {
  if (window.innerWidth > 600) {
    reinitScrollReveal();
  }
});
