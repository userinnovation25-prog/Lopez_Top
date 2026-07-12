document.addEventListener("DOMContentLoaded", () => {
  const services = [
    {
      title: "Fotogrametría con Drones",
      tagline: "Modelos aéreos de alta precisión",
      image: "assets/images/drone.jpg",
      imageAlt: "Drone usado para levantamientos topográficos aéreos",
      description:
        `En LOPEZTOP S.A.S. utilizamos tecnología de fotogrametría avanzada para obtener información topográfica precisa, rápida y confiable a partir de imágenes aéreas de alta resolución. Esta metodología permite capturar grandes extensiones de terreno con un alto nivel de detalle, optimizando tiempos de trabajo y reduciendo costos operativos en campo.
        Mediante el uso de drones y software especializado, generamos modelos digitales del terreno, ortomosaicos georreferenciados, curvas de nivel y nubes de puntos, herramientas fundamentales para la planificación, diseño y ejecución de proyectos de ingeniería, urbanismo, minería y gestión territorial.
        Nuestros procesos combinan tecnología de última generación, control topográfico en campo y rigurosidad técnica, garantizando resultados precisos que cumplen con los estándares requeridos para estudios técnicos y proyectos de infraestructura.
        Con la fotogrametría de LOPEZTOP, su proyecto obtiene una visión detallada del terreno, facilitando análisis más eficientes y decisiones más seguras desde las primeras etapas de planificación.`,
    },
    {
      title: "Topografía Terrestre",
      tagline: "Medición precisa para proyectos e inmuebles",
      image: "assets/images/topografia_terrestre.png",
      imageAlt: "Equipo de topografía terrestre en campo",
      description:
        "Realizamos levantamientos topográficos de alta precisión para proyectos de infraestructura, certificación de terrenos, desarrollo urbano y gestión predial. Nuestro equipo técnico entrega información clara, confiable y lista para respaldar decisiones de diseño, construcción y trámite.",
      subcategories: [
        {
          title: "Infraestructura Vial",
          description:
            `En LOPEZTOP S.A.S. brindamos soporte topográfico especializado para proyectos de infraestructura vial, aportando la precisión y confiabilidad necesarias en cada etapa del proceso constructivo.
            Realizamos levantamientos topográficos, replanteos, control geométrico de obra, nivelaciones y seguimiento técnico, garantizando que carreteras, vías urbanas, caminos rurales y demás proyectos viales se ejecuten conforme a los diseños y especificaciones establecidas.
            Nuestro equipo técnico trabaja con tecnología de alta precisión y metodologías actualizadas, permitiendo optimizar tiempos de ejecución, minimizar errores en campo y asegurar el correcto desarrollo de las obras.
            En LOPEZTOP S.A.S. entendemos que la infraestructura vial es clave para el desarrollo y la conectividad de las regiones. Por eso ofrecemos información topográfica confiable que respalda decisiones técnicas y contribuye a la construcción de vías seguras, eficientes y duraderas.`,
        },
        
        {
          title: "Parcelaciones",
          description:
            `En LOPEZTOP S.A.S. ofrecemos servicios topográficos especializados para proyectos de parcelación y subdivisión de terrenos, garantizando precisión técnica y cumplimiento de la normativa vigente.
            Realizamos levantamientos topográficos, diseño y replanteo de lotes, definición de linderos, cálculo de áreas y elaboración de planos, proporcionando la información necesaria para desarrollar proyectos de parcelación de forma organizada, segura y legalmente respaldada.
            Nuestro equipo combina experiencia técnica, tecnología de alta precisión y rigurosidad en el manejo de la información, permitiendo optimizar el aprovechamiento del terreno y facilitar los procesos de planificación, urbanización y comercialización de los lotes.
            En LOPEZTOP S.A.S acompañamos cada proyecto de parcelación con información topográfica confiable, contribuyendo a que el desarrollo del territorio se realice de manera ordenada, eficiente y sostenible.`,
        },
      ],
    },
    
    {
      title: "Construcción Civil",
      tagline: "Control topográfico para obra",
      image: "assets/images/construccion_civil.png",
      imageAlt: "Topografía aplicada a construcción civil",
      description: `Ofrecemos servicios profesionales de construcción civil, garantizando calidad, resistencia y cumplimiento en los tiempos de obra.

        • Planificación, ejecución, control y operación de obras civiles.

        • Dirección o manejo de recursos humanos, técnicos, económicos y materiales del proyecto.

        • Control de grupos de trabajo y subcontratistas`,
    },
    {
      title: "Seguridad y Salud en el Trabajo (SST)",
      tagline: "Servicios de Seguridad y Salud en el Trabajo",
      image: "assets/images/SG-SST.png",
      imageAlt: "Evaluación técnica de condiciones del terreno",
      description: `Protege a tus trabajadores y cumple con la normativa vigente con un Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST) bien implementado.
      Ofrecemos asesoría profesional para empresas de construcción, industria y comercio, enfocándonos en la prevención de riesgos laborales, el cumplimiento legal y el bienestar del personal.
      Nuestros servicios incluyen:

      • Implementación y actualización del SG-SST
      • Identificación de peligros y evaluación de riesgos
      • Elaboración de documentos y procedimientos de seguridad
      • Capacitaciones en prevención de accidentes laborales
      • Investigación de incidentes y accidentes de trabajo
      • Acompañamiento en auditorías y cumplimiento normativo`,
    },
    {
      title: "Actualización y Certificado de Áreas",
      tagline: "Precisión que respalda su propiedad",
      image: "assets/images/certificados_areas.png",
      imageAlt: "Certificacion de areas",
      description:
        `En LOPEZTOP S.A.S. ofrecemos el servicio de actualización y certificación de áreas, orientado a determinar con precisión las dimensiones reales de un predio o terreno, garantizando información confiable para trámites legales, técnicos y administrativos.
            Realizamos levantamientos topográficos detallados, verificación de linderos y procesamiento de la información para emitir planos y certificados de área que respaldan procesos como compraventa de predios, subdivisiones, trámites notariales, actualizaciones catastrales y procesos ante entidades públicas o privadas.
            Nuestro trabajo se desarrolla con equipos de alta precisión y metodologías técnicas confiables, asegurando que los resultados reflejen fielmente las características del terreno y cumplan con los requisitos establecidos por la normativa vigente.
            En LOPEZTOP S.A.S brindamos claridad y seguridad sobre la información de su propiedad, entregando documentación técnica precisa que respalda sus decisiones y trámites con total confianza.`,
        },
  ];

  const servicesGrid = document.querySelector("#servicesGrid");
  const modal = document.querySelector("#serviceModal");
  const modalPanel = modal?.querySelector(".service-modal__panel");
  const modalTitle = document.querySelector("#serviceModalTitle");
  const modalContent = document.querySelector("#serviceModalContent");
  const closeTriggers = modal?.querySelectorAll("[data-modal-close]");
  let lastFocusedElement = null;

  if (!servicesGrid || !modal || !modalPanel || !modalTitle || !modalContent) {
    return;
  }

  function createServiceCard(service, index) {
    const animationDelay = `${Number((index * 0.1).toFixed(1))}s`;
    const card = document.createElement("button");
    card.className = "service-card scroll-reveal reveal-slide-up";
    card.type = "button";
    card.dataset.delay = animationDelay;
    card.style.setProperty("--delay", animationDelay);
    card.setAttribute("aria-label", `Ver detalles de ${service.title}`);

    const image = document.createElement("img");
    image.src = service.image;
    image.alt = service.imageAlt;
    image.loading = "lazy";
    image.decoding = "async";

    const content = document.createElement("span");
    content.className = "service-card__content";

    const title = document.createElement("span");
    title.className = "service-card__title";
    title.textContent = service.title;

    const tagline = document.createElement("span");
    tagline.className = "service-card__tagline";
    tagline.textContent = service.tagline;

    const action = document.createElement("span");
    action.className = "service-card__action";
    action.innerHTML =
      '<span>Ver más</span><i class="fas fa-arrow-right" aria-hidden="true"></i>';

    content.append(title, tagline, action);
    card.append(image, content);
    card.addEventListener("click", () => openServiceModal(service));

    return card;
  }

  function renderServiceCards() {
    const fragment = document.createDocumentFragment();
    services.forEach((service, index) => {
      fragment.append(createServiceCard(service, index));
    });
    servicesGrid.append(fragment);

    if (typeof reinitScrollReveal === "function") {
      reinitScrollReveal();
    }
  }

  function renderModalContent(service) {
    modalTitle.textContent = service.title;
    modalContent.replaceChildren();

    renderStructuredText(modalContent, service.description);

    if (!service.subcategories?.length) {
      return;
    }

    const subcategoryList = document.createElement("div");
    subcategoryList.className = "service-modal__subcategories";

    service.subcategories.forEach((subcategory) => {
      const item = document.createElement("article");
      item.className = "service-modal__subcategory";

      const title = document.createElement("h4");
      title.textContent = subcategory.title;

      item.append(title);
      renderStructuredText(item, subcategory.description);
      subcategoryList.append(item);
    });

    modalContent.append(subcategoryList);
  }

  function renderStructuredText(container, content) {
    const blocks = Array.isArray(content) ? content : [content];

    blocks.forEach((block) => {
      const lines = String(block)
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      let listItems = [];

      lines.forEach((line) => {
        const bulletMatch = line.match(/^[•*-]\s*(.+)$/);

        if (bulletMatch) {
          listItems.push(bulletMatch[1]);
          return;
        }

        appendList(container, listItems);
        listItems = [];
        appendParagraph(container, line);
      });

      appendList(container, listItems);
    });
  }

  function appendParagraph(container, text) {
    const paragraph = document.createElement("p");
    appendTextWithBrandBold(paragraph, text);
    container.append(paragraph);
  }

  function appendList(container, items) {
    if (!items.length) {
      return;
    }

    const list = document.createElement("ul");
    list.className = "service-modal__list";

    items.forEach((item) => {
      const listItem = document.createElement("li");
      appendTextWithBrandBold(listItem, item);
      list.append(listItem);
    });

    container.append(list);
  }

  function appendTextWithBrandBold(element, text) {
    const brandPattern = /LOPEZTOP S\.A\.S\.?/g;
    let lastIndex = 0;
    let match = brandPattern.exec(text);

    while (match) {
      if (match.index > lastIndex) {
        element.append(document.createTextNode(text.slice(lastIndex, match.index)));
      }

      const strong = document.createElement("strong");
      strong.textContent = match[0];
      element.append(strong);

      lastIndex = brandPattern.lastIndex;
      match = brandPattern.exec(text);
    }

    if (lastIndex < text.length) {
      element.append(document.createTextNode(text.slice(lastIndex)));
    }
  }

  function getFocusableElements() {
    return modalPanel.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
  }

  function openServiceModal(service) {
    lastFocusedElement = document.activeElement;
    renderModalContent(service);
    modal.removeAttribute("inert");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    window.setTimeout(() => {
      modalPanel.focus();
    }, 50);
  }

  function closeServiceModal() {
    if (!modal.classList.contains("is-open")) {
      return;
    }

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("inert", "");
    document.body.classList.remove("modal-open");

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }

  function handleModalKeyboard(event) {
    if (!modal.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeServiceModal();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = Array.from(getFocusableElements());
    if (!focusableElements.length) {
      event.preventDefault();
      modalPanel.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (document.activeElement === modalPanel) {
      event.preventDefault();
      (event.shiftKey ? lastElement : firstElement).focus();
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeServiceModal);
  });

  document.addEventListener("keydown", handleModalKeyboard);
  renderServiceCards();
});
