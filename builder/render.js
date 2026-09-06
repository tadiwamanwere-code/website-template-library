/* =========================================================================
   render.js — fill a template with a client's details.

   This is the only thing that turns a template into a site. The preview
   screen and the published page both call it, so the preview can never
   lie about what gets shipped.

   It is deliberately dumb. It finds strings and replaces them. It does not
   design, it does not write copy, and it never calls out to anything.

     render(template, swaps, theme)  ->  { html, warnings }

   Rules it enforces, because these are the ways this breaks in practice:
     - whole strings only, longest find first, so "Tower" cannot corrupt
       "Tower Construction"
     - a find string that is no longer in the template is a warning: it means
       the template drifted and swap.json is stale
     - a replacement more than 20% longer than what it replaces is a warning:
       that is the length trap that overflows heroes
     - nothing is ever written back into a template folder

   Node 18+. No dependencies.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const LIBRARY = path.resolve(__dirname, '..');
const LENGTH_TOLERANCE = 1.2; // 20% longer than the default is a warning

/* ---------------------------------------------------------------- loading */

function templateDir(template) {
  return path.join(LIBRARY, template);
}

function loadTemplate(template) {
  const dir = templateDir(template);
  const htmlPath = path.join(dir, 'index.html');
  const cardPath = path.join(dir, 'swap.json');

  if (!fs.existsSync(htmlPath)) {
    throw new Error(`Template "${template}" has no index.html at ${htmlPath}`);
  }
  if (!fs.existsSync(cardPath)) {
    throw new Error(`Template "${template}" has no swap.json. It has not had the reusable pass yet.`);
  }
  return {
    html: fs.readFileSync(htmlPath, 'utf8'),
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

/* How long a string reads to a person: entities count as one character,
   because that is what the layout sees. */
function visibleLength(str) {
  return String(str)
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, 'x')
    .length;
}

function replaceAll(haystack, find, replacement) {
  return haystack.split(find).join(replacement);
}

/**
 * Apply every replacement in ONE pass over the original string.
 *
 * Doing them one after another looks the same and is not: a value that has
 * just been written in can be matched again by a later rule. Filling
 * "Building & Civil Engineering Contractors" with "Plumbing and Drainage
 * Contractors" and then replacing the leftover word "Contractors" gave
 * "Plumbing and Drainage Plumbing". One pass over the original cannot do that.
 *
 * @param {string} source
 * @param {Array<{find:string, replacement:string}>} rules  longest find first
 */
function applyOnce(source, rules) {
  const hits = [];
  rules.forEach((rule, priority) => {
    if (!rule.find) return;
    let at = source.indexOf(rule.find);
    while (at !== -1) {
      hits.push({ start: at, end: at + rule.find.length, text: rule.replacement, priority });
      at = source.indexOf(rule.find, at + rule.find.length);
    }
  });

  /* Earliest first; where two rules start together the longer one wins,
     which is what "longest first" means once positions are involved. */
  hits.sort((a, b) => a.start - b.start || a.priority - b.priority);

  let out = '';
  let cursor = 0;
  let applied = 0;
  for (const hit of hits) {
    if (hit.start < cursor) continue;          // already covered by a longer match
    out += source.slice(cursor, hit.start) + hit.text;
    cursor = hit.end;
    applied++;
  }
  return { text: out + source.slice(cursor), applied };
}

/* ----------------------------------------------------------------- themes */

function themesOf(card) {
  return Array.isArray(card.themes) && card.themes.length ? card.themes : ['navy-amber'];
}

/* The theme is six CSS variables, already in the template. All we do is name
   which set the page should use. */
function applyTheme(html, theme) {
  const cleaned = html.replace(/<html\b([^>]*)>/i, (whole, attrs) => {
    return '<html' + attrs.replace(/\s+data-theme="[^"]*"/i, '') + '>';
  });
  return cleaned.replace(/<html\b([^>]*)>/i, `<html$1 data-theme="${theme}">`);
}

/* ------------------------------------------------------------------ style
   Fonts, type scale and colour, laid over the template as one small block of
   CSS variables. The template already routes every typeface through --sans
   and --mono and every colour through the six theme values, so this changes
   the whole page without touching a single rule.

   The families are a fixed list, for the same reason there are four themes
   and not a colour picker: a free choice of typeface is a good way to wreck
   a good layout. */

const FONTS = {
  'Inter':            { css: 'Inter:wght@400;500;600;700;800;900', stack: '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif' },
  'Archivo':          { css: 'Archivo:wght@400;500;600;700;800;900', stack: '"Archivo",Helvetica,Arial,sans-serif' },
  'Manrope':          { css: 'Manrope:wght@400;500;600;700;800', stack: '"Manrope",Helvetica,Arial,sans-serif' },
  'Space Grotesk':    { css: 'Space+Grotesk:wght@400;500;600;700', stack: '"Space Grotesk",Helvetica,Arial,sans-serif' },
  'Sora':             { css: 'Sora:wght@400;500;600;700;800', stack: '"Sora",Helvetica,Arial,sans-serif' },
  'IBM Plex Sans':    { css: 'IBM+Plex+Sans:wght@400;500;600;700', stack: '"IBM Plex Sans",Helvetica,Arial,sans-serif' },
  'Fraunces':         { css: 'Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900', stack: '"Fraunces",Georgia,serif' },
  'Instrument Serif': { css: 'Instrument+Serif:ital@0;1', stack: '"Instrument Serif",Georgia,serif' },
  'JetBrains Mono':   { css: 'JetBrains+Mono:wght@400;500;700', stack: '"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace' },
  'IBM Plex Mono':    { css: 'IBM+Plex+Mono:wght@400;500;700', stack: '"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace' },
  'Space Mono':       { css: 'Space+Mono:wght@400;700', stack: '"Space Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace' }
};

const COLOUR_KEYS = ['brand', 'accent', 'ink', 'paper', 'paper-2', 'rule'];

function fontList() {
  return Object.keys(FONTS).map(name => ({ name, mono: /Mono/.test(name) }));
}

function styleBlock(style) {
  style = style || {};
  const vars = [];
  const families = [];

  const display = FONTS[style.fontDisplay];
  const mono = FONTS[style.fontMono];
  if (display) { vars.push(`  --sans:${display.stack};`); families.push(display.css); }
  if (mono) { vars.push(`  --mono:${mono.stack};`); families.push(mono.css); }

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, Number(v)));
  if (style.typeDisplay && Number(style.typeDisplay) !== 1) vars.push(`  --type-display:${clamp(style.typeDisplay, 0.7, 1.5)};`);
  if (style.typeBody && Number(style.typeBody) !== 1) vars.push(`  --type-body:${clamp(style.typeBody, 0.8, 1.4)};`);

  for (const key of COLOUR_KEYS) {
    const v = style[key];
    if (v && /^#[0-9A-Fa-f]{3,8}$/.test(v)) vars.push(`  --${key}:${v};`);
  }

  /* A wordmark logo already says the name, so the text one beside it is a
     duplicate. A mark-only logo still needs it, which is why this is a
     choice and not automatic. */
  const extra = style.hideBrandText ? '.brand-txt{display:none;}\n' : '';

  if (!vars.length && !extra) return '';

  const link = families.length
    ? `<link href="https://fonts.googleapis.com/css2?${families.map(f => 'family=' + f).join('&')}&display=swap" rel="stylesheet">\n`
    : '';

  /* html[data-theme] sets the six colours, so this has to outrank it. */
  const block = vars.length ? `:root,html[data-theme]{\n${vars.join('\n')}\n}\n` : '';
  return link + `<style id="site-style">\n${block}${extra}</style>\n`;
}

/* ---------------------------------------------------------------- noindex */

/* A mockup of a real business must never turn up in a search result.
   Handover files are the one case where we take it back off again. */
function applyNoindex(html, wanted) {
  const stripped = html.replace(/\s*<meta name="robots"[^>]*>\n?/gi, '');
  if (!wanted) return stripped;
  return stripped.replace(
    /(<meta name="viewport"[^>]*>)/i,
    '$1\n<meta name="robots" content="noindex, nofollow">'
  );
}

/* ----------------------------------------------------------------- render */

/**
 * @param {string} template  folder name, e.g. "20-tower-construction"
 * @param {object} swaps     { BUSINESS_NAME: "Acme Builders", ... }
 * @param {string} theme     one of the template's approved themes
 * @param {object} [opts]    { noindex, edits: [{find, replace}], style: {fonts, scales, colours} }
 * @returns {{ html: string, warnings: string[], applied: number }}
 */
function render(template, swaps, theme, opts) {
  opts = opts || {};
  swaps = swaps || {};

  const { html: source, card } = loadTemplate(template);
  const warnings = [];

  const themes = themesOf(card);
  const chosen = theme || themes[0];
  if (!themes.includes(chosen)) {
    warnings.push(`Theme "${chosen}" is not one of this template's approved themes (${themes.join(', ')}). Using "${themes[0]}".`);
  }

  const entries = (card.swaps || []).concat(card.images || []);
  const byKey = new Map(entries.map(e => [e.key, e]));

  /* A value for a key this template does not have is a mistake worth saying
     out loud, not something to swallow. */
  for (const key of Object.keys(swaps)) {
    if (!byKey.has(key)) warnings.push(`No swap named "${key}" in ${template}/swap.json. Ignored.`);
  }

  /* Longest find first. This is the whole reason "Tower" does not eat
     "Tower Construction". */
  const ordered = entries.slice().sort((a, b) => b.find.length - a.find.length);

  let html = source;
  let applied = 0;
  const rules = [];

  for (const entry of ordered) {
    if (!html.includes(entry.find)) {
      warnings.push(`STALE: "${entry.key}" looks for ${JSON.stringify(entry.find.slice(0, 60))} and it is not in the template any more.`);
      continue;
    }

    const raw = swaps[entry.key];
    if (raw === undefined || raw === null || String(raw).trim() === '') continue;

    /* Everything is escaped, images included: a URL lands inside an HTML
       attribute, so a stray quote there would break out of the tag. */
    const isImage = (card.images || []).some(i => i.key === entry.key);
    const value = escapeHtml(String(raw).trim());

    /* Length check against what the designer allowed for. */
    const limit = entry.maxChars;
    const len = visibleLength(value);
    if (limit && len > limit) {
      warnings.push(`TOO LONG: "${entry.key}" is ${len} characters, the design allows ${limit}. It will overflow.`);
    } else if (!limit && !isImage && len > visibleLength(entry.find) * LENGTH_TOLERANCE) {
      warnings.push(`TOO LONG: "${entry.key}" is ${len} characters against a default of ${visibleLength(entry.find)}. Over 20% longer breaks these layouts.`);
    }

    rules.push({ find: entry.find, replacement: entry.format ? entry.format.replace('{}', value) : value });
  }

  /* One pass, so a value that has just been written in cannot be matched
     again by a later rule. */
  const swapped = applyOnce(html, rules);
  html = swapped.text;
  applied += swapped.applied;

  /* Edits made by clicking the page. Each one is the exact text that was on
     the page and the text that replaced it, so it is the same dumb mechanism
     as a swap and re-renders identically. They are a second pass, because
     they were typed against a page that already had the swaps in it. */
  const editRules = [];
  for (const edit of opts.edits || []) {
    if (!edit || !edit.find || edit.find === edit.replace) continue;
    if (!html.includes(edit.find)) {
      warnings.push(`LOST EDIT: ${JSON.stringify(edit.find.slice(0, 40))} is no longer on the page, so that change could not be re-applied.`);
      continue;
    }
    editRules.push({ find: edit.find, replacement: edit.replace });
  }
  editRules.sort((a, b) => b.find.length - a.find.length);
  const edited = applyOnce(html, editRules);
  html = edited.text;
  applied += edited.applied;

  html = applyTheme(html, themes.includes(chosen) ? chosen : themes[0]);
  html = applyNoindex(html, opts.noindex !== false);

  /* Fonts, type scale and any hand-picked colours, last so they win. */
  html = html.replace(/\s*<style id="site-style">[\s\S]*?<\/style>\n?/g, '');
  const block = styleBlock(opts.style);
  if (block) html = html.replace('</head>', block + '</head>');

  /* The worst failure this can have is shipping a page to a prospect with the
     template's own business name still on it. Once a client name is set, none
     of the template's brand words may survive. Check it every time. */
  if (swaps.BUSINESS_NAME) {
    const body = html.slice(html.indexOf('<body'));
    for (const token of card.brandTokens || []) {
      if (body.includes(token)) {
        warnings.push(`BRAND LEAK: "${token}" is still on the page. A swap was missed — run deriveSwaps() or set the field.`);
      }
    }
  }

  return { html, warnings, applied };
}

/* ------------------------------------------------------- sensible defaults
   The app must ship a real page when someone types only a business name and
   clicks Finish. This fills the fields that can be worked out from the ones
   we were given. It is not part of render(): render stays dumb. */

/* Cut a phrase down to its first few words without leaving it hanging on a
   joining word. "Groundworks and Civil Engineering" -> "Groundworks", not
   "Groundworks and". */
const JOINERS = new Set(['and', '&', 'or', 'of', 'for', 'the', 'to', 'in', 'with']);

function shorten(phrase, maxWords) {
  const words = phrase.split(/\s+/).slice(0, maxWords);
  while (words.length > 1 && JOINERS.has(words[words.length - 1].toLowerCase())) words.pop();
  return words.join(' ');
}

/* Drop whole words until it fits. Better a short true line than one that
   overflows the slot it was designed for. */
function trimTo(phrase, limit) {
  if (visibleLength(phrase) <= limit) return phrase;
  const words = phrase.split(/\s+/);
  while (words.length > 1 && visibleLength(words.join(' ')) > limit) words.pop();
  while (words.length > 1 && JOINERS.has(words[words.length - 1].toLowerCase())) words.pop();
  return words.join(' ').slice(0, limit);
}

function deriveSwaps(template, given) {
  const { card } = loadTemplate(template);
  const known = new Set((card.swaps || []).map(s => s.key));
  const out = Object.assign({}, given);

  const name = (out.BUSINESS_NAME || '').trim();
  if (name) {
    const words = name.split(/\s+/);
    if (known.has('HERO_LINE_1') && !out.HERO_LINE_1) out.HERO_LINE_1 = words[0];
    if (known.has('HERO_LINE_2') && !out.HERO_LINE_2) {
      out.HERO_LINE_2 = words.length > 1 ? words.slice(1).join(' ') : '';
    }
  }

  const does = (out.WHAT_THEY_DO || '').trim();
  if (does) {
    if (known.has('TAGLINE') && !out.TAGLINE) {
      /* The tagline sits under the logo in a fixed slot, so it is trimmed to
         fit rather than left to overflow and warn. */
      const limit = (card.swaps.find(s => s.key === 'TAGLINE') || {}).maxChars;
      out.TAGLINE = limit ? trimTo(does, limit) : does;
    }
    if (known.has('SHORT_TRADE') && !out.SHORT_TRADE) out.SHORT_TRADE = shorten(does, 2);
  }

  /* Anything too long is left in place on purpose. render() warns about it
     and the person decides. A silent drop is worse than an ugly line,
     because nobody finds out. */
  return out;
}

/* ---------------------------------------------------------------- listing */

function listTemplates() {
  return fs.readdirSync(LIBRARY, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^\d\d-/.test(d.name))
    .filter(d => fs.existsSync(path.join(LIBRARY, d.name, 'swap.json')))
    .map(d => {
      const card = JSON.parse(fs.readFileSync(path.join(LIBRARY, d.name, 'swap.json'), 'utf8'));
      return { template: d.name, industry: card.industry || '', covers: card.covers || '', themes: themesOf(card) };
    });
}

module.exports = { render, deriveSwaps, listTemplates, loadTemplate, escapeHtml, visibleLength, fontList, FONTS, COLOUR_KEYS };

/* -------------------------------------------------------------------- CLI
   node builder/render.js 20-tower-construction \
     --theme charcoal-rust \
     --set BUSINESS_NAME="Acme Builders" --set PHONE="+44 20 7946 0000" \
     --out builder/out/acme.html
   -------------------------------------------------------------------- */

if (require.main === module) {
  const argv = process.argv.slice(2);

  if (!argv.length || argv[0] === '--list') {
    console.log('Templates with a swap card:\n');
    for (const t of listTemplates()) {
      console.log(`  ${t.template.padEnd(26)} ${t.industry}`);
      console.log(`  ${''.padEnd(26)} themes: ${t.themes.join(', ')}\n`);
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
      if (eq === -1) { console.error(`--set needs KEY=value, got "${pair}"`); process.exit(1); }
      swaps[pair.slice(0, eq)] = pair.slice(eq + 1);
    } else if (a === '--theme') { theme = argv[++i]; }
    else if (a === '--out') { out = argv[++i]; }
    else if (a === '--handover') { noindex = false; }
    else { console.error(`Unknown argument "${a}"`); process.exit(1); }
  }

  const filled = deriveSwaps(template, swaps);
  const result = render(template, filled, theme, { noindex });

  for (const w of result.warnings) console.error('  ! ' + w);

  if (out) {
    const target = path.resolve(process.cwd(), out);
    if (target.startsWith(path.join(LIBRARY, template) + path.sep)) {
      console.error('Refusing to write into a template folder.');
      process.exit(1);
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, result.html);
    console.error(`\n  ${result.applied} swaps applied, ${result.warnings.length} warning(s).`);
    console.error(`  Written to ${target}`);
  } else {
    process.stdout.write(result.html);
  }
}
