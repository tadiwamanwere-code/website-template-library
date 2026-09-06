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
 * @param {object} [opts]    { noindex: true }
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

  for (const entry of ordered) {
    if (!html.includes(entry.find)) {
      warnings.push(`STALE: "${entry.key}" looks for ${JSON.stringify(entry.find.slice(0, 60))} and it is not in the template any more.`);
      continue;
    }

    const raw = swaps[entry.key];
    if (raw === undefined || raw === null || String(raw).trim() === '') continue;

    const isImage = (card.images || []).some(i => i.key === entry.key);
    const value = isImage ? String(raw).trim() : escapeHtml(String(raw).trim());

    /* Length check against what the designer allowed for. */
    const limit = entry.maxChars;
    const len = visibleLength(value);
    if (limit && len > limit) {
      warnings.push(`TOO LONG: "${entry.key}" is ${len} characters, the design allows ${limit}. It will overflow.`);
    } else if (!limit && !isImage && len > visibleLength(entry.find) * LENGTH_TOLERANCE) {
      warnings.push(`TOO LONG: "${entry.key}" is ${len} characters against a default of ${visibleLength(entry.find)}. Over 20% longer breaks these layouts.`);
    }

    const replacement = entry.format ? entry.format.replace('{}', value) : value;
    html = replaceAll(html, entry.find, replacement);
    applied++;
  }

  html = applyTheme(html, themes.includes(chosen) ? chosen : themes[0]);
  html = applyNoindex(html, opts.noindex !== false);

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
    if (known.has('TAGLINE') && !out.TAGLINE) out.TAGLINE = does;
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

module.exports = { render, deriveSwaps, listTemplates, loadTemplate, escapeHtml, visibleLength };

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
