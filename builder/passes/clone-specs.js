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








  '37-ventrix-capital': {
    title: 'Ventrix Capital',
    industry: 'Professional services',
    covers: 'Investment firms, venture capital, advisory and consulting firms, any firm selling expertise and partnership',
    from: 'ventrix-cap.framer.website (a Framer design, used for inspiration)',
    name: 'Ventrix',
    /* The deep green is the brand's ground, not its accent; the lime is the
       accent. The colour guess had them the other way round. */
    roleMap: { dark: ['accent'], accentSoft: ['paper-3'], ink: ['ink'], ink2: ['ink-2'], ink3: ['ink-3'],
      sheet: ['sheet'], paper: ['paper'], paper2: ['paper-2'], line: ['line'], line2: ['line-2'] },
    nameAlso: [],
    /* The demo is full of people who do not exist: four quoted founders,
       a team, three blog authors, a rating and a street address. On a
       client's page every one of those would be a claim about them, so each
       becomes a line that plainly asks for the real thing. */
    scrub: {
      'info@Ventrix.com': 'hello@yourbusiness.example',
      'info@ventrix.com': 'hello@yourbusiness.example',
      'Ventrix has been fantastic as a sounding board for our vision, priorities, and strategic thinking. They were one of the first funds to support us, providing invaluable guidance and encouragement throughout our journey and growth.': 'A client’s own words about working with you go here.',
      'Ventrix has been an exceptional partner from the very beginning, helping us sharpen our thinking, clarify our priorities, and stay focused on the bigger picture. Their early belief in our team and consistent strategic guidance have been incredibly valuable.': 'A second client’s own words about working with you go here.',
      'From day one, Ventrix has brought thoughtful perspective, conviction, and practical advice to the table. They have helped us navigate important decisions with clarity while remaining a steady source of encouragement throughout our growth.': 'A third client’s own words about working with you go here.',
      'Ventrix has played a meaningful role in our journey, not just as an early supporter but as a trusted strategic partner. Their ability to challenge our thinking, refine our vision, and back us with genuine conviction has made a lasting impact.': 'A fourth client’s own words about working with you go here.',
      '>Jerry Helfer<': '>Client Name<',
      '>Maya Chen<': '>Client Name<',
      '>Arjun Mehta<': '>Client Name<',
      '>Elena Brooks<': '>Client Name<',
      '>Founder, GeoSignage&nbsp;<': '>Role, Company<',
      '>Co-Founder &amp; CEO, Northline AI<': '>Role, Company<',
      '>Founder, AtlasGrid<': '>Role, Company<',
      '>Daniel Hamilton<': '>Team Member<',
      '>Olivia Bennett<': '>Team Member<',
      '>Founder &amp; CEO<': '>Role<',
      '>Kimberly Mastrangelo<': '>Author<',
      '>James Hall<': '>Author<',
      '>Judith Rodriguez<': '>Author<',
      '>May 11, 2026<': '>Date<',
      'Healquest VC Invests in Royal Health Inc to Accelerate Innovation in Radiology Sector.': 'Your latest news headline goes here.',
      '>100+Founders<': '>Founders<',
      '>Rated 4.9/5 <': '>Client reviews <',
      '>Est.2018<': '>Established<',
      ' with 20+ years of experience and expertise.': ' with deep experience and expertise.',
      ' with 20+ years of experience. ': ' with deep experience. ',
      '3274 Doe Meadow Drive, Annapolis Junction, MD 20701': 'Your street address, City',
      '3274 Doe Meadow Drive, Annapolis Junction, MD 01': 'Your street address, City',
      '>Pentaclay<': '><',
      'Buy for $129': ''
    }
  },

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
/* node clone-specs.js <folder> runs one; with no folder, all of them. */
const only = process.argv[2];
for (const folder of Object.keys(SPECS).filter(f => !only || f === only)) {
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
console.log('\n  ' + ok + ' of ' + (only ? 1 : Object.keys(SPECS).length) + ' cards written.');
