/* =========================================================================
   server.js — the builder, running on your own machine.

     node builder/server.js        then open http://localhost:4180/build

   All the thinking is in routes.js, which Vercel runs too. This file only
   adds the one thing a local machine needs and a deployment does not:
   serving the template files off disk, so the picker can show live pages.
   ========================================================================= */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { handle, notFound, send } = require('./routes.js');
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
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.md': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  try {
    const answered = await handle(req, res);
    if (answered !== null) return;

    /* ---- the library itself, so the picker can show live previews ---- */
    const route = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.join(LIBRARY, route === '/' ? 'index.html' : route);
    if (!file.startsWith(LIBRARY)) return send(res, 403, 'Forbidden');

    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      return send(res, 200, fs.readFileSync(file), TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
    }
    return send(res, 404, notFound(route), TYPES['.html']);
  } catch (err) {
    return send(res, 500, JSON.stringify({ error: String((err && err.message) || err) }), TYPES['.json']);
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('  Builder     http://localhost:' + PORT + '/build');
  console.log('  Gallery     http://localhost:' + PORT + '/');
  console.log('  Sites are served at /s/<slug>, stored on disk (' + store.DRIVER + ')');
  console.log('');
});
