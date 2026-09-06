/* =========================================================================
   render.js — the only thing that turns a template into a client's site.

   It is find and replace, and nothing else. No AI, no parsing, no DOM.
   Give it a template folder, a set of values and a theme name, and it
   hands back finished HTML.

     node builder/render.js --list
     node builder/render.js 20-tower-construction --theme charcoal-rust \
       --set BUSINESS_NAME="Acme Builders" --out builder/out/acme.html

   Three rules this file exists to keep:

     1. One rendering path. The preview and the published page both come
        through here, so they cannot disagree.
     2. Templates are never written to. A template is source; a site is the
        inputs plus this function.
     3. Nothing is invented. A field left empty stays as the template drew
        it. Making up a fact about a real business is the one unforgivable
        bug in this system.

   A template needs no special markup to become reusable. Everything lives
   in its swap.json: palettes (four sets of that template's own CSS
   variables), swaps (the exact strings to replace) and images.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const LIBRARY = path.resolve(__dirname, '..');
const LENGTH_TOLERANCE = 1.2;                 // 20% longer than the default is a warning
const CREDIT_URL = 'https://rylolabz.com';
const CREDIT_NAME = 'Rylo Labz';

/* ---------------------------------------------------------------- loading */

function templateDir(template) {
  if (!/^[0-9a-z-]+$/i.test(String(template))) throw new Error('Bad template name: ' + template);
  const dir = path.join(LIBRARY, template);
  if (!dir.startsWith(LIBRARY)) throw new Error('Bad template name');
  return dir;
}

function loadTemplate(template) {
  const dir = templateDir(template);
  const page = path.join(dir, 'index.html');
  const cardPath = path.join(dir, 'swap.json');
  if (!fs.existsSync(page)) throw new Error('No index.html in ' + template);
  if (!fs.existsSync(cardPath)) throw new Error('No swap.json in ' + template + '. It is not reusable yet.');
  return {
    html: fs.readFileSync(page, 'utf8'),
    card: JSON.parse(fs.readFileSync(cardPath, 'utf8'))
  };
}

/* ---------------------------------------------------------------- helpers */

/* Values arrive as plain text typed by a person. They land in HTML, so the
   five characters that would change the markup are escaped. */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* How long a string reads to a person: an entity counts as one character,
   because that is what the layout sees. */
function visibleLength(str) {
  return String(str)
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, 'x')
    .length;
}

/* A slot may look for one string or several. A logo usually sits in the
   header and again in the footer. Always answer with a list. */
function findsOf(entry) {
  if (Array.isArray(entry.find)) return entry.find.filter(Boolean);
  return entry.find ? [entry.find] : [];
}

function longestFind(entry) {
  return findsOf(entry).reduce(function (n, f) { return Math.max(n, f.length); }, 0);
}

/**
 * Apply every replacement in ONE pass over the original string.
 *
 * Doing them one after another looks the same and is not: a value that has
 * just been written in can be matched again by a later rule. Filling
 * "Building & Civil Engineering Contractors" with "Plumbing and Drainage
 * Contractors" and then replacing the leftover word "Contractors" gave
 * "Plumbing and Drainage Plumbing". One pass over the original cannot.
 */
function applyOnce(source, rules) {
  const hits = [];
  rules.forEach(function (rule, priority) {
    if (!rule.find) return;
    let at = source.indexOf(rule.find);
    while (at !== -1) {
      hits.push({ start: at, end: at + rule.find.length, text: rule.replacement, priority: priority });
      at = source.indexOf(rule.find, at + rule.find.length);
    }
  });

  /* Earliest first; where two rules start together the longer one wins,
     which is what "longest first" means once positions are involved. */
  hits.sort(function (a, b) { return a.start - b.start || a.priority - b.priority; });

  let out = '';
  let cursor = 0;
  let applied = 0;
  for (const hit of hits) {
    if (hit.start < cursor) continue;          // already covered by a longer match
    out += source.slice(cursor, hit.start) + hit.text;
    cursor = hit.end;
    applied++;
  }
  return { text: out + source.slice(cursor), applied: applied };
}

/* ----------------------------------------------------------------- themes
   A theme is a named set of that template's own CSS variables, listed in
   swap.json. They are injected as one block at the end of <head>, so they
   beat whatever the template set at the top of the file.

   Four sets per template, hand-picked and checked. Not a colour picker: a
   free choice of colour is a good way to wreck a good design. */

function paletteNames(card) {
  const names = Object.keys(card.palettes || {});
  if (names.length) return names;
  return Array.isArray(card.themes) && card.themes.length ? card.themes : ['default'];
}

function paletteVars(card, name) {
  return (card.palettes || {})[name] || {};
}

/* Set data-theme too: templates written before palettes existed carry their
   own theme table keyed off this attribute. */
function tagTheme(html, theme) {
  const cleaned = html.replace(/<html\b([^>]*)>/i, function (whole, attrs) {
    return '<html' + attrs.replace(/\s+data-theme="[^"]*"/i, '') + '>';
  });
  return cleaned.replace(/<html\b([^>]*)>/i, '<html$1 data-theme="' + theme + '">');
}

/* ------------------------------------------------------------------- type
   Type size changes by rewriting the numbers in the stylesheet, not by
   adding a variable to every template by hand. Every font-size is
   multiplied: 24px and up counts as a heading, the rest as body.

   A declaration that already routes through --type-display or --type-body
   is left alone, because the variable is doing the same job. */

function scaleOneValue(value, displayK, bodyK) {
  if (/var\(--type-(display|body)\)/.test(value)) return value;

  const measured = [];
  const re = /([\d.]+)(px|rem|em)\b/g;
  let m;
  while ((m = re.exec(value)) !== null) measured.push(parseFloat(m[1]) * (m[2] === 'px' ? 1 : 16));

  const peak = measured.length ? Math.max.apply(null, measured) : 0;
  const k = peak >= 24 ? displayK : bodyK;
  if (k === 1) return value;

  return value.replace(/([\d.]+)(px|rem|em|vw|vh|vmin|vmax|%)\b/g, function (whole, n, unit) {
    return (Math.round(parseFloat(n) * k * 100) / 100) + unit;
  });
}

function scaleType(html, displayK, bodyK) {
  if (displayK === 1 && bodyK === 1) return html;
  return html.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, function (whole, open, css, close) {
    const out = css.replace(/font-size\s*:\s*([^;}]+)/gi, function (m, val) {
      return 'font-size:' + scaleOneValue(val, displayK, bodyK);
    });
    return open + out + close;
  });
}

/* ------------------------------------------------------------------ fonts
   A fixed list on purpose, the same reason there are four themes and not a
   colour picker. Every template routes its typefaces through --sans and
   --mono, so two lines change the whole page. */

const FONTS = {
  'Inter':            { css: 'Inter:wght@400;500;600;700;800;900', stack: '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif' },
  'Archivo':          { css: 'Archivo:wght@400;500;600;700;800;900', stack: '"Archivo",Helvetica,Arial,sans-serif' },
  'Manrope':          { css: 'Manrope:wght@400;500;600;700;800', stack: '"Manrope",Helvetica,Arial,sans-serif' },
  'Space Grotesk':    { css: 'Space+Grotesk:wght@400;500;600;700', stack: '"Space Grotesk",Helvetica,Arial,sans-serif' },
  'Sora':             { css: 'Sora:wght@400;500;600;700;800', stack: '"Sora",Helvetica,Arial,sans-serif' },
  'IBM Plex Sans':    { css: 'IBM+Plex+Sans:wght@400;500;600;700', stack: '"IBM Plex Sans",Helvetica,Arial,sans-serif' },
  'Figtree':          { css: 'Figtree:wght@400;500;600;700;800;900', stack: '"Figtree",Helvetica,Arial,sans-serif' },
  'Playfair Display': { css: 'Playfair+Display:wght@400;500;600;700;800;900', stack: '"Playfair Display",Georgia,serif' },
  'Fraunces':         { css: 'Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900', stack: '"Fraunces",Georgia,serif' },
  'Instrument Serif': { css: 'Instrument+Serif:ital@0;1', stack: '"Instrument Serif",Georgia,serif' },
  'JetBrains Mono':   { css: 'JetBrains+Mono:wght@400;500;700', stack: '"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace' },
  'IBM Plex Mono':    { css: 'IBM+Plex+Mono:wght@400;500;700', stack: '"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace' },
  'Space Mono':       { css: 'Space+Mono:wght@400;700', stack: '"Space Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace' }
};

const COLOUR_KEYS = ['brand', 'accent', 'ink', 'paper', 'paper-2', 'rule'];

function fontList() {
  return Object.keys(FONTS).map(function (name) { return { name: name, mono: /Mono/.test(name) }; });
}

function clampNum(v, lo, hi) { return Math.min(hi, Math.max(lo, Number(v) || 1)); }

/* One block at the end of <head>: the theme, then anything set by hand,
   then the fonts. Last one in the file wins, which is the order we want. */
function headBlock(card, themeName, style, hidden) {
  style = style || {};
  const vars = [];
  const families = [];

  /* 1. the theme */
  const palette = paletteVars(card, themeName);
  for (const name of Object.keys(palette)) vars.push('  --' + name + ':' + palette[name] + ';');

  /* 2. colours set by hand. A template says which of its own variables are
        safe to touch, and what else has to move with them. */
  const adjust = card.adjust || {};
  for (const role of Object.keys(adjust)) {
    const spec = adjust[role];
    const picked = style[role];
    if (!picked || !/^#[0-9A-Fa-f]{3,8}$/.test(picked)) continue;
    vars.push('  --' + (spec.var || role) + ':' + picked + ';');
    for (const alsoVar of Object.keys(spec.also || {})) {
      vars.push('  --' + alsoVar + ':' + String(spec.also[alsoVar]).split('{}').join(picked) + ';');
    }
  }

  /* Templates that carry the six universal names (template 20 onward). */
  for (const key of COLOUR_KEYS) {
    const v = style[key];
    if (v && /^#[0-9A-Fa-f]{3,8}$/.test(v) && !adjust[key]) vars.push('  --' + key + ':' + v + ';');
  }

  /* 3. typefaces */
  const display = FONTS[style.fontDisplay];
  const mono = FONTS[style.fontMono];
  if (display) { vars.push('  --sans:' + display.stack + ';'); families.push(display.css); }
  if (mono) { vars.push('  --mono:' + mono.stack + ';'); families.push(mono.css); }

  /* Templates written before the scale was arithmetic still read these. */
  if (style.typeDisplay && Number(style.typeDisplay) !== 1) vars.push('  --type-display:' + clampNum(style.typeDisplay, 0.7, 1.5) + ';');
  if (style.typeBody && Number(style.typeBody) !== 1) vars.push('  --type-body:' + clampNum(style.typeBody, 0.8, 1.4) + ';');

  const rules = [];

  /* A wordmark logo already says the name, so the text one beside it is a
     duplicate. A mark-only logo still needs it, which is why this is a
     choice and not automatic. */
  if (style.hideBrandText) rules.push('.brand-txt,.brand__txt,.brand-text,.brand-name{display:none!important;}');

  /* Sections switched off in the builder. */
  for (const id of style.hideSections || []) {
    if (id === 'footer' || id === 'header') rules.push(id + '{display:none!important;}');
    else if (/^[A-Za-z][\w-]*$/.test(id)) rules.push('#' + id + '{display:none!important;}');
  }

  /* Pictures the client does not have. The image goes and so does the box
     it sat in, so a gallery closes up instead of leaving a hole. */
  for (const key of hidden || []) {
    const mark = '#no-' + key;
    rules.push('[src="' + mark + '"],[href="' + mark + '"],[style*="' + mark + '"]{display:none!important;}');
    rules.push(':is(figure,picture,div,li,a,span,article):has(>[src="' + mark + '"]){display:none!important;}');
  }

  if (!vars.length && !rules.length) return '';

  const link = families.length
    ? '<link href="https://fonts.googleapis.com/css2?' + families.map(function (f) { return 'family=' + f; }).join('&') + '&display=swap" rel="stylesheet">\n'
    : '';

  /* :root,html[data-theme] matches the specificity of a template's own
     html[data-theme="x"] table, and this block comes later in the file. */
  const block = vars.length ? ':root,html,html[data-theme]{\n' + vars.join('\n') + '\n}\n' : '';
  return link + '<style id="site-style">\n' + block + rules.join('\n') + '\n</style>\n';
}

/* ---------------------------------------------------------------- noindex */

/* A mockup of a real business must never turn up in a search result.
   Handover files are the one case where we take it back off again. */
function applyNoindex(html, wanted) {
  const stripped = html.replace(/\s*<meta name="robots"[^>]*>\n?/gi, '');
  if (!wanted) return stripped;
  return stripped.replace(/(<meta name="viewport"[^>]*>)/i,
    '$1\n<meta name="robots" content="noindex, nofollow">');
}

/* ----------------------------------------------------------------- credit
   Who built it. One line in the footer of every site this makes. It uses
   currentColor, so it reads on a dark footer and a light one alike. */

function applyCredit(html, wanted) {
  const cleaned = html.replace(/\s*<div class="built-by"[\s\S]*?<\/div>\n?/g, '');
  if (wanted === false) return cleaned;

  const line =
    '\n<div class="built-by" style="width:100%;padding:18px 24px 22px;text-align:center;' +
    'font:400 11px/1.6 ui-sans-serif,system-ui,-apple-system,Segoe UI,Helvetica,Arial,sans-serif;' +
    'letter-spacing:.14em;text-transform:uppercase;opacity:.55;box-sizing:border-box">' +
    'Site by <a href="' + CREDIT_URL + '" target="_blank" rel="noopener" ' +
    'style="color:inherit;text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:1px">' +
    CREDIT_NAME + '</a></div>\n';

  const at = cleaned.lastIndexOf('</footer>');
  if (at !== -1) return cleaned.slice(0, at) + line + cleaned.slice(at);

  const end = cleaned.lastIndexOf('</body>');
  if (end !== -1) return cleaned.slice(0, end) + line + cleaned.slice(end);
  return cleaned + line;
}

/* ----------------------------------------------------------------- render */

const HIDE = '__HIDE__';

/**
 * @param {string} template  folder name, e.g. "20-tower-construction"
 * @param {object} swaps     { BUSINESS_NAME: "Acme Builders", ... }
 * @param {string} theme     one of the template's palettes
 * @param {object} [opts]    { noindex, credit, edits:[{find,replace}], style:{} }
 * @returns {{ html:string, warnings:string[], applied:number }}
 */
function render(template, swaps, theme, opts) {
  opts = opts || {};
  swaps = swaps || {};

  const loaded = loadTemplate(template);
  const source = loaded.html;
  const card = loaded.card;
  const warnings = [];

  const themes = paletteNames(card);
  let chosen = theme || themes[0];
  if (themes.indexOf(chosen) === -1) {
    warnings.push('Theme "' + chosen + '" is not one of this template themes (' + themes.join(', ') + '). Using "' + themes[0] + '".');
    chosen = themes[0];
  }

  const entries = (card.swaps || []).concat(card.images || []);
  const byKey = new Map(entries.map(function (e) { return [e.key, e]; }));
  const imageKeys = new Set((card.images || []).map(function (i) { return i.key; }));

  /* A value for a key this template does not have is a mistake worth saying
     out loud, not something to swallow. */
  for (const key of Object.keys(swaps)) {
    if (!byKey.has(key)) warnings.push('No swap named "' + key + '" in ' + template + '/swap.json. Ignored.');
  }

  /* Longest find first. This is the whole reason "Tower" does not eat
     "Tower Construction". */
  const ordered = entries.slice().sort(function (a, b) { return longestFind(b) - longestFind(a); });

  let html = source;
  const rules = [];
  const hidden = [];

  for (const entry of ordered) {
    const finds = findsOf(entry);
    const live = finds.filter(function (f) { return html.indexOf(f) !== -1; });

    if (!live.length) {
      warnings.push('STALE: "' + entry.key + '" looks for ' + JSON.stringify((finds[0] || '').slice(0, 60)) + ' and it is not in the template any more.');
      continue;
    }
    if (live.length < finds.length) {
      warnings.push('STALE: "' + entry.key + '" found ' + live.length + ' of ' + finds.length + ' places it expected.');
    }

    const raw = swaps[entry.key];
    if (raw === undefined || raw === null || String(raw).trim() === '') continue;

    /* A picture the client does not have. Point it at a marker the injected
       CSS knows to hide, rather than leaving a broken image. */
    if (String(raw).trim() === HIDE) {
      if (!imageKeys.has(entry.key)) { warnings.push('"' + entry.key + '" is not a picture, so it cannot be hidden.'); continue; }
      hidden.push(entry.key);
      for (const f of live) rules.push({ find: f, replacement: '#no-' + entry.key });
      continue;
    }

    /* Everything is escaped, images included: a URL lands inside an HTML
       attribute, so a stray quote there would break out of the tag. */
    const value = escapeHtml(String(raw).trim());
    const isImage = imageKeys.has(entry.key);

    /* Length check against what the designer allowed for. */
    const limit = entry.maxChars;
    const len = visibleLength(value);
    if (limit && len > limit) {
      warnings.push('TOO LONG: "' + entry.key + '" is ' + len + ' characters, the design allows ' + limit + '. It will overflow.');
    } else if (!limit && !isImage && len > visibleLength(finds[0]) * LENGTH_TOLERANCE) {
      warnings.push('TOO LONG: "' + entry.key + '" is ' + len + ' characters against a default of ' + visibleLength(finds[0]) + '. Over 20% longer breaks these layouts.');
    }

    const replacement = entry.format ? entry.format.split('{}').join(value) : value;
    for (const f of live) rules.push({ find: f, replacement: replacement });
  }

  /* One pass, so a value that has just been written in cannot be matched
     again by a later rule. */
  const swapped = applyOnce(html, rules);
  html = swapped.text;
  let applied = swapped.applied;

  /* Edits made by clicking the page. Each one is the exact text that was on
     the page and the text that replaced it, so it is the same dumb mechanism
     as a swap and re-renders identically. A second pass, because they were
     typed against a page that already had the swaps in it. */
  const editRules = [];
  for (const edit of opts.edits || []) {
    if (!edit || !edit.find || edit.find === edit.replace) continue;
    if (html.indexOf(edit.find) === -1) {
      warnings.push('LOST EDIT: ' + JSON.stringify(edit.find.slice(0, 40)) + ' is no longer on the page, so that change could not be re-applied.');
      continue;
    }
    editRules.push({ find: edit.find, replacement: edit.replace });
  }
  editRules.sort(function (a, b) { return b.find.length - a.find.length; });
  const edited = applyOnce(html, editRules);
  html = edited.text;
  applied += edited.applied;

  /* Type size is arithmetic on the stylesheet, so it works on any template
     without that template knowing anything about it. */
  const style = opts.style || {};
  html = scaleType(html,
    clampNum(style.typeDisplay || 1, 0.7, 1.5),
    clampNum(style.typeBody || 1, 0.8, 1.4));

  html = tagTheme(html, chosen);
  html = applyNoindex(html, opts.noindex !== false);
  html = applyCredit(html, opts.credit !== false);

  /* Theme, hand-set colours, typefaces and anything hidden. Last, so it
     wins over everything the template said. */
  html = html.replace(/\s*<style id="site-style">[\s\S]*?<\/style>\n?/g, '');
  const block = headBlock(card, chosen, style, hidden);
  if (block) html = html.replace('</head>', block + '</head>');

  /* The worst failure this can have is shipping a page to a prospect with
     the template's own business name still on it. Once a client name is
     set, none of the template's brand words may survive. Checked always. */
  if (swaps.BUSINESS_NAME) {
    const body = html.slice(html.indexOf('<body'));
    for (const token of card.brandTokens || []) {
      if (body.indexOf(token) !== -1) {
        warnings.push('BRAND LEAK: "' + token + '" is still on the page. A swap was missed.');
      }
    }
  }

  return { html: html, warnings: warnings, applied: applied };
}

/* ------------------------------------------------------- sensible defaults
   The app must ship a real page when someone types only a business name and
   clicks Finish. This fills the fields that can be worked out from the ones
   we were given. It is not part of render(): render stays dumb. */

/* Cut a phrase down without leaving it hanging on a joining word.
   "Groundworks and Civil Engineering" -> "Groundworks", not "Groundworks and". */
const JOINERS = new Set(['and', '&', 'or', 'of', 'for', 'the', 'to', 'in', 'with', 'a', 'at', 'on']);

function shorten(phrase, maxWords) {
  const words = String(phrase).split(/\s+/).slice(0, maxWords);
  while (words.length > 1 && JOINERS.has(words[words.length - 1].toLowerCase())) words.pop();
  return words.join(' ');
}

/* Drop whole words until it fits. Better a short true line than one that
   overflows the slot it was designed for. */
function trimTo(phrase, limit) {
  if (visibleLength(phrase) <= limit) return phrase;
  const words = String(phrase).split(/\s+/);
  while (words.length > 1 && visibleLength(words.join(' ')) > limit) words.pop();
  while (words.length > 1 && JOINERS.has(words[words.length - 1].toLowerCase())) words.pop();
  return words.join(' ').slice(0, limit);
}

function firstWord(name) { return String(name).trim().split(/\s+/)[0] || ''; }
function restOfName(name) {
  const w = String(name).trim().split(/\s+/);
  return w.length > 1 ? w.slice(1).join(' ') : '';
}

function deriveSwaps(template, given) {
  const card = loadTemplate(template).card;
  const list = card.swaps || [];
  const known = new Map(list.map(function (s) { return [s.key, s]; }));
  const out = Object.assign({}, given);

  function set(key, value) {
    if (!known.has(key) || out[key] || !value) return;
    const lim = (known.get(key) || {}).maxChars;
    out[key] = lim ? trimTo(value, lim) : value;
  }

  const name = String(out.BUSINESS_NAME || '').trim();
  if (name) {
    set('HERO_LINE_1', firstWord(name));
    set('HERO_LINE_2', restOfName(name));
    set('BRAND_SHORT', firstWord(name));
    set('BRAND_INITIAL', firstWord(name).charAt(0).toUpperCase());
    set('CURTAIN_NAME', name);
    set('NAME_CAPS', name.toUpperCase());
  }

  const does = String(out.WHAT_THEY_DO || '').trim();
  if (does) {
    set('TAGLINE', does);
    set('SHORT_TRADE', shorten(does, 2));
    set('CATEGORY', shorten(does, 3));
  }

  const city = String(out.CITY || '').trim();
  if (city && name) set('PLACE_LINE', name + ' — ' + city);

  /* Anything still too long is left in place on purpose. render() warns and
     the person decides. A silent drop is worse than an ugly line, because
     nobody finds out. */
  return out;
}

/* ---------------------------------------------------------------- listing */

const SWATCH_ACCENT = ['accent', 'acc', 'gold', 'amber', 'signal', 'acid', 'green', 'teal', 'red', 'lacquer', 'brand', 'coral', 'blue'];
const SWATCH_INK = ['ink', 'brand', 'navy-900', 'olive-900', 'bg', 'dark', 'pine', 'blk'];
const SWATCH_PAPER = ['paper', 'sand', 'bone', 'cream', 'ground', 'porcelain', 'wht', 'white'];

function listTemplates() {
  return fs.readdirSync(LIBRARY, { withFileTypes: true })
    .filter(function (d) { return d.isDirectory() && /^\d\d-/.test(d.name); })
    .filter(function (d) { return fs.existsSync(path.join(LIBRARY, d.name, 'swap.json')); })
    .map(function (d) {
      const card = JSON.parse(fs.readFileSync(path.join(LIBRARY, d.name, 'swap.json'), 'utf8'));
      const names = paletteNames(card);
      const sk = card.swatchKeys || {};
      return {
        template: d.name,
        title: card.title || d.name.replace(/^\d\d-/, '').replace(/-/g, ' '),
        industry: card.industry || '',
        covers: card.covers || '',
        themes: names,
        /* three colours per theme, so the app can draw a swatch without
           loading and measuring the page */
        swatches: names.map(function (n) {
          const v = paletteVars(card, n);
          function pick(list) {
            for (const k of list) if (v[k] && /^#/.test(v[k])) return v[k];
            return '#8a8a8a';
          }
          return {
            name: n,
            accent: pick(sk.accent ? [sk.accent].concat(SWATCH_ACCENT) : SWATCH_ACCENT),
            ink: pick(sk.ink ? [sk.ink].concat(SWATCH_INK) : SWATCH_INK),
            paper: pick(sk.paper ? [sk.paper].concat(SWATCH_PAPER) : SWATCH_PAPER)
          };
        })
      };
    });
}

module.exports = {
  render: render, deriveSwaps: deriveSwaps, listTemplates: listTemplates, loadTemplate: loadTemplate,
  escapeHtml: escapeHtml, visibleLength: visibleLength, fontList: fontList,
  paletteNames: paletteNames, paletteVars: paletteVars,
  FONTS: FONTS, COLOUR_KEYS: COLOUR_KEYS, HIDE: HIDE
};

/* -------------------------------------------------------------------- CLI */

if (require.main === module) {
  const argv = process.argv.slice(2);

  if (!argv.length || argv[0] === '--list') {
    console.log('Templates with a swap card:\n');
    for (const t of listTemplates()) {
      console.log('  ' + t.template.padEnd(26) + t.industry);
      console.log('  ' + ''.padEnd(26) + 'themes: ' + t.themes.join(', ') + '\n');
    }
    process.exit(0);
  }

  const template = argv[0];
  const swaps = {};
  let theme = null;
  let out = null;
  let noindex = true;

  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--set') {
      const pair = argv[++i] || '';
      const eq = pair.indexOf('=');
      if (eq === -1) { console.error('--set needs KEY=value, got "' + pair + '"'); process.exit(1); }
      swaps[pair.slice(0, eq)] = pair.slice(eq + 1);
    } else if (a === '--theme') { theme = argv[++i]; }
    else if (a === '--out') { out = argv[++i]; }
    else if (a === '--handover') { noindex = false; }
    else { console.error('Unknown argument "' + a + '"'); process.exit(1); }
  }

  const result = render(template, deriveSwaps(template, swaps), theme, { noindex: noindex });
  for (const w of result.warnings) console.error('  ! ' + w);

  if (out) {
    const target = path.resolve(process.cwd(), out);
    if (target.startsWith(path.join(LIBRARY, template) + path.sep)) {
      console.error('Refusing to write into a template folder.');
      process.exit(1);
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, result.html);
    console.error('\n  ' + result.applied + ' swaps applied, ' + result.warnings.length + ' warning(s).');
    console.error('  Written to ' + target);
  } else {
    process.stdout.write(result.html);
  }
}
