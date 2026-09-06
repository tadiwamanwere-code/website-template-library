/* =========================================================================
   server.js — the builder, and the route that serves finished sites.

     node builder/server.js        then open http://localhost:4180

   Two things live here:

     /            the app: my sites, pick a template, details, preview, finish
     /s/:slug     the site itself, rendered from its record on every request

   The link works the moment a site is created, because the route existed
   before the site did. The preview iframe loads /s/:slug — the same route,
   the same bytes — so the preview cannot lie about what gets published.

   No AI anywhere in this file. Filling a template is find and replace, a
   theme is six CSS variables, and a link is a slug and a route.
   ========================================================================= */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { render, deriveSwaps, listTemplates, loadTemplate, fontList } = require('./render.js');
const store = require('./store.js');

const LIBRARY = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 4180);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.md': 'text/plain; charset=utf-8'
};

/* ------------------------------------------------------------------ replies */

function send(res, code, body, type) {
  res.writeHead(code, {
    'Content-Type': type || 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

const json = (res, code, obj) => send(res, code, JSON.stringify(obj, null, 2), TYPES['.json']);

function body(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => {
      raw += c;
      if (raw.length > 2e6) { reject(new Error('Too big')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); }
    });
  });
}

/* -------------------------------------------------------------- the site --- */

/* One rendering path. The preview and the published page both come through
   here, so they are the same HTML by construction. */
function buildSite(record) {
  const filled = deriveSwaps(record.template, record.swaps || {});
  return render(record.template, filled, record.theme, {
    noindex: true,           // a mockup of a real business must never be indexed
    edits: record.edits || [],
    style: record.style || {}
  });
}

/* ------------------------------------------------------------------ routes */

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const route = decodeURIComponent(url.pathname);

  try {
    /* ---- the app ---- */
    if (route === '/' || route === '/index.html') {
      return send(res, 200, fs.readFileSync(path.join(__dirname, 'app', 'index.html')), TYPES['.html']);
    }

    /* ---- what templates can we build from ---- */
    if (route === '/api/templates') {
      const rows = listTemplates().map(t => {
        const { card } = loadTemplate(t.template);
        return {
          template: t.template,
          industry: t.industry,
          covers: t.covers,
          themes: t.themes,
          fields: (card.swaps || []).map(s => ({
            key: s.key, label: s.label, maxChars: s.maxChars || null,
            type: s.type || 'text', optional: !!s.optional, hint: s.hint || null,
            value: s.format ? s.find.replace(s.format.split('{}')[0], '').replace(s.format.split('{}')[1] || '', '') : s.find
          })),
          /* the picture slots, so the preview can tell which image was clicked */
          images: (card.images || []).map(i => ({
            key: i.key, label: i.label, kind: i.kind || 'photo', ratio: i.ratio || null,
            value: i.format ? null : i.find
          }))
        };
      });
      return json(res, 200, rows);
    }

    /* ---- the typefaces on offer ---- */
    if (route === '/api/fonts') return json(res, 200, fontList());

    /* ---- saved sites ---- */
    if (route === '/api/sites' && req.method === 'GET') {
      return json(res, 200, store.list().map(s => ({
        slug: s.slug, name: (s.swaps && s.swaps.BUSINESS_NAME) || 'Untitled',
        template: s.template, theme: s.theme, status: s.status,
        version: s.version, updatedAt: s.updatedAt, url: '/s/' + s.slug
      })));
    }

    if (route === '/api/sites' && req.method === 'POST') {
      const b = await body(req);
      if (!b.template) return json(res, 400, { error: 'template is required' });

      const slug = b.slug && store.read(b.slug)
        ? b.slug
        : store.slugify((b.swaps && b.swaps.BUSINESS_NAME) || b.template);

      const record = store.write({
        slug,
        template: b.template,
        theme: b.theme || null,
        swaps: b.swaps || {},
        edits: b.edits || [],
        style: b.style || {},
        notes: b.notes || '',
        status: b.status || 'draft'
      });

      const { warnings } = buildSite(record);
      return json(res, 200, { slug: record.slug, url: '/s/' + record.slug, version: record.version, warnings });
    }

    if (route.startsWith('/api/sites/')) {
      const slug = route.slice('/api/sites/'.length);
      if (req.method === 'DELETE') return json(res, 200, { deleted: store.remove(slug) });
      const record = store.read(slug);
      if (!record) return json(res, 404, { error: 'No such site' });
      return json(res, 200, record);
    }

    /* ---- the published site ---- */
    if (route.startsWith('/s/')) {
      const slug = route.slice(3).replace(/\/$/, '');
      const record = store.read(slug);
      if (!record) return send(res, 404, notFound(slug), TYPES['.html']);
      const { html } = buildSite(record);
      return send(res, 200, html, TYPES['.html']);
    }

    /* ---- the library itself, so the picker can show live previews ---- */
    const file = path.join(LIBRARY, route);
    if (!file.startsWith(LIBRARY)) return send(res, 403, 'Forbidden');
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      return send(res, 200, fs.readFileSync(file), TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
    }

    return send(res, 404, notFound(route), TYPES['.html']);
  } catch (err) {
    return json(res, 500, { error: String(err && err.message || err) });
  }
});

function notFound(what) {
  return `<!doctype html><meta charset="utf-8"><title>Not found</title>
<body style="margin:0;background:#0d0f12;color:#e8eaee;font:14px ui-monospace,SFMono-Regular,Menlo,monospace">
<div style="padding:40px;max-width:640px">
<p style="letter-spacing:.2em;text-transform:uppercase;font-size:11px;color:#7d8794">404</p>
<p style="font-size:18px;margin:14px 0 0">Nothing at ${String(what).replace(/[<&]/g, '')}</p>
</div>`;
}

server.listen(PORT, () => {
  console.log('');
  console.log('  Website builder   http://localhost:' + PORT);
  console.log('  Sites are served at /s/<slug> and stored in builder/sites/');
  console.log('');
});
