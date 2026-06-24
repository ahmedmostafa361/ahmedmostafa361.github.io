/**
 * FITZONE GYM — script.js (v2 — reviewed & fixed)
 *
 * FIXES IN THIS VERSION:
 * - Mobile Menu: double-rAF stagger so opacity:0 paints before transition starts
 * - Scroll Spy: proper aria-current="page" set/removed (was toggleAttribute, invalid)
 * - Scroll Spy: rootMargin recalculated on navbar resize (ResizeObserver)
 * - FAQ Accordion: switched from [hidden] to a CSS class so max-height transition
 *   actually animates (hidden forces display:none and kills the transition)
 * - Before/After Slider: initial setPosition deferred to double-rAF so
 *   getBoundingClientRect() isn't 0 on first paint; added ResizeObserver
 * - Testimonials Marquee: 3x duplication (was 2x) so wide desktop screens
 *   never show a seam
 * - Counters: prefers-reduced-motion check moved BEFORE requestAnimationFrame
 *   is queued (previously the first frame always fired regardless)
 * - Contact Form: loader visibility via class, not [hidden] (display:none
 *   blocked the spin transition); added isSubmitting guard vs double-submit
 * - Back-to-Top: visibility/opacity class instead of [hidden] toggling to
 *   avoid a layout reflow on every scroll tick
 * - NEW: page scroll-progress bar
 * - NEW: sticky mobile CTA bar (appears after hero, biggest mobile conversion lever)
 */

'use strict';

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
  initProgressBar();
  initStickyMobileCTA();
});

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
  onScroll();
}

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

    mobileLinks.forEach(link => {
      link.style.transition = 'none';
      link.style.opacity = '0';
      link.style.transform = 'translateY(20px)';
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mobileLinks.forEach((link, i) => {
          link.style.transition = `opacity 0.35s ease ${i * 0.07}s, transform 0.35s ease ${i * 0.07}s`;
          link.style.opacity = '1';
          link.style.transform = 'translateY(0)';
        });
      });
    });

    const firstLink = mobileMenu.querySelector('.mobile-menu__link');
    if (firstLink) setTimeout(() => firstLink.focus(), 150);
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
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeMenu(); });
  mobileMenu.addEventListener('click', e => { if (e.target === mobileMenu) closeMenu(); });
}

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
    const navH = navbar ? navbar.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
    history.pushState(null, '', targetId);
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');
  if (!sections.length || !navLinks.length) return;
  const navbar = document.getElementById('site-header');

  function getMargin() {
    const navH = navbar ? navbar.offsetHeight : 0;
    return `-${navH + 16}px 0px -60% 0px`;
  }

  function updateActive(id) {
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('navbar__link--active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  let observer = null;
  function createObserver() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) updateActive(entry.target.id); });
    }, { rootMargin: getMargin(), threshold: 0 });
    sections.forEach(s => observer.observe(s));
  }

  createObserver();
  if (window.ResizeObserver && navbar) {
    new ResizeObserver(createObserver).observe(navbar);
  }
}

function initFAQAccordion() {
  const accordion = document.querySelector('.faq__accordion');
  if (!accordion) return;
  const items = accordion.querySelectorAll('.faq__item');
  const questions = accordion.querySelectorAll('.faq__question');

  items.forEach(item => {
    const answer = item.querySelector('.faq__answer');
    if (answer) {
      answer.removeAttribute('hidden');
      answer.classList.remove('faq__answer--open');
    }
  });

  function openItem(btn) {
    const answerId = btn.getAttribute('aria-controls');
    const answer = document.getElementById(answerId);
    if (!answer) return;
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';

    questions.forEach(q => {
      q.setAttribute('aria-expanded', 'false');
      const a = document.getElementById(q.getAttribute('aria-controls'));
      const icon = q.querySelector('.faq__icon');
      if (a) a.classList.remove('faq__answer--open');
      if (icon) icon.textContent = '+';
    });

    if (!isExpanded) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('faq__answer--open');
      const icon = btn.querySelector('.faq__icon');
      if (icon) icon.textContent = '×';
    }
  }

  questions.forEach(btn => {
    btn.addEventListener('click', () => openItem(btn));
    btn.addEventListener('keydown', e => {
      const list = [...questions];
      const idx = list.indexOf(btn);
      const map = {
        ArrowDown: (idx + 1) % list.length,
        ArrowUp: (idx - 1 + list.length) % list.length,
        Home: 0,
        End: list.length - 1,
      };
      if (e.key in map) { e.preventDefault(); list[map[e.key]].focus(); }
    });
  });
}

function initTransformationSliders() {
  const sliders = document.querySelectorAll('.transformation-card__slider');
  sliders.forEach(slider => {
    const before = slider.querySelector('.transformation-card__before');
    const after = slider.querySelector('.transformation-card__after');
    const handle = slider.querySelector('.transformation-card__handle');
    if (!before || !after || !handle) return;

    let dragging = false;
    let currentPct = 0.5;

    function setPosition(clientX) {
      const rect = slider.getBoundingClientRect();
      if (!rect.width) return;
      let pct = (clientX - rect.left) / rect.width;
      pct = Math.max(0.02, Math.min(0.98, pct));
      currentPct = pct;
      before.style.clipPath = `inset(0 ${(1 - pct) * 100}% 0 0)`;
      after.style.clipPath = `inset(0 0 0 ${pct * 100}%)`;
      handle.style.left = `${pct * 100}%`;
    }

    function resetToCenter() {
      const rect = slider.getBoundingClientRect();
      setPosition(rect.left + rect.width * 0.5);
    }

    requestAnimationFrame(() => requestAnimationFrame(resetToCenter));

    handle.addEventListener('mousedown', e => { e.preventDefault(); dragging = true; });
    slider.addEventListener('mousedown', e => { dragging = true; setPosition(e.clientX); });
    window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });

    slider.addEventListener('touchstart', e => {
      dragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchmove', e => {
      if (dragging) setPosition(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', () => { dragging = false; });

    if (window.ResizeObserver) {
      new ResizeObserver(() => {
        const rect = slider.getBoundingClientRect();
        setPosition(rect.left + currentPct * rect.width);
      }).observe(slider);
    }

    handle.setAttribute('tabindex', '0');
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-valuemin', '0');
    handle.setAttribute('aria-valuemax', '100');
    handle.setAttribute('aria-valuenow', '50');
    handle.setAttribute('aria-label', 'Drag to compare before and after');

    handle.addEventListener('keydown', e => {
      const step = e.shiftKey ? 0.1 : 0.02;
      const rect = slider.getBoundingClientRect();
      if (e.key === 'ArrowLeft') { e.preventDefault(); setPosition(rect.left + (currentPct - step) * rect.width); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setPosition(rect.left + (currentPct + step) * rect.width); }
      handle.setAttribute('aria-valuenow', String(Math.round(currentPct * 100)));
    });
  });
}

function initTestimonialsMarquee() {
  const tracks = document.querySelectorAll('.testimonials__track');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  tracks.forEach(track => {
    if (prefersReduced) return;
    const originals = [...track.children];
    for (let i = 0; i < 3; i++) {
      originals.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }
  });
}

function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('in-view'));
    return;
  }

  const selectors = [
    '.feature-card', '.service-card', '.pricing-card',
    '.trainer-card', '.transformation-card', '.testimonial-card', '.faq__item',
    '.contact__detail-item', '.about__image-cell', '.social-card',
    '.section-header', '.about__content', '.about__visual',
    '.faq__intro', '.contact__info', '.contact__form-wrap',
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.closest('.testimonials__marquee')) el.classList.add('animate-on-scroll');
    });
  });

  const staggerParents = [
    '.about__features', '.services__grid', '.pricing__grid',
    '.trainers__grid', '.transformations__grid', '.social-media__grid',
  ];
  staggerParents.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add('stagger-children', 'animate-on-scroll'));
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = 1600;
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    if (prefersReduced) return;
    const target = parseFloat(el.getAttribute('data-count'));
    const original = el.textContent.trim();
    const suffix = original.replace(/[\d,.]/g, '');
    const hasComma = original.includes(',');
    let start = null;

    function frame(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const current = Math.floor(easeOut(progress) * target);
      el.textContent = hasComma ? current.toLocaleString() + suffix : current + suffix;
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = original;
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

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const submitBtn = form.querySelector('.contact-form__submit');
  const successBox = document.getElementById('form-success');
  let isSubmitting = false;

  const rules = {
    'full-name': { validate: v => v.trim().length >= 2, message: 'Please enter your full name (at least 2 characters).' },
    email: { validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: 'Please enter a valid email address.' },
    phone: { validate: v => /^[+\d\s\-()]{7,20}$/.test(v.trim()), message: 'Please enter a valid phone number.' },
    goal: { validate: v => v !== '', message: 'Please select your fitness goal.' }
  };

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    if (!field || !error) return;
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('field--error');
    error.textContent = message;
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    if (!field || !error) return;
    field.removeAttribute('aria-invalid');
    field.classList.remove('field--error');
    error.textContent = '';
  }

  Object.keys(rules).forEach(id => {
    const field = document.getElementById(id);
    if (!field) return;
    field.addEventListener('blur', () => {
      if (!rules[id].validate(field.value)) showError(id, rules[id].message);
      else clearError(id);
    });
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true' && rules[id].validate(field.value)) clearError(id);
    });
  });

  function validateAll() {
    let valid = true;
    Object.keys(rules).forEach(id => {
      const field = document.getElementById(id);
      if (!field) return;
      if (!rules[id].validate(field.value)) { showError(id, rules[id].message); valid = false; }
      else clearError(id);
    });
    return valid;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateAll()) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');

    await new Promise(resolve => setTimeout(resolve, 1800));

    submitBtn.disabled = false;
    submitBtn.classList.remove('is-loading');
    isSubmitting = false;

    if (successBox) {
      successBox.removeAttribute('hidden');
      successBox.classList.add('is-visible');
      setTimeout(() => {
        if (typeof successBox.scrollIntoView === 'function') {
          successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
      successBox.focus();
    }

    form.reset();

    setTimeout(() => {
      if (successBox) {
        successBox.classList.remove('is-visible');
        successBox.setAttribute('hidden', '');
      }
    }, 8000);
  });
}

function initNewsletterForm() {
  const form = document.querySelector('.footer__newsletter-form');
  if (!form) return;
  const input = form.querySelector('.footer__newsletter-input');
  const errorEl = document.getElementById('newsletter-error');
  const btn = form.querySelector('.footer__newsletter-btn');
  const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!isValidEmail(input.value)) {
      if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
      input.classList.add('field--error');
      input.focus();
      return;
    }
    if (errorEl) errorEl.textContent = '';
    input.classList.remove('field--error');

    const origText = btn.textContent;
    btn.textContent = 'Subscribing…';
    btn.disabled = true;

    await new Promise(r => setTimeout(r, 1200));

    btn.textContent = '✓ Subscribed!';
    btn.classList.add('is-success');
    input.value = '';

    setTimeout(() => {
      btn.textContent = origText;
      btn.classList.remove('is-success');
      btn.disabled = false;
    }, 3500);
  });

  input.addEventListener('input', () => {
    input.classList.remove('field--error');
    if (errorEl) errorEl.textContent = '';
  });
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.removeAttribute('hidden');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('is-visible', window.scrollY > 400);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) skipLink.focus();
  });
}

function initWhatsAppButton() {
  const btn = document.querySelector('.whatsapp-float');
  const tooltip = document.querySelector('.whatsapp-float__tooltip');
  if (!btn || !tooltip) return;

  setTimeout(() => {
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateX(0)';
    setTimeout(() => {
      tooltip.style.opacity = '';
      tooltip.style.transform = '';
    }, 5000);
  }, 3000);

  btn.addEventListener('mouseenter', () => { btn.style.animationPlayState = 'paused'; });
  btn.addEventListener('mouseleave', () => { btn.style.animationPlayState = 'running'; });
}

function initCTAInteractions() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn--primary, .btn--crimson');
    if (!btn) return;

    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    Object.assign(ripple.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      top: `${e.clientY - rect.top - size / 2}px`,
      left: `${e.clientX - rect.left - size / 2}px`,
      background: 'rgba(255,255,255,0.22)',
      borderRadius: '50%',
      transform: 'scale(0)',
      pointerEvents: 'none',
      animation: 'fz-ripple 0.6s linear',
      zIndex: '5',
    });

    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  if (!document.getElementById('fz-ripple-style')) {
    const s = document.createElement('style');
    s.id = 'fz-ripple-style';
    s.textContent = '@keyframes fz-ripple { to { transform: scale(4); opacity: 0; } }';
    document.head.appendChild(s);
  }
}

function initKeyboardAccessibility() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const focusables = [...mobileMenu.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )];
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

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

  document.querySelectorAll('.trainer-card, .service-card').forEach(card => {
    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const cta = card.querySelector('a, button');
        if (cta) { e.preventDefault(); cta.click(); }
      }
    });
  });
}

function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'fz-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const total = doc.scrollHeight - doc.clientHeight;
        const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
        bar.style.width = `${pct}%`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initStickyMobileCTA() {
  if (window.innerWidth > 768) return;
  const hero = document.getElementById('home');
  if (!hero || document.querySelector('.fz-sticky-cta')) return;

  const bar = document.createElement('div');
  bar.className = 'fz-sticky-cta';
  bar.innerHTML = `
    <a href="#contact" class="btn btn--primary btn--full fz-sticky-cta__btn">
      Claim Your Free Trial →
    </a>`;
  document.body.appendChild(bar);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { bar.classList.toggle('is-visible', !entry.isIntersecting); });
  }, { threshold: 0.1 });

  observer.observe(hero);
}

function debounce(fn, wait = 150) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), wait); };
}

function throttleRAF(fn) {
  let pending = false;
  return (...args) => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { fn(...args); pending = false; });
  };
}
