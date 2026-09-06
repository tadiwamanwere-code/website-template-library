/* =========================================================================
   build-pharmacy.js — turns the live Long Range Pharmacies storefront into
   a single-file template in the library.

   The client's site is a React app: dozens of files, a build step, and a
   basket that talks to a server. None of that belongs in a template. What
   we want is the design, exactly as it stands, in one HTML file that the
   builder can fill in and a prospect can open.

   So the page is taken as it renders, and three things are done to it:

     1. The stylesheet is inlined, with the brand's colours swapped for CSS
        variables. That one change is what lets the template wear a theme —
        a compiled Tailwind sheet has the hex codes written into every rule,
        and a hex code cannot be themed.

     2. The reveal-on-scroll state is cleared. A snapshot catches those
        elements mid-animation, and a static page has to show everything.

     3. The hero carousel and the menus are given a small piece of plain
        JavaScript, because the React that drove them is gone.

   Run: node builder/passes/build-pharmacy.js <captured-dom.html> <bundle.css>
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '..', '..', '19-longrange-pharmacy');
const domFile = process.argv[2];
const cssFile = process.argv[3];
if (!domFile || !cssFile) {
  console.error('  usage: node build-pharmacy.js <captured-dom.html> <bundle.css>');
  process.exit(1);
}

let dom = fs.readFileSync(domFile, 'utf8');
let css = fs.readFileSync(cssFile, 'utf8');

/* --------------------------------------------------------------- colours
   Every one of these is in the client's own tailwind.config.js. Replacing
   the compiled hex with the variable it came from gives the design back the
   knobs the source had, which is all a theme needs. */

const VARS = {
  '#12A85A': 'green', '#04783F': 'green-d', '#4CC787': 'green-l',
  '#04672F': 'navy-900', '#055A2C': 'navy-800', '#066B33': 'navy-700',
  '#F5E900': 'yellow', '#F7D51D': 'yellow-d',
  '#0B322C': 'pine', '#062420': 'pine-9', '#12463E': 'pine-7',
  '#24272A': 'ink', '#58615C': 'muted',
  '#F4F7F5': 'ground', '#f6f8f7': 'ground-2',
  '#F3FAF8': 'mint-50', '#E6F4F0': 'mint-100', '#D4ECE7': 'mint-200',
  '#BFE3DC': 'mint-300', '#A6D7CF': 'mint-400', '#8DC5BE': 'mint-500', '#70A9A2': 'mint-600',
  '#F0644A': 'coral', '#D9503A': 'coral-d', '#FCEDE8': 'coral-soft',
  '#FBF3EE': 'cream',
  '#FBE4EC': 'blush', '#F3D0DE': 'blush-deep', '#9D2B54': 'blush-ink',
  /* the greys the design borrows from Tailwind for rules and quiet text */
  '#e2e8f0': 'line', '#cbd5e1': 'line-2', '#f1f5f9': 'paper-2',
  '#64748b': 'grey', '#475569': 'grey-2', '#334155': 'grey-3'
};

/* The values those variables start out as: the design exactly as drawn. */
const ROOT = [
  '/* brand green — nav, buttons, add to basket */',
  '--green:#12A85A; --green-d:#04783F; --green-l:#4CC787;',
  '--navy-900:#04672F; --navy-800:#055A2C; --navy-700:#066B33;',
  '/* brand yellow — highlight flashes only */',
  '--yellow:#F5E900; --yellow-d:#F7D51D;',
  '/* pine: a deep forest-teal used as near-black, so the ink keeps a green cast */',
  '--pine:#0B322C; --pine-9:#062420; --pine-7:#12463E;',
  '--ink:#24272A; --muted:#58615C;',
  '/* the grounds */',
  '--sheet:#FFFFFF; --ground:#F4F7F5; --ground-2:#f6f8f7; --paper-2:#f1f5f9;',
  '/* mint studio palette — sampled off the product render so the floor and',
  '   the podium read as one set with the product standing on it */',
  '--mint-50:#F3FAF8; --mint-100:#E6F4F0; --mint-200:#D4ECE7;',
  '--mint-300:#BFE3DC; --mint-400:#A6D7CF; --mint-500:#8DC5BE; --mint-600:#70A9A2;',
  '/* coral — urgency only: promo strip, sale flashes, basket count */',
  '--coral:#F0644A; --coral-d:#D9503A; --coral-soft:#FCEDE8;',
  '--cream:#FBF3EE;',
  '--blush:#FBE4EC; --blush-deep:#F3D0DE; --blush-ink:#9D2B54;',
  '/* rules and quiet text */',
  '--line:#e2e8f0; --line-2:#cbd5e1; --grey:#64748b; --grey-2:#475569; --grey-3:#334155;',
  '/* the three typefaces, named so one line changes the whole page */',
  "--body:'Inter',Arial,system-ui,sans-serif;",
  "--display:'Manrope','Inter',system-ui,sans-serif;",
  "--ui:'Montserrat',system-ui,sans-serif;",
  "--marker:'Permanent Marker',cursive;"
];

/* Tailwind writes colours two ways: as a hex in an arbitrary value, and as
   `rgb(R G B / var(--tw-…-opacity))` for its own palette. Both are handled,
   the second by rebuilding the rgb() around the variable. */
function hexToRgbTriplet(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16)
  ];
}

/* A colour with something less than full opacity has to stay that way, or
   a tint becomes a solid block. color-mix against transparent is the same
   thing written so a variable can sit inside it. */
function fade(name, alpha) {
  const pct = Math.round(Math.max(0, Math.min(1, alpha)) * 1000) / 10;
  if (pct >= 100) return 'var(--' + name + ')';
  return 'color-mix(in srgb, var(--' + name + ') ' + pct + '%, transparent)';
}

let swaps = 0;
for (const hex of Object.keys(VARS)) {
  const name = VARS[hex];
  const [r, g, b] = hexToRgbTriplet(hex);
  const esc = hex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  /* 1. #12A85A1a — an eight-digit hex, so the last two are the opacity.
        This has to go first: taking the six-digit form out from under it
        would leave the stray "1a" behind, which is not a colour at all. */
  css = css.replace(new RegExp(esc + '([0-9a-f]{2})\\b', 'gi'), function (whole, aa) {
    swaps++;
    return fade(name, parseInt(aa, 16) / 255);
  });

  /* 2. rgb(18 168 90 / var(--tw-bg-opacity, 1)) — Tailwind's own form. The
        variable is always 1 in a compiled sheet, so the colour is solid. */
  css = css.replace(
    new RegExp('rgba?\\(\\s*' + r + '\\s+' + g + '\\s+' + b + '\\s*/\\s*var\\(--tw-[a-z-]+-opacity(?:\\s*,\\s*[\\d.]+)?\\)\\s*\\)', 'g'),
    function () { swaps++; return 'var(--' + name + ')'; });

  /* 3. rgb(18 168 90 / .5) and rgb(18 168 90 / 50%) */
  css = css.replace(
    new RegExp('rgba?\\(\\s*' + r + '\\s+' + g + '\\s+' + b + '\\s*/\\s*([\\d.]+)(%?)\\s*\\)', 'g'),
    function (whole, n, pc) { swaps++; return fade(name, pc ? parseFloat(n) / 100 : parseFloat(n)); });

  /* 4. rgba(18,168,90,.5) */
  css = css.replace(
    new RegExp('rgba\\(\\s*' + r + '\\s*,\\s*' + g + '\\s*,\\s*' + b + '\\s*,\\s*([\\d.]+)\\s*\\)', 'g'),
    function (whole, n) { swaps++; return fade(name, parseFloat(n)); });

  /* 5. plain rgb(18,168,90) and rgb(18 168 90) */
  css = css.replace(
    new RegExp('rgba?\\(\\s*' + r + '[\\s,]+' + g + '[\\s,]+' + b + '\\s*\\)', 'g'),
    function () { swaps++; return 'var(--' + name + ')'; });

  /* 6. the six-digit hex on its own */
  css = css.replace(new RegExp(esc + '\\b', 'gi'), function () { swaps++; return 'var(--' + name + ')'; });
}

/* White is the page itself on this design, so it gets a variable too — but
   only where it is a background. White text on a green button stays white. */
css = css.replace(/(\.bg-white\s*\{[^}]*?)rgb\(255\s+255\s+255\s*\/\s*var\(--tw-bg-opacity(?:\s*,\s*[\d.]+)?\)\)/g,
  function (whole, head) { swaps++; return head + 'var(--sheet)'; });

console.log('  ' + swaps + ' colours in the stylesheet now come from a variable');

/* ------------------------------------------------------------------ body */

let body = dom.slice(dom.indexOf('<body'), dom.lastIndexOf('</body>'));
body = body.replace(/^<body[^>]*>/, '');

/* The pictures live in the template's own folder, and the path to them has
   to be absolute. A finished site is served from /s/<slug>, not from the
   folder, so a relative "assets/…" would be looked for beside the link and
   found nowhere. That is exactly why the hero came out blank the first
   time this was built. */
const BASE = '/19-longrange-pharmacy/assets/';
body = body.replace(/(src|srcset|href)="\/assets\//g, '$1="' + BASE);
body = body.replace(/,\s*\/assets\//g, ', ' + BASE);
body = body.replace(/href="\/favicon\.png"/g, 'href="' + BASE + 'favicon.png"');

/* Every link in the snapshot points into the app's own routes, which do not
   exist in a single file. Send them to the section a visitor actually
   wants: the branches, or the contact form. */
body = body.replace(/href="#\/(shop|catalogue|account|checkout)[^"]*"/g, 'href="#shop"');

/* Two dialogs and a drawer belong to the app, not to a landing page. */
body = body.replace(/<div[^>]*role="dialog"[\s\S]*?<\/div>\s*(?=<)/g, '');

/* Nothing on a mockup should be crawled or fetched eagerly. */
body = body.replace(/\sfetchpriority="high"/g, '');

/* The hero pictures ship at two sizes. That is right for the client's own
   site and wrong here: swap the picture in the builder and the small screen
   would quietly keep showing the old one. One picture, one address. */
body = body.replace(/\ssrcset="[^"]*"/g, '');
body = body.replace(/\ssizes="[^"]*"/g, '');

fs.mkdirSync(OUT_DIR, { recursive: true });

/* ------------------------------------------------------------------ page */

const page = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Long Range Pharmacies &mdash; pharmacy and health shop</title>
<meta name="description" content="Long Range Pharmacies. A pharmacy and health shop: prescriptions dispensed by pharmacists, plus vitamins, skin care, baby care and sports nutrition.">
<link rel="icon" href="/19-longrange-pharmacy/assets/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&family=Permanent+Marker&display=swap" rel="stylesheet">
<style>
/* ══════════════════════════════════════════════════════════════════════════
   LONG RANGE PHARMACY — pharmacy and health shop

   The client's own storefront, kept as it stands. The stylesheet below is
   the site's compiled sheet with one change: every brand colour is read
   from a variable instead of being written into the rule. That is what lets
   the builder put a different palette on it.

   This template deliberately breaks the library's one-accent rule. A shop
   needs a commerce palette: green for the buttons, coral for urgency,
   yellow for a highlight. That is the brief, not an oversight.
   ══════════════════════════════════════════════════════════════════════════ */

:root{
  ${ROOT.join('\n  ')}
}

/* The page was captured with its reveal-on-scroll animations part-way
   through, which leaves elements sitting at nothing. A page in a file has
   nothing to scroll into, so everything is shown. */
[class*="transition-[transform,opacity]"],
[class*="transition-\\[transform"]{opacity:1!important;transform:none!important;}

/* The hero runs itself now, in a few lines at the bottom of this file
   rather than a framework. */
.hero-slide{opacity:0;transition:opacity .55s ease;pointer-events:none;}
.hero-slide.is-on{opacity:1;pointer-events:auto;}
.hero-dot.is-on{background:var(--pine)!important;width:26px!important;}

body{font-family:var(--body);}
h1,h2,h3,h4{font-family:var(--display);}

${css}
</style>
</head>
<body>
${body}

<script>
/* -------------------------------------------------------------------------
   Everything the page needs to work on its own. No framework, no build.
   ------------------------------------------------------------------------- */
(function () {
  'use strict';

  /* ---- the hero -------------------------------------------------------
     All five panels are in the markup, stacked. Showing one is a class. */
  var stage = document.querySelector('[aria-roledescription="carousel"]');
  if (stage) {
    var slides = Array.prototype.filter.call(
      stage.querySelectorAll(':scope > div > div[aria-hidden="true"]'),
      function (el) { return el.className.indexOf('absolute inset-0') !== -1; }
    );
    slides.forEach(function (el, i) {
      el.classList.add('hero-slide');
      el.classList.remove('opacity-0', 'opacity-100');
      if (i === 0) el.classList.add('is-on');
      el.removeAttribute('aria-hidden');
    });

    var at = 0;
    /* The dots are the buttons that name a range — "Show Vitamins". The two
       round ones are Previous and Next, and they are not dots. */
    var dots = Array.prototype.slice.call(stage.querySelectorAll('button[aria-label^="Show "]'));
    dots.forEach(function (d) { d.classList.add('hero-dot'); });

    var show = function (n) {
      if (!slides.length) return;
      at = (n + slides.length) % slides.length;
      slides.forEach(function (el, i) { el.classList.toggle('is-on', i === at); });
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i === at); });
    };

    Array.prototype.forEach.call(stage.querySelectorAll('button'), function (b) {
      var label = b.getAttribute('aria-label') || '';
      if (/^Previous/i.test(label)) b.addEventListener('click', function () { show(at - 1); stop(); });
      else if (/^Next/i.test(label)) b.addEventListener('click', function () { show(at + 1); stop(); });
      else if (/^Show /i.test(label)) {
        var mine = dots.indexOf(b);
        b.addEventListener('click', function () { show(mine); stop(); });
      }
    });

    /* Moves on its own until somebody takes hold of it, then stops and
       stays where they put it. */
    var timer = setInterval(function () { show(at + 1); }, 6000);
    function stop() { clearInterval(timer); }
    stage.addEventListener('mouseenter', stop);
    show(0);
  }

  /* ---- anything that only made sense inside the app ------------------- */
  document.querySelectorAll('form').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); });
  });

  /* ---- reveal on scroll, the small version ---------------------------- */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('main section');
    var io = new IntersectionObserver(function (rows) {
      rows.forEach(function (row) {
        if (!row.isIntersecting) return;
        row.target.style.opacity = '1';
        row.target.style.transform = 'none';
        io.unobserve(row.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el, i) {
      if (i === 0) return;                       /* the hero is already there */
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)';
      io.observe(el);
    });
  }
})();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT_DIR, 'index.html'), page);
console.log('  written ' + path.join(OUT_DIR, 'index.html') + ' (' + Math.round(page.length / 1024) + 'KB)');

/* ------------------------------------------------------------- the files
   Every picture the page asks for, listed so a second script can fetch
   them. Nothing is downloaded here: this pass is meant to be re-runnable
   without hitting the network. */

const wanted = new Set();
const strip = url => String(url).replace('/19-longrange-pharmacy/', '');
const re = /(?:src|href)="\/19-longrange-pharmacy\/(assets\/[^"]+)"/g;
let m;
while ((m = re.exec(page)) !== null) wanted.add(m[1]);
const reSet = /srcset="([^"]+)"/g;
while ((m = reSet.exec(page)) !== null) {
  for (const part of m[1].split(',')) {
    const url = strip(part.trim().split(/\s+/)[0]);
    if (url && url.indexOf('assets/') === 0) wanted.add(url);
  }
}
fs.writeFileSync(path.join(__dirname, 'pharmacy-assets.txt'), Array.from(wanted).sort().join('\n') + '\n');
console.log('  ' + wanted.size + ' files to fetch, listed in builder/passes/pharmacy-assets.txt');
