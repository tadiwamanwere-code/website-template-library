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

/* Eight sites cloned from a rendered snapshot: a Framer design, five law
   and finance sites, a property developer and a Swiss construction firm.
   An earlier attempt at six of these came out broken; builder/README.md
   says what was actually wrong (a print stylesheet, and the classes on
   <body>), because it was not what it looked like.
 */

const SPECS = {








  '38-parvis-family-law': {
    title: 'Parvis Family Law',
    industry: 'Professional services',
    covers: 'Solicitors, family lawyers, mediators, any practice led by one named professional',
    from: 'lindsayparvis.com (layout used for inspiration; every name, photo and quote removed)',
    name: 'Joseph Greenwald &amp; Laake, PA',
    nameAlso: [],
    /* Twelve real clients wrote about a real lawyer. None of that can go on
       another firm's page, so two boxes stay, each asking for a client's own
       words, and the rest go. */
    scrubRe: [
      ['<div class="tmf-post tmf-post-\\d+ testimonial small middle-post[^"]*">[\\s\\S]*?<div class="clear"></div>\\s*</div>', 'g', ''],
      ['(<div class="tmf-post[^"]*testimonial[^"]*">[\\s\\S]*?<div class="excerpt">)[\\s\\S]*?(</div>)', 'g', '$1 “A client’s own words about working with you go here.” $2'],
      ['(<div class="testimonial-description">)[\\s\\S]*?(</div>)', 'g', '$1 – Client name $2']
    ],
    scrub: {
      'Lindsay Parvis, Attorney - Joseph Greenwald &amp; Laake, PA': 'Your Business Name',
      'Lindsay Parvis, Attorney - Joseph Greenwald & Laake, PA': 'Your Business Name',
      'I have been a family law attorney since 2002, representing clients in divorce, child custody, support, prenuptial agreements, guardianship, and related issues.': 'A short introduction to the lead lawyer goes here: what they practise, and who they help.',
      ' who has been helping people navigate life’s legal changes for more than 20 years.': ' who helps people navigate life’s legal changes.',
      'When you are ready, commit to working with Lindsay and the family law team at JGL.': 'When you are ready, commit to working with our family law team.',
      'Contact our law office to schedule a consultation with Lindsay.': 'Contact our law office to schedule a consultation.',
      'Meet with Lindsay to get the information you need about your legal situation.': 'Meet with us to get the information you need about your legal situation.',
      'Learn More About Lindsay': 'Learn More About Us',
      'Lindsay Parvis': 'Your Name',
      ' 111 Rockville Pike, ': ' Your street address, ',
      '111 Rockville Pike<br>': 'Your street address<br>',
      ' 6404 Ivy Lane, ': ' Second office address, ',
      ' Suite 975 ': ' ',
      ' Suite 400 ': ' ',
      '>Rockville, MD<': '>Your City<',
      '>Greenbelt, MD<': '>Second City<',
      '>Rockville<': '>Your City<',
      '>Greenbelt<': '>Second City<',
      '20850': '',
      '20770': '',
      'Law Firm Website Design by The Modern Firm': '',
      'Maryland': 'Your State'
    }
  },

  '39-wegner-law': {
    title: 'Wegner Law',
    industry: 'Professional services',
    covers: 'Law firms, debt and bankruptcy advisers, accountants, any practice with a team and a process',
    from: 'attorneywegner.com (layout used for inspiration; every name, photo and quote removed)',
    name: 'Wegner Law PLLC',
    nameAlso: ['Wegner Law, PLLC', 'Wegner Law ,LLC', 'Wegner Law Firm', 'Wegner Law'],
    /* Real clients reviewing a real firm, and real staff by name. */
    scrubRe: [
      ['(<div class="tmf-post[^"]*testimonial[^"]*"[^>]*>[\\s\\S]*?<div class="excerpt">)[\\s\\S]*?(</div>)', 'g', '$1 “A client’s own words about working with you go here.” $2'],
      ['(<div class="testimonial-description">)[\\s\\S]*?(</div>)', 'g', '$1 – Client name $2']
    ],
    scrub: {
      'Fort Worth bankruptcy lawyer Matthew Wegner established Wegner Law to give': 'Your Business Name was established to give',
      'Matthew Wegner': 'Team Member',
      'Caden Pratte': 'Team Member',
      'Maria Estrada': 'Team Member',
      'Racheal Wegner': 'Team Member',
      '>Owner/Attorney<': '>Role<',
      '>Associate Attorney<': '>Role<',
      '>Chapter 7 Paralegal/Spanish Speaker<': '>Role<',
      '>Office Manager<': '>Role<',
      '9500 Ray White Road Suite 200': 'Your street address',
      '9500 Ray White Road': 'Your street address',
      'Suite 200': '',
      'Fort Worth': 'Your City',
      '>TX<': '><',
      '76244': '',
      'Law Firm Website Design by': '',
      'The Modern Firm': ''
    }
  },

  '40-connolly-law': {
    title: 'Connolly Law',
    industry: 'Professional services',
    covers: 'Law firms, traffic and criminal defence, conveyancing, any practice with several distinct services',
    from: 'connollylawoffice.com (layout used for inspiration; every name, photo, badge and quote removed)',
    name: 'Connolly Law Office',
    nameAlso: [],
    /* A named lawyer's military service, a rating badge, an award, staff
       and clients by name. All of it is somebody's real record. */
    scrubRe: [
      ['<svg class="avvo-badge"[\\s\\S]*?</svg>', 'g', ''],
      ['(<div class="tmf-post[^"]*testimonial[^"]*"[^>]*>[\\s\\S]*?<div class="excerpt">)[\\s\\S]*?(</div>)', 'g', '$1 “A client’s own words about working with you go here.” $2'],
      ['(<div class="testimonial-description">)[\\s\\S]*?(</div>)', 'g', '$1 – Client name $2'],
      ['<p>Sean has spent[\\s\\S]*?</p>', '', '<p>A short introduction to the lead lawyer goes here: their background, what they practise, and who they help.</p>'],
      ['<p>While in college, Sean[\\s\\S]*?</p>', '', ''],
      ['<p><a href="#">Attorney Sean Connolly</a> brings[\\s\\S]*?</p>', '', '<p>A sentence about the lead lawyer’s experience goes here.</p>']
    ],
    scrub: {
      'Connolly Law Office P.C.': 'Connolly Law Office',
      'Connolly Law Office is Veteran-Owned and operated': 'A short line about the firm goes here',
      'Over 20 years of trial court experience.': 'Trial court experience.',
      'Learn More About Sean': 'Learn More About Us',
      'Sean P. Connolly': 'Your Name',
      'Sean Connolly': 'Your Name',
      'Cathleen Clift': 'Team Member',
      'Golriz Connolly': 'Team Member',
      'Terri Krueger': 'Team Member',
      'Julia Zajączkowski': 'Team Member',
      ', including Cook County, DuPage County, Will County, Kane County, Kendall County and Lake County': '',
      ' under 625 ILCS 5/15-111 and related Illinois Vehicle Code violations': ' and related vehicle code violations',
      'Illinois Vehicle Code': 'vehicle code',
      '801 N. Cass Avenue Suite 200': 'Your street address',
      '801 N. Cass Avenue': 'Your street address',
      'Suite 200': '',
      '60559': '',
      '>Westmont<': '>Your City<',
      'Illinois': 'Your State',
      'Law Firm Website Design by': '',
      'The Modern Firm': ''
    }
  },

  '41-hamilton-partners': {
    title: 'Hamilton Partners',
    industry: 'Property',
    covers: 'Commercial property developers, landlords, property managers, any firm with a portfolio of buildings',
    from: 'hamiltonpartners.com (layout used for inspiration; every name, photo and property removed)',
    name: 'Hamilton Partners',
    nameAlso: [],
    /* Their history, their square footage and their buildings by name and
       address: all facts about one company. */
    scrub: {
      'Hamilton Partners has developed, owned, and operated commercial real estate since 1987 — today spanning more than 17 million square feet of office, industrial, and retail space across greater Chicago and the Mountain West. Nearly four decades in, our commitment is unchanged: quality development, long-term ownership, and service our tenants can count on.':
        'A few lines on the firm go here: how long it has been building, what it owns and manages, and where.',
      'Commercial real estate developer and owner since 1987 — over 17 million SF of office, industrial, and retail space across greater Chicago and the Mountain West.': 'Commercial property development, ownership and management.',
      'member of the Hamilton community': 'member of our community',
      'Esplanade at Locust Point': 'Property Name',
      'Hamilton Lakes': 'Property Name',
      'Lake Park Commerce Center Building 1': 'Property Name',
      'Downers Grove, IL 60515, United States': 'Town, Region',
      '300 Park Blvd. Ste 201 Itasca, IL  60143': 'Your street address, City',
      'Itasca, IL 60143': 'Town, Region',
      'West Valley, UT 84120': 'Town, Region',
      'Chicago Region': 'First Region',
      'Phoenix Region': 'Second Region',
      'Salt Lake Region': 'Third Region'
    }
  },

  '42-jag-capital': {
    title: 'JAG Capital',
    industry: 'Professional services',
    covers: 'Investment managers, wealth advisers, pension and fund managers, any firm with strategies and values to explain',
    from: 'jagcap.com (layout used for inspiration; every name, photo, claim and figure removed)',
    name: 'JAG Capital Management',
    nameAlso: ['JAG'],
    /* A founding year, a veteran-owned status, a compliance record, a
       regulatory notice and a book by a named author are all facts about
       one firm. Each becomes a line asking for the client's own. */
    scrubRe: [
      ['<p>\\*JAG Capital Management, LLC claims compliance with[\\s\\S]*?</p>', '', '']
    ],
    scrub: {
      'JAG Capital Management, LLC': 'JAG Capital Management',
      'JAG Capital Management LLC': 'JAG Capital Management',
      'Prudent &amp; Purpose-Driven. Since 1945': 'Prudent &amp; Purpose-Driven.',
      'JAG has served generations of clients with integrity, clarity, and discipline.': 'JAG serves its clients with integrity, clarity, and discipline.',
      'With millions of personal capital committed, JAG team members and their families invest directly in our strategies and funds.': 'A line about how your team invests alongside clients goes here.',
      '>Veteran-Owned Business<': '>A Second Strength<',
      'As a Veteran-Owned Business, our leadership invests personal capital alongside clients ensuring full alignment.': 'A line about it goes here.',
      'GIPS® Verified Compliance': 'A Third Strength',
      '*Independent, firmwide verification of GIPS® compliance dating back to 1996.': 'A line about it goes here.',
      ' — refined over decades to help clients achieve lasting outcomes.': ' to help clients achieve lasting outcomes.',
      'is available in a 1940 Act mutual fund.': 'is also available as a fund.',
      'The Art of Investment Misery': 'our investor guide',
      ', Norm Conley reveals the behavioral mistakes': ', we explain the behavioral mistakes',
      '1610 Des Peres Road, Suite 120': 'Your street address',
      'St. Louis, MO 63131': 'Your City'
    }
  },

  '43-cermak-legal': {
    title: 'Cermak Legal',
    industry: 'Professional services',
    covers: 'Specialist law firms, environmental and regulatory advisers, consultancies with a named team',
    from: 'cermaklegal.com (layout used for inspiration; every name, photo, ranking and quote removed)',
    name: 'Cermak &amp; Inglin, LLP',
    nameAlso: ['Cermak &amp; Inglin'],
    /* Ranking-guide quotes about named partners, and the whole team by name
       in the menu. */
    scrubRe: [
      ['(<div class="tmf-post[^"]*testimonial[^"]*"[^>]*>[\\s\\S]*?<div class="excerpt">)[\\s\\S]*?(</div>)', 'g', '$1 “A client’s own words about working with you go here.” $2'],
      ['(menu-item-object-attorney[^"]*"><a href="#">)[^<]*(</a>)', 'g', '$1Team Member$2']
    ],
    scrub: {
      ' Recognized as one of the top environmental law firms in the country, the Firm represents': ' The Firm represents',
      'Our lawyers have decades of experience': 'Our lawyers have deep experience',
      'Decades of experience in handling complex environmental matters.': 'Experience in handling complex environmental matters.',
      'Environmental lawyers with decades of large-firm experience and government service.': 'Environmental lawyers with large-firm and government experience.',
      'Reviews and Rankings': 'What Clients Say',
      '12121 Wilshire Boulevard, Suite 322': 'Your street address',
      '90025': '',
      'Los Angeles': 'Your City',
      'Law Firm Website Design by': '',
      'The Modern Firm': ''
    }
  },

  '44-berch-construction': {
    title: 'Berch Construction',
    industry: 'Construction and trades',
    covers: 'Project managers, quantity surveyors, construction consultants, builders with a list of projects',
    from: 'berch.ch (layout used for inspiration; translated from German, every name, photo, project and figure removed)',
    name: 'BERCH',
    nameAlso: ['Berch'],
    /* The original is Swiss and in German. The copy is put into English here,
       and their projects, figures and news, which are all facts about one
       firm, become lines that ask for the client's own. */
    scrub: {
      'BERCH | Bauökonomie, Bau- &amp; Projektmanagement Schweiz': 'BERCH | Cost planning, construction and project management',
      'Ihr Partner für Bauökonomie, Bau- und Projekt- management': 'Your partner for cost planning, construction and project management',
      'Ihr Partner für Bauökonomie, Bau- und Projektmanagement': 'Your partner for cost planning, construction and project management',
      'Beratung, Koordination und Leitung von Bauprojekten mit Erfahrung und Präzision – damit du dich ganz auf deine Vision konzentrieren kannst.': 'Advice, coordination and management of building projects, with care and precision, so you can concentrate on what you are building.',
      'Jahre Erfahrung im Bau- und Projektmanagement.': 'Years of experience in construction and project management.',
      'Betreute &amp;&nbsp;Abgeschlossene Projekte in Wohn-, Gewerbe- und öffentlichen Bereichen.': 'Projects managed and completed across homes, commercial and public buildings.',
      'Erfolgreich betreute &amp; begleitete Bauvolumen': 'Construction value managed',
      '>35+<': '>00+<',
      '>190+<': '>00+<',
      '>&gt;3`500 Mio<': '>00 m<',
      'Innenausbau in Stäfa gestartet': 'Your latest project news goes here',
      'Bauleitung mit Weitsicht. Effizienz trifft Verantwortung': 'A second news headline goes here',
      'Zusammenarbeit, die funktioniert. Erfolgreiche Projekte entstehen im Team': 'A third news headline goes here',
      '>08.02.2026<': '>Date<',
      '>10.12.2025<': '>Date<',
      '>08.12.2025<': '>Date<',
      'Wir verwandeln Komplexität in Klarheit.': 'We turn complexity into clarity.',
      'ÜBERBAUUNG DEPOT HARD (ca. 200 WHG.)': 'PROJECT NAME, TOWN',
      'PERGOLA SSA BUHN ZH': 'PROJECT NAME, TOWN',
      'MFH (8WHG) RÜSCHLIKON ZH': 'PROJECT NAME, TOWN',
      '2 MFH (27WHG) STADT ZÜRICH': 'PROJECT NAME, TOWN',
      'MFH (3WHG) MEILEN ZH': 'PROJECT NAME, TOWN',
      'ENERGETISCHE SANIERUNG WERKHOF &amp; WOHNUNG ESCHENBACH SG': 'PROJECT NAME, TOWN',
      'KAPO URDORF ZH - OPTIMIERUNG MATERIALDIENST': 'PROJECT NAME, TOWN',
      'SCHULBAUTEN KANTON ZH - BFSW WINTERTHUR': 'PROJECT NAME, TOWN',
      'MFH (5WHG) BIRMENSDORF ZH': 'PROJECT NAME, TOWN',
      'SCHULBAUTEN KANTON ZH - KANTONSSCHULE ZÜRICH NORD': 'PROJECT NAME, TOWN',
      '>Unsere Leistungen<': '>Our services<',
      '>Leistungen<': '>Services<',
      '>Projekte<': '>Projects<',
      '>Aktuelles<': '>News<',
      '>Kontakt<': '>Contact<',
      '>Über<': '>About<',
      '>Mehr erfahren<': '>Learn more<',
      '>Mehr anzeigen<': '>Show more<',
      '>Wohnen<': '>Residential<',
      '>Neubau<': '>New build<',
      '>Bildung &amp; Forschung<': '>Education &amp; research<',
      '>Industrie &amp; Gewerbe<': '>Industrial &amp; commercial<',
      '>Umbau &amp; Sanierung<': '>Renovation<',
      '>Dienstleistungen ansehen<': '>View services<',
      '>Artikel lesen<': '>Read article<',
      '>Impressum<': '>Legal notice<',
      '>Datenschutz<': '>Privacy<',
      'Montag bis Freitag:': 'Monday to Friday:',
      'Alte Jonastrasse 83': 'Your street address',
      '8640 Rapperswil': 'Your City',
      '>Schweiz<': '><',
      '>Website made by Visioned<': '><',
      'Schweiz': ''
    }
  },

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
