/* Scroll effects: reveal, counters, process timeline, parallax, back-to-top */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const $ = id => document.getElementById(id);

  /* reveal */
  const items = document.querySelectorAll('.reveal,.img-reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(en => en.forEach(x => {if (x.isIntersecting) {x.target.classList.add('in'); io.unobserve(x.target);}}), {threshold: .12, rootMargin: '0px 0px -40px 0px'});
    items.forEach(i => io.observe(i));
  } else items.forEach(i => i.classList.add('in'));

  /* counters */
  const counters = document.querySelectorAll('[data-count]');
  function runCount(el) {
    const to = +el.dataset.count, t0 = performance.now(), d = 1400;
    (function f(t) {const p = Math.min(1, (t - t0) / d); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f);})(t0);
  }
  if ('IntersectionObserver' in window && !reduce) {
    const co = new IntersectionObserver(en => en.forEach(x => {if (x.isIntersecting) {runCount(x.target); co.unobserve(x.target);}}), {threshold: .6});
    counters.forEach(c => {c.textContent = '0'; co.observe(c);});
  }

  /* process timeline: steps activate one by one */
  const steps = $('steps'), stepEls = [...steps.querySelectorAll('.step')];
  if ('IntersectionObserver' in window && !reduce) {
    const so = new IntersectionObserver(en => {if (en[0].isIntersecting) {
      steps.classList.add('go-line'); stepEls.forEach((s, k) => setTimeout(() => s.classList.add('on'), 500 + k * 750)); so.disconnect();}}, {threshold: .35});
    so.observe(steps);
  } else {steps.classList.add('go-line'); stepEls.forEach(s => s.classList.add('on'));}

  /* parallax (cinematic CTA) */
  const cine = $('cineBg');
  if (cine && !reduce) {
    const sec = cine.parentElement; let t = false;
    const upd = () => {const r = sec.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) cine.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - innerHeight / 2) * -0.12).toFixed(1) + 'px,0)'; t = false;};
    addEventListener('scroll', () => {if (!t) {t = true; requestAnimationFrame(upd);}}, {passive: true}); upd();
  }

  /* back to top */
  const top = $('toTop');
  addEventListener('scroll', () => {top.style.display = scrollY > 700 ? 'block' : 'none';}, {passive: true});
  top.addEventListener('click', () => scrollTo({top: 0, behavior: 'smooth'}));
})();
