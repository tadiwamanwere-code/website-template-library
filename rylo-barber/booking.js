(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const API = '/api/rylo-booking';
  const HISTORY = 'rylo.bookingHistory.v1', PROFILE = 'rylo.bookingDetails.v1';
  const MEMBER = 'rylo.member.v1';
  const profilePage = document.body.dataset.page === 'profile';
  function openDialog(id) {
    $('#booking-dialog').hidden = id !== 'booking-dialog';
    $('#profile-dialog').hidden = id !== 'profile-dialog';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function openBooking() { location.href = 'booking.html'; }
  const stepIds = ['service', 'time', 'details', 'ticket'];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let info, available, service = 'Haircut', barberId = 'kai', date = '', time = '', week = 0, step = 0;
  let requestId = crypto.randomUUID(), ticket = null, sequence = 0, controller, sending = false, toastTimer;
  let loadFailed = false, slotFailed = false;
  function saved(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
  function erase(key) { try { localStorage.removeItem(key); return true; } catch { return false; } }
  function history() { const rows = saved(HISTORY, []); return Array.isArray(rows) ? rows.filter(t => t && typeof t.reference === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.date) && typeof t.time === 'string' && typeof t.service === 'string' && typeof t.barberName === 'string').slice(0, 30) : []; }
  function el(tag, text, cls) { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (cls) e.className = cls; return e; }
  function button(text, cls, fn) { const b = el('button', text, cls); b.type = 'button'; b.onclick = fn; return b; }
  function dayLabel(value, options = {}) { return new Date(value + 'T12:00:00Z').toLocaleDateString('en-GB', { timeZone: 'UTC', ...options }); }
  function error(message = '') { $('#booking-error').textContent = message; }
  function resetChoice() { time = ''; requestId = crypto.randomUUID(); $('#time-next').disabled = true; }
  function selectedService() { return info?.services.find(s => s.id === service); }
  function showStep(value, focus = true) {
    step = value; error();
    stepIds.forEach((id, i) => { const panel = $('#step-' + id); panel.hidden = i !== value; panel.classList.toggle('step-panel-enter', i === value); });
    document.querySelectorAll('[data-step]').forEach((b, i) => { b.parentElement.className = i === value ? 'current' : i < value ? 'done' : ''; b.disabled = sending || i > value || value === 3; if (i === value) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    if (value === 0) paintServices();
    if (value === 1) { paintDates(); paintBarbers(); }
    if (value === 2) paintReview();
    if (focus) {
      $('#step-' + stepIds[value] + ' h3').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
    }
  }
  async function json(url, init) {
    const response = await fetch(url, init);
    const result = await response.json();
    if (!response.ok) { const err = new Error(result.error || 'Something went wrong. Please try again.'); err.status = response.status; throw err; }
    return result;
  }
  function paintServices() {
    if (!info) return;
    const box = $('#service-options'); box.replaceChildren();
    info.services.forEach(s => {
      const b = button('', 'service-option', () => { if (service !== s.id) { service = s.id; resetChoice(); available = null; } paintServices(); $('#service-options [aria-pressed=true]').focus({ preventScroll: true }); });
      b.setAttribute('aria-pressed', String(service === s.id));
      const copy = el('span'); copy.append(el('strong', s.label), el('small', s.description));
      b.append(copy, el('span', s.duration + ' min')); box.append(b);
    });
    $('#service-length').textContent = selectedService().duration + ' minutes, just for you';
  }
  function paintDates() {
    if (!info) return;
    $('#time-service').textContent = selectedService().label + ' · ' + selectedService().duration + ' minutes';
    const box = $('#date-options'); box.replaceChildren();
    const days = info.days.slice(week * 7, week * 7 + 7);
    $('#calendar-month').textContent = days[0].date.slice(0, 7) === days.at(-1).date.slice(0, 7) ? dayLabel(days[0].date, { month: 'long', year: 'numeric' }) : dayLabel(days[0].date, { month: 'short' }) + ' / ' + dayLabel(days.at(-1).date, { month: 'short', year: 'numeric' });
    $('#week-back').disabled = week === 0; $('#week-next').disabled = (week + 1) * 7 >= info.days.length;
    days.forEach(d => {
      const b = button('', 'date-choice', () => { date = d.date; resetChoice(); paintDates(); $('#date-options [aria-pressed=true]').focus({ preventScroll: true }); fetchSlots(); });
      b.append(el('small', dayLabel(d.date, { weekday: 'short' })), el('strong', dayLabel(d.date, { day: 'numeric' })));
      b.disabled = d.closed; b.setAttribute('aria-pressed', String(date === d.date));
      b.setAttribute('aria-label', dayLabel(d.date, { weekday: 'long', day: 'numeric', month: 'long' }) + (d.closed ? ', closed' : ''));
      box.append(b);
    });
  }
  function paintBarbers() {
    if (!info) return;
    const box = $('#barber-options'); box.replaceChildren();
    info.barbers.forEach(b => {
      const choice = button('', 'barber-card', () => { if (barberId !== b.id) { barberId = b.id; resetChoice(); } paintBarbers(); paintTimes(); $('#barber-options [aria-pressed=true]').focus({ preventScroll: true }); });
      choice.setAttribute('aria-pressed', String(barberId === b.id)); choice.setAttribute('aria-label', 'Choose ' + b.name);
      const count = available?.availability.find(x => x.id === b.id)?.slots.filter(x => x.available).length;
      choice.append(el('span', b.initials, 'barber-initial'), el('strong', b.name), el('small', count === undefined ? 'Demo barber' : count + ' times free'));
      box.append(choice);
    });
    $('#barber-specialty').textContent = info.barbers.find(b => b.id === barberId)?.specialty || '';
  }
  function paintTimes() {
    const box = $('#time-options'); box.replaceChildren();
    const slots = available?.availability.find(b => b.id === barberId)?.slots || [];
    slots.forEach(s => {
      const b = button(s.time, 'time-choice', () => { time = s.time; requestId = crypto.randomUUID(); paintTimes(); $('#time-options [aria-pressed=true]').focus({ preventScroll: true }); });
      b.disabled = !s.available; b.setAttribute('aria-pressed', String(time === s.time));
      b.setAttribute('aria-label', s.time + (s.available ? ', available' : ', unavailable')); box.append(b);
    });
    const count = slots.filter(s => s.available).length;
    $('#slot-count').textContent = available ? count + ' free' : '';
    $('#time-next').disabled = !time || !available || !slots.some(s => s.available && s.time === time);
    if (available) $('#slot-status').textContent = count ? '' : 'No times left for this barber on this day. Try another barber or date.';
  }
  async function fetchSlots() {
    if (!info) return;
    const seq = ++sequence; controller?.abort(); controller = new AbortController();
    available = null; slotFailed = false; $('#booking-retry').hidden = true; error();
    $('#slot-status').textContent = 'Checking available times…'; $('#step-time').setAttribute('aria-busy', 'true'); paintTimes(); paintBarbers();
    try {
      const result = await json(API + '?action=availability&date=' + encodeURIComponent(date) + '&service=' + encodeURIComponent(service), { signal: controller.signal });
      if (seq !== sequence) return;
      available = result; paintBarbers(); paintTimes();
    } catch (e) {
      if (seq !== sequence || e.name === 'AbortError') return;
      slotFailed = true; $('#slot-status').textContent = 'We could not load times. Please try again.'; $('#booking-retry').hidden = false;
    } finally { if (seq === sequence) $('#step-time').removeAttribute('aria-busy'); }
  }
  function paintReview() {
    const box = $('#booking-review'); box.replaceChildren();
    box.append(el('strong', selectedService().label + ' with ' + info.barbers.find(b => b.id === barberId).name));
    box.append(el('p', dayLabel(date, { weekday: 'long', day: 'numeric', month: 'long' }) + ' at ' + time));
    box.append(el('p', selectedService().duration + ' minutes · Harare time (UTC+2) · Demo'));
  }
  function showTicket(value) {
    ticket = value; if ($('#booking-dialog').hidden) openDialog('booking-dialog'); showStep(3);
    const box = $('#booking-ticket'); box.replaceChildren();
    const head = el('div', undefined, 'ticket-head'); head.append(el('span', 'rylo.', 'ticket-brand'), el('span', 'BOOKED / DEMO', 'ticket-stamp')); box.append(head);
    box.append(el('p', dayLabel(value.date, { weekday: 'long', day: 'numeric', month: 'long' }), 'ticket-date'));
    box.append(el('p', value.time + ' · Harare time (UTC+2)', 'ticket-time'));
    const data = el('dl', undefined, 'ticket-data');
    [['Service', value.service], ['Barber', value.barberName], ['Your time', value.duration + ' minutes'], ['Status', 'Demo ' + value.status]].forEach(([label, text]) => { const item = el('div'); item.append(el('dt', label), el('dd', text)); data.append(item); });
    box.append(data, el('p', value.reference, 'ticket-reference'), el('p', 'A demo experience. Not a real appointment.', 'ticket-footer'));
  }
  function renderHistory() {
    const rows = history(); const member = saved(MEMBER, null), person = saved(PROFILE, null);
    $('#profile-greeting').textContent = member || rows.length ? (person?.name ? 'Welcome back, ' + person.name + '.' : 'Welcome to your Rylo profile.') + ' ' + rows.length + (rows.length === 1 ? ' visit saved.' : ' visits saved.') : 'Your profile is created after your first booking.';
    $('#history-count').textContent = String(rows.length);
    const box = $('#history-list'); box.replaceChildren();
    if (!rows.length) box.append(el('p', 'Your tickets will appear here after booking.', 'history-hint'));
    rows.forEach(t => { const card = el('div', undefined, 'history-card'), copy = el('div'); copy.append(el('strong', t.service + ' · ' + t.barberName), el('small', dayLabel(t.date, { day: 'numeric', month: 'short' }) + ' at ' + t.time), el('small', t.reference)); card.append(copy, button('View ticket', '', () => { showTicket(t); $('#local-note').textContent = 'Saved on this device. Status shown is from when this ticket was saved.'; })); box.append(card); });
    $('#clear-history').disabled = !rows.length;
    const profile = saved(PROFILE, null); $('#forget-details').hidden = !(profile && typeof profile.name === 'string');
  }
  function toast(value) {
    clearTimeout(toastTimer); $('#toast-copy').textContent = value.barberName + ' · ' + dayLabel(value.date, { day: 'numeric', month: 'short' }) + ' · ' + value.time + '. Your demo ticket is ready.';
    $('#booking-toast').classList.add('shown'); toastTimer = setTimeout(() => $('#booking-toast').classList.remove('shown'), 8000);
  }
  function startAgain() {
    ticket = null; requestId = crypto.randomUUID(); resetChoice();
    $('#notes').value = ''; $('#website').value = ''; $('#booking-toast').classList.remove('shown');
    const profile = saved(PROFILE, null);
    $('#name').value = typeof profile?.name === 'string' ? profile.name : ''; $('#phone').value = typeof profile?.phone === 'string' ? profile.phone : ''; $('#remember-details').checked = !!profile;
    showStep(0);
  }
  async function load() {
    $('#booking-loading').hidden = false; $('#booking-panel').setAttribute('aria-busy', 'true'); $('#booking-retry').hidden = true; error();
    try {
      info = await json(API + '?action=availability'); loadFailed = false;
      if (!info.services.some(s => s.id === service)) service = info.services[0].id;
      date = info.days.find(d => !d.closed).date; showStep(0, false);
      const profile = saved(PROFILE, null);
      if (typeof profile?.name === 'string' && typeof profile?.phone === 'string') { $('#name').value = profile.name; $('#phone').value = profile.phone; $('#remember-details').checked = true; }
    } catch (e) { loadFailed = true; error('Booking could not load. Please try again.'); $('#booking-retry').hidden = false; }
    finally { $('#booking-loading').hidden = true; $('#booking-panel').setAttribute('aria-busy', 'false'); renderHistory(); }
  }
  $('#service-next').onclick = () => { showStep(1); fetchSlots(); };
  $('#time-back').onclick = () => showStep(0);
  $('#time-next').onclick = () => { if (!$('#time-next').disabled) showStep(2); };
  $('#details-back').onclick = () => { showStep(1); fetchSlots(); };
  function changeWeek(delta) { week += delta; date = info.days.slice(week * 7, week * 7 + 7).find(d => !d.closed).date; resetChoice(); paintDates(); fetchSlots(); }
  $('#week-back').onclick = () => changeWeek(-1);
  $('#week-next').onclick = () => changeWeek(1);
  $('#booking-retry').onclick = () => loadFailed ? load() : slotFailed ? fetchSlots() : load();
  document.querySelectorAll('[data-step]').forEach((b, i) => b.onclick = () => { if (i < step && !sending && step !== 3) { showStep(i); if (i === 1) fetchSlots(); } });
  document.querySelectorAll('[data-service],[data-look]').forEach(b => b.onclick = () => {
    if (sending) return;
    openDialog('booking-dialog');
    service = b.dataset.service || 'Haircut'; resetChoice();
    if (b.dataset.look) $('#notes').value = 'I would like: ' + b.dataset.look + '.';
    if (info) { showStep(1); fetchSlots(); } else $('#book').scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' });
  });
  $('#booking-form').onsubmit = async e => {
    e.preventDefault(); if (sending || !e.target.reportValidity() || !available || !time) return;
    const phone = $('#phone').value.trim();
    if (!/^[+\d ()-]{7,30}$/.test(phone) || phone.replace(/\D/g, '').length < 7) { error('Please enter a valid phone number.'); $('#phone').focus(); return; }
    const body = { requestId, demo: true, service, barberId, date, time, offset: -120, name: $('#name').value.trim(), phone, notes: $('#notes').value, website: $('#website').value };
    const remember = $('#remember-details').checked;
    sending = true; $('#details-fields').disabled = true; document.querySelectorAll('[data-step]').forEach(b => b.disabled = true); $('#submit-booking').textContent = 'Saving your place…'; error();
    try {
      const result = await json(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(25000) });
      if (!result.ticket) throw new Error('We could not load your ticket. Please try again.');
      if (!saved(MEMBER, null)) save(MEMBER, { id: crypto.randomUUID(), createdAt: new Date().toISOString() });
      const ticketSaved = save(HISTORY, [result.ticket, ...history().filter(t => t.id !== result.ticket.id)].slice(0, 30));
      const profileSaved = remember ? save(PROFILE, { name: body.name, phone: body.phone }) : erase(PROFILE);
      showTicket(result.ticket); renderHistory();
      $('#local-note').textContent = !ticketSaved ? 'Your booking was saved, but this browser could not save your history. Download your ticket below.' : remember && !profileSaved ? 'Ticket saved on this device. Your contact details could not be saved.' : 'Your Rylo profile is ready. Your ticket is saved in your profile on this device.';
      toast(result.ticket);
    } catch (e) {
      if (e.status === 409) { resetChoice(); showStep(1); await fetchSlots(); error('That time was just taken. Pick another free time. Your details are still here.'); }
      else error(e.name === 'TimeoutError' ? 'The connection took too long. Try again. The same request will not create a second booking.' : e.message);
    } finally {
      sending = false; $('#details-fields').disabled = false; $('#submit-booking').innerHTML = 'Book demo visit <span aria-hidden="true"><svg class="ui-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" style="display:inline-block;vertical-align:middle;flex-shrink:0"><path d="M6 18 18 6M6 6h12v12"/></svg></span>';
      document.querySelectorAll('[data-step]').forEach((b, i) => b.disabled = i > step || step === 3);
    }
  };
  $('#new-booking').onclick = () => profilePage ? openBooking() : startAgain();
  $('#close-toast').onclick = () => $('#booking-toast').classList.remove('shown');
  $('#save-ticket').onclick = () => {
    if (!ticket) return;
    const content = ['RYLO | DEMO BOOKING TICKET', '', 'Reference: ' + ticket.reference, 'Service: ' + ticket.service, 'Barber: ' + ticket.barberName, 'Date: ' + ticket.date, 'Time: ' + ticket.time + ' (Harare, UTC+2)', 'Length: ' + ticket.duration + ' minutes', 'Status: Demo ' + ticket.status, '', 'This is a demo ticket, not a real appointment.'].join('\r\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' })); const a = el('a'); a.href = url; a.download = 'Rylo-' + ticket.reference + '.txt'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
  };
  $('#clear-history').onclick = () => { if (confirm('Clear booking history from this device? Saved bookings in the shop inbox will stay.')) { const ok = erase(HISTORY); renderHistory(); if (!ok) error('This browser could not clear its saved history.'); } };
  $('#forget-details').onclick = () => { if (erase(PROFILE)) { $('#remember-details').checked = false; $('#name').value = ''; $('#phone').value = ''; renderHistory(); } else error('This browser could not clear saved details.'); };
  $('#remember-details').onchange = () => { if (!$('#remember-details').checked) { erase(PROFILE); renderHistory(); } };
  window.addEventListener('storage', renderHistory);
  document.querySelectorAll('[data-open-booking],a[href="#book"]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); if (!sending) openBooking(); }));
  document.querySelectorAll('[data-open-profile]').forEach(b => b.onclick = () => { location.href = 'profile.html'; });
  openDialog(profilePage ? 'profile-dialog' : 'booking-dialog');
  const params = new URLSearchParams(location.search);
  service = params.get('service') || service;
  if (params.get('look')) $('#notes').value = 'I would like: ' + params.get('look').slice(0,200) + '.';
  renderHistory();
  if (!profilePage) load();

})();
