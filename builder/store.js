/* =========================================================================
   store.js — where saved sites live.

   A saved site is the *inputs*, never the finished HTML. Fixing a bug in a
   template then fixes every site ever made from it. The HTML is rebuilt on
   every request and can be thrown away at any time.

   Today that is one JSON file per site on disk. The whole surface is four
   functions, so swapping this for Cloudflare R2 or KV later touches nothing
   else in the app.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'sites');

function ensure() {
  fs.mkdirSync(DIR, { recursive: true });
}

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
  return `${base}-${suffix(4)}`;
}

/* -------------------------------------------------------------- read/write */

function file(slug) {
  /* A slug comes off a URL, so it never gets to choose a path. */
  if (!/^[a-z0-9-]{1,64}$/.test(slug)) throw new Error('Bad slug');
  return path.join(DIR, slug + '.json');
}

function read(slug) {
  try {
    return JSON.parse(fs.readFileSync(file(slug), 'utf8'));
  } catch {
    return null;
  }
}

function list() {
  ensure();
  return fs.readdirSync(DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try { return JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch { return null; }
    })
    .filter(Boolean)
    .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
}

/* Finish writes a new version, never an overwrite. People break things and
   want yesterday back. */
function write(record) {
  ensure();
  const now = new Date().toISOString();
  const existing = read(record.slug);

  const next = Object.assign({}, existing, record, {
    updatedAt: now,
    createdAt: (existing && existing.createdAt) || now,
    version: existing ? (existing.version || 1) + 1 : 1,
    history: (existing && existing.history || []).concat(
      existing ? [{
        version: existing.version || 1,
        at: existing.updatedAt || existing.createdAt,
        theme: existing.theme,
        swaps: existing.swaps,
        edits: existing.edits
      }] : []
    ).slice(-20)
  });

  fs.writeFileSync(file(next.slug), JSON.stringify(next, null, 2));
  return next;
}

function remove(slug) {
  try { fs.unlinkSync(file(slug)); return true; } catch { return false; }
}

module.exports = { list, read, write, remove, slugify, DIR };
