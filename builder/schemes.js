/* =========================================================================
   schemes.js — the shared colour schemes every template can wear.

   A template's own palettes are hand-picked for that one design. They are
   good, and they stay. What they are not is *many*: four sets of nearly the
   same idea. This file is the other half — a set of complete colour schemes
   written once and worn by every template, including dark ones.

   The trick is that a scheme never names a template's variables. It fills
   ROLES. Each template's swap.json has a `roleMap` saying which of its own
   variables play which role:

       "roleMap": { "paper": ["cream","white"], "ink": ["ink"], ... }

   So one scheme dresses eleven different designs, and adding a twelfth
   template costs one small map rather than eight new palettes.

   Every scheme fills every role. A missing role is a hole in a page, and a
   hole in a page is worse than a colour nobody loves.
   ========================================================================= */

'use strict';

/* The roles, in the order a designer thinks about them. Anything reading
   this file to check a scheme is complete uses this list. */
const ROLES = [
  /* the light ground and what sits on it */
  'sheet', 'paper', 'paper2', 'paper3',
  'ink', 'ink2', 'ink3', 'inkSoft', 'inkFaint',
  'line', 'line2',
  /* the dark ground and what sits on it */
  'dark', 'dark2', 'dark3',
  'onDark', 'onDark2', 'onDarkSoft',
  'lineDark', 'lineDark2',
  /* the one saturated colour */
  'accent', 'accentDeep', 'accentSoft', 'accentTint', 'accentInk'
];

/* ------------------------------------------------------------------ maker
   Writing 23 colours by hand twelve times is how mistakes get in. Give the
   maker the eight decisions that matter and it fills the rest. */

function scheme(o) {
  return {
    sheet: o.sheet, paper: o.paper, paper2: o.paper2, paper3: o.paper3,
    ink: o.ink, ink2: o.ink2, ink3: o.ink3,
    inkSoft: o.inkSoft, inkFaint: o.inkFaint,
    line: o.line, line2: o.line2,
    dark: o.dark, dark2: o.dark2, dark3: o.dark3,
    onDark: o.onDark, onDark2: o.onDark2, onDarkSoft: o.onDarkSoft,
    lineDark: o.lineDark, lineDark2: o.lineDark2,
    accent: o.accent, accentDeep: o.accentDeep,
    accentSoft: o.accentSoft, accentTint: o.accentTint, accentInk: o.accentInk,
    label: o.label,
    mood: o.mood || 'light'
  };
}

const SCHEMES = {

  /* ---------------------------------------------------------------- light */

  'ivory-forest': scheme({
    sheet: '#FFFEFA',
    label: 'Ivory and forest',
    paper: '#F7F5EF', paper2: '#EFEDE4', paper3: '#E4E2D6',
    ink: '#141814', ink2: '#333B33', ink3: '#6A736A',
    inkSoft: 'rgba(20,24,20,.62)', inkFaint: 'rgba(20,24,20,.34)',
    line: 'rgba(20,24,20,.15)', line2: 'rgba(20,24,20,.28)',
    dark: '#101613', dark2: '#18211D', dark3: '#222D27',
    onDark: '#F2F0E8', onDark2: '#B7BEB6', onDarkSoft: 'rgba(242,240,232,.64)',
    lineDark: 'rgba(242,240,232,.16)', lineDark2: 'rgba(242,240,232,.08)',
    accent: '#1E6B4A', accentDeep: '#124630', accentSoft: '#8FBFA6',
    accentTint: '#E7F0EA', accentInk: '#F7F5EF'
  }),

  'bone-terracotta': scheme({
    sheet: '#FFFCF7',
    label: 'Bone and terracotta',
    paper: '#F5F0E8', paper2: '#EDE6DA', paper3: '#E1D8C8',
    ink: '#1C1712', ink2: '#3D362C', ink3: '#78705F',
    inkSoft: 'rgba(28,23,18,.62)', inkFaint: 'rgba(28,23,18,.34)',
    line: 'rgba(28,23,18,.15)', line2: 'rgba(28,23,18,.28)',
    dark: '#181209', dark2: '#221A0F', dark3: '#2E2416',
    onDark: '#F5EFE4', onDark2: '#BCB2A0', onDarkSoft: 'rgba(245,239,228,.64)',
    lineDark: 'rgba(245,239,228,.16)', lineDark2: 'rgba(245,239,228,.08)',
    accent: '#B0532C', accentDeep: '#82381A', accentSoft: '#DBA085',
    accentTint: '#F6E8E0', accentInk: '#FBF7F1'
  }),

  'porcelain-ink': scheme({
    sheet: '#FFFFFF',
    label: 'Porcelain and ink',
    paper: '#FAFAFA', paper2: '#F0F1F1', paper3: '#E3E5E5',
    ink: '#0B0C0D', ink2: '#2A2D2F', ink3: '#6B7073',
    inkSoft: 'rgba(11,12,13,.62)', inkFaint: 'rgba(11,12,13,.32)',
    line: 'rgba(11,12,13,.16)', line2: 'rgba(11,12,13,.30)',
    dark: '#0B0C0D', dark2: '#141618', dark3: '#1E2124',
    onDark: '#F4F5F5', onDark2: '#A8ADB0', onDarkSoft: 'rgba(244,245,245,.64)',
    lineDark: 'rgba(244,245,245,.18)', lineDark2: 'rgba(244,245,245,.09)',
    accent: '#0B0C0D', accentDeep: '#000000', accentSoft: '#7A8083',
    accentTint: '#EDEEEE', accentInk: '#FAFAFA'
  }),

  'mist-cobalt': scheme({
    sheet: '#FFFFFF',
    label: 'Mist and cobalt',
    paper: '#F4F6FA', paper2: '#E9EDF4', paper3: '#DBE2ED',
    ink: '#0F1420', ink2: '#2C3547', ink3: '#67718A',
    inkSoft: 'rgba(15,20,32,.62)', inkFaint: 'rgba(15,20,32,.32)',
    line: 'rgba(15,20,32,.14)', line2: 'rgba(15,20,32,.27)',
    dark: '#0B1120', dark2: '#111A2E', dark3: '#1A2740',
    onDark: '#EDF1F8', onDark2: '#9FAAC2', onDarkSoft: 'rgba(237,241,248,.64)',
    lineDark: 'rgba(237,241,248,.16)', lineDark2: 'rgba(237,241,248,.08)',
    accent: '#1F4FD8', accentDeep: '#14349A', accentSoft: '#8DA6EF',
    accentTint: '#E4EAFB', accentInk: '#F6F8FE'
  }),

  'sand-plum': scheme({
    sheet: '#FFFCFA',
    label: 'Sand and plum',
    paper: '#F6F1EE', paper2: '#EDE5E1', paper3: '#E0D5D0',
    ink: '#1A1216', ink2: '#3A2C33', ink3: '#766168',
    inkSoft: 'rgba(26,18,22,.62)', inkFaint: 'rgba(26,18,22,.33)',
    line: 'rgba(26,18,22,.15)', line2: 'rgba(26,18,22,.28)',
    dark: '#170F13', dark2: '#20161B', dark3: '#2C1F26',
    onDark: '#F4EEEB', onDark2: '#BBA9B1', onDarkSoft: 'rgba(244,238,235,.64)',
    lineDark: 'rgba(244,238,235,.16)', lineDark2: 'rgba(244,238,235,.08)',
    accent: '#7A2B4E', accentDeep: '#551833', accentSoft: '#C08AA3',
    accentTint: '#F4E5EC', accentInk: '#FAF4F6'
  }),

  'linen-rust': scheme({
    sheet: '#FFFDF8',
    label: 'Linen and rust',
    paper: '#F4F1EA', paper2: '#EBE6DB', paper3: '#DED7C7',
    ink: '#1B1A16', ink2: '#3B382F', ink3: '#767161',
    inkSoft: 'rgba(27,26,22,.62)', inkFaint: 'rgba(27,26,22,.33)',
    line: 'rgba(27,26,22,.15)', line2: 'rgba(27,26,22,.28)',
    dark: '#16150F', dark2: '#1F1D15', dark3: '#2B281D',
    onDark: '#F3F0E7', onDark2: '#B9B4A3', onDarkSoft: 'rgba(243,240,231,.64)',
    lineDark: 'rgba(243,240,231,.16)', lineDark2: 'rgba(243,240,231,.08)',
    accent: '#A8481F', accentDeep: '#7A3011', accentSoft: '#D89670',
    accentTint: '#F6E7DD', accentInk: '#FBF7F1'
  }),

  'sage-gold': scheme({
    sheet: '#FDFEFB',
    label: 'Sage and gold',
    paper: '#F3F4EF', paper2: '#E9EBE3', paper3: '#DCE0D4',
    ink: '#171A15', ink2: '#363B31', ink3: '#6F7566',
    inkSoft: 'rgba(23,26,21,.62)', inkFaint: 'rgba(23,26,21,.33)',
    line: 'rgba(23,26,21,.15)', line2: 'rgba(23,26,21,.28)',
    dark: '#12150F', dark2: '#1A1E15', dark3: '#252A1E',
    onDark: '#F2F3EC', onDark2: '#B4B8A8', onDarkSoft: 'rgba(242,243,236,.64)',
    lineDark: 'rgba(242,243,236,.16)', lineDark2: 'rgba(242,243,236,.08)',
    accent: '#A8873A', accentDeep: '#7C6222', accentSoft: '#D6BE81',
    accentTint: '#F3EDDD', accentInk: '#14170F'
  }),

  'cream-cocoa': scheme({
    sheet: '#FFFCF6',
    label: 'Cream and cocoa',
    paper: '#F8F4EC', paper2: '#F0EADE', paper3: '#E4DBCA',
    ink: '#1E1710', ink2: '#3F352A', ink3: '#7A6E5D',
    inkSoft: 'rgba(30,23,16,.62)', inkFaint: 'rgba(30,23,16,.33)',
    line: 'rgba(30,23,16,.14)', line2: 'rgba(30,23,16,.27)',
    dark: '#1A130C', dark2: '#241B11', dark3: '#312517',
    onDark: '#F7F2E8', onDark2: '#BFB2A0', onDarkSoft: 'rgba(247,242,232,.64)',
    lineDark: 'rgba(247,242,232,.16)', lineDark2: 'rgba(247,242,232,.08)',
    accent: '#6B4226', accentDeep: '#4A2B15', accentSoft: '#B08A6B',
    accentTint: '#F0E4D7', accentInk: '#FBF7F0'
  }),

  'slate-lime': scheme({
    sheet: '#FDFFFE',
    label: 'Slate and lime',
    paper: '#F4F6F5', paper2: '#E8ECEA', paper3: '#D9DFDD',
    ink: '#0E1413', ink2: '#2A3433', ink3: '#66716F',
    inkSoft: 'rgba(14,20,19,.62)', inkFaint: 'rgba(14,20,19,.32)',
    line: 'rgba(14,20,19,.15)', line2: 'rgba(14,20,19,.28)',
    dark: '#0C1211', dark2: '#131B19', dark3: '#1D2725',
    onDark: '#EEF2F0', onDark2: '#A0ABA8', onDarkSoft: 'rgba(238,242,240,.64)',
    lineDark: 'rgba(238,242,240,.16)', lineDark2: 'rgba(238,242,240,.08)',
    accent: '#4E9A2F', accentDeep: '#35701D', accentSoft: '#9CCB84',
    accentTint: '#E7F2E1', accentInk: '#F6F9F4'
  }),

  /* ----------------------------------------------------------------- dark
     The page ground itself turns dark. Every template that lists one of
     these has been looked at on screen first: a design that assumes a white
     hero does not get offered one. */

  'charcoal-amber': scheme({
    sheet: '#1F2127',
    label: 'Charcoal and amber',
    mood: 'dark',
    paper: '#15161A', paper2: '#1C1E23', paper3: '#25282E',
    ink: '#F0F1F3', ink2: '#C6C9CE', ink3: '#8E939B',
    inkSoft: 'rgba(240,241,243,.66)', inkFaint: 'rgba(240,241,243,.36)',
    line: 'rgba(240,241,243,.16)', line2: 'rgba(240,241,243,.30)',
    dark: '#0D0E11', dark2: '#141519', dark3: '#1D1F24',
    onDark: '#F0F1F3', onDark2: '#9AA0A8', onDarkSoft: 'rgba(240,241,243,.64)',
    lineDark: 'rgba(240,241,243,.14)', lineDark2: 'rgba(240,241,243,.07)',
    accent: '#F0A22E', accentDeep: '#C87E14', accentSoft: '#F6C97E',
    accentTint: '#2B2418', accentInk: '#15161A'
  }),

  'midnight-ice': scheme({
    sheet: '#1A253C',
    label: 'Midnight and ice',
    mood: 'dark',
    paper: '#0F1626', ink: '#EAF0FA', paper2: '#141D31', paper3: '#1C273E',
    ink2: '#BCC7DA', ink3: '#8794AC',
    inkSoft: 'rgba(234,240,250,.66)', inkFaint: 'rgba(234,240,250,.36)',
    line: 'rgba(234,240,250,.16)', line2: 'rgba(234,240,250,.30)',
    dark: '#080D18', dark2: '#0D1422', dark3: '#141D2F',
    onDark: '#EAF0FA', onDark2: '#95A2B8', onDarkSoft: 'rgba(234,240,250,.64)',
    lineDark: 'rgba(234,240,250,.14)', lineDark2: 'rgba(234,240,250,.07)',
    accent: '#68B7F0', accentDeep: '#3B8DC8', accentSoft: '#A5D5F6',
    accentTint: '#16283A', accentInk: '#0A1120'
  }),

  'noir-red': scheme({
    sheet: '#1A1A1C',
    label: 'Noir and red',
    mood: 'dark',
    paper: '#0B0B0C', paper2: '#131314', paper3: '#1C1C1E',
    ink: '#F4F4F4', ink2: '#C9C9CB', ink3: '#8D8D91',
    inkSoft: 'rgba(244,244,244,.66)', inkFaint: 'rgba(244,244,244,.36)',
    line: 'rgba(244,244,244,.18)', line2: 'rgba(244,244,244,.32)',
    dark: '#000000', dark2: '#0B0B0C', dark3: '#151517',
    onDark: '#F4F4F4', onDark2: '#9A9A9E', onDarkSoft: 'rgba(244,244,244,.64)',
    lineDark: 'rgba(244,244,244,.16)', lineDark2: 'rgba(244,244,244,.08)',
    accent: '#FF2D1F', accentDeep: '#C41A0F', accentSoft: '#FF8177',
    accentTint: '#2A1210', accentInk: '#0B0B0C'
  }),

  'ink-emerald': scheme({
    sheet: '#1A2320',
    label: 'Ink and emerald',
    mood: 'dark',
    paper: '#0E1412', paper2: '#141B19', paper3: '#1D2622',
    ink: '#ECF2EF', ink2: '#C0CBC6', ink3: '#8A9791',
    inkSoft: 'rgba(236,242,239,.66)', inkFaint: 'rgba(236,242,239,.36)',
    line: 'rgba(236,242,239,.16)', line2: 'rgba(236,242,239,.30)',
    dark: '#080D0B', dark2: '#0E1412', dark3: '#161E1B',
    onDark: '#ECF2EF', onDark2: '#93A09A', onDarkSoft: 'rgba(236,242,239,.64)',
    lineDark: 'rgba(236,242,239,.14)', lineDark2: 'rgba(236,242,239,.07)',
    accent: '#33C486', accentDeep: '#1E9563', accentSoft: '#84DBB4',
    accentTint: '#14291F', accentInk: '#08120D'
  })
};

/* Every scheme must fill every role. Caught here rather than on a page. */
for (const name of Object.keys(SCHEMES)) {
  for (const role of ROLES) {
    if (!SCHEMES[name][role]) throw new Error('Scheme "' + name + '" has no ' + role);
  }
}

const LIGHT = Object.keys(SCHEMES).filter(n => SCHEMES[n].mood !== 'dark');
const DARK = Object.keys(SCHEMES).filter(n => SCHEMES[n].mood === 'dark');

module.exports = { SCHEMES, ROLES, LIGHT, DARK };
