/* =========================================================================
   make-card.js — writes the swap.json for a cloned template, and takes the
   original firm's details off the page while it is there.

   A clone keeps the layout of somebody else's site. It must not keep who
   they are. This does both halves in one pass:

     the copy pass   the firm's name, its people, its address, its phone
                     numbers and its email are replaced with wording that is
                     true for any business in that trade.

     the swap card   every one of those becomes a field, so the builder can
                     put the client's own details back in.

   Phone numbers and email addresses are found by pattern. Names and places
   have to be given, because no pattern knows the difference between a
   partner's surname and an ordinary word.

   Run:
     node builder/passes/make-card.js <folder> <spec.json>

   The spec:
     {
       "title": "Parvis Family Law",
       "industry": "Professional services",
       "covers": "Solicitors, family law, mediation, any small practice",
       "name": "Lindsay Parvis",          the firm as written on the page
       "nameAlso": ["Parvis", "LINDSAY"], other forms of it
       "scrub": { "Maryland": "your county", "Bar No. 12345": "" },
       "keep": ["Free consultation"]      wording that is fine to leave
     }
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const LIB = path.resolve(__dirname, '..', '..');
const folder = process.argv[2];
const specFile = process.argv[3];
if (!folder || !specFile) {
  console.error('  usage: node make-card.js <folder> <spec.json>');
  process.exit(1);
}

const DIR = path.join(LIB, folder);
const FILE = path.join(DIR, 'index.html');
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
let html = fs.readFileSync(FILE, 'utf8');
const roles = JSON.parse(fs.readFileSync(path.join(DIR, 'roles.json'), 'utf8'));
/* The guess from the colours, unless the spec knows better. A brand's dark
   ground can be its most saturated colour, and the guess then calls it the
   accent. */
const roleMap = spec.roleMap || roles.roleMap;

const body = () => html.slice(html.indexOf('<body'));

/* ------------------------------------------------------------- the copy pass
   Order matters. The longest form of a name goes first, or replacing the
   surname on its own leaves the full name half-changed. */

const swaps = [];
const misses = [];
let changes = 0;

function go(find, replace, note) {
  if (find === replace) return false;
  const before = html;
  html = html.split(find).join(replace);
  if (html === before) { misses.push(note || find.slice(0, 46)); return false; }
  changes++;
  return true;
}

/* 1. everything the spec calls theirs: the partners, the street, the county.
      These go before the firm's name, because a partner is usually called
      after the firm. Replace "Wegner" first and "Matthew Wegner" is left
      half-changed and worse than either. Longest first for the same reason. */
let scrubbed = 0;
/* Patterns, for things that repeat with different words each time: a dozen
   testimonials, each in its own box. [source, flags, replacement]. */
for (const [src, flags, rep] of spec.scrubRe || []) {
  const before = html;
  html = html.replace(new RegExp(src, flags), rep);
  if (html === before) misses.push('pattern ' + src.slice(0, 40)); else scrubbed++;
}
for (const from of Object.keys(spec.scrub || {}).sort((a, b) => b.length - a.length)) {
  if (go(from, spec.scrub[from], 'scrub "' + from + '"')) scrubbed++;
}

/* 2. the firm's name, longest form first */
const names = [spec.name].concat(spec.nameAlso || []).filter(Boolean)
  .sort((a, b) => b.length - a.length);
names.forEach(function (n, i) {
  const placeholder = i === 0 ? 'Your Business Name' : 'YourBusiness' + (i > 1 ? i : '');
  if (go(n, placeholder, 'name "' + n + '"') && i === 0) {
    swaps.push({ key: 'BUSINESS_NAME', find: placeholder, label: 'Business name', maxChars: 34, required: true });
  } else if (i > 0 && html.indexOf(placeholder) !== -1) {
    swaps.push({ key: 'BRAND_' + i, find: placeholder, label: 'Name, short form ' + i, maxChars: 24 });
  }
});

/* 2b. the placeholders the scrub above wrote. A page that now says "Your
       City" should ask for the town in the builder, not leave it there. */
const EXTRAS = [
  ['ADDRESS', 'Your street address', 'Street address', 60],
  ['ADDRESS_2', 'Second office address', 'Second address', 60],
  ['CITY', 'Your City', 'Town or city', 34],
  ['CITY_2', 'Second City', 'Second town', 34],
  ['REGION', 'Your State', 'County, state or province', 34],
  ['PERSON_NAME', 'Your Name', 'Lead person’s name', 34]
];
for (const [key, find, label, maxChars] of EXTRAS) {
  if (html.indexOf(find) !== -1) swaps.push({ key, find, label, maxChars });
}

/* 3. email addresses, found by pattern */
const emails = [...new Set((body().match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || []))]
  .filter(e => !/example|sentry|\.png|\.jpg|@2x/i.test(e));
emails.slice(0, 3).forEach(function (e, i) {
  const key = i === 0 ? 'EMAIL' : 'EMAIL_' + (i + 1);
  const to = i === 0 ? 'hello@yourbusiness.example' : 'team' + i + '@yourbusiness.example';
  if (go(e, to)) swaps.push({ key: key, find: to, label: i === 0 ? 'Email' : 'Second email', maxChars: 44 });
});

/* 4. phone numbers. The link and the printed number are different strings
      and both have to go, or a client's page dials the original firm. */
/* Only in the words on the page. An icon's drawing is a long run of numbers
   too ("6.398 11.101"), and changing one breaks the icon. */
const pageWords = body().replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, '\n');
const phones = [...new Set((pageWords.match(/(?:\+?\d[\d\s().-]{7,}\d)/g) || []))]
  .map(p => p.trim())
  .filter(p => (p.replace(/\D/g, '').length >= 9 && p.replace(/\D/g, '').length <= 15))
  .filter(p => !/\d\.\d{3}/.test(p) || /^\(?\d{3}\)?[.]\d{3}[.]\d{4}$/.test(p))
  .filter(p => !/^\d{4}$/.test(p));
function goText(find, replace) {
  const before = html;
  html = html.replace(/>([^<]*)</g, (m, t) => '>' + t.split(find).join(replace) + '<');
  if (html === before) { misses.push(find.slice(0, 46)); return false; }
  changes++;
  return true;
}
const seenPhone = new Set();
let phoneN = 0;
phones.forEach(function (p) {
  const digits = p.replace(/\D/g, '');
  if (seenPhone.has(digits) || phoneN >= 3) return;
  seenPhone.add(digits);
  phoneN++;
  const key = phoneN === 1 ? 'PHONE' : 'PHONE_' + phoneN;
  const to = phoneN === 1 ? '+00 000 000 0000' : '+00 000 000 000' + phoneN;
  if (goText(p, to)) swaps.push({ key: key, find: to, label: phoneN === 1 ? 'Phone' : 'Phone ' + phoneN, maxChars: 24 });
});
/* the tel: links, which carry the digits with no spaces */
/* Matched on the digits alone, because a link may carry the number in any
   form: "tel:5108956500", "tel:+1 510…", "tel:(510) 895-6500". */
const phoneOrder = [...seenPhone];
let linked = false;
html = html.replace(/href="tel:([^"]*)"/gi, function (m, v) {
  const d = v.replace(/\D/g, '');
  const i = phoneOrder.findIndex(p => d === p || d.endsWith(p) || p.endsWith(d));
  if (i === -1 || d.length < 7) return m;
  if (i === 0) linked = true;
  return 'href="tel:' + (i === 0 ? '+000000000000' : '+00000000000' + (i + 1)) + '"';
});
if (linked) swaps.push({ key: 'PHONE_LINK', find: '+000000000000', label: 'Phone, digits only', maxChars: 18 });

if (misses.length) {
  console.log('  not found (fine if the page never said it):');
  for (const s of misses.slice(0, 8)) console.log('    - ' + s);
}
console.log('  ' + changes + ' replacements, ' + emails.length + ' emails, ' + phoneN + ' phone numbers');

/* --------------------------------------------------------------- pictures */

const pics = [...new Set((body().match(/<img\b[^>]*\ssrc="([^"]+)"/gi) || [])
  .map(t => (t.match(/\ssrc="([^"]+)"/i) || [])[1])
  .filter(Boolean)
  .filter(s => !/^data:/.test(s)))];

const images = pics.slice(0, 20).map(function (src, i) {
  const guess = /portrait|person|team|1573497/.test(src) ? 'person at work'
    : /office|1497366/.test(src) ? 'office interior'
    : /meet|1517245/.test(src) ? 'meeting a client'
    : 'the trade at work';
  return {
    key: 'PIC_' + (i + 1),
    find: src,
    label: 'Picture ' + (i + 1),
    ratio: '3/2',
    search: guess
  };
});

/* ---------------------------------------------------------- the swap card */

const mix = (pct, to) => 'color-mix(in srgb, {} ' + pct + '%, ' + to + ')';
const has = role => !!roleMap[role];
const varOf = role => roleMap[role][0];

const adjust = {};
if (has('accent') || has('accentSoft')) adjust.accent = { label: 'Accent', var: varOf(has('accent') ? 'accent' : 'accentSoft'),
  also: has('accentDeep') ? { [varOf('accentDeep')]: mix(76, '#000') } : undefined };
if (has('ink')) adjust.ink = { label: 'Text', var: varOf('ink'),
  also: has('ink2') ? { [varOf('ink2')]: mix(82, '#fff') } : undefined };
if (has('sheet')) adjust.sheet = { label: 'Page background', var: varOf('sheet') };
if (has('paper')) adjust.paper = { label: 'Section bands', var: varOf('paper') };
if (has('dark')) adjust.dark = { label: 'Dark blocks', var: varOf('dark') };
if (has('line')) adjust.line = { label: 'Lines', var: varOf('line') };

const card = {
  template: folder,
  title: spec.title,
  industry: spec.industry,
  covers: spec.covers,
  _note: 'Cloned with builder/passes/clone-site.js from ' + (spec.from || 'a live site')
       + ', then this pass took the original firm\'s details off it.',

  fontVars: { heading: [], body: [], mono: [] },
  schemes: ['ivory-forest', 'bone-terracotta', 'porcelain-ink', 'mist-cobalt',
    'sand-plum', 'linen-rust', 'sage-gold', 'cream-cocoa', 'slate-lime'],
  roleMap: roleMap,
  adjust: adjust,

  _brandTokens: 'Words belonging to the site this was cloned from, not to a client.',
  brandTokens: names.concat(Object.keys(spec.scrub || {}))
    .filter(t => t && t.length > 3 && t.length < 40 && !/^https?:|[<>@]/.test(t))
    .slice(0, 12),

  swaps: swaps,
  images: images
};

fs.writeFileSync(FILE, html);
fs.writeFileSync(path.join(DIR, 'swap.json'), JSON.stringify(card, null, 2) + '\n');
fs.rmSync(path.join(DIR, 'roles.json'));
console.log('  swap.json written: ' + swaps.length + ' fields, ' + images.length + ' pictures, '
  + Object.keys(adjust).length + ' colours');
