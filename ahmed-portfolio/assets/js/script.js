/**
 * Ahmed Megahed — Portfolio
 * Modular, performant, accessible vanilla JS
 * Enhanced with GSAP, ScrollTrigger, Lenis, Vanilla Tilt, Three.js
 * Phase 18 — Final production polish
 */

;(function () {
  'use strict';

  /* ═══════════════════════════════════════════════
     UTILITIES
     ═══════════════════════════════════════════════ */

  /** Query all matching elements within a root (default: document). */
  const $ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  /** Query the first matching element within a root (default: document). */
  const $$ = (selector, root = document) =>
    root.querySelector(selector);

  /**
   * Throttle: fires at most once per `ms` milliseconds,
   * guaranteeing a trailing call so the last event is never dropped.
   */
  function throttle(fn, ms) {
    let last  = 0;
    let timer = null;
    return function (...args) {
      const now       = Date.now();
      const remaining = ms - (now - last);
      if (remaining <= 0) {
        last = now;
        fn.apply(this, args);
      } else if (!timer) {
        timer = setTimeout(() => {
          last  = Date.now();
          timer = null;
          fn.apply(this, args);
        }, remaining);
      }
    };
  }

  /** Debounce: fires only after `ms` milliseconds of silence. */
  function debounce(fn, ms) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  /** Returns true when the user prefers reduced motion. */
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Returns true on pointer devices (mouse/trackpad). */
  const hasFinePointer = () =>
    window.matchMedia('(pointer: fine)').matches;

  /** Returns the current scroll position, favouring Lenis when available. */
  function getScrollY() {
    return window._lenis ? (window._lenis.animatedScroll || 0) : window.scrollY;
  }

  /** Linear interpolation between `a` and `b` by factor `t`. */
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /** Clamps `val` between `min` and `max`. */
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  /* ═══════════════════════════════════════════════
     GSAP PLUGIN REGISTRATION
     ═══════════════════════════════════════════════ */
  function registerGSAPPlugins() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  /* ═══════════════════════════════════════════════
     ANIMATION CONFIG
     ═══════════════════════════════════════════════ */
  const ANIM_MAP = {
    'text-reveal': {
      from: { clipPath: 'inset(0 0 100% 0)' },
      to:   { clipPath: 'inset(0 0 0% 0)', ease: 'power4.out' }
    },
    'word-reveal': {
      from: { clipPath: 'inset(0 0 100% 0)', y: '100%' },
      to:   { clipPath: 'inset(0 0 0% 0)', y: '0%', ease: 'power4.out' }
    },
    'fade-up': {
      from: { y: 30, opacity: 0 },
      to:   { y: 0, opacity: 1, ease: 'power3.out' }
    },
    'fade-down': {
      from: { y: -30, opacity: 0 },
      to:   { y: 0, opacity: 1, ease: 'power3.out' }
    },
    'fade-in': {
      from: { opacity: 0, scale: 0.95 },
      to:   { opacity: 1, scale: 1, ease: 'power3.out' }
    },
    'card-reveal': {
      from: { y: 20, opacity: 0, scale: 0.97 },
      to:   { y: 0, opacity: 1, scale: 1, ease: 'power3.out' }
    },
    'image-reveal': {
      from: { clipPath: 'inset(15% 15% 15% 15% round 28px)', scale: 0.95 },
      to:   { clipPath: 'inset(0% 0% 0% 0% round 28px)', scale: 1, ease: 'power3.out' }
    },
    'skill-bar': {
      from: null,
      to:   { ease: 'power3.out' }
    }
  };

  /* ═══════════════════════════════════════════════
     DOM CACHE
     ═══════════════════════════════════════════════ */
  const dom = {};

  /** Cache all frequently used DOM references once at boot. */
  function cacheDom() {
    dom.loader            = $$('#loader');
    dom.cursor            = $$('#cursor');
    dom.cursorRing        = $$('#cursor-ring');
    dom.canvas            = $$('#particles');
    dom.navbar            = $$('#navbar');
    dom.navLinks          = $$('#navLinks');
    dom.hamburger         = $$('#hamburger');
    dom.navAnchors        = $('.nav-links a');
    dom.sections          = $('section[id]');
    dom.backTop           = $$('#back-top');
    dom.revealEls         = $('.reveal');
    dom.skillBars         = $('.skill-bar');
    dom.counterEls        = $('[data-target]');
    dom.copyBtns          = $('[data-copy]');
    dom.hoverTargets      = $(
      'a, button, .highlight-item, .project-card, ' +
      '.platform-card, .cert-card, .contact-item, ' +
      '.socials-grid a, .skill-category, .about-card, ' +
      '.marquee-item, .edu-card'
    );
    dom.hero              = $$('#hero');
    dom.allAnimated       = $('[data-animation]');
    dom.staggerContainers = $('[data-animation="stagger"]');
    dom.tiltElements      = $('[data-tilt]');
    dom.parallaxEls       = $('[data-parallax]');
    dom.floatingContainer = $$('[data-floating-container]');
    dom.socialLinks       = $('.socials-grid a');
    dom.magneticBtns      = $('.btn, .project-link, .copy-btn, .back-top');
    dom.threeBg           = $$('#three-bg');

    /* Phase 15 — additional refs */
    dom.heroLayers = {
      bg:  $$('.hero-layer-bg'),
      mid: $$('.hero-layer-mid'),
      fg:  $$('.hero-layer-fg')
    };
    dom.heroCanvasLayer  = $$('.hero-canvas-layer');
    dom.heroGlassPanels  = $('.hero-glass-panel');
    dom.floatingObjects  = $('.floating-object');
    dom.depthScrollBg    = $('.depth-scroll-bg');
    dom.depthScrollMid   = $('.depth-scroll-mid');
    dom.sectionDepths    = $('.section-depth');
    dom.sectionOverlays  = $('.section-bg-overlay');
    dom.lightRadials     = $('.light-radial');
    dom.webglWrapper     = $$('.webgl-canvas-wrapper');
  }

  /* ═══════════════════════════════════════════════
     LOADER
     ═══════════════════════════════════════════════ */
  function initLoader() {
    if (!dom.loader) return;

    window.addEventListener('load', () => {
      const delay = prefersReducedMotion() ? 400 : 2200;

      setTimeout(() => {
        if (typeof gsap !== 'undefined' && !prefersReducedMotion()) {
          gsap.to(dom.loader, {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
              dom.loader.classList.add('hide');
              dom.loader.style.pointerEvents = 'none';
            }
          });
        } else {
          dom.loader.classList.add('hide');
        }

        if (window._playHeroTimeline) window._playHeroTimeline();
      }, delay);
    });
  }

  /* ═══════════════════════════════════════════════
     CUSTOM CURSOR
     ═══════════════════════════════════════════════ */
  function initCursor() {
    if (!dom.cursor || !dom.cursorRing) return;

    /* Remove on touch/reduced-motion devices */
    if (!hasFinePointer() || prefersReducedMotion()) {
      dom.cursor.remove();
      dom.cursorRing.remove();
      document.body.style.cursor = 'auto';
      return;
    }

    let mx = 0, my = 0;   /* target position  */
    let rx = 0, ry = 0;   /* ring position    */
    let rafId = null;

    /* Move dot cursor instantly; kick off ring RAF if needed */
    function onPointerMove(e) {
      mx = e.clientX;
      my = e.clientY;

      if (typeof gsap !== 'undefined') {
        gsap.set(dom.cursor, { left: mx, top: my });
      } else {
        dom.cursor.style.left = mx + 'px';
        dom.cursor.style.top  = my + 'px';
      }

      if (!rafId) rafId = requestAnimationFrame(stepRing);
    }

    /* Smoothly follow cursor with the ring element */
    function stepRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;

      if (typeof gsap !== 'undefined') {
        gsap.set(dom.cursorRing, { left: rx, top: ry });
      } else {
        dom.cursorRing.style.left = rx + 'px';
        dom.cursorRing.style.top  = ry + 'px';
      }

      const dist = Math.abs(mx - rx) + Math.abs(my - ry);
      rafId = dist > 0.5 ? requestAnimationFrame(stepRing) : null;
    }

    /* Use a single selector string for hover detection */
    const HOVER_SELECTOR =
      'a, button, .highlight-item, .project-card, .platform-card, ' +
      '.cert-card, .contact-item, .socials-grid a, .skill-category, ' +
      '.about-card, .marquee-item, .edu-card';

    document.addEventListener('mousemove', onPointerMove, { passive: true });

    document.addEventListener('pointerover', (e) => {
      if (e.target.closest(HOVER_SELECTOR)) {
        document.body.classList.add('hovering');
      }
    }, { passive: true });

    document.addEventListener('pointerout', (e) => {
      if (e.target.closest(HOVER_SELECTOR)) {
        document.body.classList.remove('hovering');
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════
     PARTICLE CANVAS (2D fallback)
     ═══════════════════════════════════════════════ */
  function initParticles() {
    if (!dom.canvas) return;

    /* Defer to Three.js when WebGL scene is active */
    if (window._threeJSActive) {
      dom.canvas.remove();
      return;
    }

    if (!hasFinePointer() || prefersReducedMotion()) {
      dom.canvas.remove();
      return;
    }

    const ctx = dom.canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    let particles = [];
    let mouseX = -9999, mouseY = -9999;
    let rafId = null;
    let isVisible = true;

    const CONNECT_DIST   = 120;
    const CURSOR_DIST    = 150;
    const PARTICLE_COUNT = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    const COLORS         = ['107,138,255', '164,124,255'];

    class Particle {
      constructor() { this.init(); }

      init() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r  = Math.random() * 1.4 + 0.5;
        this.a  = Math.random() * 0.45 + 0.1;
        this.c  = COLORS[Math.random() > 0.5 ? 1 : 0];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) {
          this.init();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.1, this.r), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + this.c + ',' + this.a + ')';
        ctx.fill();
      }
    }

    function resize() {
      W = dom.canvas.width  = window.innerWidth;
      H = dom.canvas.height = window.innerHeight;
    }

    function populate() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      /* Update and draw each particle */
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      /* Draw connecting lines between nearby particles */
      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          /* Bounding-box early-out before expensive sqrt */
          if (dx > CONNECT_DIST || dx < -CONNECT_DIST || dy > CONNECT_DIST || dy < -CONNECT_DIST) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.strokeStyle = 'rgba(107,138,255,' + ((1 - dist / CONNECT_DIST) * 0.12) + ')';
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }

        /* Draw line from particle toward cursor */
        const cdx = pi.x - mouseX;
        const cdy = pi.y - mouseY;
        if (cdx > -CURSOR_DIST && cdx < CURSOR_DIST && cdy > -CURSOR_DIST && cdy < CURSOR_DIST) {
          const dist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (dist < CURSOR_DIST) {
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = 'rgba(164,124,255,' + ((1 - dist / CURSOR_DIST) * 0.25) + ')';
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }
      }

      if (isVisible) rafId = requestAnimationFrame(draw);
    }

    function start() { if (rafId) return; isVisible = true;  rafId = requestAnimationFrame(draw); }
    function stop()  { isVisible = false; if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
    window.addEventListener('resize', debounce(() => { resize(); populate(); }, 250));
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });

    resize();
    populate();
    start();
  }

  /* ═══════════════════════════════════════════════
     LENIS SMOOTH SCROLL
     ═══════════════════════════════════════════════ */
  function initLenis() {
    if (typeof Lenis === 'undefined' || prefersReducedMotion()) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const lenis = new Lenis({
      duration:        1.2,
      easing:          (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth:          true,
      smoothTouch:     false,
      touchMultiplier: 2
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    window._lenis = lenis;
  }

  /* ═══════════════════════════════════════════════
     NAVIGATION
     ═══════════════════════════════════════════════ */
  function initNavigation() {
    if (!dom.navbar) return;

    const SCROLL_THRESHOLD = 80;
    const SPY_OFFSET       = 200;

    /* Update navbar scroll state and active nav link */
    function onScroll() {
      const y = getScrollY();
      dom.navbar.classList.toggle('scrolled', y > SCROLL_THRESHOLD);
      if (dom.backTop) dom.backTop.classList.toggle('visible', y > 400);

      let currentId = '';
      for (let i = dom.sections.length - 1; i >= 0; i--) {
        if (y >= dom.sections[i].offsetTop - SPY_OFFSET) {
          currentId = dom.sections[i].id;
          break;
        }
      }

      dom.navAnchors.forEach((a) => {
        const isActive = a.getAttribute('href') === '#' + currentId;
        a.classList.toggle('active', isActive);
        if (isActive) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }

    window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });
    onScroll(); /* run immediately to set initial state */

    /* Mobile hamburger toggle */
    if (dom.hamburger && dom.navLinks) {
      dom.hamburger.addEventListener('click', () => {
        const isOpen = dom.navLinks.classList.toggle('open');
        dom.hamburger.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) {
          const firstLink = dom.navLinks.querySelector('a');
          if (firstLink) firstLink.focus();
        }
      });

      /* Close menu on nav-link click */
      dom.navAnchors.forEach((a) => {
        a.addEventListener('click', () => {
          dom.navLinks.classList.remove('open');
          dom.hamburger.setAttribute('aria-expanded', 'false');
        });
      });

      /* Close menu on Escape */
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dom.navLinks.classList.contains('open')) {
          dom.navLinks.classList.remove('open');
          dom.hamburger.setAttribute('aria-expanded', 'false');
          dom.hamburger.focus();
        }
      });

      /* Trap focus within open mobile menu */
      dom.navLinks.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab' || !dom.navLinks.classList.contains('open')) return;
        const focusable = dom.navLinks.querySelectorAll('a, button');
        const first     = focusable[0];
        const last      = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
      });
    }

    /* Smooth-scroll for all in-page anchor links */
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '#main-content') return;
      const target = $$(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = dom.navbar ? dom.navbar.offsetHeight : 0;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      if (window._lenis) window._lenis.scrollTo(top, { duration: 1.4 });
      else window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });

    /* Back-to-top button */
    if (dom.backTop) {
      dom.backTop.addEventListener('click', () => {
        if (window._lenis) window._lenis.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      });
    }
  }

  /* ═══════════════════════════════════════════════
     HERO ANIMATION
     ═══════════════════════════════════════════════ */
  function initHeroAnimation() {
    if (typeof gsap === 'undefined') return;

    if (prefersReducedMotion()) {
      resetHeroCSSAnimations();
      return;
    }

    /* Suppress CSS keyframe animations — GSAP takes over */
    const heroAnimEls = document.querySelectorAll(
      '.hero-greeting, .hero-name, .hero-title, .hero-subtitle, .hero-cta, .hero-stats, .hero-image'
    );
    heroAnimEls.forEach(el => { el.style.animation = 'none'; });

    const tl = gsap.timeline({ paused: true });

    tl.fromTo('#navbar',
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.2
    );
    tl.fromTo('.nav-logo',
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, 0.4
    );
    tl.fromTo('.hero-greeting',
      { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
      { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.8, ease: 'power4.out' }, 0.8
    );
    tl.fromTo('.hero-name .word',
      { clipPath: 'inset(0 0 100% 0)', y: '100%' },
      { clipPath: 'inset(0 0 0% 0)', y: '0%', duration: 0.8, stagger: 0.12, ease: 'power4.out' }, 1.0
    );
    tl.fromTo('.hero-title',
      { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
      { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.8, ease: 'power4.out' }, 1.5
    );
    tl.fromTo('.hero-subtitle',
      { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
      { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 1.0, ease: 'power4.out' }, 1.8
    );
    tl.fromTo('.hero-cta .btn',
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, 2.2
    );
    tl.fromTo('.hero-stats li',
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, 2.5
    );
    tl.fromTo('.hero-image',
      { clipPath: 'inset(15% 15% 15% 15% round 28px)', scale: 0.92, opacity: 0 },
      { clipPath: 'inset(0% 0% 0% 0% round 28px)', scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' }, 1.2
    );

    /* Expose play function — triggered by loader completion */
    window._playHeroTimeline = () => tl.play();
  }

  /** Reset hero elements to visible state (reduced-motion path). */
  function resetHeroCSSAnimations() {
    const els = document.querySelectorAll(
      '.hero-greeting, .hero-name, .hero-title, .hero-subtitle, .hero-cta, .hero-stats, .hero-image, .nav-logo, #navbar'
    );
    els.forEach(el => {
      el.style.animation = 'none';
      el.style.opacity   = '1';
      el.style.transform = 'none';
      el.style.clipPath  = 'none';
    });
  }

  /* ═══════════════════════════════════════════════
     SCROLLTRIGGER ANIMATIONS
     ═══════════════════════════════════════════════ */
  function initScrollTriggerAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (prefersReducedMotion()) { resetAllDataAnimations(); return; }

    const hero             = dom.hero;
    const staggerProcessed = new Set();

    /* Process stagger containers first */
    dom.staggerContainers.forEach(container => {
      if (hero && hero.contains(container)) return; /* hero handled separately */

      const staggerTime = parseFloat(container.dataset.stagger)  || 0.1;
      const delay       = parseFloat(container.dataset.delay)     || 0;
      const duration    = parseFloat(container.dataset.duration)  || 0.6;
      const children    = Array.from(container.children).filter(child =>
        child.dataset.animation && child.dataset.animation !== 'stagger'
      );
      if (!children.length) return;

      const type   = children[0].dataset.animation;
      const config = ANIM_MAP[type];
      if (!config) return;

      const fromVars = config.from ? { ...config.from } : {};
      const toVars   = { ...config.to, duration, stagger: staggerTime };

      gsap.fromTo(children, fromVars, {
        ...toVars,
        scrollTrigger: { trigger: container, start: 'top 88%', once: true },
        delay
      });

      children.forEach(c => staggerProcessed.add(c));
    });

    /* Process all other data-animation elements */
    dom.allAnimated.forEach(el => {
      if (hero && hero.contains(el)) return;
      if (staggerProcessed.has(el))  return;
      if (el.dataset.animation === 'stagger') return;

      const type   = el.dataset.animation;
      const config = ANIM_MAP[type];
      if (!config) return;

      const delay    = parseFloat(el.dataset.delay)    || 0;
      const duration = parseFloat(el.dataset.duration) || 0.6;

      if (type === 'skill-bar') {
        gsap.to(el, {
          width:    el.dataset.width + '%',
          duration,
          ease:     'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          delay,
          onStart: () => el.classList.add('animated')
        });
        return;
      }

      gsap.fromTo(el, config.from, {
        ...config.to,
        duration,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        delay
      });
    });

    /* Footer fade-in */
    const footer = $$('#footer');
    if (footer && footer.dataset.animation) {
      const delay    = parseFloat(footer.dataset.delay)    || 0;
      const duration = parseFloat(footer.dataset.duration) || 0.6;
      const config   = ANIM_MAP[footer.dataset.animation];
      if (config) {
        gsap.fromTo(footer, config.from, {
          ...config.to,
          duration,
          scrollTrigger: { trigger: footer, start: 'top 95%', once: true },
          delay
        });
      }
    }
  }

  /** Immediately show all animated elements (reduced-motion path). */
  function resetAllDataAnimations() {
    dom.allAnimated.forEach(el => {
      if (el.dataset.animation === 'skill-bar') el.style.width = el.dataset.width + '%';
      el.style.opacity   = '1';
      el.style.transform = 'none';
      el.style.clipPath  = 'none';
      el.style.scale     = 'none';
    });
    const footer = $$('#footer');
    if (footer) { footer.style.opacity = '1'; footer.style.transform = 'none'; }
  }

  /* ═══════════════════════════════════════════════
     VANILLA TILT
     ═══════════════════════════════════════════════ */
  function initVanillaTilt() {
    if (typeof VanillaTilt === 'undefined') return;
    if (!hasFinePointer() || prefersReducedMotion()) return;

    dom.tiltElements.forEach(el => {
      VanillaTilt.init(el, {
        max:         parseFloat(el.dataset.tiltMax) || 3,
        speed:       400,
        glare:       false,
        scale:       1.02,
        perspective: 1000,
        transition:  true,
        easing:      'cubic-bezier(0.16, 1, 0.3, 1)'
      });
    });
  }

  /* ═══════════════════════════════════════════════
     MAGNETIC BUTTONS
     ═══════════════════════════════════════════════ */
  function initMagneticButtons() {
    if (typeof gsap === 'undefined') return;
    if (!hasFinePointer() || prefersReducedMotion()) return;

    dom.magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x    = e.clientX - rect.left  - rect.width  / 2;
        const y    = e.clientY - rect.top   - rect.height / 2;
        gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.35, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ═══════════════════════════════════════════════
     PARALLAX (data-parallax elements)
     ═══════════════════════════════════════════════ */
  function initParallax() {
    if (typeof gsap === 'undefined') return;
    if (!hasFinePointer() || prefersReducedMotion()) return;
    if (!dom.parallaxEls.length) return;

    let mx = 0, my = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX - window.innerWidth  / 2;
      my = e.clientY - window.innerHeight / 2;
    }, { passive: true });

    function update() {
      dom.parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0.03;
        gsap.set(el, { x: mx * speed, y: my * speed });
      });
      requestAnimationFrame(update);
    }
    update();
  }

  /* ═══════════════════════════════════════════════
     FLOATING DECORATIVE ELEMENTS (DOM dots)
     ═══════════════════════════════════════════════ */
  function initFloatingElements() {
    if (typeof gsap === 'undefined') return;
    if (!dom.floatingContainer || prefersReducedMotion()) return;

    const COUNT = 6;
    for (let i = 0; i < COUNT; i++) {
      const el   = document.createElement('div');
      const size = 4 + Math.random() * 8;
      const color = Math.random() > 0.5 ? 'var(--accent)' : 'var(--accent-2)';
      el.style.cssText =
        'position:absolute;' +
        'width:'          + size    + 'px;' +
        'height:'         + size    + 'px;' +
        'border-radius:50%;' +
        'background:'     + color   + ';' +
        'opacity:'        + (0.06 + Math.random() * 0.1) + ';' +
        'left:'           + (Math.random() * 100) + '%;' +
        'top:'            + (Math.random() * 100) + '%;' +
        'pointer-events:none;';
      dom.floatingContainer.appendChild(el);
      gsap.to(el, {
        y:        -30 - Math.random() * 60,
        x:        (Math.random() - 0.5) * 50,
        duration: 3 + Math.random() * 4,
        repeat:   -1,
        yoyo:     true,
        ease:     'sine.inOut',
        delay:    Math.random() * 2
      });
    }
  }

  /* ═══════════════════════════════════════════════
     SOCIAL HOVER EFFECTS
     ═══════════════════════════════════════════════ */
  function initSocialHoverEffects() {
    if (!hasFinePointer()) return;

    dom.socialLinks.forEach(link => {
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        link.style.setProperty('--social-x', ((e.clientX - rect.left) / rect.width  * 100) + '%');
        link.style.setProperty('--social-y', ((e.clientY - rect.top)  / rect.height * 100) + '%');
      });
    });
  }

  /* ═══════════════════════════════════════════════
     SCROLL REVEAL (IntersectionObserver fallback)
     ═══════════════════════════════════════════════ */
  function initReveal() {
    if (!dom.revealEls.length) return;

    if (prefersReducedMotion()) {
      dom.revealEls.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    dom.revealEls.forEach(el => observer.observe(el));
  }

  /* ═══════════════════════════════════════════════
     SKILL BAR ANIMATION (IntersectionObserver fallback)
     Only applies to bars NOT managed by ScrollTrigger.
     ═══════════════════════════════════════════════ */
  function initSkillBars() {
    const bars = dom.skillBars.filter(bar => !bar.dataset.animation);
    if (!bars.length) return;

    if (prefersReducedMotion()) {
      bars.forEach(bar => { bar.style.width = (bar.dataset.width || 0) + '%'; });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.width = (entry.target.dataset.width || 0) + '%';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    bars.forEach(bar => observer.observe(bar));
  }

  /* ═══════════════════════════════════════════════
     3D TILT CARD (Legacy)
     ═══════════════════════════════════════════════ */
  function initTiltCard() {
    const card = $$('#card3d') || $$('.about-card-3d');
    if (!card) return;
    if (!hasFinePointer() || prefersReducedMotion()) return;

    const MAX_ROTATION = 10;

    function onMove(e) {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const normX = clamp((e.clientX - cx) / (rect.width  / 2), -1, 1);
      const normY = clamp((e.clientY - cy) / (rect.height / 2), -1, 1);
      card.style.transform =
        'perspective(800px) ' +
        'rotateX(' + (-normY * MAX_ROTATION).toFixed(2) + 'deg) ' +
        'rotateY(' + ( normX * MAX_ROTATION).toFixed(2) + 'deg) ' +
        'translateZ(8px)';
    }

    function onLeave() {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    }

    card.addEventListener('mousemove',  onMove,   { passive: true });
    card.addEventListener('mouseleave', onLeave);
  }

  /* ═══════════════════════════════════════════════
     ANIMATED COUNTERS
     ═══════════════════════════════════════════════ */
  function initCounters() {
    if (!dom.counterEls.length) return;

    /**
     * Animate a single counter element from 0 to its data-target value.
     * Uses easeOutCubic for a natural deceleration.
     */
    function animateCounter(el) {
      const target   = parseInt(el.dataset.target, 10) || 0;
      const suffix   = el.id === 'c1' ? '+' : '';
      const duration = prefersReducedMotion() ? 0 : 1500;

      if (duration === 0) {
        el.textContent = target.toLocaleString() + suffix;
        return;
      }

      const startTime = performance.now();
      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); /* easeOutCubic */
        el.textContent = Math.round(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    dom.counterEls.forEach(el => observer.observe(el));
  }

  /* ═══════════════════════════════════════════════
     COPY TO CLIPBOARD
     ═══════════════════════════════════════════════ */
  function initCopyToClipboard() {
    if (!dom.copyBtns.length) return;

    const RESET_DELAY = 2000;

    async function copyText(btn, text) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          /* Fallback for older browsers */
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }

        const original = btn.textContent;
        btn.textContent = '\u2713 Copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, RESET_DELAY);
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    }

    /* Single delegated listener — more efficient than per-button listeners */
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-copy]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const text = btn.dataset.copy;
      if (text) copyText(btn, text);
    });

    /* Legacy inline-handler compatibility */
    window.copyToClipboard = function (e, text) {
      copyText(e.currentTarget || e.target, text);
    };
  }

  /* ═══════════════════════════════════════════════
     SCROLL INDICATOR
     ═══════════════════════════════════════════════ */
  function initScrollIndicator() {
    const hint = $$('.scroll-hint');
    if (!hint) return;

    window.addEventListener('scroll', throttle(() => {
      const past = getScrollY() > 150;
      hint.style.opacity       = past ? '0' : '';
      hint.style.pointerEvents = past ? 'none' : '';
    }, 60), { passive: true });
  }

  /* ═══════════════════════════════════════════════
     LAZY RESIZE HANDLER
     ═══════════════════════════════════════════════ */
  function initResizeHandler() {
    window.addEventListener('resize', debounce(() => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 300));
  }

  /* ═══════════════════════════════════════════════════════════════
     PHASE 15 — CSS FALLBACK SCENE
     Activated when WebGL / Three.js is unavailable.
     Ensures the hero always looks premium.
     ═══════════════════════════════════════════════════════════════ */
  function initCSSFallbackScene() {
    if (!dom.hero || prefersReducedMotion()) return;
    if (typeof gsap === 'undefined') return;

    /* Animate CSS floating-object elements defined in the stylesheet */
    const objs = dom.floatingObjects;
    if (objs.length) {
      objs.forEach((obj, i) => {
        gsap.to(obj, {
          y:        '-=20',
          x:        i % 2 === 0 ? '+=8' : '-=8',
          duration: 5 + i * 1.5,
          repeat:   -1,
          yoyo:     true,
          ease:     'sine.inOut',
          delay:    i * 0.6
        });
      });
    }

    /* Mouse parallax for hero layers (CSS fallback path) */
    if (!hasFinePointer()) return;

    const { bg, mid } = dom.heroLayers;
    let mx = 0, my = 0;

    document.addEventListener('mousemove', (e) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    let rafId = null;
    let curX  = 0, curY = 0;

    function updateLayers() {
      curX = lerp(curX, mx, 0.05);
      curY = lerp(curY, my, 0.05);

      if (bg)  gsap.set(bg,  { x: curX * -12, y: curY * -8 });
      if (mid) gsap.set(mid, { x: curX * -6,  y: curY * -4 });

      /* Drive light radials toward mouse */
      dom.lightRadials.forEach((lr, i) => {
        const factor = i % 2 === 0 ? 1 : -1;
        gsap.set(lr, { x: curX * 20 * factor, y: curY * 15 * factor });
      });

      rafId = requestAnimationFrame(updateLayers);
    }

    rafId = requestAnimationFrame(updateLayers);

    /* Pause RAF when hero is scrolled out of view */
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger:     dom.hero,
        start:       'top top',
        end:         'bottom top',
        onLeave:     () => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } },
        onEnterBack: () => { if (!rafId) rafId = requestAnimationFrame(updateLayers); }
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     PHASE 15 — CSS HERO LAYER MOUSE PARALLAX
     Drives .hero-layer-bg / .hero-layer-mid with mouse on desktop.
     Only runs when Three.js is NOT active (avoids double-work).
     ═══════════════════════════════════════════════════════════════ */
  function initHeroLayerParallax() {
    if (window._threeJSActive) return;  /* Three.js handles camera motion */
    if (!hasFinePointer() || prefersReducedMotion()) return;
    if (typeof gsap === 'undefined') return;

    const { bg, mid, fg } = dom.heroLayers;
    if (!bg && !mid) return;

    let mx = 0, my = 0;
    let cx = 0, cy = 0;
    let rafId = null;

    document.addEventListener('mousemove', (e) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function update() {
      cx = lerp(cx, mx, 0.05);
      cy = lerp(cy, my, 0.05);

      if (bg)  gsap.set(bg,  { x: cx * -14, y: cy * -10 });
      if (mid) gsap.set(mid, { x: cx *  -7, y: cy *  -5 });
      if (fg)  gsap.set(fg,  { x: cx *  -2, y: cy *  -1 });

      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger:     dom.hero,
        start:       'top top',
        end:         'bottom top',
        onLeave:     () => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } },
        onEnterBack: () => { if (!rafId) rafId = requestAnimationFrame(update); }
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     PHASE 15 — HERO GLASS PANEL MOUSE TILT
     Gives hero-glass-panel elements subtle 3D parallax tilt.
     ═══════════════════════════════════════════════════════════════ */
  function initHeroGlassPanelTilt() {
    if (!dom.heroGlassPanels.length) return;
    if (!hasFinePointer() || prefersReducedMotion()) return;
    if (typeof gsap === 'undefined') return;

    dom.heroGlassPanels.forEach(panel => {
      panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const x    = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
        const y    = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
        gsap.to(panel, {
          rotateX:             -y * 4,
          rotateY:              x * 4,
          translateZ:           10,
          duration:             0.4,
          ease:                 'power2.out',
          transformPerspective: 800
        });
      });
      panel.addEventListener('mouseleave', () => {
        gsap.to(panel, {
          rotateX:             0,
          rotateY:             0,
          translateZ:          0,
          duration:            0.6,
          ease:                'elastic.out(1, 0.5)',
          transformPerspective: 800
        });
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     PHASE 15 — SECTION DEPTH PARALLAX
     Drives depth-scroll-bg/mid layers and section-bg-overlays
     via ScrollTrigger scrub for a scroll-depth illusion.
     ═══════════════════════════════════════════════════════════════ */
  function initSectionDepthParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (prefersReducedMotion()) return;

    dom.sectionDepths.forEach(section => {
      const overlayTop    = section.querySelector('.section-bg-overlay--top');
      const overlayBottom = section.querySelector('.section-bg-overlay--bottom');
      const bgLayer       = section.querySelector('.depth-scroll-bg');
      const midLayer      = section.querySelector('.depth-scroll-mid');

      if (bgLayer) {
        gsap.to(bgLayer, {
          yPercent:      -15,
          ease:          'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
        });
      }

      if (midLayer) {
        gsap.to(midLayer, {
          yPercent:      -8,
          ease:          'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        });
      }

      /* Fade overlays when section enters view */
      if (overlayTop || overlayBottom) {
        ScrollTrigger.create({
          trigger:      section,
          start:        'top 90%',
          onEnter:      () => { section.classList.add('in-view'); },
          onLeaveBack:  () => { section.classList.remove('in-view'); }
        });
      }
    });

    /* Light radials — subtle scroll-driven vertical drift */
    dom.lightRadials.forEach((lr, i) => {
      const dir = i % 2 === 0 ? -1 : 1;
      gsap.to(lr, {
        y:             dir * 60,
        ease:          'none',
        scrollTrigger: {
          trigger: lr.closest('section') || document.body,
          start:   'top bottom',
          end:     'bottom top',
          scrub:   1.5
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     PHASE 15 — TOUCH / GYRO PARALLAX (Mobile)
     Replaces mouse parallax on touch devices using DeviceOrientation.
     ═══════════════════════════════════════════════════════════════ */
  function initGyroParallax() {
    if (hasFinePointer()) return;           /* desktop uses mouse parallax */
    if (prefersReducedMotion()) return;
    if (!dom.hero) return;
    if (!window.DeviceOrientationEvent) return;

    const { bg, mid } = dom.heroLayers;
    if (!bg && !mid) return;

    let gammaRef = null, betaRef = null;

    function onOrientation(e) {
      if (gammaRef === null) { gammaRef = e.gamma || 0; betaRef = e.beta || 0; }
      const dx = clamp((e.gamma - gammaRef) / 30, -1, 1);
      const dy = clamp((e.beta  - betaRef)  / 30, -1, 1);

      if (bg) {
        bg.style.transform  =
          'translateZ(-120px) scale(1.15) translate(' + (dx * -8) + 'px,' + (dy * -6) + 'px)';
      }
      if (mid) {
        mid.style.transform =
          'translateZ(-40px) scale(1.06) translate('  + (dx * -4) + 'px,' + (dy * -3) + 'px)';
      }
    }

    window.addEventListener('deviceorientation', onOrientation, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════════
     THREE.JS — DEVICE TIER DETECTION
     ═══════════════════════════════════════════════════════════════ */
  function getDeviceTier() {
    const w = window.innerWidth;
    if (w < 768)  return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  }

  /** Returns true when the browser supports WebGL rendering. */
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     THREE.JS — HERO 3D SCENE
     Premium WebGL background for the hero section.
     Renders into #three-bg; also activates .hero-canvas-layer
     if present in the DOM (CSS hook from Phase 14).
     ═══════════════════════════════════════════════════════════════ */
  function initThreeHeroScene() {
    if (typeof THREE === 'undefined') return null;
    if (!isWebGLAvailable())          return null;
    if (!dom.hero || !dom.threeBg)    return null;
    if (prefersReducedMotion())        return null;

    const tier      = getDeviceTier();
    const container = dom.threeBg;
    const heroEl    = dom.hero;

    /* ── Renderer ── */
    const pixelRatio = Math.min(window.devicePixelRatio, tier === 'mobile' ? 1.5 : 2);
    const renderer   = new THREE.WebGLRenderer({
      antialias:       tier !== 'mobile',
      alpha:           true,
      powerPreference: tier === 'mobile' ? 'low-power' : 'high-performance',
      stencil:         false,
      depth:           true
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace    = THREE.SRGBColorSpace;
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    /* Signal CSS hook without moving the canvas element */
    if (dom.heroCanvasLayer && !dom.heroCanvasLayer.contains(renderer.domElement)) {
      dom.heroCanvasLayer.setAttribute('data-three-active', 'true');
    }

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06060b, tier === 'mobile' ? 0.08 : 0.04);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, tier === 'mobile' ? 8 : 6);

    /* ── Lights ── */
    const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x6b8aff, 0.4);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const pointLight1 = new THREE.PointLight(0x6b8aff, 1.5, 15, 2);
    pointLight1.position.set(-3, 2, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa47cff, 1.2, 12, 2);
    pointLight2.position.set(4, -1, 2);
    scene.add(pointLight2);

    let pointLight3 = null;
    if (tier === 'desktop') {
      pointLight3 = new THREE.PointLight(0x4fd1c5, 0.6, 10, 2);
      pointLight3.position.set(0, 3, -2);
      scene.add(pointLight3);
    }

    /* ── Shared Materials ── */
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x6b8aff, metalness: 0.0, roughness: 0.05,
      transmission: 0.92, thickness: 0.5, ior: 1.45,
      transparent: true, opacity: 0.35, envMapIntensity: 0.3,
      clearcoat: 1.0, clearcoatRoughness: 0.1,
      side: THREE.DoubleSide, depthWrite: false
    });

    const glassMaterial2 = new THREE.MeshPhysicalMaterial({
      color: 0xa47cff, metalness: 0.0, roughness: 0.05,
      transmission: 0.9, thickness: 0.4, ior: 1.4,
      transparent: true, opacity: 0.3, envMapIntensity: 0.25,
      clearcoat: 1.0, clearcoatRoughness: 0.1,
      side: THREE.DoubleSide, depthWrite: false
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x6b8aff, wireframe: true,
      transparent: true, opacity: 0.08, depthWrite: false
    });

    const wireframeMaterial2 = new THREE.MeshBasicMaterial({
      color: 0xa47cff, wireframe: true,
      transparent: true, opacity: 0.06, depthWrite: false
    });

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x6b8aff, transparent: true, opacity: 0.12,
      side: THREE.DoubleSide, depthWrite: false
    });

    const ringMaterial2 = new THREE.MeshBasicMaterial({
      color: 0xa47cff, transparent: true, opacity: 0.10,
      side: THREE.DoubleSide, depthWrite: false
    });

    /* ── Shared Geometries ── */
    const sphereGeo      = new THREE.SphereGeometry(1, 32, 32);
    const smallSphereGeo = new THREE.SphereGeometry(0.5, 24, 24);
    const icoGeo         = new THREE.IcosahedronGeometry(1, 1);
    const octGeo         = new THREE.OctahedronGeometry(1, 0);
    const torusGeo       = new THREE.TorusGeometry(1, 0.02, 16, 100);
    const torusGeoThick  = new THREE.TorusGeometry(1, 0.04, 16, 80);
    const planeGeo       = new THREE.PlaneGeometry(6, 6);

    /* ── Object Config by Device Tier ── */
    const tierCfg = {
      desktop: { spheres: 3, wireframes: 2, rings: 3, particles: 120 },
      tablet:  { spheres: 2, wireframes: 1, rings: 2, particles: 60  },
      mobile:  { spheres: 1, wireframes: 1, rings: 1, particles: 30  }
    };
    const cfg     = tierCfg[tier];
    const objects = [];

    /* ── Glass Spheres ── */
    const spherePositions = [
      { x:  3.5, y:  1.2, z: -1,   s: 0.6, mat: glassMaterial,  geo: sphereGeo      },
      { x: -2.8, y: -0.8, z:  0.5, s: 0.4, mat: glassMaterial2, geo: smallSphereGeo },
      { x:  4.2, y: -1.5, z: -2,   s: 0.3, mat: glassMaterial,  geo: smallSphereGeo }
    ];
    for (let i = 0; i < cfg.spheres; i++) {
      const sp   = spherePositions[i];
      const mesh = new THREE.Mesh(sp.geo, sp.mat);
      mesh.position.set(sp.x, sp.y, sp.z);
      mesh.scale.setScalar(sp.s);
      mesh.userData = {
        type:       'sphere',
        basePos:    { x: sp.x, y: sp.y, z: sp.z },
        floatSpeed: 0.3 + Math.random() * 0.4,
        floatAmp:   0.15 + Math.random() * 0.2,
        rotSpeed:   { x: 0.002 + Math.random() * 0.003, y: 0.003 + Math.random() * 0.004 },
        phase:      Math.random() * Math.PI * 2
      };
      scene.add(mesh);
      objects.push(mesh);
    }

    /* ── Wireframe Shapes ── */
    const wireframeConfigs = [
      { x: -3.5, y:  2,   z: -3,   s: 0.7, mat: wireframeMaterial,  geo: icoGeo },
      { x:  2,   y: -2.5, z: -2.5, s: 0.5, mat: wireframeMaterial2, geo: octGeo }
    ];
    for (let i = 0; i < cfg.wireframes; i++) {
      const wc   = wireframeConfigs[i];
      const mesh = new THREE.Mesh(wc.geo, wc.mat);
      mesh.position.set(wc.x, wc.y, wc.z);
      mesh.scale.setScalar(wc.s);
      mesh.userData = {
        type:       'wireframe',
        basePos:    { x: wc.x, y: wc.y, z: wc.z },
        floatSpeed: 0.2 + Math.random() * 0.3,
        floatAmp:   0.1 + Math.random() * 0.15,
        rotSpeed:   { x: 0.004 + Math.random() * 0.003, y: 0.005 + Math.random() * 0.004, z: 0.001 + Math.random() * 0.002 },
        phase:      Math.random() * Math.PI * 2
      };
      scene.add(mesh);
      objects.push(mesh);
    }

    /* ── Floating Rings ── */
    const ringConfigs = [
      { x:  0.5, y:  2.5, z: -2,   s: 0.8, mat: ringMaterial,  geo: torusGeo,      rotX: 0.8,  rotZ:  0.3  },
      { x: -1.5, y: -2,   z: -1.5, s: 0.6, mat: ringMaterial2, geo: torusGeoThick, rotX: 1.2,  rotZ: -0.5  },
      { x:  3,   y:  0.5, z: -3,   s: 0.5, mat: ringMaterial,  geo: torusGeo,      rotX: 0.4,  rotZ:  0.8  }
    ];
    for (let i = 0; i < cfg.rings; i++) {
      const rc   = ringConfigs[i];
      const mesh = new THREE.Mesh(rc.geo, rc.mat);
      mesh.position.set(rc.x, rc.y, rc.z);
      mesh.scale.setScalar(rc.s);
      mesh.rotation.x = rc.rotX;
      mesh.rotation.z = rc.rotZ;
      mesh.userData = {
        type:       'ring',
        basePos:    { x: rc.x, y: rc.y, z: rc.z },
        floatSpeed: 0.25 + Math.random() * 0.25,
        floatAmp:   0.12 + Math.random() * 0.1,
        rotSpeed:   { x: 0.003 + Math.random() * 0.002, y: 0.006 + Math.random() * 0.004, z: 0.001 },
        phase:      Math.random() * Math.PI * 2
      };
      scene.add(mesh);
      objects.push(mesh);
    }

    /* ── Gradient Background Plane ── */
    const gradientCanvas  = document.createElement('canvas');
    gradientCanvas.width  = 256;
    gradientCanvas.height = 256;
    const gCtx     = gradientCanvas.getContext('2d');
    const gradient = gCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0,   'rgba(107,138,255,0.12)');
    gradient.addColorStop(0.4, 'rgba(164,124,255,0.06)');
    gradient.addColorStop(1,   'rgba(0,0,0,0)');
    gCtx.fillStyle = gradient;
    gCtx.fillRect(0, 0, 256, 256);

    const gradientTexture       = new THREE.CanvasTexture(gradientCanvas);
    gradientTexture.needsUpdate = true;

    const gradientPlaneMat = new THREE.MeshBasicMaterial({
      map:         gradientTexture,
      transparent: true,
      opacity:     0.6,
      depthWrite:  false,
      side:        THREE.DoubleSide,
      blending:    THREE.AdditiveBlending
    });

    const gradientPlane = new THREE.Mesh(planeGeo, gradientPlaneMat);
    gradientPlane.position.set(0.5, 0, -5);
    gradientPlane.scale.setScalar(3);
    gradientPlane.userData = {
      type:       'gradient',
      basePos:    { x: 0.5, y: 0, z: -5 },
      floatSpeed: 0.15,
      floatAmp:   0.08,
      rotSpeed:   { x: 0, y: 0, z: 0 },
      phase:      0
    };
    scene.add(gradientPlane);
    objects.push(gradientPlane);

    /* ── Particle Field ── */
    const particleCount     = cfg.particles;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes     = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3]     = (Math.random() - 0.5) * 16;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 8 - 2;
      particleSizes[i]          = Math.random() * 3 + 1;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('size',     new THREE.BufferAttribute(particleSizes, 1));

    /* Custom GLSL — soft round particles with distance-based alpha fade */
    const particleVertexShader = [
      'attribute float size;',
      'varying float vAlpha;',
      'void main() {',
      '  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
      '  gl_PointSize = size * (200.0 / -mvPosition.z);',
      '  gl_PointSize = max(gl_PointSize, 1.0);',
      '  gl_Position = projectionMatrix * mvPosition;',
      '  float dist = length(position.xy);',
      '  vAlpha = smoothstep(8.0, 2.0, dist) * 0.4;',
      '}'
    ].join('\n');

    const particleFragmentShader = [
      'varying float vAlpha;',
      'void main() {',
      '  float d = length(gl_PointCoord - vec2(0.5));',
      '  if (d > 0.5) discard;',
      '  float alpha = smoothstep(0.5, 0.1, d) * vAlpha;',
      '  gl_FragColor = vec4(0.42, 0.54, 1.0, alpha);',
      '}'
    ].join('\n');

    const particleMat = new THREE.ShaderMaterial({
      vertexShader:   particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent:    true,
      depthWrite:     false,
      blending:       THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystem.userData = { type: 'particles' };
    scene.add(particleSystem);

    /* ── Frustum Culling Helper ── */
    const frustum      = new THREE.Frustum();
    const cameraMatrix = new THREE.Matrix4();

    /* ── Mouse / Touch Tracking ── */
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    function onMouseMove(e) {
      mouse.targetX =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    document.addEventListener('mousemove', onMouseMove, { passive: true });

    function onTouchMove(e) {
      if (!e.touches.length) return;
      mouse.targetX =  (e.touches[0].clientX / window.innerWidth)  * 2 - 1;
      mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    /* ── Scroll State ── */
    let scrollProgress = 0;
    let heroHeight     = heroEl.offsetHeight;

    /* ── GSAP ScrollTrigger — camera depth on scroll ── */
    let scrollTl = null;
    if (typeof ScrollTrigger !== 'undefined') {
      scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start:   'top top',
          end:     '+=100%',
          scrub:   1.5
        }
      });
      scrollTl.to(camera.position, { z: 11, ease: 'none' }, 0);
      scrollTl.to(container,       { opacity: 0, ease: 'none' }, 0);
    }

    /* ── Scene visibility via ScrollTrigger ── */
    let heroVisible          = true;
    let scrollTriggerInstance = null;

    if (typeof ScrollTrigger !== 'undefined') {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger:     heroEl,
        start:       'top top',
        end:         'bottom top',
        onEnter:     () => { heroVisible = true;  },
        onLeave:     () => { heroVisible = false; },
        onEnterBack: () => { heroVisible = true;  },
        onLeaveBack: () => { heroVisible = false; }
      });
    }

    /* ── Clock ── */
    const clock = new THREE.Clock();
    let rafId   = null;

    /* ── Animation Loop ── */
    function animate() {
      rafId = requestAnimationFrame(animate);

      /* Skip expensive work when hero is offscreen */
      if (!heroVisible) {
        renderer.render(scene, camera);
        return;
      }

      const elapsed = clock.getElapsedTime();

      /* Smooth mouse lerp */
      mouse.x = lerp(mouse.x, mouse.targetX, 0.04);
      mouse.y = lerp(mouse.y, mouse.targetY, 0.04);

      /* Scroll progress (manual fallback when no GSAP ScrollTrigger) */
      scrollProgress = clamp(window.scrollY / heroHeight, 0, 1);

      /* Camera mouse parallax */
      camera.position.x = lerp(camera.position.x, mouse.x * 0.6, 0.03);
      camera.position.y = lerp(camera.position.y, mouse.y * 0.4, 0.03);

      /* Subtle camera look-at mouse */
      camera.rotation.y = lerp(camera.rotation.y, -mouse.x * 0.05, 0.03);
      camera.rotation.x = lerp(camera.rotation.x,  mouse.y * 0.03, 0.03);

      camera.lookAt(0, 0, 0);

      /* Update frustum for per-object culling */
      cameraMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      frustum.setFromProjectionMatrix(cameraMatrix);

      /* Animate each scene object */
      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const ud  = obj.userData;

        /* Skip if outside frustum (cheap culling) */
        if (ud.type !== 'gradient' && ud.type !== 'particles') {
          if (!frustum.intersectsObject(obj)) continue;
        }

        /* Floating motion */
        if (ud.type !== 'gradient') {
          obj.position.y = ud.basePos.y + Math.sin(elapsed * ud.floatSpeed + ud.phase) * ud.floatAmp;
          obj.position.x = ud.basePos.x + Math.cos(elapsed * ud.floatSpeed * 0.7 + ud.phase) * ud.floatAmp * 0.5;
        } else {
          obj.position.y = ud.basePos.y + Math.sin(elapsed * ud.floatSpeed) * ud.floatAmp;
        }

        /* Rotation */
        obj.rotation.x += ud.rotSpeed.x;
        obj.rotation.y += ud.rotSpeed.y;
        if (ud.rotSpeed.z) obj.rotation.z += ud.rotSpeed.z;

        /* Mouse parallax per object, depth-weighted */
        const pFactor = (ud.basePos.z + 3) * 0.15;
        obj.position.x += mouse.x * pFactor * 0.1;
        obj.position.y += mouse.y * pFactor * 0.08;

        /* Scroll depth — objects drift back */
        obj.position.z = ud.basePos.z - scrollProgress * 3;

        /* Opacity fade as user scrolls past hero */
        if (obj.material && obj.material.opacity !== undefined) {
          const baseOpacity = ud.type === 'sphere'
            ? (obj.material === glassMaterial ? 0.35 : 0.3)
            : ud.type === 'wireframe'
              ? (obj.material === wireframeMaterial ? 0.08 : 0.06)
              : ud.type === 'ring'
                ? (obj.material === ringMaterial ? 0.12 : 0.1)
                : 0.6;
          obj.material.opacity = baseOpacity * (1 - scrollProgress * 1.2);
        }
      }

      /* Particle field rotation */
      particleSystem.rotation.y = elapsed * 0.02;
      particleSystem.rotation.x = Math.sin(elapsed * 0.01) * 0.1;
      particleMat.opacity        = clamp(1 - scrollProgress * 1.5, 0, 1);

      /* Animate point lights */
      pointLight1.position.x = -3 + Math.sin(elapsed * 0.3) * 1.5;
      pointLight1.position.y =  2 + Math.cos(elapsed * 0.25) * 1;
      pointLight2.position.x =  4 + Math.cos(elapsed * 0.35) * 1.2;
      pointLight2.position.y = -1 + Math.sin(elapsed * 0.2) * 0.8;

      if (pointLight3) {
        pointLight3.position.x = Math.sin(elapsed * 0.2) * 2;
        pointLight3.position.y = 3 + Math.cos(elapsed * 0.15) * 0.5;
      }

      pointLight1.intensity = 1.5 + Math.sin(elapsed * 0.5) * 0.3;
      pointLight2.intensity = 1.2 + Math.cos(elapsed * 0.4) * 0.2;

      renderer.render(scene, camera);
    }

    /* ── Visibility API: pause render loop when tab is hidden ── */
    function onVisibilityChange() {
      if (document.hidden) clock.stop();
      else                  clock.start();
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    /* ── Resize ── */
    function onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      heroHeight = heroEl.offsetHeight;
    }
    window.addEventListener('resize', debounce(onResize, 200));

    /* ── Activate ── */
    container.classList.add('active');
    window._threeJSActive = true;

    /* ── Start loop ── */
    animate();

    /* ── Dispose / Cleanup ── */
    return function dispose() {
      if (rafId) cancelAnimationFrame(rafId);

      document.removeEventListener('mousemove',        onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('touchmove',          onTouchMove);
      window.removeEventListener('resize',             onResize);

      if (scrollTriggerInstance) scrollTriggerInstance.kill();
      if (scrollTl && scrollTl.scrollTrigger) scrollTl.scrollTrigger.kill();

      /* Dispose geometries */
      [sphereGeo, smallSphereGeo, icoGeo, octGeo,
       torusGeo, torusGeoThick, planeGeo, particleGeo].forEach(g => g.dispose());

      /* Dispose materials */
      [glassMaterial, glassMaterial2, wireframeMaterial, wireframeMaterial2,
       ringMaterial, ringMaterial2, gradientPlaneMat, particleMat].forEach(m => m.dispose());

      /* Dispose textures */
      gradientTexture.dispose();

      /* Dispose renderer and remove canvas */
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      objects.length        = 0;
      window._threeJSActive = false;
      container.classList.remove('active');
    };
  }

  /* ═══════════════════════════════════════════════
     THREE.JS ENTRY POINT
     ═══════════════════════════════════════════════ */
  function initThreeJS() {
    let disposeFn = null;
    try {
      disposeFn = initThreeHeroScene();
    } catch (err) {
      console.warn('Three.js scene could not be initialized:', err);
      window._threeJSActive = false;
    }
    window._disposeThreeJS = disposeFn;
  }

  /* ═══════════════════════════════════════════════
     INIT — Boot sequence
     Order matters: Three.js → flag set → particles check
     ═══════════════════════════════════════════════ */
  function init() {
    cacheDom();
    registerGSAPPlugins();

    /* Three.js first — sets window._threeJSActive flag */
    initThreeJS();

    /* CSS fallback and layer parallax depend on the Three.js flag */
    if (!window._threeJSActive) {
      initCSSFallbackScene();
    }
    initHeroLayerParallax();

    initLenis();
    initLoader();
    initCursor();
    initParticles();              /* removes itself when Three.js is active */
    initNavigation();
    initHeroAnimation();
    initScrollTriggerAnimations();
    initVanillaTilt();
    initTiltCard();
    initMagneticButtons();
    initParallax();
    initFloatingElements();
    initSocialHoverEffects();
    initReveal();
    initSkillBars();
    initCounters();
    initCopyToClipboard();
    initScrollIndicator();
    initResizeHandler();

    /* Phase 15 — 3D & depth modules */
    initHeroGlassPanelTilt();
    initSectionDepthParallax();
    initGyroParallax();
  }

  /* Boot on DOMContentLoaded or immediately if DOM is already ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
