(function() {
  "use strict"; // Start of use strict

  // Función de utilidad para seleccionar elementos y manejar eventos
  const qs = (selector) => document.querySelector(selector);
  const qsa = (selector) => document.querySelectorAll(selector);
  const body = qs('body');
  const sidebar = qs('.sidebar');

  // Utility para el collapse de Bootstrap (si se usa Vanilla)
  // Nota: Asume que tienes el JS de Bootstrap cargado. Si no,
  // deberías implementar tu propia lógica de colapso.
  const hideSidebarCollapse = () => {
    const collapses = qsa('.sidebar .collapse');
    collapses.forEach(collapse => {
      // Si usas Bootstrap 5+, esto requeriría la inicialización de Collapse
      // Para un simple toggling de clases, usarías:
      // collapse.classList.remove('show');
      // Pero si usas Bootstrap 4, debes usar la API de JS:
      if (collapse.classList.contains('show')) {
         // Simulación de .collapse('hide')
         collapse.classList.remove('show');
      }
    });
  };
  
  // Función para ocultar todos los colapsos de la barra lateral (Adaptación de .collapse('hide'))
  const hideAllSidebarCollapses = () => {
    qsa('.sidebar .collapse.show').forEach(collapse => {
      // Utiliza el método nativo de Bootstrap si está cargado
      if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
          const bsCollapse = new bootstrap.Collapse(collapse, { toggle: false });
          bsCollapse.hide();
      } else {
          // Si no hay Bootstrap JS, simplemente elimina la clase 'show'
          collapse.classList.remove('show');
      }
    });
  };


  // =================================================================
  // 1. Toggle the side navigation (Toggle de la navegación lateral)
  // =================================================================

  qsa("#sidebarToggle, #sidebarToggleTop").forEach(toggleBtn => {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      body.classList.toggle("sidebar-toggled");
      sidebar.classList.toggle("toggled");

      if (sidebar.classList.contains("toggled")) {
        hideAllSidebarCollapses();
      }
    });
  });

  // =================================================================
  // 2. Window Resize (Redimensionamiento de la ventana)
  // =================================================================

  window.addEventListener('resize', () => {
    const windowWidth = window.innerWidth;
    const sidebarToggled = sidebar.classList.contains("toggled");

    // Close any open menu accordions when window is resized below 768px
    if (windowWidth < 768) {
      hideAllSidebarCollapses();
    }
    
    // Toggle the side navigation when window is resized below 480px
    if (windowWidth < 480 && !sidebarToggled) {
      body.classList.add("sidebar-toggled");
      sidebar.classList.add("toggled");
      hideAllSidebarCollapses();
    }
  });

  // =================================================================
  // 3. Prevent sidebar scrolling (Evitar desplazamiento de la barra lateral fija)
  // =================================================================

  const fixedNavSidebar = qs('body.fixed-nav .sidebar');
  if (fixedNavSidebar) {
      fixedNavSidebar.addEventListener('wheel', (e) => {
          if (window.innerWidth > 768) {
              const delta = e.deltaY || -e.detail;
              e.currentTarget.scrollTop += (delta > 0 ? 1 : -1) * 30; // Uso de e.deltaY para navegadores modernos
              e.preventDefault();
          }
      }, { passive: false }); // {passive: false} es necesario para que preventDefault funcione
  }


  // =================================================================
  // 4. Scroll to top button (Botón de desplazamieto hacia arriba)
  // =================================================================

  const scrollToTopButton = qs('.scroll-to-top');

  document.addEventListener('scroll', () => {
    const scrollDistance = window.scrollY;
    if (scrollDistance > 100) {
      if (scrollToTopButton) scrollToTopButton.style.display = 'inline-block'; // Simular fadeIn
    } else {
      if (scrollToTopButton) scrollToTopButton.style.display = 'none'; // Simular fadeOut
    }
  });

  // =================================================================
  // 5. Smooth scrolling (Desplazamiento suave)
  // =================================================================
  
  document.addEventListener('click', (e) => {
    // Solo si el elemento clickeado o su padre es un ancla con la clase 'scroll-to-top'
    const anchor = e.target.closest('a.scroll-to-top');
    
    if (anchor) {
      e.preventDefault();
      const targetSelector = anchor.getAttribute('href');
      const targetElement = qs(targetSelector);

      if (targetElement) {
        // En Vanilla JS, esto se logra con scrollIntoView o scrollTo (mejor para animaciones)
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth' // Usa CSS para el desplazamiento suave (easeInOutExpo requiere más código)
        });

        // Nota: Replicar 'easeInOutExpo' de jQuery Easing en Vanilla JS
        // requiere una función de animación/curva de tiempo separada (mucho más código).
        // Usamos 'smooth' que es el estándar moderno.
      }
    }
  });
  
})(); // Fin del uso estricto y función de envolvimiento.