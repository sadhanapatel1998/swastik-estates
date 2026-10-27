/* Header: scroll state, scroll-spy, mobile drawer */
(function () {
  'use strict';
  const header = document.getElementById('siteHeader'), burger = document.getElementById('burger'), drawer = document.getElementById('drawer');
  const links = [...document.querySelectorAll('#mainNav a, #drawer a.dl')];
  const secs = [...new Set(links.map(a => a.getAttribute('href')))].map(h => document.querySelector(h)).filter(Boolean).sort((a, b) => a.offsetTop - b.offsetTop);
  let tick = false;
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
    const y = window.scrollY + 140; let cur = secs[0];
    secs.forEach(s => {if (s.getBoundingClientRect().top + window.scrollY <= y) cur = s;});
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur.id));
    tick = false;
  }
  window.addEventListener('scroll', () => {if (!tick) {tick = true; requestAnimationFrame(onScroll);}}, {passive: true});
  onScroll();
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    burger.setAttribute('aria-expanded', open); drawer.setAttribute('aria-hidden', !open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {if (e.key === 'Escape') setMenu(false);});
  window.matchMedia('(min-width:1101px)').addEventListener('change', e => {if (e.matches) setMenu(false);});
})();
