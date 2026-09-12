/* =========================================================================
   clone-site.js — turns a live website into a single-file template.

   This is the pharmacy pass (build-pharmacy.js) made general, because doing
   that by hand eleven more times is not a plan.

   What it does, in order:

     1. Pulls in every stylesheet the page links to and writes them into one
        <style> block, so the template is one file with no build step.

     2. Finds the colours the design actually uses, and replaces them with
        CSS variables. This is the part that matters. A live site writes its
        hex codes into every rule, and a hex code cannot be themed. Once they
        are variables, the template can wear any of the shared schemes in
        schemes.js.

        The roles are worked out from the colours themselves: the darkest
        common colour is the text, the lightest is the page, the most
        saturated is the accent. Not clever, but right nearly every time,
        and a person can correct the map afterwards.

     3. Makes every address absolute, so nothing breaks when the page is
        served from /s/<slug> instead of the site root.

     4. Throws away the JavaScript. A template does not need somebody else's
        analytics, chat widget or cookie banner. A small script goes back in
        for the mobile menu and the scroll reveals.

     5. Unless --own is given, replaces every photograph with a stock one.
        These pages belong to real firms. Their layout is a fair thing to
        learn from. Their staff photographs are not ours to ship.

   Run:
     node builder/passes/clone-site.js <folder> <origin> <raw.html> [--own]

   Example:
     node builder/passes/clone-site.js 26-parvis-family-law \
       https://lindsayparvis.com/ scratch/lindsayparvis.html
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const LIB = path.resolve(__dirname, '..', '..');

const folder = process.argv[2];
const origin = process.argv[3];
const rawFile = process.argv[4];
const OWN = process.argv.includes('--own');

if (!folder || !origin || !rawFile) {
  console.error('  usage: node clone-site.js <folder> <origin> <raw.html> [--own]');
  process.exit(1);
}

const OUT = path.join(LIB, folder);
const BASE = new URL(origin);

/* ------------------------------------------------------------------ tools */

function abs(url) {
  if (!url) return url;
  const u = String(url).trim().replace(/^["']|["']$/g, '');
  if (/^(data:|https?:|mailto:|tel:|#|javascript:)/i.test(u)) return u;
  if (u.startsWith('//')) return BASE.protocol + u;
  try { return new URL(u, BASE).href; } catch { return u; }
}

/* Stock pictures, by what the slot looks like it is for. A cloned page keeps
   its shape; what fills it has to be ours. */
const STOCK = {
  person:  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
  people:  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80',
  office:  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
  meeting: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
  city:    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  desk:    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80',
  build:   'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80',
  hands:   'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80'
};

function stockFor(src, alt) {
  const s = (src + ' ' + (alt || '')).toLowerCase();
  /* People take turns too: a team section of four identical faces is worse
     than no photographs at all. */
  if (/team|staff|attorney|lawyer|portrait|headshot|profile|bio|author|person/.test(s)) {
    const key = String(src).split('?')[0];
    if (!PEOPLE_SEEN.has(key)) PEOPLE_SEEN.set(key, PEOPLE[PEOPLE_SEEN.size % PEOPLE.length] + '?auto=format&fit=crop&w=1000&q=80');
    return PEOPLE_SEEN.get(key);
  }
  if (/group|together|people|client/.test(s)) return STOCK.people;
  if (/office|building|reception|interior|premises/.test(s)) return STOCK.office;
  if (/meet|consult|talk|advice|discussion/.test(s)) return STOCK.meeting;
  if (/city|skyline|street|map|location/.test(s)) return STOCK.city;
  if (/desk|paper|document|contract|sign|book|law/.test(s)) return STOCK.desk;
  if (/site|construct|roof|thatch|electric|work|tool|van/.test(s)) return STOCK.build;
  /* No clue in the name, which is every picture on a Framer site: their
     files are hashes. One photo for all of them made a page of identical
     handshakes, so these take turns instead. The same original always gets
     the same stand-in, because Framer prints each picture once per screen
     size and the three copies must agree. */
  const key = String(src).split('?')[0];
  if (!POOL_SEEN.has(key)) POOL_SEEN.set(key, POOL[POOL_SEEN.size % POOL.length] + '?auto=format&fit=crop&w=1600&q=80');
  return POOL_SEEN.get(key);
}

const POOL = [
  'https://images.unsplash.com/photo-1531973576160-7125cd663d86',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
  'https://images.unsplash.com/photo-1499914485622-a88fac536970',
  'https://images.unsplash.com/photo-1568992687947-868a62a9f521',
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216'
];
const POOL_SEEN = new Map();

const PEOPLE = [
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
  'https://images.unsplash.com/photo-1624797432677-6f803a98acb3',
  'https://images.unsplash.com/photo-1614786269829-d24616faf56d',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7'
];
const PEOPLE_SEEN = new Map();

/* Backgrounds get quiet surfaces, not photographs. A section background is
   usually a soft texture with words over it, and a busy city in its place
   drowns the words. */
const TEXTURES = [
  'https://images.unsplash.com/photo-1566041510394-cf7c8fe21800',
  'https://images.unsplash.com/photo-1601662528567-526cd06f6582',
  'https://images.unsplash.com/photo-1558346648-9757f2fa4474',
  'https://images.unsplash.com/photo-1498262257252-c282316270bc'
];
const TEXTURE_SEEN = new Map();
function textureFor(u) {
  const key = String(u).split('?')[0];
  if (!TEXTURE_SEEN.has(key)) TEXTURE_SEEN.set(key, TEXTURES[TEXTURE_SEEN.size % TEXTURES.length] + '?auto=format&fit=crop&w=1800&q=70');
  return TEXTURE_SEEN.get(key);
}

/* --------------------------------------------------------------- the page */

let html = fs.readFileSync(rawFile, 'utf8');

/* Anything that is not the page. A template carries no analytics, no chat
   bubble, no cookie banner and no consent wall. */
html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
html = html.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');
html = html.replace(/<iframe[^>]*(?:youtube|vimeo|google|facebook|hubspot|calendly)[^>]*>[\s\S]*?<\/iframe>/gi, '');
html = html.replace(/<!--[\s\S]*?-->/g, '');

/* -------------------------------------------------------------- the styles
   Every linked stylesheet, fetched and written in. Order kept, because CSS
   is order-dependent and getting that wrong looks like a broken site. */

const sheets = [];
const linkRe = /<link\b[^>]*>/gi;
let m;
while ((m = linkRe.exec(html)) !== null) {
  const tag = m[0];
  if (!/rel\s*=\s*["']?stylesheet/i.test(tag)) continue;
  const href = (tag.match(/href\s*=\s*["']([^"']+)["']/i) || [])[1];
  if (!href) continue;
  const url = abs(href);
  /* Google's own font sheet stays a link: it is small, it is meant to be
     linked, and inlining it would freeze the font files. */
  if (/fonts\.googleapis\.com/.test(url)) continue;
  /* The media a sheet is for. A print sheet written into the page as if it
     were for the screen lays the page out for paper: every picture full
     width, the menu gone. That is what broke the WordPress clones. */
  const media = ((tag.match(/media\s*=\s*["']([^"']+)["']/i) || [])[1] || 'all').trim();
  sheets.push({ tag: tag, url: url, media: media });
}

async function main() {
  /* Some of these sites serve their stylesheets from a cache folder that
     only exists for a real browser. The file itself is still where it
     always was, so if the cache path 404s, ask for the plain one. */
  /* Fetched stylesheets are kept in a folder outside the repo, so building
     a template again does not ask somebody's server for the same forty
     files. One site started refusing us half way through a rebuild, which
     silently cost the page its header. Set CLONE_CACHE to move the folder. */
  const CACHE = process.env.CLONE_CACHE || path.join(require('os').tmpdir(), 'clone-site-cache');
  fs.mkdirSync(CACHE, { recursive: true });
  const cacheFile = u => path.join(CACHE, require('crypto').createHash('sha1').update(u).digest('hex').slice(0, 20) + '.css');

  async function grab(url) {
    const hit = cacheFile(url);
    if (fs.existsSync(hit)) return fs.readFileSync(hit, 'utf8');

    const tries = [url];
    const plain = url.replace(/\/wp-content\/cache\/min\/\d+\//, '/')
      .replace(/\/cache\/(minify|autoptimize)\/[^?]*?(?=wp-content)/, '/');
    if (plain !== url) tries.push(plain);
    tries.push(url.replace(/\?.*$/, ''));

    /* Three goes at each shape, waiting longer each time: a server that has
       just served thirty files often says no to the thirty-first. */
    for (const t of tries) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await fetch(t, { headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
            'accept': 'text/css,*/*;q=0.1',
            'referer': BASE.origin + '/'
          } });
          if (res.ok) {
            const text = await res.text();
            try { fs.writeFileSync(hit, text); } catch { /* a cache miss costs nothing */ }
            return text;
          }
          if (res.status !== 429 && res.status < 500) break;   /* a real 404 will not improve */
        } catch { /* try again */ }
        await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
      }
    }
    return null;
  }

  let css = '';
  for (const sheet of sheets) {
    try {
      /* A template nobody can load is not a template. */
      if (css.length > 2e6) { console.error('  ! stopping at 2MB of CSS'); break; }
      if (/^print$/i.test(sheet.media)) { html = html.replace(sheet.tag, ''); continue; }
      const got = await grab(sheet.url);
      if (got === null) { console.error('  ! could not fetch ' + sheet.url); html = html.replace(sheet.tag, ''); continue; }
      let text = got;
      /* url(...) inside a stylesheet is relative to the stylesheet, not to
         the page. Resolve against the right one or every background goes. */
      const sheetBase = new URL(sheet.url);
      text = text.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, function (whole, q, u) {
        if (/^(data:|https?:|\/\/)/i.test(u)) return whole;
        try { return 'url("' + new URL(u, sheetBase).href + '")'; } catch { return whole; }
      });
      /* @import pulls in more sheets. One level is enough for these. */
      text = text.replace(/@import\s+url\(([^)]+)\);?/g, '');
      if (!/^(all|screen)$/i.test(sheet.media)) text = '@media ' + sheet.media + '{' + text + '}';
      css += '\n/* ---- ' + sheet.url.split('/').pop() + ' ---- */\n' + text;
    } catch (e) {
      console.error('  ! could not fetch ' + sheet.url);
    }
    html = html.replace(sheet.tag, '');
  }

  /* Styles written into the page itself, kept and made absolute too. */
  html = html.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, function (whole, open, body, close) {
    const media = ((open.match(/media\s*=\s*["']([^"']+)["']/i) || [])[1] || 'all').trim();
    if (/^print$/i.test(media)) return '';
    if (!/^(all|screen)$/i.test(media)) body = '@media ' + media + '{' + body + '}';
    css +='\n/* ---- inline ---- */\n' + body.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, function (w, q, u) {
      return /^(data:|https?:|\/\/)/i.test(u) ? w : 'url("' + abs(u) + '")';
    });
    return '';
  });

  console.log('  ' + sheets.length + ' stylesheets, ' + Math.round(css.length / 1024) + 'KB of CSS');

  /* --------------------------------------------------------- the colours
     Count what the design uses, then hand the busiest ones a variable. */

  const counts = new Map();
  const hexRe = /#([0-9a-f]{6}|[0-9a-f]{3})\b/gi;
  let h;
  while ((h = hexRe.exec(css)) !== null) {
    const hex = normalise('#' + h[1]);
    counts.set(hex, (counts.get(hex) || 0) + 1);
  }
  const rgbRe = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)/g;
  while ((h = rgbRe.exec(css)) !== null) {
    const hex = toHex(+h[1], +h[2], +h[3]);
    counts.set(hex, (counts.get(hex) || 0) + 1);
  }
  /* Tailwind writes rgb(18 168 90 / var(--tw-bg-opacity)) with spaces and no
     commas. Miss this and a Tailwind site keeps every colour it started with. */
  const twRe = /rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/[^)]*)?\)/g;
  while ((h = twRe.exec(css)) !== null) {
    const hex = toHex(+h[1], +h[2], +h[3]);
    counts.set(hex, (counts.get(hex) || 0) + 1);
  }

  function normalise(hex) {
    let s = hex.toLowerCase();
    if (s.length === 4) s = '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
    return s;
  }
  function toHex(r, g, b) {
    return '#' + [r, g, b].map(n => ('0' + Math.max(0, Math.min(255, n)).toString(16)).slice(-2)).join('');
  }
  function parse(hex) {
    return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  }
  function luma(hex) {
    const [r, g, b] = parse(hex);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }
  function sat(hex) {
    const [r, g, b] = parse(hex).map(n => n / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max === min) return 0;
    const l = (max + min) / 2;
    return l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  }

  /* Only colours the design leans on. In a big framework stylesheet one
     appearance is a one-off; in a small hand-written one it is the whole
     brand, so the bar moves with the size of the sheet. */
  const floor = css.length > 120e3 ? 3 : 1;
  const used = [...counts.entries()]
    .filter(([hex, n]) => n >= floor)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 26)
    .map(([hex, n]) => ({ hex, n, l: luma(hex), s: sat(hex) }));

  /* Roles, worked out from the colours themselves. */
  const darks = used.filter(c => c.l < 0.34).sort((a, b) => a.l - b.l);
  const lights = used.filter(c => c.l > 0.86).sort((a, b) => b.l - a.l);
  const mids = used.filter(c => c.l >= 0.34 && c.l <= 0.86).sort((a, b) => b.n - a.n);
  const colourful = used.filter(c => c.s > 0.22 && c.l > 0.12 && c.l < 0.82)
    .sort((a, b) => (b.s * b.n) - (a.s * a.n));

  const roleOf = new Map();
  const take = (role, c) => { if (c && !roleOf.has(c.hex)) roleOf.set(c.hex, role); };

  take('accent', colourful[0]);
  take('accentDeep', colourful[1]);
  take('accentSoft', colourful[2]);
  take('ink', darks[0]);
  take('dark', darks[1]);
  take('ink2', darks[2]);
  take('dark2', darks[3]);
  take('sheet', lights[0]);
  take('paper', lights[1]);
  take('paper2', lights[2]);
  take('paper3', lights[3]);
  take('ink3', mids.filter(c => c.s < 0.22 && c.l < 0.6)[0]);
  take('line', mids.filter(c => c.s < 0.18 && c.l > 0.6)[0]);
  take('line2', mids.filter(c => c.s < 0.18 && c.l > 0.6)[1]);

  /* A variable name per role, and the value it starts at. */
  const NAME = {
    accent: 'accent', accentDeep: 'accent-deep', accentSoft: 'accent-soft',
    ink: 'ink', ink2: 'ink-2', ink3: 'ink-3',
    dark: 'dark', dark2: 'dark-2',
    sheet: 'sheet', paper: 'paper', paper2: 'paper-2', paper3: 'paper-3',
    line: 'line', line2: 'line-2'
  };

  const rootVars = [];
  const roleMap = {};
  let swapped = 0;

  for (const [hex, role] of roleOf) {
    const name = NAME[role];
    rootVars.push('  --' + name + ':' + hex + ';');
    roleMap[role] = [name];

    const [r, g, b] = parse(hex);
    const esc = hex.replace('#', '#');
    /* rgba with an alpha keeps its alpha, or a tint becomes a solid block. */
    css = css.replace(new RegExp('rgba\\(\\s*' + r + '\\s*,\\s*' + g + '\\s*,\\s*' + b + '\\s*,\\s*([\\d.]+)\\s*\\)', 'g'),
      function (w, a) {
        swapped++;
        const pct = Math.round(parseFloat(a) * 1000) / 10;
        return pct >= 100 ? 'var(--' + name + ')' : 'color-mix(in srgb, var(--' + name + ') ' + pct + '%, transparent)';
      });
    css = css.replace(new RegExp('rgb\\(\\s*' + r + '\\s*,\\s*' + g + '\\s*,\\s*' + b + '\\s*\\)', 'g'),
      function () { swapped++; return 'var(--' + name + ')'; });
    /* the space-separated form, with or without an opacity after the slash */
    css = css.replace(new RegExp('rgba?\\(\\s*' + r + '\\s+' + g + '\\s+' + b + '\\s*/\\s*var\\([^)]*\\)\\s*\\)', 'g'),
      function () { swapped++; return 'var(--' + name + ')'; });
    css = css.replace(new RegExp('rgba?\\(\\s*' + r + '\\s+' + g + '\\s+' + b + '\\s*/\\s*([\\d.]+)(%?)\\s*\\)', 'g'),
      function (w, n, pc) {
        swapped++;
        const pct = Math.round((pc ? parseFloat(n) : parseFloat(n) * 100) * 10) / 10;
        return pct >= 100 ? 'var(--' + name + ')' : 'color-mix(in srgb, var(--' + name + ') ' + pct + '%, transparent)';
      });
    css = css.replace(new RegExp('rgba?\\(\\s*' + r + '\\s+' + g + '\\s+' + b + '\\s*\\)', 'g'),
      function () { swapped++; return 'var(--' + name + ')'; });
    /* an eight-digit hex carries its own opacity in the last two */
    css = css.replace(new RegExp(esc + '([0-9a-f]{2})\\b', 'gi'), function (w, aa) {
      swapped++;
      const pct = Math.round(parseInt(aa, 16) / 255 * 1000) / 10;
      return pct >= 100 ? 'var(--' + name + ')' : 'color-mix(in srgb, var(--' + name + ') ' + pct + '%, transparent)';
    });
    css = css.replace(new RegExp(esc + '\\b', 'gi'), function () { swapped++; return 'var(--' + name + ')'; });
  }
  console.log('  ' + roleOf.size + ' colours given a variable, ' + swapped + ' rules now read one');

  /* ------------------------------------------------------------ addresses */

  html = html.replace(/\s(src|href|data-src|data-bg|poster)\s*=\s*"([^"]*)"/gi,
    (w, a, v) => ' ' + a + '="' + abs(v) + '"');
  /* A link to another page of the original site would take a client's
     visitor to somebody else's website. A link to a section stays a jump
     to that section; anything else on that site goes nowhere. */
  const home = new URL(BASE).origin;
  /* Their social pages and their office on a map are theirs too. */
  if (!OWN) {
    html = html.replace(/\shref="https?:\/\/(?:www\.)?(?:facebook|instagram|linkedin|twitter|x|youtube|tiktok|pinterest|avvo|yelp)\.com[^"]*"/gi, ' href="#"');
    html = html.replace(/\shref="https?:\/\/(?:maps\.google\.[a-z.]+|(?:www\.)?google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)[^"]*"/gi, ' href="#"');
  }
  html = html.replace(/\shref="([^"]*)"/gi, function (w, v) {
    if (v.indexOf(home) !== 0 || /\.(css|woff2?|ttf|otf|png|jpe?g|webp|avif|svg|gif|ico|mp4|webm)(\?|$)/i.test(v)) return w;
    const hash = v.indexOf('#');
    return ' href="' + (hash !== -1 && new URL(v).pathname === new URL(BASE).pathname ? v.slice(hash) : '#') + '"';
  });
  html = html.replace(/\ssrcset\s*=\s*"([^"]*)"/gi, (w, v) =>
    ' srcset="' + v.split(',').map(p => {
      const bits = p.trim().split(/\s+/);
      bits[0] = abs(bits[0]);
      return bits.join(' ');
    }).join(', ') + '"');
  html = html.replace(/style\s*=\s*"([^"]*url\([^"]*)"/gi, (w, v) =>
    'style="' + v.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, (x, q, u) => 'url("' + abs(u) + '")') + '"');

  /* ------------------------------------------------------ split headings
     Animation libraries (GSAP SplitText and the like) cut a heading into
     one span per word or line, positioned for the reveal, and keep the
     sentence whole in aria-label. Frozen, the spans are the wrong words in
     the wrong places and nobody can edit the line. The sentence goes back. */
  html = html.replace(/<(h[1-6]|p|div)(\b[^>]*?)\saria-label="([^"]*)"([^>]*)>([\s\S]*?)<\/\1>/gi,
    function (m, tag, a1, label, a2, inner) {
      if (!/gsap_split|split-line|split-word|split-char|splitting|\bword\b|\bchar\b/i.test(inner)) return m;
      /* A div is only safe when nothing inside it is another div. */
      if (tag.toLowerCase() === 'div' && /<div\b/i.test(inner)) return m;
      return '<' + tag + a1 + a2 + '>' + label + '</' + tag + '>';
    });

  /* ----------------------------------------------------------- the photos
     Somebody else's page keeps its shape. What fills it is ours. */

  let replaced = 0;
  if (!OWN) {
    html = html.replace(/<img\b[^>]*>/gi, function (tag) {
      /* A lazy-loaded picture keeps a blank placeholder in src and the real
         address in data-src until script swaps them. There is no script. */
      const lazy = (tag.match(/\sdata-(?:lazy-)?src\s*=\s*"([^"]+)"/i) || [])[1];
      if (lazy && /\ssrc\s*=\s*"(data:|about:blank)/i.test(tag)) {
        tag = tag.replace(/\ssrc\s*=\s*"[^"]*"/i, ' src="' + lazy + '"');
      }
      const src = (tag.match(/\ssrc\s*=\s*"([^"]*)"/i) || [])[1] || '';
      const alt = (tag.match(/\salt\s*=\s*"([^"]*)"/i) || [])[1] || '';
      const cls = (tag.match(/\sclass\s*=\s*"([^"]*)"/i) || [])[1] || '';
      /* A logo is often a vector file, so this comes before the rule that
         leaves vector icons alone. */
      if (/logo/i.test(src + alt + cls)) return '<span class="clone-wordmark">Your Business Name</span>';
      if (/\.svg(\?|$)/i.test(src) || /^data:/i.test(src)) return tag;   /* icons stay */
      /* Their logo is their identity. It becomes a plain wordmark that the
         builder fills with the client's name. */
      if (/logo/i.test(src + alt + cls)) {
        return '<span class="clone-wordmark">Your Business Name</span>';
      }
      /* Small pictures are icons: an illustration of a key, a scale, a
         house. They carry no identity and a photograph would look absurd in
         a 60px circle. The width comes from the rendered snapshot. */
      const shown = +((tag.match(/\sdata-cw\s*=\s*"(\d+)"/i) || [])[1] || (tag.match(/\swidth\s*=\s*"(\d+)"/i) || [])[1] || 0);
      if ((shown && shown < 160) || /brand|mark|icon/i.test(src + alt)) return tag;
      replaced++;
      return tag
        .replace(/\ssrcset\s*=\s*"[^"]*"/i, '')
        .replace(/\ssizes\s*=\s*"[^"]*"/i, '')
        .replace(/\ssrc\s*=\s*"[^"]*"/i, ' src="' + stockFor(src, alt) + '"');
    });
    /* Backgrounds pointing at their server, swapped the same way. */
    css = css.replace(new RegExp('url\\("' + BASE.origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^"]*\\.(jpe?g|webp)"\\)', 'gi'),   /* a .png background is nearly always an icon */
      function (m) { replaced++; return 'url("' + textureFor(m) + '")'; });
    console.log('  ' + replaced + ' photographs swapped for stock');
  }

  /* -------------------------------------------------------------- assemble */

  const head = html.slice(0, html.indexOf('</head>'));
  const title = (head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || folder;
  const desc = (head.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1] || '';
  const fontLinks = (head.match(/<link\b[^>]*fonts\.googleapis\.com[^>]*>/gi) || []).join('\n');
  const preconnect = '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    + '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';

  /* The classes on <html> and <body> stay. WordPress and Elementor hang
     whole layouts off them: the full-width page, the header style, the
     "home" rules. Dropping them squeezed a page into the theme's narrow
     default column. "no-js" becomes "js", because the page no longer needs
     its script to be shown. */
  const attr = (tag, name) => ((html.match(new RegExp('<' + tag + '\\b[^>]*\\s' + name + '\\s*=\\s*"([^"]*)"', 'i')) || [])[1] || '');
  const htmlClass = attr('html', 'class').replace(/\bno-js\b/g, 'js').replace(/\blenis[\w-]*/g, '').replace(/\s+/g, ' ').trim();
  const bodyClass = attr('body', 'class').trim();
  let body = html.slice(html.indexOf('<body'));
  body = body.replace(/^<body[^>]*>/, '').replace(/<\/body>[\s\S]*$/, '');

  const page = `<!DOCTYPE html>
<html lang="en"${htmlClass ? ' class="' + htmlClass + '"' : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title.trim()}</title>
<meta name="description" content="${desc.replace(/"/g, '&quot;')}">
${preconnect}
${fontLinks}
<style>
/* ══════════════════════════════════════════════════════════════════════════
   ${OWN ? "Cloned from " + BASE.origin + " by" : "Built with"} builder/passes/clone-site.js.

   The design is kept as it stands. The one change of substance is that the
   colours it leans on are read from the variables below instead of being
   written into every rule, which is what lets this template wear a theme.
   ══════════════════════════════════════════════════════════════════════════ */

:root{
${rootVars.join('\n')}
}

/* The page was taken as it renders, so anything waiting on a scroll
   animation was caught at nothing. A file has nothing to scroll into. */
[data-framer-appear-id]:not([class*="menu"]):not([class*="nav"]):not([class*="modal"]):not([class*="popup"]):not([class*="drawer"]):not([class*="offcanvas"]),[data-aos]:not([class*="menu"]):not([class*="nav"]):not([class*="modal"]):not([class*="popup"]):not([class*="drawer"]):not([class*="offcanvas"]),[class*="animate"]:not([class*="menu"]):not([class*="nav"]):not([class*="modal"]):not([class*="popup"]):not([class*="drawer"]):not([class*="offcanvas"]),[class*="fade"]:not([class*="menu"]):not([class*="nav"]):not([class*="modal"]):not([class*="popup"]):not([class*="drawer"]):not([class*="offcanvas"]),[class*="reveal"]:not([class*="menu"]):not([class*="nav"]):not([class*="modal"]):not([class*="popup"]):not([class*="drawer"]):not([class*="offcanvas"]),[class*="wow"]:not([class*="menu"]):not([class*="nav"]):not([class*="modal"]):not([class*="popup"]):not([class*="drawer"]):not([class*="offcanvas"]){
  opacity:1!important;transform:none!important;visibility:visible!important;
}
/* Framer. Its text-reveal boxes are drawn 20px tall and grown by script to
   fit the words; with no script they stay 20px and cut the heading off. The
   "made in Framer" badge is theirs, not ours. */
div[style*="height:20px;min-height:20px;overflow:hidden"]{height:auto!important;min-height:0!important;}
/* Cards that wipe into view start fully clipped; script opens them. */
[style*="clip-path:inset(100% 0% 0% 0%)"]{clip-path:none!important;}
#__framer-badge-container{display:none!important;}
/* Elementor's sticky header clones itself with script to hold its place. */
.elementor-sticky__spacer{display:none!important;}
/* A template's demo page carries the seller's own "buy this" button. */
div:has(> a[href*="lemonsqueezy"]),div:has(> a[href*="gumroad.com"]),a[href*="framer.com/marketplace"]{display:none!important;}
html{scroll-behavior:smooth;}
img{max-width:100%;height:auto;}
.clone-wordmark{display:inline-block;font-weight:700;font-size:22px;line-height:1.1;letter-spacing:.01em;white-space:nowrap;color:inherit;}

${css}
</style>
</head>
<body${bodyClass ? ' class="' + bodyClass + '"' : ''}>
${body}

<script>
/* The site's own JavaScript is gone with its analytics. This is what a
   template actually needs: a menu that opens, and sections that arrive. */
(function () {
  'use strict';

  /* ---- the menu -------------------------------------------------------
     Every one of these designs marks its menu button differently, so go by
     what it is called rather than what class it happens to carry. */
  var toggles = document.querySelectorAll(
    '[class*="menu-toggle"],[class*="menu-btn"],[class*="hamburger"],[class*="burger"],' +
    '[aria-label*="enu"],[aria-controls*="enu"],[class*="nav-toggle"]');
  Array.prototype.forEach.call(toggles, function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var id = b.getAttribute('aria-controls');
      var panel = id ? document.getElementById(id) : null;
      if (!panel) panel = document.querySelector('[class*="mobile-menu"],[class*="nav-menu"],nav ul');
      if (!panel) return;
      var open = panel.getAttribute('data-open') === '1';
      panel.setAttribute('data-open', open ? '0' : '1');
      panel.style.display = open ? '' : 'block';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  /* Nothing is hidden and revealed on scroll here. A snapshot is taken
     mid-animation, and adding a second reveal on top of a page that was
     already part-way through one is how a template comes out blank. The
     stylesheet above forces everything visible instead. */

  /* ---- forms do nothing, and say so quietly -------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('form'), function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); });
  });
})();
</script>
</body>
</html>
`;

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'index.html'), page);
  fs.writeFileSync(path.join(OUT, 'roles.json'), JSON.stringify({ roleMap: roleMap, vars: rootVars }, null, 2));
  console.log('  written ' + folder + '/index.html (' + Math.round(page.length / 1024) + 'KB)');
}

main().catch(e => { console.error(e); process.exit(1); });
