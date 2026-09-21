'use strict';
const crypto = require('node:crypto');
const BASE = 'https://blob.vercel-storage.com';
const PREFIX = 'rylo-bookings/';
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const SERVICES = ['Haircut', 'Beard tidy', 'Haircut and beard'];
const limits = new Map();
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
  if (!response.ok) throw new Error('Booking storage request failed');
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
  const response = await fetch(blob.url + '?t=' + Date.now(), { cache: 'no-store', signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error('Booking could not be read');
  return unseal(await response.json(), cfg.key);
}
async function put(record, cfg, overwrite = false) {
  await storage('/' + PREFIX + record.id + '.json', cfg, { method: 'PUT', headers: { 'content-type': 'application/json', 'x-content-type': 'application/json', 'x-add-random-suffix': '0', 'x-cache-control-max-age': '0', 'x-allow-overwrite': overwrite ? '1' : '0' }, body: seal(record, cfg.key) });
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
  if (method !== 'POST' && !admin) return reply(res, 401, { error: 'Enter your builder passcode to view bookings.' });
  if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(method)) return reply(res, 405, { error: 'Method not allowed.' });
  const origin = req.headers.origin;
  if (origin) {
    try { if (new URL(origin).host !== req.headers.host) return reply(res, 403, { error: 'Please book from the Rylo website.' }); }
    catch { return reply(res, 403, { error: 'Invalid origin.' }); }
  }
  try {
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
      if (b.website) return reply(res, 400, { error: 'Please leave the website field empty.' });
      const invalid = validation(b);
      if (invalid) return reply(res, 422, { error: invalid });
      const ip = req.headers['x-forwarded-for'] || 'local';
      const bucket = limits.get(ip) || { count: 0, until: 0 };
      if (bucket.until < Date.now()) { bucket.count = 0; bucket.until = Date.now() + 60000; }
      if (++bucket.count > 8) return reply(res, 429, { error: 'Please wait a minute before trying again.' });
      limits.set(ip, bucket);
      if (limits.size > 2000) for (const [key, value] of limits) if (value.until < Date.now()) limits.delete(key);
      const reference = 'RY-' + b.requestId.slice(-8).toUpperCase();
      // Retrying a lost connection does not create a second appointment request.
      if (!await find(b.requestId, cfg)) {
        const record = { id: b.requestId, reference, service: b.service, name: b.name.trim(), phone: b.phone.trim(), notes: b.notes.trim(), date: b.date, time: b.time, offset: b.offset, status: 'pending', createdAt: new Date().toISOString() };
        try { await put(record, cfg); } catch (err) { if (!await find(b.requestId, cfg)) throw err; }
      }
      return reply(res, 201, { reference, status: 'pending' });
    }
    if (!UUID.test(b.id || '')) return reply(res, 400, { error: 'Invalid booking.' });
    const blob = await find(b.id, cfg);
    if (!blob) return reply(res, 404, { error: 'Booking not found.' });
    if (method === 'DELETE') {
      await storage('/delete', cfg, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ urls: [blob.url] }) });
      return reply(res, 200, { deleted: true });
    }
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(b.status)) return reply(res, 422, { error: 'Invalid status.' });
    const record = await read(blob, cfg);
    await put({ ...record, status: b.status, updatedAt: new Date().toISOString() }, cfg, true);
    return reply(res, 200, { status: b.status });
  } catch {
    return reply(res, 503, { error: 'We could not save your request right now. Please try again. Your appointment is not confirmed.' });
  }
}
module.exports = handler;
module.exports._test = { validation, seal, unseal, secureEqual };
