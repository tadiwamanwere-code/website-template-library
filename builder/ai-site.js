/* =========================================================================
   ai-site.js — the AI's hand on a site.

   A person types what they want ("fit this to a solar installer in
   Bulawayo", "warmer photos", "shorter hero"). This builds the brief the
   model works from, asks for a structured answer, and applies only what is
   safe to apply:

     fields      named values on the swap card, within their length limits
     textEdits   exact text on the page and what replaces it, the same
                 mechanism as clicking a line and typing
     pictures    a stock-photo search per picture slot, run through Unsplash
                 and Pexels, top result used
     theme       one of the themes this template can wear

   The model never writes HTML and never touches the template file. Every
   change is an ordinary swap or edit, so a person can see it, undo it, or
   edit it by hand afterwards, and every AI change is a new saved version.

   The facts it may state come from one place: the research UtahOp sent with
   the lead (LeadForge's findings and the rep's notes) plus whatever the
   person types. See RULES.
   ========================================================================= */

'use strict';

const { render, deriveSwaps, loadTemplate, paletteNames } = require('./render.js');
const ai = require('./ai.js');

const RULES = `You improve a small-business website built from a template. A web design agency sends the finished site to the business as a proposal, so it must read as if it were written for that business.

You can change four things: fields (named values such as the business name or tagline), the words on the page (textEdits), the photographs (pictures), and the colour theme.

FACTS
The only facts about the business you may state are the ones in BUSINESS RESEARCH and in the REQUEST. Never invent a number, a year, a price, a rating, an award, a certification, a client, a testimonial, a staff name, an address, opening hours, a delivery or turnaround time, or a claim to be the best, first, biggest or longest-running. When the page already makes a claim like that and the research does not support it, replace it with honest wording that claims nothing, or with a bracketed placeholder such as [Year founded] for the agency to fill in. Leaving the template's invented facts on the page counts as inventing them.

You may write freely: what a business in this trade does, why a customer would want it, headlines, calls to action, section introductions, and descriptions of services this trade plainly offers. Make it specific to the trade and the town. Never generic filler.

VOICE
Plain, warm, confident English. Short sentences. No hype words (world-class, cutting-edge, unparalleled, leverage, elevate, seamless, solutions, one-stop). No em dashes.

MECHANICS
- textEdits.find must be copied exactly from PAGE TEXT, character for character, including codes such as &amp;. Replace a whole listed string, not a fragment of one.
- Keep each replacement within about 20% of the original's length, or the design breaks. Respect maxChars on fields.
- No HTML in any value.
- Use only the field keys and picture keys listed. For theme, use a name from THEMES, or "" to leave it.
- pictures.search is a stock-photo search of 2 to 5 words describing what should be in that photo for this business (for example "electrician fitting solar panels"). When the business is in Zimbabwe or elsewhere in Africa, prefer searches that will show African people and places, where the photo has people or places in it.
- Do what the REQUEST asks and nothing else. One change asked for means one change made.
- summary: two or three plain sentences saying what you changed.
- questions: facts you needed and did not have, as short questions for the agency. Empty when there are none.`;

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'fields', 'textEdits', 'pictures', 'theme', 'questions'],
  properties: {
    summary: { type: 'string' },
    fields: {
      type: 'array',
      items: { type: 'object', additionalProperties: false, required: ['key', 'value'],
        properties: { key: { type: 'string' }, value: { type: 'string' } } }
    },
    textEdits: {
      type: 'array',
      items: { type: 'object', additionalProperties: false, required: ['find', 'replace'],
        properties: { find: { type: 'string' }, replace: { type: 'string' } } }
    },
    pictures: {
      type: 'array',
      items: { type: 'object', additionalProperties: false, required: ['key', 'search'],
        properties: { key: { type: 'string' }, search: { type: 'string' } } }
    },
    theme: { type: 'string' },
    questions: { type: 'array', items: { type: 'string' } }
  }
};

/* What a person reads on the page, as the exact strings in the HTML. An
   edit's find has to be one of these, which is what makes a model's edit
   land instead of silently missing. */
function pageText(html) {
  const body = html.slice(Math.max(0, html.indexOf('<body')));
  const clean = body.replace(/<(script|style|svg|noscript)\b[\s\S]*?<\/\1>/gi, ' ');
  const seen = new Set();
  const out = [];
  const re = />([^<>]{3,700})</g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    const t = m[1].trim();
    if (t.length < 3 || !/[A-Za-z]{2}/.test(t) || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
    if (out.length >= 500) break;
  }
  return out;
}

function brief(record, card, texts, prompt) {
  const filled = deriveSwaps(record.template, record.swaps || {});
  const pictureKeys = new Set((card.images || []).map(i => i.key));

  const fields = (card.swaps || [])
    .filter(s => !pictureKeys.has(s.key) && s.key !== 'LOGO')
    .map(s => ({
      key: s.key,
      label: s.label || s.key,
      maxChars: s.maxChars || null,
      now: filled[s.key] ? String(filled[s.key]).slice(0, 300) : '(still the template’s own wording)'
    }));

  const pictures = (card.images || []).map(i => ({
    key: i.key,
    label: i.label || i.key,
    shape: i.ratio || '',
    templateWasShowing: i.search || ''
  }));

  const research = Object.assign({}, record.context || {});
  if (record.notes) research.notes = String(record.notes).slice(0, 3000);

  return [
    'BUSINESS RESEARCH (the only facts you may state, besides the REQUEST):',
    Object.keys(research).length ? JSON.stringify(research, null, 1) : '(none: this site was not made from a CRM lead)',
    '',
    'TEMPLATE: ' + JSON.stringify({ title: card.title, madeFor: card.industry, covers: card.covers }),
    '',
    'FIELDS:',
    JSON.stringify(fields),
    '',
    'PICTURES:',
    JSON.stringify(pictures),
    '',
    'THEMES (current: ' + (record.theme || 'the template default') + '): ' + paletteNames(card).join(', '),
    '',
    'PAGE TEXT:',
    texts.map((t, i) => (i + 1) + '. ' + t).join('\n'),
    '',
    'REQUEST:',
    prompt
  ].join('\n');
}

function orientationFor(ratio) {
  const m = String(ratio || '').match(/([\d.]+)\s*\/\s*([\d.]+)/);
  if (!m) return 'landscape';
  const r = Number(m[1]) / Number(m[2]);
  return r > 1.1 ? 'landscape' : r < 0.9 ? 'portrait' : 'squarish';
}

/* The site as the model sees it: the card, the rendered page, and the brief. */
function prepare(record, prompt) {
  const card = loadTemplate(record.template).card;
  const { html } = render(record.template, deriveSwaps(record.template, record.swaps || {}), record.theme,
    { edits: record.edits || [], style: record.style || {} });
  return { card: card, html: html, brief: brief(record, card, pageText(html), prompt) };
}

/* The built-in AI: one request to the model, then the same checks WebForge's
   answers go through. */
async function improve(record, prompt, deps) {
  const p = prepare(record, prompt);
  const answer = await ai.ask(RULES, p.brief, SCHEMA);
  return apply(record, p, answer, prompt, deps);
}

/* An answer in the SCHEMA shape, checked and turned into a new swaps/edits/theme. */
async function apply(record, prepared, answer, prompt, deps) {
  const { card, html } = prepared;
  const swaps = Object.assign({}, record.swaps || {});
  const edits = (record.edits || []).map(e => Object.assign({}, e));
  let theme = record.theme;
  const done = { fields: 0, text: 0, pictures: 0, theme: false };
  const skipped = [];

  const fieldOf = new Map((card.swaps || []).map(s => [s.key, s]));
  const pictureOf = new Map((card.images || []).map(i => [i.key, i]));
  const noTags = v => String(v || '').replace(/[<>]/g, '').trim();

  for (const f of answer.fields || []) {
    const spec = fieldOf.get(f.key);
    const value = noTags(f.value);
    if (!spec || pictureOf.has(f.key) || !value) continue;
    if (spec.maxChars && value.length > Math.ceil(spec.maxChars * 1.2)) {
      skipped.push((spec.label || f.key) + ' was too long for the design');
      continue;
    }
    swaps[f.key] = value;
    done.fields++;
  }

  for (const e of answer.textEdits || []) {
    const find = String(e.find || '');
    const replace = noTags(e.replace);
    if (!find || !replace || find === replace) continue;
    if (html.indexOf(find) === -1) { skipped.push('a text change whose original line was not found'); continue; }
    /* When the line is already the result of an earlier edit, change that
       edit. A second edit would look for text that only exists after the
       first one has run, and would be lost on the next render. */
    const earlier = edits.find(x => x.replace && x.replace.indexOf(find) !== -1);
    if (earlier) earlier.replace = earlier.replace.split(find).join(replace);
    else edits.push({ find: find, replace: replace });
    done.text++;
  }

  const wanted = (answer.pictures || []).filter(p => pictureOf.has(p.key) && String(p.search || '').trim()).slice(0, 16);
  await Promise.all(wanted.map(async function (p) {
    try {
      const found = await deps.searchPhotos(String(p.search).slice(0, 80), 1, orientationFor(pictureOf.get(p.key).ratio));
      const best = (found.results || []).find(r => r.full);
      if (!best) { skipped.push('no photo found for "' + p.search + '"'); return; }
      swaps[p.key] = best.full;
      if (best.download) deps.usePhoto(best.download);
      done.pictures++;
    } catch (err) {
      skipped.push('photo search failed for "' + p.search + '"');
    }
  }));

  /* A request for a new headline came back with a new colour scheme as well.
     The theme only changes when the request is about the look, or about the
     whole site. */
  const aboutLook = /theme|colou?r|palette|look|style|dark|light|whole site|entire site|fit this site/i.test(prompt);
  if (aboutLook && answer.theme && paletteNames(card).indexOf(answer.theme) !== -1 && answer.theme !== record.theme) {
    theme = answer.theme;
    done.theme = true;
  }

  return {
    draft: { swaps: swaps, edits: edits, theme: theme },
    summary: String(answer.summary || '').trim(),
    questions: (answer.questions || []).map(q => String(q).trim()).filter(Boolean).slice(0, 8),
    done: done,
    skipped: skipped
  };
}

module.exports = { improve, prepare, apply, pageText, RULES, SCHEMA };
