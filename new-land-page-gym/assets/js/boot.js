/* Boot sequence — the opening title.
   Progress is real (fonts, hero poster, document load) with a floor so the
   readout never stalls, a 1.5s minimum so the brand reveal always completes,
   and a hard ceiling so a slow connection never holds the site hostage.
   Runs once per session; skipped on deep links and in a hidden tab. */
(function () {
  var root = document.documentElement;

  function skipped() {
    try {
      if (/[?&]boot=1\b/.test(location.search)) return false; /* force a replay */
      return !!location.hash || !!sessionStorage.getItem('fz-boot');
    } catch (e) { return false; }
  }

  function begin() {
    var boot = document.getElementById('fz-boot');
    if (!boot || boot.hasAttribute('data-boot-on')) return;
    boot.setAttribute('data-boot-on', '1');
    if (skipped()) { if (boot.parentNode) boot.parentNode.removeChild(boot); return; }
    root.setAttribute('data-booting', '1');
    /* If anything below throws, the page is still handed over. */
    var failsafe = setTimeout(function () { release(boot); drop(boot); }, 7000);
    try { run(boot, failsafe); } catch (e) { clearTimeout(failsafe); release(boot); drop(boot); }
  }

  function release(boot) {
    root.removeAttribute('data-booting');
    try { sessionStorage.setItem('fz-boot', '1'); } catch (e) {}
    window.dispatchEvent(new Event('fz:boot-done'));
  }

  function drop(boot) { if (boot.parentNode) boot.parentNode.removeChild(boot); }

  function run(boot, failsafe) {
    var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var MIN = REDUCE ? 260 : 1500;
    var MAX = 4200;
    var TICKS = 28;

    var num = boot.querySelector('[data-boot-num]');
    var label = boot.querySelector('[data-boot-label]');
    var holder = boot.querySelector('[data-boot-ticks]');
    var ticks = [], i, s;
    for (i = 0; i < TICKS; i++) {
      s = document.createElement('span');
      s.className = 'fz-boot__tick';
      holder.appendChild(s);
      ticks.push(s);
    }

    var t0 = performance.now();
    var real = 0, shown = 0, lit = 0, timer = 0, closed = false;

    function bump(w) { real = Math.min(1, real + w); }

    /* Real signals. Each resolves once; failures still credit their weight, so a
       missing asset can never wedge the sequence. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { bump(0.28); }, function () { bump(0.28); });
    else bump(0.28);

    var poster = document.querySelector('#hero-plate img');
    if (!poster || poster.complete) bump(0.34);
    else {
      poster.addEventListener('load', function () { bump(0.34); }, { once: true });
      poster.addEventListener('error', function () { bump(0.34); }, { once: true });
    }

    if (document.readyState === 'complete') bump(0.38);
    else window.addEventListener('load', function () { bump(0.38); }, { once: true });

    /* Swallow scroll gestures over the plate rather than locking <html>, which
       would drop the scrollbar and shift the page underneath. */
    function swallow(ev) { ev.preventDefault(); }
    boot.addEventListener('wheel', swallow, { passive: false });
    boot.addEventListener('touchmove', swallow, { passive: false });

    function paint() {
      var pct = Math.round(shown * 100);
      if (num) num.firstChild.nodeValue = pct < 100 ? ('00' + pct).slice(-3) : '100';
      var want = Math.round(shown * TICKS);
      while (lit < want) { ticks[lit].className = 'fz-boot__tick fz-boot__tick--on'; lit++; }
    }

    function frame() {
      var el = performance.now() - t0;
      var ready = real > 0.999 && el >= MIN;
      var target = ready ? 1 : Math.min(0.94, Math.max(real * 0.94, (el / MAX) * 0.88));
      shown += (target - shown) * (ready ? 0.34 : 0.12);
      if (ready && shown > 0.994) shown = 1;
      paint();
      if (shown >= 1 || el > MAX + 1200) { shown = 1; paint(); close(); }
    }

    function close() {
      if (closed) return;
      closed = true;
      clearInterval(timer);
      clearTimeout(failsafe);
      boot.setAttribute('data-ready', '1');
      if (label) label.firstChild.nodeValue = 'Floor open';

      /* Content leaves behind its mask, then the plates part along the rule. */
      setTimeout(function () { boot.setAttribute('data-state', 'lift'); }, REDUCE ? 0 : 200);
      setTimeout(function () { boot.setAttribute('data-state', 'out'); }, REDUCE ? 60 : 620);
      setTimeout(function () {
        /* Hand the sequence over: the hero type and counters were held back so
           they read as the next frame of the same shot, not a second entrance. */
        boot.removeEventListener('wheel', swallow, { passive: false });
        boot.removeEventListener('touchmove', swallow, { passive: false });
        release(boot);
      }, REDUCE ? 90 : 1060);
      setTimeout(function () { drop(boot); }, REDUCE ? 320 : 1700);
    }

    /* Commit the pre-entrance styles with a forced reflow rather than waiting on
       requestAnimationFrame, which never fires in a background tab — the sequence
       must not stall behind a throttled frame callback. The interval ticker keeps
       working there too, and CSS transitions do the smoothing. */
    void boot.offsetHeight;
    boot.setAttribute('data-state', 'in');
    if (document.hidden) { real = 1; t0 -= MIN; }
    timer = setInterval(frame, 50);
    frame();
  }

  if (document.getElementById('fz-boot')) begin();
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', begin);
  else begin();
})();
