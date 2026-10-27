/* Hero slider: vanilla, CSS-driven. Automatically disables when single banner is used. */
(function () {
  'use strict';
  const hero = document.getElementById('home');
  if (!hero) return;
  const slides = [...hero.querySelectorAll('.slide')];
  if (slides.length <= 1) return;

  const bars = [...document.querySelectorAll('#hBars .bar')], cur = document.getElementById('hCur');
  const hPrev = document.getElementById('hPrev'), hNext = document.getElementById('hNext');
  const DUR = 6500, reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  let i = 0, timer = null;
  hero.style.setProperty('--dur', DUR + 'ms');
  slides.forEach(s => {
    const img = s.querySelector('img');
    if (img) img.loading = 'eager';
  });

  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    if (bars.length) {
      bars.forEach((b, k) => {
        b.classList.remove('run');
        b.classList.toggle('done', k < i);
        void b.offsetWidth;
        if (k === i) b.classList.add('run');
      });
    }
    if (cur) cur.textContent = String(i + 1).padStart(2, '0');
    clearTimeout(timer);
    remaining = DUR;
    started = Date.now();
    if (!reduce) timer = setTimeout(() => go(i + 1), DUR);
    if (reduce && bars.length) bars.forEach((b, k) => b.classList.toggle('done', k <= i));
  }

  let remaining = DUR, started = 0;
  function pause() {
    hero.classList.add('paused');
    clearTimeout(timer);
    remaining = Math.max(300, DUR - (Date.now() - started));
  }
  function resume() {
    if (reduce) return;
    hero.classList.remove('paused');
    timer = setTimeout(() => go(i + 1), remaining);
    started = Date.now() - (DUR - remaining);
  }

  if (hPrev) hPrev.addEventListener('click', () => go(i - 1));
  if (hNext) hNext.addEventListener('click', () => go(i + 1));
  bars.forEach((b, k) => b.addEventListener('click', () => go(k)));
  hero.addEventListener('mouseenter', pause);
  hero.addEventListener('mouseleave', resume);
  document.addEventListener('visibilitychange', () => document.hidden ? pause() : resume());

  let x0 = null;
  hero.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  go(0);
})();
