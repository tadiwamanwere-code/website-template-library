/* =========================================================================
   portable.js — a link that carries the whole site inside it.

   Normally a link points at a saved record: /s/acme-plumbing-4wjk. That
   needs somewhere to save it.

   A portable link needs nothing at all. The site's details are squeezed,
   encoded and put in the address itself, and the server unpacks them and
   renders the page. It is longer to look at and it never expires, never
   breaks, and works the moment the app is deployed, before any storage has
   been set up.

   It is the safety net, not the main road. Short links are nicer, so as
   soon as a Blob store exists the app uses those instead.
   ========================================================================= */

'use strict';

const zlib = require('zlib');

/* Browsers and proxies stop being reliable well before their theoretical
   limits, so refuse to make a link nobody can paste. An uploaded logo is
   usually what pushes it over. */
const MAX = 7500;

function encode(record) {
  /* Only the parts that make the page. History and timestamps are not in
     the link, because they would double its length for nothing. */
  const lean = {
    t: record.template,
    h: record.theme || null,
    s: record.swaps || {},
    e: record.edits || [],
    y: record.style || {},
    n: (record.swaps && record.swaps.BUSINESS_NAME) || ''
  };
  const packed = zlib.deflateRawSync(Buffer.from(JSON.stringify(lean), 'utf8'), { level: 9 });
  return packed.toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decode(payload) {
  const b64 = String(payload).replace(/-/g, '+').replace(/_/g, '/');
  const raw = zlib.inflateRawSync(Buffer.from(b64, 'base64')).toString('utf8');
  const lean = JSON.parse(raw);
  if (!lean.t) throw new Error('Not a site');
  return {
    slug: null,
    template: lean.t,
    theme: lean.h || null,
    swaps: lean.s || {},
    edits: lean.e || [],
    style: lean.y || {},
    portable: true
  };
}

/* Is this record small enough to travel in a link? */
function fits(record) {
  try { return encode(record).length <= MAX; } catch { return false; }
}

module.exports = { encode, decode, fits, MAX };
