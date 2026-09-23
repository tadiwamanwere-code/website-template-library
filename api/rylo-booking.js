'use strict';
const crypto = require('node:crypto');
const BASE = 'https://blob.vercel-storage.com';
const PREFIX = 'rylo-bookings/';
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const SERVICES = ['Haircut', 'Beard tidy', 'Haircut and beard'];
const limits = new Map();
const schedule = require('../builder/rylo-schedule');
const HOLD_PREFIX = 'rylo-slot-holds/';
function config() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const secret = process.env.BUILDER_API_KEY;
  const passcode = process.env.BUILDER_AI_PASSCODE;
  if (!token || !secret || !passcode) throw new Error('Booking storage is not configured');
  return { token, passcode, key: crypto.createHash('sha256').update('rylo-bookings-v1:' + secret).digest() };
}
function secureEqual(a, b) {
  return crypto.timingSafeEqual(crypto.createHash('sha256').update(String(a || '')).digest(), crypto.createHash('sha256').update(String(b || '')).digest());
}
function seal(record, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(record), 'utf8'), cipher.final()]);
  return JSON.stringify({ v: 1, iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: data.toString('base64') });
}
function unseal(body, key) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(body.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(body.tag, 'base64'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(body.data, 'base64')), decipher.final()]).toString('utf8'));
}
async function storage(path, cfg, init = {}) {
  const response = await fetch(BASE + path, { ...init, headers: { authorization: 'Bearer ' + cfg.token, 'x-api-version': '7', ...init.headers }, signal: AbortSignal.timeout(12000) });
  if (!response.ok) { const detail = await response.json().catch(() => ({})); const error = new Error('Booking storage request failed'); error.status = response.status; error.code = detail.error?.message?.includes('already exists') ? 'blob_exists' : detail.error?.code; throw error; }
  return response.json();
}
async function blobs(cfg, prefix, cursor) {
  return storage('?prefix=' + encodeURIComponent(prefix) + '&limit=100' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : ''), cfg);
}
async function find(id, cfg) {
  const pathname = PREFIX + id + '.json';
  const result = await blobs(cfg, pathname);
  return (result.blobs || []).find(b => b.pathname === pathname);
}
async function read(blob, cfg) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(blob.url + '?t=' + Date.now(), { cache: 'no-store', signal: AbortSignal.timeout(12000) });
    if (response.ok) return unseal(await response.json(), cfg.key);
    if (attempt === 3 || ![404, 429, 500, 502, 503, 504].includes(response.status)) {
      throw new Error('Booking could not be read (' + response.status + ')');
    }
    await new Promise(resolve => setTimeout(resolve, [250, 750, 1500][attempt]));
  }
}

async function put(record, cfg, overwrite = false) {
  await storage('/' + PREFIX + record.id + '.json', cfg, { method: 'PUT', headers: { 'content-type': 'application/json', 'x-content-type': 'application/json', 'x-add-random-suffix': '0', 'x-cache-control-max-age': '0', 'x-allow-overwrite': overwrite ? '1' : '0' }, body: seal(record, cfg.key) });
}

async function occupiedSlots(date, cfg) {
  const occupied = new Set(); let cursor;
  do {
    const page = await blobs(cfg, HOLD_PREFIX + date + '/', cursor);
    (page.blobs || []).forEach(b => occupied.add(b.pathname.slice(HOLD_PREFIX.length)));
    cursor = page.hasMore ? page.cursor : null;
  } while (cursor);
  return occupied;
}
async function holdSlot(record, cfg) {
  const path = HOLD_PREFIX + schedule.slotKey(record.date, record.barberId, record.time);
  try {
    await storage('/?pathname=' + encodeURIComponent(path), cfg, { method: 'PUT', headers: { 'x-api-version': '12', 'x-vercel-blob-access': 'public', 'content-type': 'application/json', 'x-content-type': 'application/json', 'x-add-random-suffix': '0', 'x-allow-overwrite': '0', 'x-cache-control-max-age': '60' }, body: seal({ id: record.id }, cfg.key) });
  } catch (error) {
    // A new Blob can appear in reads shortly after its conditional write.
    // The provider's already-exists response is enough to reject a competing booking.
    let owner;
    try {
      const page = await blobs(cfg, path);
      const existing = (page.blobs || []).find(b => b.pathname === path);
      if (existing) owner = await read(existing, cfg);
    } catch { /* Preserve the write result when the new file is not readable yet. */ }
    if (owner?.id === record.id) return;
    if (owner || error.code === 'blob_exists' || error.status === 409) {
      const conflict = new Error('That time was just taken. Please choose another.'); conflict.status = 409; throw conflict;
    }
    throw error;
  }
}

async function releaseSlot(record, cfg) {
  if (!record.demo || !record.barberId) return;
  const path = HOLD_PREFIX + schedule.slotKey(record.date, record.barberId, record.time);
  const page = await blobs(cfg, path);
  const existing = (page.blobs || []).find(b => b.pathname === path);
  if (existing && (await read(existing, cfg)).id === record.id) {
    await storage('/delete', cfg, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ urls: [existing.url] }) });
  }
}

function validation(b, now = new Date()) {
  if (!b || !UUID.test(b.requestId || '')) return 'Please reload the page and try again.';
  if (!SERVICES.includes(b.service)) return 'Please choose a service.';
  if (typeof b.name !== 'string' || b.name.trim().length < 2 || b.name.length > 100) return 'Please enter your name.';
  if (typeof b.phone !== 'string' || !/^[+\d ()-]{7,30}$/.test(b.phone) || b.phone.replace(/\D/g, '').length < 7) return 'Please enter a valid phone number.';
  if (typeof b.notes !== 'string' || b.notes.length > 700) return 'Please keep your note under 700 characters.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date || '') || !/^([01]\d|2[0-3]):[0-5]\d$/.test(b.time || '')) return 'Please choose a date and time.';
  if (!Number.isInteger(b.offset) || b.offset < -840 || b.offset > 840) return 'Please reload the page and try again.';
  const wall = new Date(b.date + 'T' + b.time + ':00Z');
  if (!Number.isFinite(+wall) || wall.toISOString().slice(0, 10) !== b.date) return 'Please choose a valid date.';
  const at = +wall + b.offset * 60000;
  if (at <= +now || at > +now + 91 * 86400000) return 'Please choose a future time within the next 90 days.';
  return null;
}
async function bodyOf(req) {
  if (req.body !== undefined) {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(raw) > 8192) throw new Error('Request too large');
    return typeof req.body === 'string' ? JSON.parse(raw) : req.body;
  }
  let raw = '';
  for await (const chunk of req) { raw += chunk; if (Buffer.byteLength(raw) > 8192) throw new Error('Request too large'); }
  return JSON.parse(raw || '{}');
}
function reply(res, status, value) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(value));
}
async function handler(req, res) {
  let cfg;
  try { cfg = config(); } catch { return reply(res, 503, { error: 'Booking is temporarily unavailable. Please try again shortly.' }); }
  const method = req.method;
  const admin = secureEqual(req.headers['x-rylo-passcode'], cfg.passcode);
  const url = new URL(req.url || '/', 'http://localhost');
  const availability = method === 'GET' && url.searchParams.get('action') === 'availability';
  if (method !== 'POST' && !availability && !admin) return reply(res, 401, { error: 'Enter your builder passcode to view bookings.' });
  if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(method)) return reply(res, 405, { error: 'Method not allowed.' });
  const origin = req.headers.origin;
  if (origin) {
    try { if (new URL(origin).host !== req.headers.host) return reply(res, 403, { error: 'Please book from the Rylo website.' }); }
    catch { return reply(res, 403, { error: 'Invalid origin.' }); }
  }
  try {
    if (availability) {
      const info = schedule.catalog();
      const date = url.searchParams.get('date');
      const service = url.searchParams.get('service');
      if (!date) return reply(res, 200, info);
      if (!info.days.some(d => d.date === date) || !SERVICES.includes(service)) return reply(res, 422, { error: 'Please choose a date and service.' });
      const occupied = await occupiedSlots(date, cfg);
      return reply(res, 200, { ...info, date, availability: info.barbers.map(b => ({ ...b, slots: schedule.slots(date, service, b.id, occupied) })) });
    }
    if (method === 'GET') {
      const all = []; let cursor;
      do {
        const page = await blobs(cfg, PREFIX, cursor);
        all.push(...await Promise.all((page.blobs || []).map(b => read(b, cfg))));
        cursor = page.hasMore ? page.cursor : null;
      } while (cursor);
      return reply(res, 200, { bookings: all.sort((a,b) => b.createdAt.localeCompare(a.createdAt)) });
    }
    let b;
    try { b = await bodyOf(req); } catch { return reply(res, 400, { error: 'We could not read the request. Please try again.' }); }
    if (method === 'POST') {
      if (!b || typeof b !== 'object' || Array.isArray(b)) return reply(res, 422, { error: 'Please send a valid booking.' });
      if (b.website) return reply(res, 400, { error: 'Please leave the website field empty.' });
      b.offset = schedule.OFFSET;
      const invalid = validation(b);
      if (invalid) return reply(res, 422, { error: invalid });
      const ip = req.headers['x-forwarded-for'] || 'local';
      const bucket = limits.get(ip) || { count: 0, until: 0 };
      if (bucket.until < Date.now()) { bucket.count = 0; bucket.until = Date.now() + 60000; }
      if (++bucket.count > 8) return reply(res, 429, { error: 'Please wait a minute before trying again.' });
      limits.set(ip, bucket);
      if (limits.size > 2000) for (const [key, value] of limits) if (value.until < Date.now()) limits.delete(key);
      const existing = await find(b.requestId, cfg);
      if (existing) {
        const record = await read(existing, cfg);
        return reply(res, 200, { reference: record.reference, status: record.status, ticket: schedule.ticket(record) });
      }
      const barber = schedule.BARBERS.find(x => x.id === b.barberId);
      if (!barber || b.demo !== true) return reply(res, 422, { error: 'Choose a demo barber before booking.' });
      const choices = schedule.slots(b.date, b.service, barber.id);
      if (!choices.some(x => x.time === b.time && x.available)) return reply(res, 409, { error: 'That time is no longer available. Please choose another.' });
      const record = { id: b.requestId, reference: 'RY-' + b.requestId.slice(-8).toUpperCase(), service: b.service, duration: schedule.SERVICES.find(x => x.id === b.service).duration, barberId: barber.id, barberName: barber.name, demo: true, name: b.name.trim(), phone: b.phone.trim(), notes: b.notes.trim(), date: b.date, time: b.time, offset: schedule.OFFSET, status: 'confirmed', createdAt: new Date().toISOString() };
      await holdSlot(record, cfg);
      // If a response is lost, retrying this ID finishes the same booking.
      try { await put(record, cfg); } catch (error) { if (!await find(record.id, cfg)) throw error; }
      return reply(res, 201, { reference: record.reference, status: record.status, ticket: schedule.ticket(record) });
    }
    if (!UUID.test(b.id || '')) return reply(res, 400, { error: 'Invalid booking.' });
    const blob = await find(b.id, cfg);
    if (!blob) return reply(res, 404, { error: 'Booking not found.' });
    if (method === 'DELETE') {
      await releaseSlot(await read(blob, cfg), cfg);
      await storage('/delete', cfg, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ urls: [blob.url] }) });
      return reply(res, 200, { deleted: true });
    }
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(b.status)) return reply(res, 422, { error: 'Invalid status.' });
    const record = await read(blob, cfg);
    if (record.demo && record.status === 'cancelled' && b.status !== 'cancelled') await holdSlot(record, cfg);
    await put({ ...record, status: b.status, updatedAt: new Date().toISOString() }, cfg, true);
    if (b.status === 'cancelled') await releaseSlot(record, cfg);
    return reply(res, 200, { status: b.status });
  } catch (error) {
    console.error('Rylo booking error:', error.name, error.message);
    if (error.status === 409) return reply(res, 409, { error: error.message });
    return reply(res, 503, { error: 'We could not save your request right now. Please try again. Your appointment is not confirmed.' });
  }
}
module.exports = handler;
module.exports._test = { validation, seal, unseal, secureEqual };
