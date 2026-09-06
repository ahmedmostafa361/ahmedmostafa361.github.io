/* FITZONE GYM — IronPulse implementation.
   Behaviour ported from the design source; no framework required. */
(function () {
  'use strict';

  function DCLogic(props) { this.props = props || {}; }
  DCLogic.prototype.setState = function () {};
  DCLogic.prototype.forceUpdate = function () {};

  class Component extends DCLogic {
  get p() { return this.props || {}; }
  renderVals() {
    return { atm: this.p.atmosphere ?? 0.6, yes: true, no: false };
  }
  componentDidMount() { this.boot(); }
  componentDidUpdate() { this.apply(); }
  componentWillUnmount() { this.kill(); }

  kill() {
    (this._off || []).forEach(f => { try { f(); } catch (e) {} });
    (this._ios || []).forEach(o => { try { o.disconnect(); } catch (e) {} });
    this._off = []; this._ios = [];
  }
  on(t, ev, fn, opt) { t.addEventListener(ev, ev === 'scroll' || ev === 'pointermove' ? fn : fn, opt); this._off.push(() => t.removeEventListener(ev, fn, opt)); }
  io(fn, opt) { const o = new IntersectionObserver(fn, opt); this._ios.push(o); return o; }
  qa(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  boot() {
    if (window.__ipKill) { try { window.__ipKill(); } catch (e) {} }
    this._off = []; this._ios = [];
    window.__ipKill = () => this.kill();
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.navH = 76; this._hx = 0; this._hy = 0;
    try { this.apply(); } catch (err) { console.error('[FitZone] apply', err); }
    const steps = ['initMedia', 'initScroll', 'initMenu', 'initAnchors', 'initSpy', 'initFaq', 'initCompare', 'initMarquee', 'initReveal', 'initCounters', 'initForms', 'initFloats', 'initHero', 'initFilm', 'initRail', 'initKeys', 'initPanels'];
    steps.forEach(name => { try { this[name](); } catch (err) { console.error('[FitZone] ' + name, err); } });
  }

  apply() {
    this.motion = !(this.p.sceneMotion === false || this.reduce);
    const v = document.getElementById('hero-film');
    if (!v) return;
    v.muted = true; v.loop = true; v.playsInline = true;

    // The film is 16MB. Only phones-up-from-tablet, unmetered, motion-allowed
    // sessions pay for it; everyone else keeps the treated poster still, which
    // carries the same grade — so the fallback is not a downgrade.
    const conn = navigator.connection || {};
    const wanted = this.p.filmHero !== false
      && !this.reduce
      && window.innerWidth > 760
      && !conn.saveData
      && !/(^|-)2g$/.test(conn.effectiveType || '');

    if (!wanted) {
      try { v.pause(); } catch (e) {}
      v.style.opacity = '0';
      return;
    }
    this.filmGate(v);
  }

  // Photographs the reader meets first come before 16MB of film: the fetch only
  // starts once the hero is actually in view and the priority images have
  // decoded, so the video never competes with the imagery on screen.
  filmGate(v) {
    const go = () => { if (this._heroIn && this._critReady) this.loadFilm(v); };
    this._filmGo = go;
    if (this._filmObs) { go(); return; }
    const hero = document.getElementById('home');
    if (!hero || !('IntersectionObserver' in window)) { this._heroIn = true; go(); return; }
    this._filmObs = this.io(en => { this._heroIn = en[0].isIntersecting; go(); }, { threshold: 0.2 });
    this._filmObs.observe(hero);
  }

  // Media delivery: a photograph fades in over its frame's own ground the moment
  // it decodes, and lazy frames are promoted to eager well before the wipe opens
  // so a section never reveals an empty box.
  initMedia() {
    const clear = img => img.removeAttribute('data-pending');
    this.qa('.ip-media__img, [data-fade-img]').forEach(img => {
      if (img.complete && img.naturalWidth) return;
      img.setAttribute('data-pending', '1');
      this.on(img, 'load', () => clear(img), { once: true });
      this.on(img, 'error', () => clear(img), { once: true });
    });

    const crit = this.qa('img[fetchpriority="high"]');
    let left = crit.filter(i => !(i.complete && i.naturalWidth)).length;
    const ready = () => { this._critReady = true; if (this._filmGo) this._filmGo(); };
    if (!left) ready();
    else {
      crit.forEach(i => {
        if (i.complete && i.naturalWidth) return;
        const off = () => { if (--left <= 0) ready(); };
        this.on(i, 'load', off, { once: true });
        this.on(i, 'error', off, { once: true });
      });
      const id = setTimeout(ready, 2600);
      this._off.push(() => clearTimeout(id));
    }

    /* Promotion is measured off rects, not an IntersectionObserver: a large
       rootMargin is unreliable inside an embedded viewport, and the reveal pass
       already runs on this same throttled frame. */
    this._lazy = this.qa('img[loading="lazy"]');
    this.mediaPass();
    this.tick(() => this.mediaPass());
  }

  mediaPass() {
    const list = this._lazy;
    if (!list || !list.length) return;
    const vh = window.innerHeight || 800;
    const lead = vh + 1400;
    for (let i = list.length - 1; i >= 0; i--) {
      const r = list[i].getBoundingClientRect();
      if (r.top < lead && r.bottom > -vh) {
        list[i].loading = 'eager';
        list.splice(i, 1);
      }
    }
  }

  // The host serves files without Range support, which a <video src> needs, so
  // the film is fetched whole and handed over as an object URL. The graded
  // poster still holds the hero until the first frame is decodable.
  loadFilm(v) {
    if (this._filmState === 'ready') {
      if (v.readyState >= 2) v.style.opacity = '1';
      const r = v.play(); if (r && r.catch) r.catch(() => {});
      return;
    }
    if (this._filmState) return;
    this._filmState = 'loading';

    const start = () => {
      const ac = new AbortController();
      this._off.push(() => ac.abort());
      fetch('assets/video/hero.mp4', { signal: ac.signal, priority: 'low' })
        .then(r => (r.ok ? r.blob() : Promise.reject(new Error('HTTP ' + r.status))))
        .then(blob => {
          if (ac.signal.aborted) return;
          this._filmUrl = URL.createObjectURL(blob);
          this._off.push(() => URL.revokeObjectURL(this._filmUrl));
          this._filmState = 'ready';
          v.src = this._filmUrl;
          v.load();
          const r = v.play(); if (r && r.catch) r.catch(() => {});
        })
        .catch(() => { this._filmState = null; v.style.opacity = '0'; });
    };

    // The film is 16MB and would starve every lazy image of bandwidth, so it
    // waits for the document load event (all in-view images decoded) plus idle.
    const queue = () => {
      if (window.requestIdleCallback) {
        const id = requestIdleCallback(start, { timeout: 1200 });
        this._off.push(() => cancelIdleCallback(id));
      } else {
        const id = setTimeout(start, 400);
        this._off.push(() => clearTimeout(id));
      }
    };
    if (document.readyState === 'complete') queue();
    else this.on(window, 'load', queue, { once: true });
  }

  initScroll() {
    const nav = document.getElementById('navbar');
    const bar = document.getElementById('scroll-progress');
    const top = document.getElementById('back-to-top');
    const cta = document.getElementById('sticky-cta');
    const stack = document.getElementById('float-stack');
    let pending = false;
    const frame = () => {
      pending = false;
      const y = window.scrollY;
      const doc = document.documentElement;
      if (nav) nav.classList.toggle('ip-nav--solid', y > 40);
      if (bar) { const total = doc.scrollHeight - doc.clientHeight; bar.style.width = (total > 0 ? (y / total) * 100 : 0) + '%'; }
      if (top) {
        const on = y > 400;
        top.style.opacity = on ? '1' : '0';
        top.style.transform = on ? 'none' : 'translateY(12px)';
        top.style.pointerEvents = on ? 'auto' : 'none';
      }
      /* The floats would sit on top of the hero's scroll cue, so they wait
         until the hero has been left behind. */
      if (stack) {
        const on = y > (window.innerHeight || 800) * 0.72;
        stack.style.opacity = on ? '1' : '0';
        stack.style.transform = on ? 'none' : 'translateY(12px)';
        stack.style.pointerEvents = on ? 'auto' : 'none';
      }
      if (cta) {
        const on = window.innerWidth <= 768 && y > window.innerHeight * 0.85;
        cta.style.transform = on ? 'none' : 'translateY(150%)';
      }
      this.heroFrame(y);
      this.parallaxFrame();
      this.mediaPass();
      if (!document.documentElement.hasAttribute('data-booting')) {
        this.revealPass();
        this.countPass();
      }
      this.spyPass();
    };
    this._scrollFrame = frame;
    /* The boot sequence holds the reveals back so the hero reads as the next
       frame of the opening shot; pick them up the moment it hands over. */
    this.on(window, 'fz:boot-done', () => {
      frame();
      this.tick(() => { this.revealPass(); this.countPass(); });
    });
    const onScroll = () => { if (!pending) { pending = true; requestAnimationFrame(frame); } };
    this.on(window, 'scroll', onScroll, { passive: true });
    this.on(window, 'resize', onScroll);
    if (top) top.hidden = false;
    frame();
  }

  heroFrame(y) {
    const h = window.innerHeight || 900;
    const still = Math.min(1, y / h);
    const plate = document.getElementById('hero-plate');
    if (plate) plate.style.transform = this.motion
      ? 'translate3d(0,' + (still * 7).toFixed(2) + 'vh,0) scale(' + (1.03 + still * 0.09).toFixed(3) + ')'
      : 'none';
    const vig = document.getElementById('hero-vignette');
    if (vig) vig.style.opacity = String(0.78 + still * 0.18);
    const type = document.getElementById('hero-type');
    if (type) {
      type.style.opacity = String(Math.max(0, 1 - still * 1.35));
      type.style.transform = this.motion ? 'translate3d(' + this._hx + 'px,' + (-still * 90 + this._hy).toFixed(2) + 'px,0)' : 'none';
    }
    const rail = document.getElementById('hero-rail');
    if (rail) {
      /* Fade on the rail's own position, not raw scroll: it holds full opacity
         for as long as it is genuinely in view, then leaves with the hero. */
      const r = rail.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const k = Math.max(0, Math.min(1, (vh * 0.42 - r.top) / (vh * 0.42)));
      rail.style.opacity = (1 - k * 0.92).toFixed(3);
      rail.style.transform = this.motion ? 'translate3d(0,' + (-k * 34).toFixed(2) + 'px,0)' : 'none';
    }
  }

  parallaxFrame() {
    if (!this.motion || window.innerWidth < 760) return;
    if (!this._px) this._px = this.qa('[data-parallax]');
    const vh = window.innerHeight;
    this._px.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -240 || r.top > vh + 240) return;
      const mid = r.top + r.height / 2 - vh / 2;
      const amt = parseFloat(el.dataset.parallax) || 0;
      el.style.transform = 'translate3d(0,' + (-mid * amt).toFixed(1) + 'px,0) scale(1.12)';
    });
  }

  initHero() {
    const em = document.getElementById('hero-field-ember');
    const pu = document.getElementById('hero-field-pulse');
    const v = document.getElementById('hero-film');
    if (v) {
      const show = () => { if (this._filmState === 'ready' && this.p.filmHero !== false) v.style.opacity = '1'; };
      this.on(v, 'canplay', show); this.on(v, 'loadeddata', show); this.on(v, 'playing', show);
      this.on(v, 'error', () => { v.style.opacity = '0'; });
      let last = window.innerWidth > 760;
      this.on(window, 'resize', () => {
        const now = window.innerWidth > 760;
        if (now !== last) { last = now; this.apply(); }
      });
    }
    if (!this.motion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let p = false;
    const move = e => {
      if (p) return; p = true;
      const cx = e.clientX, cy = e.clientY;
      requestAnimationFrame(() => {
        p = false;
        const x = cx / window.innerWidth, y = cy / window.innerHeight;
        this._hx = ((x - 0.5) * 14).toFixed(2); this._hy = (y - 0.5) * 8;
        if (em) { em.style.left = 'calc(' + (x * 100).toFixed(2) + '% - 32vmax)'; em.style.top = 'calc(' + (y * 100).toFixed(2) + '% - 32vmax)'; }
        if (pu) { pu.style.right = 'calc(' + ((1 - x) * 12).toFixed(2) + '% - 39vmax)'; pu.style.bottom = 'calc(' + (y * 10).toFixed(2) + '% - 39vmax)'; }
      });
    };
    this.on(window, 'pointermove', move, { passive: true });
  }

  initFilm() {
    const modal = document.getElementById('film-modal');
    const player = document.getElementById('film-player');
    const openers = this.qa('#watch-film, [data-open-film]');
    if (!modal || !player) return;
    const close = () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      try { player.pause(); } catch (e) {}
    };
    const open = () => {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      const p = player.play(); if (p && p.catch) p.catch(() => {});
      const c = document.getElementById('film-close'); if (c) c.focus();
    };
    openers.forEach(b => this.on(b, 'click', e => { e.preventDefault(); open(); }));
    const cls = document.getElementById('film-close');
    if (cls) this.on(cls, 'click', close);
    this.on(modal, 'click', e => { if (e.target === modal) close(); });
    this.on(document, 'keydown', e => { if (e.key === 'Escape' && modal.style.display === 'flex') close(); });
  }

  initMenu() {
    const ham = document.getElementById('hamburger-btn');
    const menu = document.getElementById('mobile-menu');
    if (!ham || !menu) return;
    const bars = Array.prototype.slice.call(ham.querySelectorAll('[data-bar]'));
    const setBars = open => {
      if (bars.length < 3) return;
      bars[0].style.transform = open ? 'translateY(6.5px) rotate(45deg)' : 'none';
      bars[1].style.opacity = open ? '0' : '1';
      bars[2].style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : 'none';
    };
    this.closeMenu = () => {
      if (menu.getAttribute('aria-hidden') === 'true') return;
      menu.setAttribute('aria-hidden', 'true');
      menu.style.opacity = '0'; menu.style.pointerEvents = 'none'; menu.style.transform = 'translateY(-8px)';
      ham.setAttribute('aria-expanded', 'false');
      ham.setAttribute('aria-label', 'Open navigation menu');
      document.body.style.overflow = '';
      setBars(false);
      setTimeout(() => { if (menu.getAttribute('aria-hidden') === 'true') menu.style.visibility = 'hidden'; }, 320);
    };
    const openMenu = () => {
      menu.style.visibility = 'visible';
      menu.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => { menu.style.opacity = '1'; menu.style.pointerEvents = 'auto'; menu.style.transform = 'none'; });
      ham.setAttribute('aria-expanded', 'true');
      ham.setAttribute('aria-label', 'Close navigation menu');
      document.body.style.overflow = 'hidden';
      setBars(true);
      const first = menu.querySelector('a'); if (first) first.focus();
    };
    this.on(ham, 'click', () => { menu.getAttribute('aria-hidden') === 'false' ? this.closeMenu() : openMenu(); });
    this.on(document, 'keydown', e => { if (e.key === 'Escape') this.closeMenu(); });
    this.on(window, 'resize', () => { if (window.innerWidth > 900) this.closeMenu(); });
  }

  initAnchors() {
    this.on(document, 'click', e => {
      const a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (this.closeMenu) this.closeMenu();
      const pad = id === '#home' ? 0 : this.navH + 8;
      const y = el.getBoundingClientRect().top + window.scrollY - pad;
      window.scrollTo({ top: Math.max(0, y), behavior: this.reduce ? 'auto' : 'smooth' });
      if (id === '#main-content') { el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
    });
  }

  initSpy() {
    this._links = this.qa('#nav-links .ip-nav__link');
    this._sections = [];
    this._links.forEach(l => {
      const el = document.querySelector(l.getAttribute('href'));
      if (el) this._sections.push({ el: el, link: l });
    });
  }

  spyPass() {
    if (!this._sections || !this._sections.length) return;
    const line = (window.innerHeight || 800) * 0.35;
    let hit = null;
    this._sections.forEach(s => {
      const r = s.el.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) hit = s;
    });
    if (!hit || hit.link === this._active) return;
    this._active = hit.link;
    this._links.forEach(l => { l.classList.remove('ip-nav__link--active'); l.removeAttribute('aria-current'); });
    hit.link.classList.add('ip-nav__link--active');
    hit.link.setAttribute('aria-current', 'page');
  }

  initFaq() {
    const btns = this.qa('[data-faq]');
    if (!btns.length) return;
    const shut = b => {
      b.setAttribute('aria-expanded', 'false');
      const a = document.getElementById(b.getAttribute('aria-controls'));
      if (a) { a.style.maxHeight = '0px'; a.style.opacity = '0'; }
      const i = b.querySelector('[data-faq-icon]');
      if (i) { i.textContent = '+'; i.style.color = 'var(--ink-600)'; }
      b.style.color = 'var(--chalk)';
    };
    btns.forEach(shut);
    btns.forEach(b => {
      this.on(b, 'click', () => {
        const wasOpen = b.getAttribute('aria-expanded') === 'true';
        btns.forEach(shut);
        if (wasOpen) return;
        const a = document.getElementById(b.getAttribute('aria-controls'));
        b.setAttribute('aria-expanded', 'true');
        if (a) { a.style.maxHeight = a.scrollHeight + 'px'; a.style.opacity = '1'; }
        const i = b.querySelector('[data-faq-icon]');
        if (i) { i.textContent = '\u00d7'; i.style.color = 'var(--ember-500)'; }
        b.style.color = 'var(--ember-500)';
      });
      this.on(b, 'keydown', e => {
        const idx = btns.indexOf(b);
        const map = { ArrowDown: (idx + 1) % btns.length, ArrowUp: (idx - 1 + btns.length) % btns.length, Home: 0, End: btns.length - 1 };
        if (e.key in map) { e.preventDefault(); btns[map[e.key]].focus(); }
      });
    });
  }

  initCompare() {
    this.qa('[data-compare]').forEach(slider => {
      const before = slider.querySelector('[data-compare-before]');
      const after = slider.querySelector('[data-compare-after]');
      const handle = slider.querySelector('[data-compare-handle]');
      if (!before || !after || !handle) return;
      let dragging = false, pct = 0.5;
      const setPosition = clientX => {
        const rect = slider.getBoundingClientRect();
        if (!rect.width) return;
        let p = (clientX - rect.left) / rect.width;
        p = Math.max(0.02, Math.min(0.98, p));
        pct = p;
        before.style.clipPath = 'inset(0 ' + ((1 - p) * 100).toFixed(2) + '% 0 0)';
        after.style.clipPath = 'inset(0 0 0 ' + (p * 100).toFixed(2) + '%)';
        handle.style.left = (p * 100).toFixed(2) + '%';
        handle.setAttribute('aria-valuenow', String(Math.round(p * 100)));
      };
      const centre = () => { const r = slider.getBoundingClientRect(); setPosition(r.left + r.width * pct); };
      requestAnimationFrame(() => requestAnimationFrame(centre));
      this.on(handle, 'mousedown', e => { e.preventDefault(); dragging = true; });
      this.on(slider, 'mousedown', e => { dragging = true; setPosition(e.clientX); });
      this.on(window, 'mousemove', e => { if (dragging) setPosition(e.clientX); });
      this.on(window, 'mouseup', () => { dragging = false; });
      this.on(slider, 'touchstart', e => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
      this.on(window, 'touchmove', e => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
      this.on(window, 'touchend', () => { dragging = false; });
      this.on(handle, 'keydown', e => {
        const step = e.shiftKey ? 0.1 : 0.02;
        const r = slider.getBoundingClientRect();
        if (e.key === 'ArrowLeft') { e.preventDefault(); setPosition(r.left + (pct - step) * r.width); }
        if (e.key === 'ArrowRight') { e.preventDefault(); setPosition(r.left + (pct + step) * r.width); }
      });
      if (window.ResizeObserver) {
        const ro = new ResizeObserver(centre);
        ro.observe(slider);
        this._off.push(() => ro.disconnect());
      }
    });
  }

  initMarquee() {
    this.qa('[data-marquee-track]').forEach(track => {
      if (!this.motion) { track.style.animation = 'none'; return; }
      if (track.dataset.cloned === '1') return;
      const kids = Array.prototype.slice.call(track.children);
      kids.forEach(k => { const c = k.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
      track.dataset.cloned = '1';
    });
  }

  initReveal() {
    const items = [];
    this.qa('.ip-reveal').forEach(el => items.push({ el: el, k: 't' }));
    this.qa('[data-reveal]').forEach(el => {
      const d = parseInt(el.dataset.reveal || '0', 10) || 0;
      if (d) el.style.transitionDelay = d + 'ms';
      items.push({ el: el, k: 'b' });
    });
    this.qa('.ip-media__clip--hidden').forEach(el => items.push({ el: el, k: 'c' }));
    this._rev = items;
    if (!this.motion) { this.revealPass(true); return; }
    this.tick(() => this.revealPass());
    this.on(window, 'load', () => this.revealPass());
  }

  tick(fn) {
    [0, 160, 500, 1200, 2600].forEach(t => {
      const id = setTimeout(fn, t);
      this._off.push(() => clearTimeout(id));
    });
  }

  revealPass(all) {
    if (!this._rev || !this._rev.length) return;
    if (!all && document.documentElement.hasAttribute('data-booting')) return;
    const vh = window.innerHeight || 800;
    const show = o => {
      if (o.k === 't') o.el.classList.add('ip-reveal--in');
      else if (o.k === 'c') o.el.classList.remove('ip-media__clip--hidden');
      else { o.el.style.opacity = '1'; o.el.style.transform = 'none'; }
    };
    const rest = [];
    this._rev.forEach(o => {
      if (all) { show(o); return; }
      const r = o.el.getBoundingClientRect();
      if (r.bottom <= 0) {
        // Already scrolled past — never leave content stranded invisible.
        o.el.style.transitionDuration = '0ms';
        show(o);
        return;
      }
      if (r.top < vh * 0.94) show(o); else rest.push(o);
    });
    this._rev = rest;
  }

  initCounters() {
    this._cnt = this.qa('[data-count]');
    if (!this._cnt.length || !this.motion) { this._cnt = []; return; }
    this.tick(() => this.countPass());
  }

  countPass() {
    if (!this._cnt || !this._cnt.length) return;
    const vh = window.innerHeight || 800;
    const rest = [];
    this._cnt.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0) return; // scrolled past: the authored figure already reads correctly
      if (r.top > vh * 0.9) { rest.push(el); return; }
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const t0 = performance.now();
      const step = t => {
        const k = Math.min(1, (t - t0) / 1400);
        const e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(target * e).toLocaleString('en-US') + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    this._cnt = rest;
  }

  initForms() {
    const form = document.getElementById('contact-form');
    if (form) {
      const goalSel = document.getElementById('goal');
      if (goalSel) goalSel.value = '';
      const submitBtn = form.querySelector('[data-submit]');
      const label = form.querySelector('[data-submit-label]');
      const loader = form.querySelector('[data-submit-loader]');
      const successBox = document.getElementById('form-success');
      let busy = false;
      const rules = {
        'full-name': { validate: v => v.trim().length >= 2, message: 'Please enter your full name (at least 2 characters).' },
        email: { validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: 'Please enter a valid email address.' },
        phone: { validate: v => /^[+\d\s\-()]{7,20}$/.test(v.trim()), message: 'Please enter a valid phone number.' },
        goal: { validate: v => v !== '', message: 'Please select your fitness goal.' }
      };
      const showError = (id, msg) => {
        const f = document.getElementById(id), er = document.getElementById(id + '-error');
        if (!f || !er) return;
        f.setAttribute('aria-invalid', 'true');
        f.classList.add('ip-input--invalid');
        f.style.borderColor = 'var(--red-500)';
        er.textContent = msg;
      };
      const clearError = id => {
        const f = document.getElementById(id), er = document.getElementById(id + '-error');
        if (!f || !er) return;
        f.removeAttribute('aria-invalid');
        f.classList.remove('ip-input--invalid');
        f.style.borderColor = '';
        er.textContent = '';
      };
      Object.keys(rules).forEach(id => {
        const f = document.getElementById(id);
        if (!f) return;
        this.on(f, 'blur', () => { rules[id].validate(f.value) ? clearError(id) : showError(id, rules[id].message); });
        this.on(f, 'input', () => { if (f.getAttribute('aria-invalid') === 'true' && rules[id].validate(f.value)) clearError(id); });
        this.on(f, 'change', () => { if (f.getAttribute('aria-invalid') === 'true' && rules[id].validate(f.value)) clearError(id); });
      });
      this.on(form, 'submit', e => {
        e.preventDefault();
        if (busy) return;
        let valid = true;
        Object.keys(rules).forEach(id => {
          const f = document.getElementById(id);
          if (!f) return;
          if (!rules[id].validate(f.value)) { showError(id, rules[id].message); valid = false; } else clearError(id);
        });
        if (!valid) {
          const first = form.querySelector('[aria-invalid="true"]');
          if (first) first.focus();
          return;
        }
        busy = true;
        if (submitBtn) submitBtn.disabled = true;
        if (label) label.textContent = 'Sending';
        if (loader) loader.hidden = false;
        setTimeout(() => {
          busy = false;
          if (submitBtn) submitBtn.disabled = false;
          if (label) label.textContent = 'Send message & claim free trial';
          if (loader) loader.hidden = true;
          if (successBox) {
            successBox.hidden = false;
            successBox.style.opacity = '1';
            successBox.focus({ preventScroll: true });
            setTimeout(() => { successBox.style.opacity = '0'; setTimeout(() => { successBox.hidden = true; }, 400); }, 8000);
          }
          form.reset();
        }, 1800);
      });
    }

    const nf = document.getElementById('newsletter-form');
    if (nf) {
      const input = document.getElementById('newsletter-email');
      const er = document.getElementById('newsletter-error');
      const btn = nf.querySelector('[data-newsletter-btn]');
      const ok = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
      this.on(nf, 'submit', e => {
        e.preventDefault();
        if (!ok(input.value)) {
          if (er) er.textContent = 'Please enter a valid email address.';
          input.style.borderColor = 'var(--red-500)';
          input.focus();
          return;
        }
        if (er) er.textContent = '';
        input.style.borderColor = '';
        const orig = btn.textContent;
        btn.textContent = 'Subscribing';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Subscribed';
          input.value = '';
          setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3500);
        }, 1200);
      });
      this.on(input, 'input', () => { input.style.borderColor = ''; if (er) er.textContent = ''; });
    }
  }

  initFloats() {
    const top = document.getElementById('back-to-top');
    if (top) this.on(top, 'click', () => {
      window.scrollTo({ top: 0, behavior: this.reduce ? 'auto' : 'smooth' });
      const s = document.getElementById('skip-link'); if (s) s.focus();
    });
    const wa = document.querySelector('[data-whatsapp]');
    const tip = document.querySelector('[data-whatsapp-tip]');
    if (wa && tip) {
      const show = () => { tip.style.opacity = '1'; tip.style.transform = 'translateX(0)'; };
      const hide = () => { tip.style.opacity = '0'; tip.style.transform = 'translateX(8px)'; };
      const t1 = setTimeout(() => { show(); setTimeout(hide, 5000); }, 3000);
      this._off.push(() => clearTimeout(t1));
      this.on(wa, 'mouseenter', show);
      this.on(wa, 'mouseleave', hide);
      this.on(wa, 'focus', show);
      this.on(wa, 'blur', hide);
    }
  }

  initRail() {
    const rail = document.getElementById('services-rail');
    if (!rail) return;
    const step = () => Math.max(280, rail.clientWidth * 0.62);
    const prev = document.querySelector('[data-rail-prev]');
    const next = document.querySelector('[data-rail-next]');
    const sync = () => {
      const max = rail.scrollWidth - rail.clientWidth - 4;
      if (prev) prev.style.opacity = rail.scrollLeft <= 4 ? '.35' : '1';
      if (next) next.style.opacity = rail.scrollLeft >= max ? '.35' : '1';
      const pos = document.querySelector('[data-rail-pos]');
      if (pos) pos.style.transform = 'scaleX(' + Math.max(0.08, Math.min(1, rail.clientWidth / rail.scrollWidth)) + ')';
      const line = document.querySelector('[data-rail-track]');
      if (pos && line) {
        const travel = 1 - Math.max(0.08, Math.min(1, rail.clientWidth / rail.scrollWidth));
        const k = rail.scrollWidth > rail.clientWidth ? rail.scrollLeft / (rail.scrollWidth - rail.clientWidth) : 0;
        pos.style.left = (k * travel * 100).toFixed(2) + '%';
      }
    };
    if (prev) this.on(prev, 'click', () => rail.scrollBy({ left: -step(), behavior: this.reduce ? 'auto' : 'smooth' }));
    if (next) this.on(next, 'click', () => rail.scrollBy({ left: step(), behavior: this.reduce ? 'auto' : 'smooth' }));
    this.on(rail, 'scroll', sync, { passive: true });
    this.on(window, 'resize', sync);
    sync();
  }

  initPanels() {
    if (window.matchMedia('(hover: hover)').matches) return;
    const cards = this.qa('[data-hover-panel]').map(p => p.closest('[data-card-key]')).filter(Boolean);
    cards.forEach(card => {
      this.on(card, 'click', e => {
        if (e.target.closest('a, button')) return;
        const open = card.getAttribute('data-panel-open') === '1';
        cards.forEach(c => c.removeAttribute('data-panel-open'));
        if (!open) card.setAttribute('data-panel-open', '1');
      });
    });
    this.on(document, 'click', e => {
      if (e.target.closest('[data-card-key]')) return;
      cards.forEach(c => c.removeAttribute('data-panel-open'));
    });
  }

  initKeys() {
    const menu = document.getElementById('mobile-menu');
    if (menu) this.on(menu, 'keydown', e => {
      if (e.key !== 'Tab') return;
      const f = Array.prototype.slice.call(menu.querySelectorAll('a[href], button'));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    this.qa('[data-card-key]').forEach(card => {
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      this.on(card, 'keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          const cta = card.querySelector('a, button');
          /* The floats would sit on top of the hero's scroll cue, so they wait
         until the hero has been left behind. */
      if (stack) {
        const on = y > (window.innerHeight || 800) * 0.72;
        stack.style.opacity = on ? '1' : '0';
        stack.style.transform = on ? 'none' : 'translateY(12px)';
        stack.style.pointerEvents = on ? 'auto' : 'none';
      }
      if (cta) { e.preventDefault(); cta.click(); }
        }
      });
    });
  }
}

  var site = new Component({ atmosphere: 0.6, sceneMotion: true, filmHero: true });

  /* Reactive section backgrounds — cursor position + scroll velocity, mirroring
     the design system's ReactiveField primitive. */
  function initFields() {
    var fields = [].slice.call(document.querySelectorAll('[data-field]'));
    if (!fields.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var intensity = 0.6, size = 60 * intensity, vel = 0, last = window.scrollY, raf = 0, px = 0.5, py = 0.4;
    function paint() {
      raf = 0;
      fields.forEach(function (f) {
        var r = f.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        var y = Math.max(-0.2, Math.min(1.2, (window.innerHeight * py - r.top) / (r.height || 1)));
        var em = f.querySelector('[data-field-ember]');
        if (em) {
          em.style.width = size + 'vmax'; em.style.height = size + 'vmax';
          em.style.left = 'calc(' + (px * 100).toFixed(2) + '% - ' + size / 2 + 'vmax)';
          em.style.top = 'calc(' + (y * 100).toFixed(2) + '% - ' + size / 2 + 'vmax)';
          em.style.opacity = ((0.5 + vel * 0.5) * intensity).toFixed(3);
        }
        var pu = f.querySelector('[data-field-pulse]');
        if (pu) {
          var s2 = size * 1.5;
          pu.style.width = s2 + 'vmax'; pu.style.height = s2 + 'vmax';
          pu.style.right = 'calc(' + (px * 26).toFixed(2) + '% - ' + s2 / 2 + 'vmax)';
          pu.style.bottom = 'calc(' + (10 + (1 - y) * 18).toFixed(2) + '% - ' + s2 / 2 + 'vmax)';
          pu.style.opacity = ((0.42 + vel * 0.3) * intensity).toFixed(3);
        }
      });
    }
    function queue() { if (!raf) raf = requestAnimationFrame(paint); }
    window.addEventListener('pointermove', function (e) {
      px = e.clientX / window.innerWidth; py = e.clientY / window.innerHeight; queue();
    }, { passive: true });
    window.addEventListener('scroll', function () {
      vel = Math.min(1, Math.abs(window.scrollY - last) / 90); last = window.scrollY; queue();
    }, { passive: true });
    paint();
  }

  function boot() { site.boot(); initFields(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
