
    (function () {
      'use strict';

      /* ===================== CONFIG ===================== */
      const CONFIG = {
        whatsappNumber: '919999226744',
        address: 'A3-316, Paschim Vihar, New Delhi 110063',
        ads: {
          enabled: false,   // real tags install + test hone ke baad hi true karein
          call: 'AW-XXXXXXXXXX/CALL_LABEL',
          whatsapp: 'AW-XXXXXXXXXX/WHATSAPP_LABEL',
          form: 'AW-XXXXXXXXXX/FORM_LABEL'
        }
      };

      const MESSAGES = {
        general: 'Hello Swastik Estate, I would like to know more about your property services.',
        sales: 'Hello Swastik Estate, I want to sell my property in Paschim Vihar / nearby area. Please contact me with details.',
        purchase: 'Hello Swastik Estate, I am looking to buy a residential property. Please share suitable options based on my requirements.',
        renting: 'Hello Swastik Estate, I am interested in renting a property / renting out my property. Please contact me.',
        collaboration: 'Hello Swastik Estate, I would like to discuss a property collaboration opportunity.',
        featured: 'Hello Swastik Estate, I am interested in the 3 BHK Ground Floor (LIG, fully extended, brand new work) for sale in Paschim Vihar, Delhi, asking price ₹1.09 Crore (negotiable). Please share details.',
        featured_details: 'Hello Swastik Estate, please share further details and availability for the 3 BHK Ground Floor for sale in Paschim Vihar, Delhi.',
        featured_visit: 'Hello Swastik Estate, I would like to schedule a visit for the 3 BHK Ground Floor for sale in Paschim Vihar, Delhi. Please let me know available timings.'
      };
      const waUrl = t => 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(t);

      /* Missing image -> hide (beige wrapper dikhega) */
      document.querySelectorAll('img').forEach(i => {
        const hide = () => {i.style.opacity = 0;};
        if (i.complete && i.naturalWidth === 0) hide();
        i.addEventListener('error', hide);
      });

      /* ===================== Tracking ===================== */
      function trackConversion(type) {
        try {
          window.dataLayer.push({event: 'swastik_' + type});
          if (CONFIG.ads.enabled && typeof gtag === 'function' && CONFIG.ads[type]) gtag('event', 'conversion', {send_to: CONFIG.ads[type]});
        } catch (e) { }
      }
      const consentBar = document.getElementById('consentBar');
      function grantConsent() {gtag('consent', 'update', {ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'});}
      try {
        const saved = localStorage.getItem('swastik_consent');
        if (saved === 'granted') grantConsent(); else if (!saved && CONFIG.ads.enabled) consentBar.style.display = 'block';
      } catch (e) {if (CONFIG.ads.enabled) consentBar.style.display = 'block';}
      function saveConsent(v) {try {localStorage.setItem('swastik_consent', v);} catch (e) { } consentBar.style.display = 'none'; if (v === 'granted') grantConsent();}
      document.getElementById('consentAccept').onclick = () => saveConsent('granted');
      document.getElementById('consentDecline').onclick = () => saveConsent('denied');

      /* ===================== WhatsApp links ===================== */
      document.querySelectorAll('[data-wa]').forEach(el => {
        el.href = waUrl(MESSAGES[el.dataset.wa] || MESSAGES.general);
        el.target = '_blank'; el.rel = 'noopener';
      });
      document.querySelectorAll('[data-track]').forEach(el => el.addEventListener('click', () => trackConversion(el.dataset.track)));

      /* Directions */
      const dir = document.getElementById('directionsBtn');
      dir.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CONFIG.address || 'Swastik Estate Paschim Vihar Delhi');
      if (CONFIG.address) document.getElementById('addressText').textContent = CONFIG.address;

      /* Area chips -> location fill; area cards -> WhatsApp */
      const sLoc = document.getElementById('sLocation'), chips = document.querySelectorAll('.area-chips button');
      chips.forEach(b => b.addEventListener('click', () => {
        sLoc.value = b.dataset.area;
        chips.forEach(x => x.classList.toggle('on', x === b));
      }));
      sLoc.addEventListener('input', () => chips.forEach(x => x.classList.toggle('on', x.dataset.area.toLowerCase() === sLoc.value.trim().toLowerCase())));
      document.querySelectorAll('[data-area-wa]').forEach(el => {
        el.href = waUrl('Hello Swastik Estate, I am looking for a property in ' + el.dataset.areaWa + ', New Delhi. Please share available options.');
        el.target = '_blank'; el.rel = 'noopener';
        el.addEventListener('click', () => trackConversion('whatsapp'));
      });

      /* Active nav on scroll */
      const navLinks = document.querySelectorAll('.site-nav .nav-link');
      const secs = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
      window.addEventListener('scroll', () => {
        const y = window.scrollY + 120; let cur = secs[0];
        secs.forEach(s => {if (s.offsetTop <= y) cur = s;});
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur.id));
      }, {passive: true});
      navLinks.forEach(a => a.addEventListener('click', () => {
        const c = document.getElementById('mainNav'); if (c.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(c).hide();
      }));

      /* ===================== Forms ===================== */
      function normaliseMobile(v) {
        let d = v.replace(/\D/g, '');
        if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
        if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
        return /^[6-9]\d{9}$/.test(d) ? d : null;
      }
      const fMob = document.getElementById('fMobile');
      fMob.addEventListener('input', () => {fMob.value = fMob.value.replace(/[^\d+\s-]/g, '');});

      function handOff(url, box, onDone) {
        const w = window.open(url, '_blank', 'noopener');
        if (w === null) {
          box.innerHTML = '<div class="alert alert-warning py-2 mb-0">Browser ne WhatsApp block kar diya. <a class="alert-link" target="_blank" rel="noopener" href="' + url + '" id="manualWa">WhatsApp kholne ke liye yahan tap karein</a>.</div>';
          document.getElementById('manualWa').addEventListener('click', () => {
            trackConversion('form');
            box.innerHTML = '<div class="alert alert-success py-2 mb-0">WhatsApp khul gaya. Enquiry complete karne ke liye wahan Send dabayein.</div>';
          });
          return false;
        }
        trackConversion('form');
        box.innerHTML = '<div class="alert alert-success py-2 mb-0">WhatsApp khul gaya hai. Enquiry complete karne ke liye wahan Send dabayein.</div>';
        if (onDone) onDone();
        return true;
      }
      function mark(el, valid) {el.classList.toggle('is-invalid', !valid); el.classList.toggle('is-valid', valid); return valid;}

      // Hero search bar
      const sForm = document.getElementById('searchForm'), sStatus = document.getElementById('searchStatus');
      sForm.addEventListener('submit', e => {
        e.preventDefault(); sStatus.innerHTML = '';
        const loc = document.getElementById('sLocation').value.trim() || 'Paschim Vihar';
        const type = document.getElementById('sType').value, time = document.getElementById('sTime').value;
        const text = 'Hello Swastik Estate, I want to: ' + type + '.\nPreferred location: ' + loc + '\nComfortable time to contact me: ' + time + '\nPlease share suitable options.';
        handOff(waUrl(text), sStatus);
      });

      // Main form
      const form = document.getElementById('enquiryForm'), statusBox = document.getElementById('formStatus');
      form.addEventListener('submit', e => {
        e.preventDefault(); statusBox.innerHTML = '';
        const name = document.getElementById('fName'), mob = document.getElementById('fMobile'), interest = document.getElementById('fInterest');
        const ok = [mark(name, name.value.trim().length >= 2), mark(mob, !!normaliseMobile(mob.value)), mark(interest, !!interest.value)].every(Boolean);
        if (!ok) {form.querySelector('.is-invalid').focus(); return;}
        const lines = [
          'Hello Swastik Estate, I would like to make a property enquiry.', '',
          'Name: ' + name.value.trim(),
          'Mobile: ' + normaliseMobile(mob.value),
          'Interested in: ' + interest.value,
          'Preferred location: ' + (document.getElementById('fLocation').value.trim() || 'Not specified'),
          'Budget: ' + (document.getElementById('fBudget').value.trim() || 'Not specified'),
          'Message: ' + (document.getElementById('fMessage').value.trim() || '-')
        ];
        handOff(waUrl(lines.join('\n')), statusBox, () => {form.reset(); form.querySelectorAll('.is-valid').forEach(x => x.classList.remove('is-valid'));});
      });

      /* ===================== Reveal + back to top ===================== */
      const items = document.querySelectorAll('.reveal');
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(en => en.forEach(x => {if (x.isIntersecting) {x.target.classList.add('in'); io.unobserve(x.target);} }), {threshold: .12});
        items.forEach(i => io.observe(i));
      } else items.forEach(i => i.classList.add('in'));

      const toTop = document.getElementById('toTop');
      window.addEventListener('scroll', () => {toTop.style.display = window.scrollY > 600 ? 'block' : 'none';}, {passive: true});
      toTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
    })();
 