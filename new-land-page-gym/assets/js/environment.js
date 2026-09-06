/* IronPulse — reactive section environments.
   One rAF loop, one viewport-sized canvas per section (sticky, so tall sections
   never allocate tall bitmaps), and only sections intersecting the viewport draw.
   Variants share a palette and a clock so the page reads as one continuous
   environment: light / lines / depth / waves / dust / trails.
   Reacts to cursor position, pointer movement, scroll offset, scroll velocity and
   section hover. Collapses to a single static frame under prefers-reduced-motion. */
(function () {
  'use strict';

  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EMBER = '255,74,23', PULSE = '83,70,255', CHALK = '244,246,250';
  var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  var TAU = Math.PI * 2;

  /* pointer (normalised, smoothed), scroll offset and smoothed scroll velocity */
  var P = { x: 0.5, y: 0.4, sx: 0.5, sy: 0.4, cx: 0, cy: 0, moved: 0 };
  var S = { y: window.scrollY, v: 0 };
  var envs = [], running = false, live = 0;

  function rnd(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }

  function Env(el, i) {
    this.el = el;
    this.kind = el.getAttribute('data-env') || 'light';
    this.seed = 1000 + i * 977;
    this.vis = 0;          /* intersection ratio, drives opacity + amplitude */
    this.hover = 0;
    this.w = 0; this.h = 0;
    var c = document.createElement('canvas');
    c.className = 'ip-env__canvas';
    c.setAttribute('aria-hidden', 'true');
    el.appendChild(c);
    this.c = c;
    this.ctx = c.getContext('2d', { alpha: true });
    this.seedParts();
    this.resize();
  }

  Env.prototype.seedParts = function () {
    var r = rnd(this.seed), i;
    this.parts = [];
    if (this.kind === 'dust') {
      for (i = 0; i < 70; i++) this.parts.push({ x: r(), y: r(), z: 0.35 + r() * 0.9, s: 0.5 + r() * 1.3, p: r() * TAU });
    } else if (this.kind === 'lines') {
      for (i = 0; i < 16; i++) this.parts.push({ y: 0.06 + r() * 0.88, len: 90 + r() * 320, sp: 26 + r() * 78, o: r() * 2400, a: 0.05 + r() * 0.13 });
    } else if (this.kind === 'trails') {
      for (i = 0; i < 7; i++) this.parts.push({ y: 0.1 + r() * 0.8, dy: (r() - 0.5) * 0.22, len: 200 + r() * 380, sp: 34 + r() * 52, o: r() * 3000, a: 0.06 + r() * 0.1 });
    } else if (this.kind === 'waves') {
      for (i = 0; i < 5; i++) this.parts.push({ y: 0.16 + i * 0.17, amp: 12 + r() * 34, k: 1.1 + r() * 2.2, sp: 0.18 + r() * 0.3, a: 0.05 + r() * 0.07 });
    }
  };

  Env.prototype.resize = function () {
    var w = this.el.clientWidth, h = Math.min(window.innerHeight, this.el.clientHeight) || window.innerHeight;
    if (w === this.w && h === this.h) return;
    this.w = w; this.h = h;
    this.c.width = Math.max(1, Math.round(w * DPR));
    this.c.height = Math.max(1, Math.round(h * DPR));
    this.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    this.dirty = true;
  };

  /* ---------- variant renderers ---------- */

  function light(x, w, h, t, e) {
    var g, r = Math.max(w, h) * 0.62, k = 0.42 + e.vis * 0.58 + e.hover * 0.2;
    var ax = w * (0.14 + P.sx * 0.72), ay = h * (0.1 + P.sy * 0.8);
    g = x.createRadialGradient(ax, ay, 0, ax, ay, r);
    g.addColorStop(0, 'rgba(' + EMBER + ',' + (0.085 * k).toFixed(4) + ')');
    g.addColorStop(0.55, 'rgba(' + EMBER + ',' + (0.022 * k).toFixed(4) + ')');
    g.addColorStop(1, 'rgba(' + EMBER + ',0)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    var bx = w * (0.86 - P.sx * 0.55) + Math.sin(t * 0.00016) * w * 0.05;
    var by = h * (0.82 - P.sy * 0.4) + Math.cos(t * 0.00013) * h * 0.06;
    g = x.createRadialGradient(bx, by, 0, bx, by, r * 0.95);
    g.addColorStop(0, 'rgba(' + PULSE + ',' + (0.1 * k).toFixed(4) + ')');
    g.addColorStop(0.6, 'rgba(' + PULSE + ',' + (0.026 * k).toFixed(4) + ')');
    g.addColorStop(1, 'rgba(' + PULSE + ',0)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
  }

  function lines(x, w, h, t, e) {
    var boost = 1 + S.v * 2.4, k = 0.5 + e.vis * 0.5;
    x.lineCap = 'round';
    for (var i = 0; i < e.parts.length; i++) {
      var p = e.parts[i];
      var span = w + p.len;
      var px = span - ((t * 0.001 * p.sp * boost + p.o) % span);
      var y = p.y * h + (P.sy - 0.5) * 22 * (0.4 + p.y);
      var a = p.a * k * (0.72 + Math.min(1, S.v * 3) * 0.4);
      x.strokeStyle = 'rgba(' + CHALK + ',' + (a * 0.85).toFixed(4) + ')';
      x.lineWidth = 1;
      x.beginPath(); x.moveTo(px, y); x.lineTo(px + p.len, y); x.stroke();
      x.strokeStyle = 'rgba(' + EMBER + ',' + (a * 2.1).toFixed(4) + ')';
      x.lineWidth = 1.5;
      x.beginPath(); x.moveTo(px + p.len * 0.78, y); x.lineTo(px + p.len, y); x.stroke();
    }
  }

  function depth(x, w, h, t, e) {
    var vx = w * (0.18 + P.sx * 0.64), vy = h * (0.3 + P.sy * 0.34);
    var k = 0.45 + e.vis * 0.55, i, n = 15;
    x.lineWidth = 1;
    for (i = 0; i <= n; i++) {
      var bx = (i / n) * (w * 1.6) - w * 0.3;
      x.strokeStyle = 'rgba(' + CHALK + ',' + (0.05 * k * (1 - Math.abs(i / n - 0.5) * 0.9)).toFixed(4) + ')';
      x.beginPath(); x.moveTo(bx, h + 4); x.lineTo(vx, vy); x.stroke();
    }
    var drift = (S.y * 0.28 + t * 0.006) % 1;
    for (i = 1; i <= 9; i++) {
      var f = Math.pow((i - drift) / 9, 2.35);
      if (f <= 0.004 || f > 1) continue;
      var ly = vy + (h + 4 - vy) * f;
      x.strokeStyle = 'rgba(' + CHALK + ',' + (0.055 * k * f).toFixed(4) + ')';
      x.beginPath(); x.moveTo(0, ly); x.lineTo(w, ly); x.stroke();
    }
    x.strokeStyle = 'rgba(' + EMBER + ',' + (0.16 * k).toFixed(4) + ')';
    x.beginPath(); x.moveTo(vx - 9, vy); x.lineTo(vx + 9, vy); x.stroke();
  }

  function waves(x, w, h, t, e) {
    var k = (0.45 + e.vis * 0.55) * (1 + S.v * 1.6), i, j;
    x.lineWidth = 1;
    for (i = 0; i < e.parts.length; i++) {
      var p = e.parts[i];
      var amp = p.amp * (0.55 + Math.min(1, S.v * 2.5) * 0.75) * (0.7 + e.hover * 0.5);
      var ph = t * 0.001 * p.sp + S.y * 0.0022 + i;
      x.strokeStyle = i % 2 ? 'rgba(' + PULSE + ',' + (p.a * k * 1.5).toFixed(4) + ')'
                            : 'rgba(' + CHALK + ',' + (p.a * k).toFixed(4) + ')';
      x.beginPath();
      for (j = 0; j <= 32; j++) {
        var u = j / 32, xx = u * w;
        var yy = p.y * h + Math.sin(u * p.k * TAU + ph) * amp * (0.35 + P.sy * 0.9);
        j ? x.lineTo(xx, yy) : x.moveTo(xx, yy);
      }
      x.stroke();
    }
  }

  function dust(x, w, h, t, e) {
    var k = 0.55 + e.vis * 0.45;
    for (var i = 0; i < e.parts.length; i++) {
      var p = e.parts[i];
      var dx = (P.sx - 0.5) * 34 * p.z, dy = (P.sy - 0.5) * 26 * p.z;
      var xx = ((p.x + Math.sin(t * 0.00007 * p.z + p.p) * 0.035) * w + dx + w) % w;
      var yy = ((p.y - (t * 0.0000085 * p.z + S.y * 0.00004) % 1) * h + dy + h * 2) % h;
      var a = (0.1 + 0.2 * p.z) * k * (0.62 + Math.sin(t * 0.0011 + p.p) * 0.38);
      var r = 1 + p.s * p.z * 0.8;
      var accent = i % 7 === 0;
      var g = x.createRadialGradient(xx, yy, 0, xx, yy, r * 3.4);
      g.addColorStop(0, 'rgba(' + (accent ? EMBER : CHALK) + ',' + (a * (accent ? 1.5 : 0.72)).toFixed(4) + ')');
      g.addColorStop(1, 'rgba(' + (accent ? EMBER : CHALK) + ',0)');
      x.fillStyle = g;
      x.beginPath(); x.arc(xx, yy, r * 3.4, 0, TAU); x.fill();
      x.fillStyle = 'rgba(' + (accent ? EMBER : CHALK) + ',' + (a * (accent ? 2 : 1)).toFixed(4) + ')';
      x.beginPath(); x.arc(xx, yy, r, 0, TAU); x.fill();
    }
  }

  function trails(x, w, h, t, e) {
    var boost = 1 + S.v * 3, k = 0.45 + e.vis * 0.55;
    x.lineCap = 'round';
    for (var i = 0; i < e.parts.length; i++) {
      var p = e.parts[i];
      var span = w + p.len * 1.4;
      var px = ((t * 0.001 * p.sp * boost + p.o) % span) - p.len;
      var y = p.y * h + (P.sy - 0.5) * 30;
      var y2 = y + p.dy * h;
      var a = p.a * k * (0.5 + Math.min(1, S.v * 3.4) * 0.5);
      x.strokeStyle = 'rgba(' + CHALK + ',' + (a * 0.55).toFixed(4) + ')';
      x.lineWidth = 1;
      x.beginPath();
      x.moveTo(px, y);
      x.quadraticCurveTo(px + p.len * 0.55, (y + y2) / 2 - p.dy * h * 0.35, px + p.len, y2);
      x.stroke();
      x.fillStyle = 'rgba(' + EMBER + ',' + (a * 2.1).toFixed(4) + ')';
      x.beginPath(); x.arc(px + p.len, y2, 1.5, 0, TAU); x.fill();
    }
  }

  var RENDER = { light: light, lines: lines, depth: depth, waves: waves, dust: dust, trails: trails };

  Env.prototype.draw = function (t) {
    var x = this.ctx, w = this.w, h = this.h;
    x.clearRect(0, 0, w, h);
    (RENDER[this.kind] || light)(x, w, h, t, this);
    if (this.kind === 'waves' || this.kind === 'trails') light(x, w, h, t, { vis: this.vis * 0.4, hover: 0 });
    this.el.style.opacity = (0.25 + this.vis * 0.75).toFixed(3);
  };

  /* ---------- shared loop ---------- */

  function frame(now) {
    var i, e;
    P.sx += (P.x - P.sx) * 0.055;
    P.sy += (P.y - P.sy) * 0.055;
    var y = window.scrollY;
    var raw = Math.min(1, Math.abs(y - S.y) / 46);
    S.y = y;
    S.v += (raw - S.v) * (raw > S.v ? 0.4 : 0.06);
    for (i = 0; i < envs.length; i++) {
      e = envs[i];
      if (e.vis <= 0.001) continue;
      var r = e.el.getBoundingClientRect();
      var inside = P.cy >= r.top && P.cy <= r.bottom && P.cx >= r.left && P.cx <= r.right;
      e.hover += ((inside ? 1 : 0) - e.hover) * 0.07;
      e.resize();
      /* Track the viewport ourselves: the layer's overflow:hidden makes it a scroll
         container, so position:sticky cannot follow the page inside it. */
      var travel = Math.max(0, Math.min(r.height - e.h, -r.top));
      e.c.style.transform = 'translate3d(0,' + travel.toFixed(1) + 'px,0)';
      e.draw(now);
    }
    if (running) requestAnimationFrame(frame);
  }

  function start() {
    if (running || REDUCE || document.hidden) return;
    running = true;
    requestAnimationFrame(frame);
  }
  function stop() { running = false; }

  function staticPass() {
    for (var i = 0; i < envs.length; i++) { envs[i].vis = 1; envs[i].resize(); envs[i].draw(1200); }
  }

  function init() {
    var nodes = [].slice.call(document.querySelectorAll('[data-env]:not([data-env-on])'));
    if (!nodes.length) return;
    nodes.forEach(function (el) { el.setAttribute('data-env-on', '1'); });
    var base = envs.length;
    nodes.forEach(function (el, i) { envs.push(new Env(el, base + i)); });

    if (REDUCE) { staticPass(); return; }

    var index = {};
    nodes.forEach(function (el, i) { index[i] = envs[base + i]; });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var e = index[nodes.indexOf(en.target)];
          if (!e) return;
          if (en.isIntersecting) {
            e.vis = Math.max(0.14, en.intersectionRatio);
            e.el.style.opacity = (0.25 + e.vis * 0.75).toFixed(3);
          } else {
            e.vis = 0;
            e.el.style.opacity = '0';
            e.ctx.clearRect(0, 0, e.w, e.h);
          }
        });
        live = 0;
        for (var i = 0; i < envs.length; i++) if (envs[i].vis > 0.001) live++;
        live > 0 ? start() : stop();
      }, { threshold: [0, 0.08, 0.25, 0.5, 0.75, 1] });
      nodes.forEach(function (el) { io.observe(el); });
    } else {
      envs.forEach(function (e) { e.vis = 1; });
      live = envs.length;
      start();
    }
    if (envs.length === nodes.length) bindGlobals();
  }

  function bindGlobals() {
    window.addEventListener('pointermove', function (ev) {
      P.cx = ev.clientX; P.cy = ev.clientY;
      P.x = ev.clientX / window.innerWidth;
      P.y = ev.clientY / window.innerHeight;
    }, { passive: true });

    window.addEventListener('resize', function () { envs.forEach(function (e) { e.resize(); }); }, { passive: true });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : (live > 0 && start()); });
  }

  window.IronPulseEnv = { scan: init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
