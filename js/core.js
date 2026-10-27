/* Core: config, WhatsApp links, tracking, consent, search + enquiry forms (behaviour carried over from the original script.js) */
(function () {
  'use strict';
  const CONFIG = {
    whatsappNumber: '919999226744',
    address: 'A3-316, Paschim Vihar, New Delhi 110063',
    ads: {enabled: false, call: 'AW-XXXXXXXXXX/CALL_LABEL', whatsapp: 'AW-XXXXXXXXXX/WHATSAPP_LABEL', form: 'AW-XXXXXXXXXX/FORM_LABEL'}
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
  const $ = id => document.getElementById(id);
  const waUrl = t => 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(t);

  /* missing image -> fade out instead of broken icon */
  document.querySelectorAll('img').forEach(i => {
    const hide = () => {i.style.opacity = 0;};
    if (i.complete && i.naturalWidth === 0) hide();
    i.addEventListener('error', hide);
  });

  /* tracking + consent */
  function trackConversion(type) {
    try {
      window.dataLayer.push({event: 'swastik_' + type});
      if (CONFIG.ads.enabled && typeof gtag === 'function' && CONFIG.ads[type]) gtag('event', 'conversion', {send_to: CONFIG.ads[type]});
    } catch (e) {}
  }
  const consentBar = $('consentBar');
  const grantConsent = () => gtag('consent', 'update', {ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'});
  try {
    const saved = localStorage.getItem('swastik_consent');
    if (saved === 'granted') grantConsent(); else if (!saved && CONFIG.ads.enabled) consentBar.style.display = 'block';
  } catch (e) {if (CONFIG.ads.enabled) consentBar.style.display = 'block';}
  function saveConsent(v) {try {localStorage.setItem('swastik_consent', v);} catch (e) {} consentBar.style.display = 'none'; if (v === 'granted') grantConsent();}
  $('consentAccept').onclick = () => saveConsent('granted');
  $('consentDecline').onclick = () => saveConsent('denied');

  /* WhatsApp links */
  document.querySelectorAll('[data-wa]').forEach(el => {
    el.href = waUrl(MESSAGES[el.dataset.wa] || MESSAGES.general);
    el.target = '_blank'; el.rel = 'noopener';
  });
  document.querySelectorAll('[data-area-wa]').forEach(el => {
    el.href = waUrl('Hello Swastik Estate, I am looking for a property in ' + el.dataset.areaWa + ', New Delhi. Please share available options.');
    el.target = '_blank'; el.rel = 'noopener';
    el.addEventListener('click', () => trackConversion('whatsapp'));
  });
  document.querySelectorAll('[data-track]').forEach(el => el.addEventListener('click', () => trackConversion(el.dataset.track)));

  /* directions + address */
  $('directionsBtn').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CONFIG.address);
  $('addressText').textContent = CONFIG.address;

  /* area chips -> location */
  const sLoc = $('sLocation'), chips = document.querySelectorAll('.area-chips button');
  chips.forEach(b => b.addEventListener('click', () => {sLoc.value = b.dataset.area; chips.forEach(x => x.classList.toggle('on', x === b));}));
  sLoc.addEventListener('input', () => chips.forEach(x => x.classList.toggle('on', x.dataset.area.toLowerCase() === sLoc.value.trim().toLowerCase())));

  /* forms */
  function normaliseMobile(v) {
    let d = v.replace(/\D/g, '');
    if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
    if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
    return /^[6-9]\d{9}$/.test(d) ? d : null;
  }
  const fMob = $('fMobile');
  fMob.addEventListener('input', () => {fMob.value = fMob.value.replace(/[^\d+\s-]/g, '');});
  const msg = (box, cls, html) => {box.innerHTML = '<div class="alert ' + cls + '">' + html + '</div>';};
  function handOff(url, box, onDone) {
    const w = window.open(url, '_blank', 'noopener');
    if (w === null) {
      msg(box, 'warn', 'Browser ne WhatsApp block kar diya. <a target="_blank" rel="noopener" href="' + url + '" id="manualWa">WhatsApp kholne ke liye yahan tap karein</a>.');
      $('manualWa').addEventListener('click', () => {trackConversion('form'); msg(box, 'ok', 'WhatsApp khul gaya. Enquiry complete karne ke liye wahan Send dabayein.');});
      return false;
    }
    trackConversion('form');
    msg(box, 'ok', 'WhatsApp khul gaya hai. Enquiry complete karne ke liye wahan Send dabayein.');
    if (onDone) onDone();
    return true;
  }
  const mark = (el, ok) => {el.classList.toggle('is-invalid', !ok); el.classList.toggle('is-valid', ok); return ok;};

  const sStatus = $('searchStatus');
  $('searchForm').addEventListener('submit', e => {
    e.preventDefault(); sStatus.innerHTML = '';
    const loc = sLoc.value.trim() || 'Paschim Vihar';
    const text = 'Hello Swastik Estate, I want to: ' + $('sType').value + ' a property.\nProperty type: ' + $('sProp').value + '\nPreferred location: ' + loc + '\nBudget: ' + $('sBudget').value + '\nPlease share suitable options.';
    handOff(waUrl(text), sStatus);
  });

  const form = $('enquiryForm'), statusBox = $('formStatus');
  form.addEventListener('submit', e => {
    e.preventDefault(); statusBox.innerHTML = '';
    const name = $('fName'), mob = $('fMobile'), interest = $('fInterest');
    const ok = [mark(name, name.value.trim().length >= 2), mark(mob, !!normaliseMobile(mob.value)), mark(interest, !!interest.value)].every(Boolean);
    if (!ok) {form.querySelector('.is-invalid').focus(); return;}
    const lines = ['Hello Swastik Estate, I would like to make a property enquiry.', '',
      'Name: ' + name.value.trim(), 'Mobile: ' + normaliseMobile(mob.value), 'Interested in: ' + interest.value,
      'Preferred location: ' + ($('fLocation').value.trim() || 'Not specified'),
      'Budget: ' + ($('fBudget').value.trim() || 'Not specified'),
      'Message: ' + ($('fMessage').value.trim() || '-')];
    handOff(waUrl(lines.join('\n')), statusBox, () => {form.reset(); form.querySelectorAll('.is-valid').forEach(x => x.classList.remove('is-valid'));});
  });
})();
