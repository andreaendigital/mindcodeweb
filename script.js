// ============================================================
// Mind & Code Landing Page - JavaScript Module
// ============================================================

// ---- Módulo de Navegación ----

/**
 * Adjunta event handlers de clic a todos los enlaces internos
 * para realizar scroll suave a la sección destino.
 */
function initSmoothScroll() {
  var links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });

      // Close mobile menu if open
      var mobileMenu = document.getElementById('mobile-menu');
      var menuBtn = document.getElementById('mobile-menu-btn');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (menuBtn) {
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
}

/**
 * Usa IntersectionObserver para detectar la sección visible
 * y resaltar el enlace de navegación correspondiente.
 */
function initActiveNavHighlight() {
  var navLinksContainer = document.getElementById('nav-links');
  if (!navLinksContainer) return;

  var navLinks = navLinksContainer.querySelectorAll('a[href^="#"]');
  var sections = document.querySelectorAll('main section[id]');

  if (sections.length === 0) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = '#a8c202';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

/**
 * Toggle del menú hamburguesa en mobile.
 * Alterna aria-expanded y visibilidad de la lista de navegación.
 */
function initMobileMenu() {
  var menuBtn = document.getElementById('mobile-menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', function () {
    var isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    mobileMenu.classList.toggle('hidden');
  });
}

// ---- Módulo de Animaciones ----

/**
 * Verifica si el usuario tiene activada la preferencia
 * prefers-reduced-motion: reduce.
 * @returns {boolean} true si se debe reducir el movimiento
 */
function shouldReduceMotion() {
  // TODO: Implementar en tarea 7.2
  return false;
}

/**
 * Observa elementos con clase .reveal y agrega clase .revealed
 * al entrar en el viewport (threshold 0.2).
 */
function initScrollReveal() {
  var elements = document.querySelectorAll('.reveal');

  if (elements.length === 0) return;

  // If user prefers reduced motion, show everything immediately
  if (shouldReduceMotion()) {
    elements.forEach(function (el) {
      el.classList.add('revealed');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

/**
 * Anima un elemento numérico desde 0 hasta el valor objetivo.
 * @param {HTMLElement} element - Elemento DOM a animar
 * @param {number} target - Valor numérico objetivo
 * @param {number} duration - Duración máxima en ms (máx 2000)
 */
function animateCounter(element, target, duration) {
  // TODO: Implementar en tarea 7.2
}

/**
 * Usa IntersectionObserver para detectar elementos de contador
 * y disparar la animación una sola vez.
 */
function initCounters() {
  // TODO: Implementar en tarea 7.2
}

// ---- Módulo del Formulario ----

var selectedFile = null;

/**
 * Valida formato de email estándar.
 * @param {string} email - Cadena a validar
 * @returns {boolean} true si el formato es válido
 */
function validateEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida formato de URL (campo opcional).
 * @param {string} url - Cadena a validar
 * @returns {boolean} true si la URL es válida
 */
function validateURL(url) {
  if (url === '') return true;
  var regex = /^https?:\/\/.+/;
  return regex.test(url);
}

/**
 * Verifica tipo de archivo (PDF/DOCX) y tamaño (≤5MB).
 * @param {File} file - Archivo a validar
 * @returns {{valid: boolean, error: string}} Resultado de validación
 */
function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'Este campo es requerido' };
  }

  var allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  var fileName = file.name.toLowerCase();
  var hasValidExtension = fileName.endsWith('.pdf') || fileName.endsWith('.docx');
  var hasValidMime = allowedMimes.indexOf(file.type) !== -1;

  if (!hasValidMime && !hasValidExtension) {
    return { valid: false, error: 'Solo se aceptan archivos PDF o DOCX' };
  }

  var maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'El archivo no debe superar los 5 MB' };
  }

  return { valid: true, error: '' };
}

/**
 * Valida un campo individual del formulario.
 * @param {HTMLInputElement} field - Campo del formulario a validar
 * @returns {{valid: boolean, error: string}} Resultado de validación
 */
function validateField(field) {
  var tagName = field.tagName.toLowerCase();
  var value = field.value.trim();

  // Select element validation
  if (tagName === 'select') {
    if (value === '') {
      return { valid: false, error: 'Este campo es requerido' };
    }
    return { valid: true, error: '' };
  }

  // Required field check
  if (field.hasAttribute('required') && value === '') {
    return { valid: false, error: 'Este campo es requerido' };
  }

  // Email format validation
  if (field.type === 'email' && value !== '') {
    if (!validateEmail(value)) {
      return { valid: false, error: 'Ingresa un email válido' };
    }
  }

  // URL format validation
  if (field.type === 'url' && value !== '') {
    if (!validateURL(value)) {
      return { valid: false, error: 'Ingresa una URL válida' };
    }
  }

  return { valid: true, error: '' };
}

/**
 * Configura event handlers de drag-and-drop en el elemento dropzone.
 */
function initDropzone() {
  var dropzone = document.getElementById('cv-dropzone');
  var fileInput = document.getElementById('cv-input');

  if (!dropzone || !fileInput) return;

  // Click to trigger file selection
  dropzone.addEventListener('click', function () {
    fileInput.click();
  });

  // Drag events
  dropzone.addEventListener('dragenter', function (e) {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', function () {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    var files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0], dropzone);
    }
  });

  // File input change
  fileInput.addEventListener('change', function () {
    if (fileInput.files.length > 0) {
      handleFileSelection(fileInput.files[0], dropzone);
    }
  });
}

/**
 * Maneja la selección de archivo (validación y actualización del dropzone).
 * @param {File} file - Archivo seleccionado
 * @param {HTMLElement} dropzone - Elemento dropzone
 */
function handleFileSelection(file, dropzone) {
  var result = validateFile(file);
  var textEl = dropzone.querySelector('p');

  if (result.valid) {
    selectedFile = file;
    if (textEl) textEl.textContent = file.name;
    dropzone.classList.remove('error');
  } else {
    dropzone.classList.add('error');
    if (textEl) textEl.textContent = result.error;
    selectedFile = null;
  }
}

/**
 * Limpia todos los campos del formulario y elimina mensajes de validación.
 * @param {HTMLFormElement} form - Formulario a resetear
 */
function resetForm(form) {
  form.reset();
  selectedFile = null;

  // Clear all error messages
  var errorMessages = form.querySelectorAll('.error-message');
  errorMessages.forEach(function (el) {
    el.textContent = '';
  });

  // Reset dropzone text
  var dropzone = document.getElementById('cv-dropzone');
  if (dropzone) {
    var textEl = dropzone.querySelector('p');
    if (textEl) textEl.textContent = 'Arrastra tu CV aquí o haz clic para seleccionar';
    dropzone.classList.remove('error');
  }

  // Hide success message
  var successMsg = document.getElementById('form-success');
  if (successMsg) {
    successMsg.classList.add('hidden');
  }
}

/**
 * Configura el handler de envío del formulario y la validación.
 */
function initCandidateForm() {
  var form = document.getElementById('candidate-form');
  var successMsg = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var fields = form.querySelectorAll('input[name], select[name]');
    var allValid = true;
    var firstInvalid = null;

    // Validate each field
    fields.forEach(function (field) {
      var result = validateField(field);
      var errorEl = field.parentElement.querySelector('.error-message');

      if (!result.valid) {
        allValid = false;
        if (errorEl) errorEl.textContent = result.error;
        field.style.borderColor = 'red';
        if (!firstInvalid) firstInvalid = field;
      } else {
        if (errorEl) errorEl.textContent = '';
        field.style.borderColor = '';
      }
    });

    // Validate file
    var fileResult = validateFile(selectedFile);
    var dropzone = document.getElementById('cv-dropzone');
    var fileErrorEl = dropzone ? dropzone.parentElement.querySelector('.error-message') : null;

    if (!fileResult.valid) {
      allValid = false;
      if (fileErrorEl) fileErrorEl.textContent = fileResult.error;
      if (dropzone) dropzone.classList.add('error');
      if (!firstInvalid && dropzone) firstInvalid = dropzone;
    } else {
      if (fileErrorEl) fileErrorEl.textContent = '';
      if (dropzone) dropzone.classList.remove('error');
    }

    // Handle result
    if (allValid) {
      if (successMsg) successMsg.classList.remove('hidden');
      resetForm(form);
    } else {
      if (firstInvalid && firstInvalid.focus) {
        firstInvalid.focus();
      }
    }
  });
}

// ---- Inicialización ----

// ---- Hero Carousel ----

function initHeroCarousel() {
  var slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;

  var current = 0;
  var total = slides.length;

  setInterval(function () {
    slides[current].style.opacity = '0';
    current = (current + 1) % total;
    slides[current].style.opacity = '1';
  }, 2700);
}

// ---- Testimonial Carousel ----

function initTestimonialCarousel() {
  var slides = document.querySelectorAll('.testimonial-slide');
  var dots = document.querySelectorAll('.testimonial-dot');
  if (slides.length === 0) return;

  var current = 0;
  var total = slides.length;

  function showSlide(index) {
    slides.forEach(function (slide, i) {
      if (i === index) {
        slide.classList.remove('hidden');
        slide.setAttribute('data-active', 'true');
      } else {
        slide.classList.add('hidden');
        slide.setAttribute('data-active', 'false');
      }
    });
    dots.forEach(function (dot, i) {
      if (i === index) {
        dot.classList.remove('bg-gray-300', 'bg-white/50');
        dot.classList.add('bg-[#a8c202]');
      } else {
        dot.classList.remove('bg-[#a8c202]');
        dot.classList.add('bg-white/50');
      }
    });
  }

  // Click on dots
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      current = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(current);
    });
  });

  // Auto-advance every 5 seconds
  setInterval(function () {
    current = (current + 1) % total;
    showSlide(current);
  }, 5000);
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    initSmoothScroll();
    initActiveNavHighlight();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initCandidateForm();
    initDropzone();
    initHeroCarousel();
    initTestimonialCarousel();
  });
}

// ---- Exportaciones para testing ----
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateEmail: validateEmail,
    validateURL: validateURL,
    validateFile: validateFile,
    validateField: validateField,
    animateCounter: animateCounter
  };
}
