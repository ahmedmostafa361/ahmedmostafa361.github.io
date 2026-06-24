/**
 * FITZONE GYM — main.js
 * Production-ready vanilla JS for the gym landing page.
 * Features:
 *   01. DOM Ready Bootstrapper
 *   02. Navbar Scroll Effect
 *   03. Mobile Menu Toggle
 *   04. Smooth Scrolling
 *   05. Active Nav Link (Scroll Spy)
 *   06. FAQ Accordion
 *   07. Before/After Transformation Slider
 *   08. Testimonials Marquee (duplicate for seamless loop)
 *   09. Scroll Reveal Animations (IntersectionObserver)
 *   10. Animated Counters
 *   11. Contact Form Validation & Submission
 *   12. Newsletter Form
 *   13. Back-to-Top Button
 *   14. WhatsApp Float Button Behavior
 *   15. CTA Pulse on Hover Pause
 *   16. Keyboard Accessibility Helpers
 */

'use strict';

/* ================================================================
   01. DOM READY BOOTSTRAPPER
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initSmoothScrolling();
  initScrollSpy();
  initFAQAccordion();
  initTransformationSliders();
  initTestimonialsMarquee();
  initScrollReveal();
  initCounters();
  initContactForm();
  initNewsletterForm();
  initBackToTop();
  initWhatsAppButton();
  initCTAInteractions();
  initKeyboardAccessibility();
});


/* ================================================================
   02. NAVBAR SCROLL EFFECT
   Adds `.scrolled` class after 80 px; shrinks height + solidifies bg
   ================================================================ */
function initNavbarScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 80;
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load in case page is already scrolled
}


/* ================================================================
   03. MOBILE MENU TOGGLE
   Hamburger ↔ X animation, aria attributes, focus trap, close on ESC
   ================================================================ */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');
  let isOpen = false;

  function openMenu() {
    isOpen = true;
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Stagger link entrance
    mobileLinks.forEach((link, i) => {
      link.style.opacity = '0';
      link.style.transform = 'translateY(20px)';
      link.style.transition = `opacity 0.3s ease ${i * 0.06}s, transform 0.3s ease ${i * 0.06}s`;
      requestAnimationFrame(() => {
        link.style.opacity = '1';
        link.style.transform = 'translateY(0)';
      });
    });

    // Move focus into menu
    const firstLink = mobileMenu.querySelector('.mobile-menu__link');
    if (firstLink) setTimeout(() => firstLink.focus(), 100);
  }

  function closeMenu() {
    isOpen = false;
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => (isOpen ? closeMenu() : openMenu()));

  // Close on link click
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Close on backdrop click (outside menu panel)
  mobileMenu.addEventListener('click', e => {
    if (e.target === mobileMenu) closeMenu();
  });
}


/* ================================================================
   04. SMOOTH SCROLLING
   Intercepts all anchor links that point to an ID on the page.
   Offsets by the navbar height.
   ================================================================ */
function initSmoothScrolling() {
  const navbar = document.getElementById('site-header');

  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navH  = navbar ? navbar.offsetHeight : 0;
    const top   = target.getBoundingClientRect().top + window.scrollY - navH - 8;

    window.scrollTo({ top, behavior: 'smooth' });

    // Update URL without jump
    history.pushState(null, '', targetId);
  });
}


/* ================================================================
   05. SCROLL SPY — ACTIVE NAV LINK
   Highlights the nav link whose section is currently in view.
   ================================================================ */
function initScrollSpy() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.navbar__link');
  if (!sections.length || !navLinks.length) return;

  const navbar   = document.getElementById('site-header');
  const navH     = () => navbar ? navbar.offsetHeight : 0;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('navbar__link--active', href === `#${id}`);
        link.toggleAttribute('aria-current', href === `#${id}`);
      });
    });
  }, {
    rootMargin: `-${navH() + 16}px 0px -60% 0px`,
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}


/* ================================================================
   06. FAQ ACCORDION
   Single-open, keyboard navigable, ARIA-compliant.
   ================================================================ */
function initFAQAccordion() {
  const accordion = document.querySelector('.faq__accordion');
  if (!accordion) return;

  const questions = accordion.querySelectorAll('.faq__question');

  function openItem(btn) {
    const answerId = btn.getAttribute('aria-controls');
    const answer   = document.getElementById(answerId);
    if (!answer) return;

    // Close all others
    questions.forEach(q => {
      if (q === btn) return;
      q.setAttribute('aria-expanded', 'false');
      const a = document.getElementById(q.getAttribute('aria-controls'));
      if (a) a.hidden = true;
      const icon = q.querySelector('.faq__icon');
      if (icon) icon.textContent = '+';
    });

    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isExpanded));
    answer.hidden = isExpanded;

    const icon = btn.querySelector('.faq__icon');
    if (icon) icon.textContent = isExpanded ? '+' : '×';
  }

  questions.forEach(btn => {
    btn.addEventListener('click', () => openItem(btn));

    // Arrow key navigation between items
    btn.addEventListener('keydown', e => {
      const items  = [...questions];
      const idx    = items.indexOf(btn);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(idx + 1) % items.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1].focus();
      }
    });
  });
}


/* ================================================================
   07. BEFORE/AFTER TRANSFORMATION SLIDERS
   Drag handle to reveal before ↔ after. Touch + mouse.
   ================================================================ */
function initTransformationSliders() {
  const sliders = document.querySelectorAll('.transformation-card__slider');

  sliders.forEach(slider => {
    const before   = slider.querySelector('.transformation-card__before');
    const after    = slider.querySelector('.transformation-card__after');
    const handle   = slider.querySelector('.transformation-card__handle');
    if (!before || !after || !handle) return;

    let dragging = false;

    function setPosition(clientX) {
      const rect   = slider.getBoundingClientRect();
      let pct      = (clientX - rect.left) / rect.width;
      pct          = Math.max(0.02, Math.min(0.98, pct));
      const pctPx  = `${pct * 100}%`;

      before.style.clipPath = `inset(0 ${100 - pct * 100}% 0 0)`;
      after.style.clipPath  = `inset(0 0 0 ${pct * 100}%)`;
      handle.style.left     = pctPx;
    }

    // Set initial position at 50%
    setPosition(slider.getBoundingClientRect().left + slider.offsetWidth / 2);

    // Mouse
    handle.addEventListener('mousedown', e => { e.preventDefault(); dragging = true; });
    slider.addEventListener('mousedown', e => { dragging = true; setPosition(e.clientX); });
    window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
    window.addEventListener('mouseup',   () => { dragging = false; });

    // Touch
    slider.addEventListener('touchstart', e => {
      dragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchmove', e => {
      if (dragging) setPosition(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', () => { dragging = false; });

    // Keyboard (arrow keys on handle)
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', 'Drag to compare before and after');
    handle.addEventListener('keydown', e => {
      const rect = slider.getBoundingClientRect();
      const cur  = parseFloat(handle.style.left || '50') / 100;
      const step = e.shiftKey ? 0.1 : 0.02;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); setPosition(rect.left + (cur - step) * rect.width); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setPosition(rect.left + (cur + step) * rect.width); }
    });
  });
}


/* ================================================================
   08. TESTIMONIALS MARQUEE
   Clones tracks for seamless infinite scroll; respects reduced-motion.
   ================================================================ */
function initTestimonialsMarquee() {
  const tracks = document.querySelectorAll('.testimonials__track');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  tracks.forEach(track => {
    if (prefersReduced) return;

    // Duplicate children for seamless loop
    const originals = [...track.children];
    originals.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });
}


/* ================================================================
   09. SCROLL REVEAL ANIMATIONS
   Uses IntersectionObserver to add `.in-view` on scroll entry.
   Staggered children handled via CSS transition-delay.
   ================================================================ */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // Show everything immediately
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('in-view');
    });
    return;
  }

  // Auto-apply class to candidate elements that don't have it yet
  const selectors = [
    '.feature-card',
    '.service-card',
    '.pricing-card',
    '.trainer-card',
    '.transformation-card',
    '.testimonial-card',
    '.faq__item',
    '.contact__detail-item',
    '.about__image-cell',
    '.social-card',
    '.section-header',
    '.about__content',
    '.about__visual',
    '.faq__intro',
    '.contact__info',
    '.contact__form-wrap',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.closest('.testimonials__marquee')) {
        el.classList.add('animate-on-scroll');
      }
    });
  });

  // Also wire stagger classes to grid parents
  const staggerParents = [
    '.about__features',
    '.services__grid',
    '.pricing__grid',
    '.trainers__grid',
    '.transformations__grid',
    '.social-media__grid',
  ];

  staggerParents.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('stagger-children', 'animate-on-scroll');
    });
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}


/* ================================================================
   10. ANIMATED COUNTERS
   Counts up from 0 to target value when the stat enters the viewport.
   ================================================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const DURATION = 1500; // ms
  const easeOut  = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target  = parseFloat(el.getAttribute('data-count'));
    const original = el.textContent.trim();
    // Detect suffix (e.g. "+", "%", " kg", " ★")
    const suffix  = original.replace(/[\d,\.]/g, '');
    const hasComma = original.includes(',');

    let start     = null;

    function frame(ts) {
      if (!start) start = ts;
      const elapsed  = ts - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased    = easeOut(progress);
      const current  = Math.floor(eased * target);

      el.textContent = hasComma
        ? current.toLocaleString() + suffix
        : current + suffix;

      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = original; // restore exact original on finish
    }

    if (prefersReduced) {
      return; // keep static text
    }

    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}


/* ================================================================
   11. CONTACT FORM VALIDATION & SUBMISSION
   Client-side validation with inline errors; simulates async submit.
   ================================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn  = form.querySelector('.contact-form__submit');
  const btnText    = form.querySelector('.contact-form__btn-text');
  const btnLoader  = form.querySelector('.contact-form__btn-loader');
  const successBox = document.getElementById('form-success');

  const rules = {
    'full-name': {
      validate: v => v.trim().length >= 2,
      message: 'Please enter your full name (at least 2 characters).'
    },
    email: {
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: 'Please enter a valid email address.'
    },
    phone: {
      validate: v => /^[+\d\s\-()]{7,20}$/.test(v.trim()),
      message: 'Please enter a valid phone number.'
    },
    goal: {
      validate: v => v !== '',
      message: 'Please select your fitness goal.'
    }
  };

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    if (!field || !error) return;
    field.setAttribute('aria-invalid', 'true');
    field.style.borderColor = 'rgba(255, 77, 109, 0.6)';
    error.textContent = message;
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    if (!field || !error) return;
    field.removeAttribute('aria-invalid');
    field.style.borderColor = '';
    error.textContent = '';
  }

  // Live validation on blur
  Object.keys(rules).forEach(id => {
    const field = document.getElementById(id);
    if (!field) return;
    field.addEventListener('blur', () => {
      const rule = rules[id];
      if (!rule.validate(field.value)) showError(id, rule.message);
      else clearError(id);
    });
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        const rule = rules[id];
        if (rule.validate(field.value)) clearError(id);
      }
    });
  });

  function validateAll() {
    let valid = true;
    Object.keys(rules).forEach(id => {
      const field = document.getElementById(id);
      if (!field) return;
      const rule = rules[id];
      if (!rule.validate(field.value)) {
        showError(id, rule.message);
        valid = false;
      } else {
        clearError(id);
      }
    });
    return valid;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateAll()) {
      // Focus first invalid field
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    if (btnText)   btnText.hidden  = true;
    if (btnLoader) btnLoader.hidden = false;

    // Simulate API call (replace with real fetch)
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Success state
    submitBtn.disabled = false;
    if (btnText)   btnText.hidden  = false;
    if (btnLoader) btnLoader.hidden = true;

    if (successBox) {
      successBox.hidden = false;
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      // Announce to screen readers
      successBox.focus();
    }

    form.reset();

    // Auto-hide success after 8 s
    setTimeout(() => {
      if (successBox) successBox.hidden = true;
    }, 8000);
  });
}


/* ================================================================
   12. NEWSLETTER FORM
   Simple email validation on the footer newsletter input.
   ================================================================ */
function initNewsletterForm() {
  const form = document.querySelector('.footer__newsletter-form');
  if (!form) return;

  const input = form.querySelector('.footer__newsletter-input');
  const errorEl = document.getElementById('newsletter-error');
  const btn     = form.querySelector('.footer__newsletter-btn');

  const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!isValidEmail(input.value)) {
      if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
      input.focus();
      return;
    }
    if (errorEl) errorEl.textContent = '';

    const origText  = btn.textContent;
    btn.textContent = 'Subscribing…';
    btn.disabled    = true;

    await new Promise(r => setTimeout(r, 1200));

    btn.textContent = '✓ Subscribed!';
    btn.style.background = 'linear-gradient(135deg, #39FF6A, #00C2FF)';
    input.value = '';

    setTimeout(() => {
      btn.textContent = origText;
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  });
}


/* ================================================================
   13. BACK-TO-TOP BUTTON
   Appears after 400 px scroll; smooth-scrolls to top on click.
   ================================================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.hidden = window.scrollY < 400;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Move focus to top for keyboard / screen-reader users
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) skipLink.focus();
  });
}


/* ================================================================
   14. WHATSAPP FLOATING BUTTON BEHAVIOR
   Shows tooltip on first load (3 s delay), hides after 5 s.
   Pulse animation is handled in CSS; JS adds initial attention class.
   ================================================================ */
function initWhatsAppButton() {
  const btn     = document.querySelector('.whatsapp-float');
  const tooltip = document.querySelector('.whatsapp-float__tooltip');
  if (!btn || !tooltip) return;

  // Show tooltip after 3 s then auto-hide after 5 s
  setTimeout(() => {
    tooltip.style.opacity  = '1';
    tooltip.style.transform = 'translateX(0)';
    setTimeout(() => {
      tooltip.style.opacity   = '';
      tooltip.style.transform = '';
    }, 5000);
  }, 3000);

  // Pause pulse on hover (already in CSS; JS ensures re-trigger on leave)
  btn.addEventListener('mouseenter', () => {
    btn.style.animationPlayState = 'paused';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.animationPlayState = 'running';
  });
}


/* ================================================================
   15. CTA BUTTON INTERACTIONS
   Primary CTAs get a ripple effect on click.
   ================================================================ */
function initCTAInteractions() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn--primary, .btn--crimson');
    if (!btn) return;

    // Create ripple
    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    Object.assign(ripple.style, {
      position:     'absolute',
      width:        `${size}px`,
      height:       `${size}px`,
      top:          `${y}px`,
      left:         `${x}px`,
      background:   'rgba(255,255,255,0.25)',
      borderRadius: '50%',
      transform:    'scale(0)',
      pointerEvents:'none',
      animation:    'ripple 0.6s linear',
      zIndex:       '5',
    });

    // Ensure parent is relatively positioned
    const originalPosition = getComputedStyle(btn).position;
    if (originalPosition === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  // Inject keyframe if not already present
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}


/* ================================================================
   16. KEYBOARD ACCESSIBILITY HELPERS
   - Trap focus inside mobile menu when open
   - Close mobile menu when focus leaves it
   - Smooth reveal of skip-link on focus
   ================================================================ */
function initKeyboardAccessibility() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const focusables = mobileMenu.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Enhance skip-link visibility on focus (already CSS, but reinforce)
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', e => {
      e.preventDefault();
      const main = document.getElementById('main-content');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
        main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
      }
    });
  }

  // Ensure interactive cards are keyboard reachable
  document.querySelectorAll('.trainer-card, .service-card').forEach(card => {
    if (!card.hasAttribute('tabindex')) {
      card.setAttribute('tabindex', '0');
    }
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const cta = card.querySelector('a, button');
        if (cta) { e.preventDefault(); cta.click(); }
      }
    });
  });
}


/* ================================================================
   UTILITY — Debounce
   ================================================================ */
function debounce(fn, wait = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/* ================================================================
   UTILITY — Throttle (rAF-based)
   ================================================================ */
function throttleRAF(fn) {
  let pending = false;
  return (...args) => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      fn(...args);
      pending = false;
    });
  };
}
