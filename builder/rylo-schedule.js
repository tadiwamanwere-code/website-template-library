'use strict';
// These names, hours and lengths are demo data approved by the owner.
const SERVICES = [
  { id: 'Haircut', label: 'The haircut', duration: 30, description: 'A fresh shape, a clean fade, your own style.' },
  { id: 'Beard tidy', label: 'The beard tidy', duration: 20, description: 'A balanced shape and a sharp outline.' },
  { id: 'Haircut and beard', label: 'The full finish', duration: 50, description: 'Hair and beard, brought together.' }
];
const BARBERS = [
  { id: 'kai', name: 'Kai', initials: 'K', specialty: 'Classic cuts & clean lines' },
  { id: 'ren', name: 'Ren', initials: 'R', specialty: 'Texture & longer shapes' },
  { id: 'tayo', name: 'Tayo', initials: 'T', specialty: 'Fades & beard shaping' }
];
const OFFSET = -120;
function today(now = Date.now()) { return new Date(+now + 120 * 60000).toISOString().slice(0, 10); }
function days(now = Date.now()) {
  return Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today(now) + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + i);
    return { date: d.toISOString().slice(0, 10), closed: d.getUTCDay() === 1 };
  });
}
function catalog(now) { return { demo: true, timezone: 'Africa/Harare', timezoneLabel: 'Harare time (UTC+2)', services: SERVICES, barbers: BARBERS, days: days(now) }; }
function slotKey(date, barberId, time) { return date + '/' + barberId + '-' + time.replace(':', '') + '.json'; }
function slots(date, serviceId, barberId, occupied = new Set(), now = Date.now()) {
  const day = days(now).find(d => d.date === date);
  const service = SERVICES.find(s => s.id === serviceId);
  const barber = BARBERS.find(b => b.id === barberId);
  if (!day || day.closed || !service || !barber) return [];
  const sunday = new Date(date + 'T12:00:00Z').getUTCDay() === 0;
  const start = sunday ? 10 : 9, end = sunday ? 15 : 18;
  const seed = Number(date.slice(-2)) + BARBERS.indexOf(barber) * 2;
  const result = [];
  for (let hour = start; hour < end; hour++) {
    const time = String(hour).padStart(2, '0') + ':00';
    const at = Date.parse(date + 'T' + time + ':00+02:00');
    const unavailable = hour === 13 || (hour + seed) % 7 === 0 || at <= +now + 15 * 60000 || occupied.has(slotKey(date, barberId, time));
    result.push({ time, available: !unavailable });
  }
  return result;
}
function ticket(record) {
  return { id: record.id, reference: record.reference, demo: true, service: record.service, duration: record.duration, barberId: record.barberId, barberName: record.barberName, date: record.date, time: record.time, timezone: 'Africa/Harare', offset: OFFSET, status: record.status, createdAt: record.createdAt };
}
module.exports = { SERVICES, BARBERS, OFFSET, catalog, days, slots, slotKey, ticket };
