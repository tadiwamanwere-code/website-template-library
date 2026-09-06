/* =========================================================================
   themes-and-type.js — gives every template card three things it was
   missing, and which is why the builder's controls looked broken:

     fontVars   which of the template's OWN variables carry each typeface.
                Every design named them differently, and the builder only
                ever set --sans and --mono, so on eight of eleven templates
                changing the font did nothing at all.

     roleMap    which of the template's own variables play which role in a
                shared colour scheme. This is what lets one scheme in
                schemes.js dress every design, so a template goes from four
                near-identical themes to twelve real ones.

     adjust     the colours a person may move by hand. It used to be the
                accent and nothing else, so "change the text colour" and
                "change the section background" were not offered.

   Run: node builder/passes/themes-and-type.js
   It rewrites swap.json only, never a template's HTML.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const LIB = path.resolve(__dirname, '..', '..');

/* Every light scheme suits every design here. A dark scheme turns the page
   ground itself dark, which only works where the design keeps its dark
   sections in variables of their own — otherwise a dark band and a dark
   page become one grey soup. Listed per template, checked on screen. */
const LIGHT = ['ivory-forest', 'bone-terracotta', 'porcelain-ink', 'mist-cobalt',
  'sand-plum', 'linen-rust', 'sage-gold', 'cream-cocoa', 'slate-lime'];
const DARK = ['charcoal-amber', 'midnight-ice', 'noir-red', 'ink-emerald'];

const mix = (pct, to) => 'color-mix(in srgb, {} ' + pct + '%, ' + to + ')';

const CARDS = {

  /* ------------------------------------------------------------------ 09 */
  '09-atlas-realestate': {
    fontVars: { heading: ['f-serif'], body: ['f-sans'], mono: [] },
    schemes: LIGHT,
    roleMap: {
      paper: ['sand'], paper2: ['bone'], paper3: ['clay', 'shadow'],
      ink: ['ink'], ink2: ['ink-2'], ink3: ['ink-3'],
      line: ['line'],
      accent: ['accent']
    },
    adjust: {
      accent: { label: 'Accent', var: 'accent' },
      ink: { label: 'Text', var: 'ink', also: { 'ink-2': mix(78, '#fff'), 'ink-3': mix(54, '#fff') } },
      paper: { label: 'Page background', var: 'sand', also: { bone: mix(94, '#000'), clay: mix(86, '#000') } },
      line: { label: 'Lines', var: 'line' }
    }
  },

  /* ------------------------------------------------------------------ 10 */
  '10-cadence-fashion': {
    fontVars: { heading: ['f-display'], body: ['f-body'], mono: [] },
    schemes: LIGHT.concat(DARK),
    roleMap: {
      paper: ['wht'],
      ink: ['blk'],
      accent: ['red']
    },
    adjust: {
      accent: { label: 'Accent', var: 'red' },
      ink: { label: 'Text and dark blocks', var: 'blk' },
      paper: { label: 'Page background', var: 'wht' }
    }
  },

  /* ------------------------------------------------------------------ 15 */
  '15-solstice-resort': {
    fontVars: { heading: ['f-d'], body: ['f-u'], mono: [] },
    schemes: LIGHT,
    roleMap: {
      paper: ['bone'], paper2: ['bone-2'], paper3: ['sand'],
      ink: ['ink'], ink2: ['ink-2'], ink3: ['ink-3'],
      inkSoft: ['ink-soft'], onDarkSoft: ['bone-soft'],
      line: ['line-l'], lineDark: ['line-d'],
      accent: ['accent'], accentSoft: ['sand-2']
    },
    adjust: {
      accent: { label: 'Accent', var: 'accent' },
      ink: { label: 'Text and dark blocks', var: 'ink', also: { 'ink-2': mix(88, '#fff'), 'ink-3': mix(66, '#fff') } },
      paper: { label: 'Page background', var: 'bone', also: { 'bone-2': mix(93, '#000') } },
      sand: { label: 'Warm blocks', var: 'sand', also: { 'sand-2': mix(80, '#000') } }
    }
  },

  /* ------------------------------------------------------------------ 18 */
  '18-longrange-commerce': {
    fontVars: { heading: ['display'], body: ['sans'], mono: [] },
    schemes: LIGHT,
    roleMap: {
      paper: ['porcelain'], paper2: ['porcelain-2'], paper3: ['porcelain-3'],
      ink: ['ink'], ink2: ['ink-2'], ink3: ['muted'], inkFaint: ['muted-2'],
      line: ['rule'], line2: ['rule-2'],
      accent: ['accent'], accentDeep: ['accent-deep'], accentInk: ['accent-ink'],
      sheet: ['white']
    },
    adjust: {
      accent: { label: 'Accent', var: 'accent', also: { 'accent-deep': mix(72, '#000') } },
      ink: { label: 'Text', var: 'ink', also: { 'ink-2': mix(84, '#fff'), muted: mix(58, '#fff') } },
      paper: { label: 'Page background', var: 'porcelain', also: { 'porcelain-2': mix(95, '#000'), 'porcelain-3': mix(89, '#000') } },
      rule: { label: 'Lines', var: 'rule', also: { 'rule-2': mix(88, '#000') } }
    }
  },

  /* 19 is not here: the pharmacy card is written whole by pass19-pharmacy.js,
     because that template is a copy of a live site and its variables came
     with it. Running this pass must not overwrite it. */

  /* ------------------------------------------------------------------ 20 */
  '20-tower-construction': {
    /* --sans carries headings and body alike here, so the heading control
       goes through the elements instead. */
    fontVars: { heading: [], body: ['sans'], mono: ['mono'] },
    schemes: LIGHT.concat(DARK),
    roleMap: {
      paper: ['paper'], paper2: ['paper-2'],
      ink: ['ink'], line: ['rule'],
      dark: ['brand'],
      accent: ['accent']
    },
    adjust: {
      accent: { label: 'Accent', var: 'accent' },
      brand: { label: 'Dark blocks', var: 'brand' },
      ink: { label: 'Text', var: 'ink' },
      paper: { label: 'Page background', var: 'paper' },
      'paper-2': { label: 'Section bands', var: 'paper-2' },
      rule: { label: 'Lines', var: 'rule' }
    }
  },

  /* ------------------------------------------------------------------ 21 */
  '21-mirage-college': {
    fontVars: { heading: ['f-d'], body: ['f-u'], mono: [] },
    schemes: LIGHT.concat(DARK),
    roleMap: {
      paper: ['paper'], paper2: ['paper-2'], paper3: ['paper-3'],
      ink: ['ink'], ink2: ['ink-2'], inkSoft: ['ink-so'], inkFaint: ['ink-fa'],
      dark: ['olive-900'], dark2: ['olive-850', 'olive-800'], dark3: ['olive-700', 'olive-600', 'olive-500'],
      onDark: ['cream'], onDark2: ['cream-2'], onDarkSoft: ['cream-so'],
      lineDark: ['line-d'], lineDark2: ['line-d2'],
      line: ['line-l'], line2: ['line-l2'],
      accent: ['gold'], accentSoft: ['gold-lt'], accentDeep: ['gold-dk']
    },
    adjust: {
      accent: { label: 'Accent', var: 'gold', also: { 'gold-lt': mix(70, '#fff'), 'gold-dk': mix(78, '#000') } },
      ink: { label: 'Text', var: 'ink', also: { 'ink-2': mix(82, '#fff') } },
      paper: { label: 'Page background', var: 'paper', also: { 'paper-2': mix(95, '#000'), 'paper-3': mix(89, '#000') } },
      olive: { label: 'Dark blocks', var: 'olive-900', also: { 'olive-850': mix(92, '#fff'), 'olive-800': mix(86, '#fff'), 'olive-700': mix(78, '#fff') } }
    }
  },

  /* ------------------------------------------------------------------ 22 */
  '22-smile-dental': {
    fontVars: { heading: [], body: ['serif'], mono: ['mono'] },
    schemes: LIGHT,
    roleMap: {
      sheet: ['paper'], paper: ['cream'], paper2: ['cream-2'],
      ink: ['ink'], ink2: ['ink-2'], ink3: ['muted'],
      line: ['rule'], line2: ['rule-2'],
      accent: ['teal'], accentDeep: ['teal-deep'], accentTint: ['teal-tint']
    },
    adjust: {
      accent: { label: 'Accent', var: 'teal', also: { 'teal-deep': mix(78, '#000'), 'teal-tint': mix(16, '#fff') } },
      ink: { label: 'Text', var: 'ink', also: { 'ink-2': mix(78, '#fff'), muted: mix(52, '#fff') } },
      cream: { label: 'Page background', var: 'cream', also: { 'cream-2': mix(94, '#000') } },
      paper: { label: 'Cards', var: 'paper' },
      rule: { label: 'Lines', var: 'rule', also: { 'rule-2': mix(60, '#fff') } }
    }
  },

  /* ------------------------------------------------------------------ 23 */
  '23-caro-accounting': {
    fontVars: { heading: ['disp'], body: ['body'], mono: [] },
    schemes: LIGHT.concat(DARK),
    roleMap: {
      paper: ['paper'], paper2: ['paper-2'], paper3: ['paper-3'],
      ink: ['fg'], ink3: ['mut'], inkFaint: ['dim'],
      dark: ['ink'], dark2: ['ink-2', 'ink-3'], dark3: ['ink-4'],
      onDark: ['fg-inv'], onDark2: ['mut-inv'],
      line: ['line-d'], lineDark: ['line-i'], lineDark2: ['line-i2'],
      accent: ['acc'], accentSoft: ['acc-hi'], accentDeep: ['acc-lo']
    },
    adjust: {
      accent: { label: 'Accent', var: 'acc', also: { 'acc-hi': mix(66, '#fff'), 'acc-lo': mix(74, '#000') } },
      fg: { label: 'Text', var: 'fg', also: { mut: mix(56, '#fff') } },
      paper: { label: 'Page background', var: 'paper', also: { 'paper-2': mix(96, '#000'), 'paper-3': mix(90, '#000') } },
      ink: { label: 'Dark blocks', var: 'ink', also: { 'ink-2': mix(94, '#fff'), 'ink-3': mix(88, '#fff'), 'ink-4': mix(80, '#fff') } }
    }
  },

  /* ------------------------------------------------------------------ 24 */
  '24-safeway-furniture': {
    /* This design is dark by construction: --paper is the light text that
       sits on navy, not the page. Mapping keeps that straight. */
    fontVars: { heading: [], body: ['display'], mono: ['mono'] },
    schemes: DARK.concat(LIGHT),
    roleMap: {
      dark: ['navy-950', 'ink'], dark2: ['navy-900', 'navy-860'], dark3: ['navy-820', 'navy-780', 'navy-720'],
      onDark: ['paper'], onDark2: ['mute'], onDarkSoft: ['mute-2'],
      lineDark: ['line'], lineDark2: ['line-2'],
      accent: ['accent'], accentDeep: ['accent-deep']
    },
    adjust: {
      accent: { label: 'Accent', var: 'accent', also: { 'accent-deep': mix(76, '#000') } },
      'navy-900': { label: 'Page background', var: 'navy-900', also: { 'navy-950': mix(80, '#000'), 'navy-860': mix(96, '#fff'), 'navy-820': mix(90, '#fff'), 'navy-780': mix(84, '#fff') } },
      paper: { label: 'Text', var: 'paper', also: { mute: mix(64, '#000'), 'mute-2': mix(46, '#000') } }
    }
  },

  /* ------------------------------------------------------------------ 25 */
  '25-gordons-bnb': {
    fontVars: { heading: ['serif'], body: ['sans'], mono: [] },
    schemes: LIGHT.concat(DARK),
    roleMap: {
      paper: ['paper'], paper2: ['paper-2'], paper3: ['paper-3'],
      ink: ['ink'], ink2: ['ink-2'], ink3: ['ink-3'],
      dark: ['dark'], dark2: ['dark-2'],
      onDark: ['cream'], onDarkSoft: ['cream-2'], onDark2: ['cream-3'],
      line: ['line-l'], line2: ['line-l2'],
      lineDark: ['line-d'], lineDark2: ['line-d2'],
      accent: ['gold'], accentDeep: ['gold-dk'], accentSoft: ['gold-l']
    },
    adjust: {
      accent: { label: 'Accent', var: 'gold', also: { 'gold-dk': mix(84, '#000'), 'gold-l': mix(74, '#000') } },
      ink: { label: 'Text', var: 'ink', also: { 'ink-2': mix(84, '#fff'), 'ink-3': mix(58, '#fff') } },
      paper: { label: 'Page background', var: 'paper', also: { 'paper-2': mix(95, '#000'), 'paper-3': mix(87, '#000') } },
      dark: { label: 'Dark blocks', var: 'dark', also: { 'dark-2': mix(92, '#fff') } }
    }
  }
};

let changed = 0;
for (const template of Object.keys(CARDS)) {
  const file = path.join(LIB, template, 'swap.json');
  if (!fs.existsSync(file)) { console.error('  ! no swap.json for ' + template); continue; }
  const card = JSON.parse(fs.readFileSync(file, 'utf8'));
  const patch = CARDS[template];

  card.fontVars = patch.fontVars;
  card.roleMap = patch.roleMap;
  card.schemes = patch.schemes;
  card.adjust = patch.adjust;

  fs.writeFileSync(file, JSON.stringify(card, null, 2) + '\n');
  changed++;
  console.log('  ' + template.padEnd(26)
    + Object.keys(patch.adjust).length + ' colours, '
    + patch.schemes.length + ' shared schemes');
}
console.log('\n  ' + changed + ' cards updated.');
