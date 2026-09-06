/* =========================================================================
   routes.js — everything the builder answers, in one place.

   The same handler runs on your machine (builder/server.js) and on Vercel
   (api/app.js). One copy, so the app cannot behave differently in the two
   places, which is the same reason there is only one render().

     /build                the app
     /bapi/templates       what can be built from
     /bapi/fonts           the typefaces on offer
     /bapi/photos          picture search, through Unsplash and Pexels
     /bapi/sites           saved sites: list, create
     /bapi/sites/:slug     one site: read, delete
     /s/:slug              a saved site, rendered
     /p/:payload           a site carried inside its own link

   The API sits under /bapi and not /api so that Vercel does not confuse it
   with the folder that holds the function itself.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');
const { render, deriveSwaps, listTemplates, loadTemplate, fontList } = require('./render.js');
const store = require('./store.js');
const portable = require('./portable.js');

const APP = path.join(__dirname, 'app', 'index.html');

/* ------------------------------------------------------------------- env
   Keys live in builder/.env, which git ignores. On Vercel they come from
   the project's environment settings instead. */

function loadEnv() {
  const file = path.join(__dirname, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, '');
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}
loadEnv();

const UNSPLASH = process.env.UNSPLASH_ACCESS_KEY || process.env.VITE_UNSPLASH_ACCESS_KEY || '';
const PEXELS = process.env.PEXELS_API_KEY || '';

/* ---------------------------------------------------------------- replies */

function send(res, code, body, type) {
  res.writeHead(code, {
    'Content-Type': type || 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

const json = (res, code, obj) => send(res, code, JSON.stringify(obj, null, 2), 'application/json; charset=utf-8');

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);   // Vercel parses it for us
    let raw = '';
    req.on('data', c => {
      raw += c;
      if (raw.length > 8e6) { reject(new Error('Too big')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

/* -------------------------------------------------------------- the site --
   One rendering path. The preview and the published page both come through
   here, so they are the same HTML by construction. */

function buildSite(record) {
  const filled = deriveSwaps(record.template, record.swaps || {});
  return render(record.template, filled, record.theme, {
    noindex: true,                    // a mockup of a real business must never be indexed
    edits: record.edits || [],
    style: record.style || {}
  });
}

/* ---------------------------------------------------------------- pictures
   Two libraries, searched together and proxied so the keys never reach the
   browser. Unsplash asks that a download is registered when a photo is
   actually used, which is what /bapi/photos/use does. */

async function fromUnsplash(query, page, orientation) {
  if (!UNSPLASH) return [];
  const url = 'https://api.unsplash.com/search/photos'
    + '?query=' + encodeURIComponent(query)
    + '&per_page=18&page=' + (Number(page) || 1)
    + (orientation ? '&orientation=' + encodeURIComponent(orientation) : '');

  const res = await fetch(url, { headers: { Authorization: 'Client-ID ' + UNSPLASH, 'Accept-Version': 'v1' } });
  if (!res.ok) return [];
  const body = await res.json();

  return (body.results || []).map(p => ({
    id: 'u-' + p.id,
    source: 'unsplash',
    thumb: p.urls && p.urls.small,
    /* w=2000 is enough for a hero on a 2x screen and keeps the page light */
    full: p.urls && (p.urls.raw ? p.urls.raw + '&auto=format&fit=crop&w=2000&q=80' : p.urls.regular),
    alt: p.alt_description || p.description || '',
    by: p.user && p.user.name,
    download: p.links && p.links.download_location
  }));
}

async function fromPexels(query, page, orientation) {
  if (!PEXELS) return [];
  const url = 'https://api.pexels.com/v1/search'
    + '?query=' + encodeURIComponent(query)
    + '&per_page=18&page=' + (Number(page) || 1)
    + (orientation ? '&orientation=' + encodeURIComponent(orientation) : '');

  const res = await fetch(url, { headers: { Authorization: PEXELS } });
  if (!res.ok) return [];
  const body = await res.json();

  return (body.photos || []).map(p => ({
    id: 'p-' + p.id,
    source: 'pexels',
    thumb: p.src && p.src.medium,
    full: p.src && (p.src.large2x || p.src.large),
    alt: p.alt || '',
    by: p.photographer,
    download: null                    // Pexels asks for a credit, not a ping
  }));
}

/* Both libraries, shuffled together a few at a time, so one of them does not
   fill the whole panel. */
async function searchPhotos(query, page, orientation) {
  if (!UNSPLASH && !PEXELS) {
    return { error: 'No photo library keys set. Add UNSPLASH_ACCESS_KEY or PEXELS_API_KEY to builder/.env', results: [] };
  }
  const [a, b] = await Promise.all([
    fromUnsplash(query, page, orientation).catch(() => []),
    fromPexels(query, page, orientation).catch(() => [])
  ]);

  const mixed = [];
  for (let i = 0; i < Math.max(a.length, b.length); i += 3) {
    mixed.push(...a.slice(i, i + 3), ...b.slice(i, i + 3));
  }
  if (!mixed.length) return { error: 'Nothing came back from the photo libraries.', results: [] };
  return { total: mixed.length, results: mixed };
}

/* ------------------------------------------------------------------ routes */

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');

  /* Vercel rewrites everything to this one function and hands the original
     path across in ?p=. On your own machine there is no rewrite, so the URL
     is already the real one. */
  const asked = url.searchParams.get('p') || url.pathname;
  const route = decodeURIComponent(asked).replace(/\/+$/, '') || '/';
  const method = (req.method || 'GET').toUpperCase();

  /* ---- the app ---- */
  if (route === '/build' || route === '/build/index.html') {
    return send(res, 200, fs.readFileSync(APP), 'text/html; charset=utf-8');
  }

  /* ---- what can we build from ---- */
  if (route === '/bapi/templates') {
    const rows = listTemplates().map(t => {
      const { card } = loadTemplate(t.template);
      return Object.assign({}, t, {
        fields: (card.swaps || []).map(s => ({
          key: s.key, label: s.label, maxChars: s.maxChars || null,
          type: s.type || 'text', optional: !!s.optional, hint: s.hint || null,
          /* only fields a template explicitly puts in the details group
             show up on the form; everything else is edited by clicking it */
          group: s.group || null
        })),
        images: (card.images || []).map(i => ({
          key: i.key, label: i.label, kind: i.kind || 'photo',
          ratio: i.ratio || null, hint: i.hint || null,
          search: i.search || null,
          /* the URL the template ships with, so the preview can tell which
             slot an image on screen belongs to */
          value: i.format ? null : (Array.isArray(i.find) ? i.find[0] : i.find)
        })),
        adjust: Object.keys(card.adjust || {}).map(k => ({
          key: k, label: card.adjust[k].label || k, cssVar: card.adjust[k].var || k
        }))
      });
    });
    return json(res, 200, rows);
  }

  if (route === '/bapi/fonts') return json(res, 200, fontList());

  /* ---- what this deployment can do, so the app can be honest about it ---- */
  if (route === '/bapi/env') {
    return json(res, 200, {
      storage: store.DRIVER,
      photos: !!(UNSPLASH || PEXELS),
      shortLinks: store.DRIVER === 'blob' || !process.env.VERCEL
    });
  }

  /* ---- pictures ---- */
  if (route === '/bapi/photos') {
    const q = (url.searchParams.get('q') || '').trim();
    if (!q) return json(res, 200, { results: [] });
    return json(res, 200, await searchPhotos(q, url.searchParams.get('page'), url.searchParams.get('orientation')));
  }

  if (route === '/bapi/photos/use' && method === 'POST') {
    const b = await readBody(req);
    /* Unsplash asks for this ping when a photo is actually used. It is a
       condition of the free API, so it is not optional. */
    if (UNSPLASH && b.download && /^https:\/\/api\.unsplash\.com\//.test(b.download)) {
      try { await fetch(b.download, { headers: { Authorization: 'Client-ID ' + UNSPLASH } }); } catch { }
    }
    return json(res, 200, { ok: true });
  }

  /* ---- saved sites ---- */
  if (route === '/bapi/sites' && method === 'GET') {
    const all = await store.list();
    return json(res, 200, all.map(s => ({
      slug: s.slug,
      name: (s.swaps && s.swaps.BUSINESS_NAME) || 'Untitled',
      template: s.template, theme: s.theme, status: s.status,
      version: s.version, updatedAt: s.updatedAt, url: '/s/' + s.slug
    })));
  }

  if (route === '/bapi/sites' && method === 'POST') {
    const b = await readBody(req);
    if (!b.template) return json(res, 400, { error: 'template is required' });

    const draft = {
      template: b.template,
      theme: b.theme || null,
      swaps: b.swaps || {},
      edits: b.edits || [],
      style: b.style || {},
      notes: b.notes || '',
      status: b.status || 'draft'
    };

    /* The link that always works, whatever storage exists. */
    let link = null;
    try { if (portable.fits(draft)) link = '/p/' + portable.encode(draft); } catch { }

    let record = null;
    let saveError = null;
    try {
      const slug = b.slug && (await store.read(b.slug))
        ? b.slug
        : store.slugify((b.swaps && b.swaps.BUSINESS_NAME) || b.template);
      record = await store.write(Object.assign({ slug }, draft));
    } catch (err) {
      saveError = String((err && err.message) || err);
    }

    const { warnings } = buildSite(record || draft);
    return json(res, 200, {
      slug: record ? record.slug : null,
      url: record ? '/s/' + record.slug : link,
      portable: link,
      version: record ? record.version : null,
      saveError,
      warnings
    });
  }

  if (route.startsWith('/bapi/sites/')) {
    const slug = route.slice('/bapi/sites/'.length);
    if (method === 'DELETE') return json(res, 200, { deleted: await store.remove(slug) });
    const record = await store.read(slug);
    if (!record) return json(res, 404, { error: 'No such site' });
    return json(res, 200, record);
  }

  /* ---- a saved site ---- */
  if (route.startsWith('/s/')) {
    const record = await store.read(route.slice(3));
    if (!record) return send(res, 404, notFound(route), 'text/html; charset=utf-8');
    return send(res, 200, buildSite(record).html, 'text/html; charset=utf-8');
  }

  /* ---- a site carried inside its own link ---- */
  if (route.startsWith('/p/')) {
    try {
      const record = portable.decode(route.slice(3));
      return send(res, 200, buildSite(record).html, 'text/html; charset=utf-8');
    } catch {
      return send(res, 400, notFound('that link'), 'text/html; charset=utf-8');
    }
  }

  return null;                       // not ours; the caller decides what to do
}

function notFound(what) {
  return '<!doctype html><meta charset="utf-8"><title>Not found</title>'
    + '<body style="margin:0;background:#0d0f12;color:#e8eaee;font:14px ui-monospace,SFMono-Regular,Menlo,monospace">'
    + '<div style="padding:40px;max-width:640px">'
    + '<p style="letter-spacing:.2em;text-transform:uppercase;font-size:11px;color:#7d8794">404</p>'
    + '<p style="font-size:18px;margin:14px 0 0">Nothing at ' + String(what).replace(/[<&]/g, '') + '</p>'
    + '<p style="margin-top:20px"><a href="/build" style="color:#8fb4f0">Back to the builder</a></p>'
    + '</div>';
}

module.exports = { handle, buildSite, notFound, send, json };
