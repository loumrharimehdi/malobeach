// ====================================================================
// MALOBEACH - JavaScript Main File
// Premium interactions and enhanced UX
// ====================================================================

// ====================================================================
// 1. DOCUMENT READY - Initialize all scripts when DOM is loaded
// ====================================================================
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeHamburgerMenu();
  initializeScrollHeader();
  initializeFormValidation();
  initializeSmoothScroll();
  initializeActiveNavLink();
  initializeScrollReveal();
  initializeInputInteractions();
  initializeReservationButtons();
  initializeAccessibility();
});

// ====================================================================
// 2. HAMBURGER MENU - Mobile navigation drawer
// ====================================================================
function initializeHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  const overlay = document.querySelector('.nav-overlay');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', function() {
    const isActive = this.classList.toggle('active');
    nav.classList.toggle('open', isActive);

    if (overlay) {
      overlay.classList.toggle('active', isActive);
    }

    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? 'hidden' : '';
    this.setAttribute('aria-expanded', isActive);
  });

  // Close menu when overlay is clicked
  if (overlay) {
    overlay.addEventListener('click', function() {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    });
  }

  // Close menu when a nav link is clicked
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ====================================================================
// 3. SCROLL HEADER - Glassmorphism intensification on scroll
// ====================================================================
function initializeScrollHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  let lastScroll = 0;

  const handleScroll = debounce(function() {
    const currentScroll = window.scrollY;

    if (currentScroll > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, 10);

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Check initial scroll position
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  }
}

// ====================================================================
// 4. SCROLL REVEAL - Animate elements on scroll
// ====================================================================
function initializeScrollReveal() {
  // Add .reveal class to content sections, cards, and feature items
  const revealTargets = document.querySelectorAll(
    '.content-section, .card, .feature-card, .hero-section p, .text-center, main > section, form'
  );

  revealTargets.forEach((el, index) => {
    el.classList.add('reveal');
    // Stagger delay for items in the same row
    const delayClass = `reveal-delay-${(index % 4) + 1}`;
    el.classList.add(delayClass);
  });

  // IntersectionObserver for reveal animations
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
}

// ====================================================================
// 5. FORM VALIDATION - Handle all form submissions
// ====================================================================
function initializeFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (validateForm(this)) {
        handleFormSubmission(this);
      }
    });
  });
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

  inputs.forEach(input => {
    if (!input.value.trim()) {
      markFieldAsInvalid(input, 'Ce champ est obligatoire');
      isValid = false;
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
      markFieldAsInvalid(input, 'Veuillez entrer une adresse email valide');
      isValid = false;
    } else if (input.type === 'tel' && input.value && !isValidPhone(input.value)) {
      markFieldAsInvalid(input, 'Veuillez entrer un numéro de téléphone valide');
      isValid = false;
    } else {
      clearFieldError(input);
    }
  });

  return isValid;
}

function markFieldAsInvalid(field, message) {
  const parent = field.parentElement;
  field.setAttribute('aria-invalid', 'true');
  parent.classList.add('field-error');
  parent.classList.remove('field-filled', 'field-focused');

  const existingError = parent.querySelector('.error-message');
  if (existingError) existingError.remove();

  const errorElement = document.createElement('span');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  errorElement.setAttribute('role', 'alert');
  parent.appendChild(errorElement);
}

function clearFieldError(field) {
  const parent = field.parentElement;
  field.setAttribute('aria-invalid', 'false');
  parent.classList.remove('field-error');

  const existingError = parent.querySelector('.error-message');
  if (existingError) existingError.remove();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s+()-]{9,}$/.test(phone);
}

function handleFormSubmission(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = 'Envoi en cours…';
  submitButton.style.opacity = '0.7';

  setTimeout(() => {
    showNotification('Merci ! Votre demande a été envoyée avec succès.', 'success');
    form.reset();

    // Clear all field-filled classes
    form.querySelectorAll('.field-filled').forEach(el => el.classList.remove('field-filled'));

    submitButton.disabled = false;
    submitButton.textContent = originalText;
    submitButton.style.opacity = '';
  }, 1200);
}

// ====================================================================
// 6. NAVIGATION - Handle navigation interactivity
// ====================================================================
function initializeNavigation() {
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');

      if (targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

function initializeActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();

    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

// ====================================================================
// 7. NOTIFICATIONS - Display success/error messages
// ====================================================================
function showNotification(message, type = 'info') {
  // Remove existing notifications
  document.querySelectorAll('.notification').forEach(n => n.remove());

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');
  notification.textContent = message;

  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });
  });

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

// ====================================================================
// 8. RESERVATION BUTTONS - Handle booking interactions
// ====================================================================
function initializeReservationButtons() {
  const reservationButtons = document.querySelectorAll('button');

  reservationButtons.forEach(button => {
    const text = button.textContent.trim();
    if (text.includes('RÉSERVER') || text.includes('DEMANDER')) {
      button.addEventListener('click', handleReservationClick);
    }
  });
}

function handleReservationClick(e) {
  // Don't trigger for form submit buttons
  if (e.target.type === 'submit') return;

  const buttonText = e.target.textContent;
  showReservationModal(buttonText);
}

function showReservationModal(activityType) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" aria-label="Fermer">&times;</button>
      <h2>Confirmer votre réservation</h2>
      <p>Vous souhaitez réserver : <strong>${activityType}</strong></p>
      <p>Vous serez redirigé vers le formulaire de réservation.</p>
      <div class="modal-buttons">
        <button class="btn btn-secondary" data-action="cancel">Annuler</button>
        <button class="btn" data-action="confirm">Confirmer</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });
  });

  modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));

  modal.querySelectorAll('.modal-buttons button').forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.dataset.action === 'confirm') {
        window.location.href = 'reservations.html';
      } else {
        closeModal(modal);
      }
    });
  });

  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal(modal);
  });

  // Close on Escape key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(modal);
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

function closeModal(modal) {
  modal.classList.remove('show');
  setTimeout(() => modal.remove(), 400);
}

// ====================================================================
// 9. INPUT FIELD INTERACTIONS - Enhance form UX
// ====================================================================
function initializeInputInteractions() {
  const inputFields = document.querySelectorAll('input, textarea, select');

  inputFields.forEach(field => {
    field.addEventListener('focus', function() {
      this.parentElement.classList.add('field-focused');
      this.parentElement.classList.remove('field-error');
      const err = this.parentElement.querySelector('.error-message');
      if (err) err.remove();
    });

    field.addEventListener('blur', function() {
      this.parentElement.classList.remove('field-focused');
    });

    field.addEventListener('input', function() {
      if (this.value.trim()) {
        this.parentElement.classList.add('field-filled');
      } else {
        this.parentElement.classList.remove('field-filled');
      }
    });

    if (field.value && field.value.trim()) {
      field.parentElement.classList.add('field-filled');
    }
  });
}

// ====================================================================
// 10. ACCESSIBILITY - Keyboard navigation and screen reader support
// ====================================================================
function initializeAccessibility() {
  const clickableElements = document.querySelectorAll('[onclick]');

  clickableElements.forEach(element => {
    if (!element.hasAttribute('tabindex') && !['BUTTON', 'A'].includes(element.tagName)) {
      element.setAttribute('tabindex', '0');
    }

    if (!['BUTTON', 'A'].includes(element.tagName)) {
      element.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          this.click();
          e.preventDefault();
        }
      });
    }
  });
}

// ====================================================================
// 11. UTILITY FUNCTIONS
// ====================================================================

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function getElementSafe(id) {
  return document.getElementById(id) || null;
}

// ====================================================================
// 12. CONSOLE INITIALIZATION
// ====================================================================
console.log(
  '%cMALOBEACH %c— v2.0 Premium',
  'color: #2A7B9B; font-size: 18px; font-weight: bold; font-family: Georgia, serif;',
  'color: #E8734A; font-size: 14px; font-weight: normal;'
);
console.log('%cL\'énergie de l\'eau, le plaisir du mouvement',
  'color: #718096; font-style: italic;'
);
