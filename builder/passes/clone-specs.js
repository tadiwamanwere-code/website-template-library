/* =========================================================================
   clone-specs.js — who each cloned site belongs to, and what has to come
   off it before anybody else's name goes on.

   Every entry names three things:

     name / nameAlso   the firm as the page writes it
     scrub             the partners, the street, the county, the year. These
                       run first, because a partner is usually called after
                       the firm, and replacing the firm's name first would
                       leave the partner's half-changed.
     title / industry  how the template is listed in the picker

   Nothing invented goes in the replacement column. A placeholder that
   plainly reads as a placeholder is better than a plausible fake name: a
   prospect who sees "Second Partner" knows to send you theirs, and a
   prospect who sees an invented partner may not notice at all.

   Run: node builder/passes/clone-specs.js
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HERE = __dirname;

/* The six WordPress law and finance sites were cloned and then dropped.
   Their layout comes out of JavaScript as much as CSS, so a page taken
   without its scripts collapses: text over pictures, no navigation. A
   broken template is worse than no template. Notes in builder/README.md.
 */

const SPECS = {








  '33-cloud-home': {
    title: 'Cloud Home',
    industry: 'Shops and retail',
    covers: 'Furniture, homeware, interiors, showrooms, any shop selling a considered range',
    from: 'website-one-rho-59.vercel.app',
    own: true,
    name: 'Cloud Home',
    nameAlso: ['@cloud.homezw'],
    scrub: {
      'Furniture &amp; homeware · Harare, Zimbabwe': 'Furniture and homeware',
      'Furniture & homeware · Harare, Zimbabwe': 'Furniture and homeware',
      'Zimbabwe': 'your country',
      'Made for Harare': 'Made for your city',
      'Harare': 'your city'
    }
  },

  '34-sitcha-electric': {
    title: 'Sitcha Electric',
    industry: 'Construction and trades',
    covers: 'Electricians, solar installers, plumbers, any trade selling call-outs and installations',
    from: 'sitcha-electric-services.vercel.app',
    own: true,
    name: 'Sitcha Electric Services',
    nameAlso: ['SITCHA ELECTRIC', 'Sitcha Electric', 'Sitcha', 'SITCHA'],
    scrub: { 'Masvingo': 'your town' }
  },

  '35-grazeon-thatchers': {
    title: 'Grazeon Thatchers',
    industry: 'Construction and trades',
    covers: 'Roofers, thatchers, timber and outdoor structures, any trade with divisions and a work gallery',
    from: 'grazeon-thatchers.vercel.app',
    own: true,
    name: 'Grazeon Thatchers',
    nameAlso: ['GRAZEON THATCHERS', 'GRAZEON', 'Grazeon'],
    scrub: {
      'GRAZEON THATCHERS &middot; SINCE 2003': 'ESTABLISHED',
      'Botswana, Zambia, South Africa and Kenya': 'the region',
      'Zimbabwean': 'locally based',
      'THATCHSAYF': 'FIRE TREATMENT',
      'Thatchsayf': 'our fire treatment',
      '&middot; SINCE 2003': '',
      'SINCE 2003': 'ESTABLISHED',
      '2003': '0000',
      'Wholly Zimbabwean owned': 'Locally owned',
      'Zimbabwe': 'your country'
    }
  },

  '36-alstyle-construction': {
    title: 'Alstyle Ceilings',
    industry: 'Making and fitting',
    covers: 'Ceilings, drywall, renovations, shopfitters, any fitting trade with a before and after',
    from: 'alstyle-construction.vercel.app',
    own: true,
    name: 'Alstyle Construction',
    nameAlso: ['ALSTYLE CONSTRUCTION', 'ALSTYLE', 'Alstyle'],
    scrub: { 'Zimbabwe': 'your country' }
  }
};

let ok = 0;
for (const folder of Object.keys(SPECS)) {
  const specFile = path.join(HERE, '.spec-tmp.json');
  fs.writeFileSync(specFile, JSON.stringify(SPECS[folder], null, 2));
  console.log('======== ' + folder);
  try {
    const out = execFileSync(process.execPath, [path.join(HERE, 'make-card.js'), folder, specFile], { encoding: 'utf8' });
    process.stdout.write(out);
    ok++;
  } catch (e) {
    console.error('  ! ' + String(e.stdout || e.message).slice(0, 300));
  }
  fs.rmSync(specFile, { force: true });
}
console.log('\n  ' + ok + ' of ' + Object.keys(SPECS).length + ' cards written.');
