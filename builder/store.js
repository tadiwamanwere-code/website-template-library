/* =========================================================================
   store.js — where saved sites live.

   A saved site is the *inputs*, never the finished HTML. Fixing a bug in a
   template then fixes every site ever made from it. The HTML is rebuilt on
   every request and can be thrown away at any time.

   There are two places a site can live, picked automatically:

     disk    running on your own machine: one JSON file per site
     blob    running on Vercel: the same JSON in Vercel Blob storage

   And one thing that is not storage at all: a portable link, which carries
   the whole site inside the address. It needs no database, so a link always
   works even before any storage is set up. See portable.js.

   The whole surface is five functions, all async, so a third place to keep
   sites later touches nothing else in the app.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN || '';
const DRIVER = TOKEN ? 'blob' : 'disk';
const DIR = path.join(__dirname, 'sites');

/* ------------------------------------------------------------------ slugs */

/* Two clients will be called Smile Dental, so every slug gets a short random
   suffix. No vowels, so it cannot accidentally spell anything. */
const ALPHABET = 'bcdfghjkmnpqrstvwxyz23456789';

function suffix(n) {
  let out = '';
  for (let i = 0; i < n; i++) out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return out;
}

function slugify(name) {
  const base = String(name || 'site')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'site';
  return base + '-' + suffix(4);
}

/* A slug comes off a URL, so it never gets to choose a path. */
function checkSlug(slug) {
  if (!/^[a-z0-9-]{1,64}$/.test(String(slug))) throw new Error('Bad slug');
  return slug;
}

/* ------------------------------------------------------------------- disk */

const disk = {
  async read(slug) {
    try { return JSON.parse(fs.readFileSync(path.join(DIR, checkSlug(slug) + '.json'), 'utf8')); }
    catch { return null; }
  },
  async list() {
    fs.mkdirSync(DIR, { recursive: true });
    return fs.readdirSync(DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => { try { return JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch { return null; } })
      .filter(Boolean);
  },
  async put(slug, record) {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(path.join(DIR, checkSlug(slug) + '.json'), JSON.stringify(record, null, 2));
  },
  async remove(slug) {
    try { fs.unlinkSync(path.join(DIR, checkSlug(slug) + '.json')); return true; } catch { return false; }
  }
};

/* ------------------------------------------------------------------- blob
   Vercel Blob over its HTTP API, so there is no package to install and
   nothing to keep up to date. A blob is written at a known path and read
   back by asking for that path, which is why random suffixes are off. */

const BLOB_API = 'https://blob.vercel-storage.com';
const PREFIX = 'sites/';
let publicBase = null;                     // learned on the first read, then reused

function blobHeaders(extra) {
  return Object.assign({
    authorization: 'Bearer ' + TOKEN,
    'x-api-version': '7'
  }, extra || {});
}

async function blobList(prefix) {
  const res = await fetch(BLOB_API + '?prefix=' + encodeURIComponent(prefix) + '&limit=1000', {
    headers: blobHeaders()
  });
  if (!res.ok) throw new Error('Blob list failed: ' + res.status + ' ' + await res.text());
  const body = await res.json();
  return body.blobs || [];
}

const blob = {
  async read(slug) {
    checkSlug(slug);
    const key = PREFIX + slug + '.json';

    /* Once we know the store's public host, the address is predictable and
       one request is enough. */
    if (publicBase) {
      const direct = await fetch(publicBase + key + '?t=' + Date.now());
      if (direct.ok) return direct.json();
    }
    const found = (await blobList(key)).find(b => b.pathname === key);
    if (!found) return null;
    publicBase = found.url.slice(0, found.url.length - key.length);
    const res = await fetch(found.url + '?t=' + Date.now());
    return res.ok ? res.json() : null;
  },

  async list() {
    const blobs = await blobList(PREFIX);
    if (blobs.length && !publicBase) {
      publicBase = blobs[0].url.slice(0, blobs[0].url.length - blobs[0].pathname.length);
    }
    const out = [];
    for (const b of blobs) {
      try {
        const res = await fetch(b.url);
        if (res.ok) out.push(await res.json());
      } catch { /* a blob we cannot read is not a reason to fail the list */ }
    }
    return out;
  },

  async put(slug, record) {
    checkSlug(slug);
    const key = PREFIX + slug + '.json';
    const res = await fetch(BLOB_API + '/' + key, {
      method: 'PUT',
      headers: blobHeaders({
        'x-content-type': 'application/json',
        'x-add-random-suffix': '0',
        'x-cache-control-max-age': '0',
        'content-type': 'application/json'
      }),
      body: JSON.stringify(record)
    });
    if (!res.ok) throw new Error('Blob write failed: ' + res.status + ' ' + await res.text());
    const body = await res.json();
    if (body.url) publicBase = body.url.slice(0, body.url.length - key.length);
  },

  async remove(slug) {
    checkSlug(slug);
    const key = PREFIX + slug + '.json';
    const found = (await blobList(key)).find(b => b.pathname === key);
    if (!found) return false;
    const res = await fetch(BLOB_API + '/delete', {
      method: 'POST',
      headers: blobHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify({ urls: [found.url] })
    });
    return res.ok;
  }
};

const driver = DRIVER === 'blob' ? blob : disk;

/* ------------------------------------------------------------------- api */

async function read(slug) {
  try { return await driver.read(slug); } catch { return null; }
}

async function list() {
  let all = [];
  try { all = await driver.list(); } catch { all = []; }
  return all.sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
}

/* Finish writes a new version, never an overwrite. People break things and
   want yesterday back. */
async function write(record) {
  const now = new Date().toISOString();
  const existing = await read(record.slug);

  const next = Object.assign({}, existing, record, {
    updatedAt: now,
    createdAt: (existing && existing.createdAt) || now,
    version: existing ? (existing.version || 1) + 1 : 1,
    history: ((existing && existing.history) || []).concat(
      existing ? [{
        version: existing.version || 1,
        at: existing.updatedAt || existing.createdAt,
        theme: existing.theme,
        swaps: existing.swaps,
        edits: existing.edits,
        style: existing.style
      }] : []
    ).slice(-20)
  });

  await driver.put(next.slug, next);
  return next;
}

async function remove(slug) {
  try { return await driver.remove(slug); } catch { return false; }
}

module.exports = { list, read, write, remove, slugify, checkSlug, DIR, DRIVER };
