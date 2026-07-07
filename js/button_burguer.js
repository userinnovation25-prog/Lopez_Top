// Menú hamburguesa mejorado
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  if (!menuToggle || !nav) {
    console.error("No se encontraron los elementos del menú");
    return;
  }

  // Crear overlay
  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  function toggleMenu() {
    menuToggle.classList.toggle("active");
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(nav.classList.contains("active")));
    document.body.style.overflow = nav.classList.contains("active")
      ? "hidden"
      : "";
  }

  function closeMenu() {
    menuToggle.classList.remove("active");
    nav.classList.remove("active");
    overlay.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  // Click en hamburguesa
  menuToggle.addEventListener("click", toggleMenu);
  menuToggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Click en overlay
  overlay.addEventListener("click", closeMenu);

  // Click en enlaces - con delay para mejor experiencia
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Prevenir comportamiento por defecto

      const href = link.getAttribute("href");

      // Cerrar menú
      closeMenu();

      // Navegar después de cerrar el menú
      setTimeout(() => {
        if (!href || href === "#") {
          return;
        }

        if (href.startsWith("#")) {
          // Es un ancla interna
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          // Es otra página
          window.location.href = href;
        }
      }, 300);
    });
  });

  // Cerrar al redimensionar a desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900 && nav.classList.contains("active")) {
      closeMenu();
    }
  });

  // Cerrar con tecla ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("active")) {
      closeMenu();
    }
  });
});
