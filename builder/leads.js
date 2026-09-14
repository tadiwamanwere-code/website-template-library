/* =========================================================================
   leads.js — turns a lead from the CRM into a site.

   UtahOp sends what it knows about a business: the name, the trade LeadForge
   found for it, the numbers, the town. This picks the template that fits the
   trade and says which fields each fact goes into. Nothing here writes copy.
   A fact the CRM does not have stays empty, and the template's own neutral
   wording stays on the page, exactly as it would if a person had left the
   field blank in the app.
   ========================================================================= */

'use strict';

const { listTemplates } = require('./render.js');

/* LeadForge's trade names, best template first. Checked by hand against the
   `covers` line of every card. More than one entry means more than one design
   suits that trade: the first is what the system picks on its own, and the
   rest are what it offers when a person wants to choose. A trade missing from
   here falls through to matching words, then to the default. */
const BY_TRADE = {
  /* health */
  'pharmacy': ['19-longrange-pharmacy', '18-longrange-commerce'],
  'medical-supplies': ['19-longrange-pharmacy', '18-longrange-commerce'],
  'health-shop': ['19-longrange-pharmacy'],
  'optician': ['19-longrange-pharmacy', '22-smile-dental'],
  'veterinary': ['19-longrange-pharmacy', '22-smile-dental'],
  'clinic-hospital': ['22-smile-dental'],
  'medical-practice': ['22-smile-dental'],
  'dentist': ['22-smile-dental'],
  'physiotherapy': ['22-smile-dental'],

  /* education */
  'primary-school': ['21-mirage-college'],
  'secondary-school': ['21-mirage-college'],
  'training-provider': ['21-mirage-college'],
  'driving-school': ['21-mirage-college'],
  'tutoring': ['21-mirage-college'],

  /* building and trades */
  'building-contractor': ['20-tower-construction', '44-berch-construction', '35-grazeon-thatchers'],
  'engineering-services': ['44-berch-construction', '20-tower-construction'],
  'quantity-surveyor': ['44-berch-construction'],
  'project-management': ['44-berch-construction', '20-tower-construction'],
  'borehole-driller': ['20-tower-construction', '34-sitcha-electric'],
  'steel-supplier': ['20-tower-construction', '18-longrange-commerce'],
  'haulage-transport': ['20-tower-construction'],
  'mining': ['20-tower-construction', '44-berch-construction'],
  'plant-hire': ['20-tower-construction'],
  'roofing': ['35-grazeon-thatchers', '20-tower-construction'],
  'thatching': ['35-grazeon-thatchers'],
  'landscaping': ['35-grazeon-thatchers', '34-sitcha-electric'],
  'electrician': ['34-sitcha-electric', '20-tower-construction'],
  'solar-installer': ['34-sitcha-electric', '20-tower-construction'],
  'plumber': ['34-sitcha-electric', '20-tower-construction'],
  'utilities-energy': ['34-sitcha-electric'],
  'auto-repair': ['34-sitcha-electric'],
  'cleaning-pestcontrol': ['34-sitcha-electric'],

  /* making and fitting */
  'manufacturer': ['24-safeway-furniture', '18-longrange-commerce'],
  'joinery': ['24-safeway-furniture', '36-alstyle-construction'],
  'shopfitting': ['36-alstyle-construction', '24-safeway-furniture'],
  'ceilings-drywall': ['36-alstyle-construction'],
  'renovations': ['36-alstyle-construction', '20-tower-construction'],
  'flooring-blinds': ['24-safeway-furniture', '36-alstyle-construction'],

  /* property */
  'estate-agent': ['09-atlas-realestate', '41-hamilton-partners'],
  'apartment': ['09-atlas-realestate', '41-hamilton-partners'],
  'property-developer': ['41-hamilton-partners', '09-atlas-realestate'],
  'property-management': ['41-hamilton-partners', '09-atlas-realestate'],
  'commercial-property': ['41-hamilton-partners'],
  'architect': ['09-atlas-realestate', '44-berch-construction'],

  /* law and money */
  'law-firm': ['39-wegner-law', '40-connolly-law', '43-cermak-legal', '38-parvis-family-law'],
  'legal-services': ['39-wegner-law', '40-connolly-law', '43-cermak-legal'],
  'family-law': ['38-parvis-family-law', '39-wegner-law'],
  'conveyancing': ['40-connolly-law', '39-wegner-law'],
  'accounting-firm': ['23-caro-accounting', '39-wegner-law'],
  'financial-services': ['42-jag-capital', '37-ventrix-capital', '23-caro-accounting'],
  'investment-firm': ['37-ventrix-capital', '42-jag-capital'],
  'insurance-broker': ['42-jag-capital', '23-caro-accounting'],

  /* other professional services */
  'consultancy': ['37-ventrix-capital', '23-caro-accounting', '43-cermak-legal'],
  'office-services': ['23-caro-accounting'],
  'it-support': ['23-caro-accounting', '37-ventrix-capital'],
  'isp-networking': ['23-caro-accounting', '37-ventrix-capital'],
  'security-firm': ['23-caro-accounting', '34-sitcha-electric'],
  'marketing-agency': ['10-cadence-fashion', '23-caro-accounting'],
  'web-design': ['10-cadence-fashion', '23-caro-accounting'],
  'printing': ['10-cadence-fashion', '23-caro-accounting'],

  /* stays and eating out */
  'lodge': ['15-solstice-resort', '25-gordons-bnb'],
  'hotel': ['15-solstice-resort', '25-gordons-bnb'],
  'travel-tour-operator': ['15-solstice-resort', '25-gordons-bnb'],
  'attraction': ['15-solstice-resort', '25-gordons-bnb'],
  'guesthouse': ['25-gordons-bnb', '15-solstice-resort'],
  'restaurant': ['25-gordons-bnb', '18-longrange-commerce'],

  /* shops */
  'furniture-store': ['33-cloud-home', '24-safeway-furniture', '18-longrange-commerce'],
  'home-garden': ['33-cloud-home', '18-longrange-commerce'],
  'clothing-boutique': ['10-cadence-fashion', '18-longrange-commerce'],
  'beauty-salon': ['10-cadence-fashion'],
  'event-services': ['10-cadence-fashion'],
  'supermarket-grocery': ['18-longrange-commerce'],
  'wholesaler-distributor': ['18-longrange-commerce'],
  'electronics-computer': ['18-longrange-commerce'],
  'hardware-store': ['18-longrange-commerce', '20-tower-construction'],
  'retail-gifts': ['18-longrange-commerce', '33-cloud-home'],
  'auto-spares': ['18-longrange-commerce'],
  'bar-bottlestore': ['18-longrange-commerce', '25-gordons-bnb'],
  'car-dealer': ['18-longrange-commerce', '09-atlas-realestate']
};

const DEFAULT = '23-caro-accounting';

/* When several designs score the same, use the broadest one for that trade.
   A family-law page and a general law page both match "legal", and the
   general one is the safer guess when nobody has said which. */
const GENERALIST = new Set([
  '39-wegner-law', '23-caro-accounting', '37-ventrix-capital', '20-tower-construction',
  '18-longrange-commerce', '09-atlas-realestate', '22-smile-dental', '21-mirage-college',
  '15-solstice-resort', '34-sitcha-electric', '33-cloud-home', '19-longrange-pharmacy',
  '24-safeway-furniture', '10-cadence-fashion'
]);

/* "Law Firm", "law_firm" and "law firm" are all the same trade. */
const slug = s => String(s || '').toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '');

/* Three letters, because "law" and "spa" are trades. The noise that lets in
   is handled by STOP below. */
const words = s => String(s || '').toLowerCase().split(/[^a-z]+/).filter(w => w.length > 2);
const stem = w => (/ies$/.test(w) ? w.replace(/ies$/, 'y') : w.replace(/s$/, ''));

/* Words that say nothing about what a business does, so they must not pull a
   template towards themselves. */
const STOP = new Set([
  'and', 'the', 'for', 'any', 'own', 'our', 'one', 'two', 'all', 'new', 'who',
  'ltd', 'pvt', 'inc', 'llp', 'plc',
  'with', 'that', 'their', 'this', 'from', 'have', 'firm', 'company', 'limited',
  'private', 'service', 'group', 'holding', 'enterprise', 'trading', 'zimbabwe',
  'harare', 'bulawayo', 'business', 'other', 'general'
]);

/* Word families. A card says "Dentists" and the lead says "dental"; both mean
   the same trade, and a plain string match would miss it. Every word on both
   sides goes through this first, so the two meet in the middle. */
const FAMILY = {
  dentist: ['dental', 'dentist', 'dentistry', 'orthodontist', 'orthodontic'],
  clinic: ['medical', 'medicine', 'doctor', 'clinic', 'hospital', 'surgery', 'physio', 'physiotherapy', 'health', 'healthcare'],
  pharmacy: ['pharmacy', 'pharmaceutical', 'chemist'],
  law: ['law', 'legal', 'lawyer', 'solicitor', 'attorney', 'advocate', 'litigation', 'conveyancing'],
  account: ['accounting', 'accountant', 'accountancy', 'bookkeeper', 'bookkeeping', 'payroll', 'audit', 'auditor'],
  invest: ['investment', 'investor', 'capital', 'wealth', 'fund', 'asset', 'portfolio', 'pension', 'broker', 'insurance', 'finance', 'financial'],
  build: ['construction', 'builder', 'building', 'contractor', 'civil', 'engineering', 'engineer', 'surveyor'],
  roof: ['roofing', 'roofer', 'thatch', 'thatcher', 'thatching'],
  electric: ['electrical', 'electric', 'electrician', 'solar', 'plumbing', 'plumber'],
  fitting: ['joiner', 'joinery', 'carpenter', 'carpentry', 'shopfitter', 'shopfitting', 'ceiling', 'drywall', 'flooring', 'blind', 'glazier', 'kitchen'],
  property: ['property', 'estate', 'realty', 'letting', 'landlord', 'apartment', 'residence', 'residential'],
  school: ['school', 'college', 'academy', 'training', 'education', 'tuition', 'tutor', 'campus'],
  stay: ['lodge', 'guesthouse', 'hotel', 'accommodation', 'resort', 'safari', 'retreat', 'catering'],
  food: ['restaurant', 'cafe', 'bistro', 'kitchen', 'bar'],
  fashion: ['fashion', 'clothing', 'boutique', 'apparel', 'designer', 'jeweller', 'jewellery'],
  shop: ['shop', 'store', 'retail', 'supermarket', 'grocery', 'wholesaler', 'catalogue'],
  home: ['furniture', 'furnishing', 'homeware', 'interior', 'ceramic', 'showroom'],
  event: ['event', 'wedding', 'conference', 'party', 'function'],
  motor: ['motor', 'vehicle', 'automotive', 'spares', 'garage', 'tyre']
};

const CANON = (() => {
  const out = {};
  for (const key of Object.keys(FAMILY)) for (const w of FAMILY[key]) out[w] = key;
  return out;
})();

const canon = w => CANON[w] || CANON[stem(w)] || stem(w);

/* Every template, best first, with the reason each one scored.

   Four things can make a template fit, strongest first:
     1. the lead's trade is named in the table above;
     2. the trade group LeadForge put the lead in matches the template's
        industry line;
     3. words from the trade and the group appear in the template's covers line;
     4. words from the business's own name do. This counts for less: a name is
        a name, and "Sunrise Studios" is not a photography business just
        because it says studios.

   The whole list comes back, not only the winner, so the CRM can show the
   rest and let a person choose. */
function rankTemplates(input, extra) {
  const lead = (input && typeof input === 'object') ? input : { trade: input };
  const trade = slug(lead.trade);
  const group = String(lead.tradeGroup || '');
  const loose = [lead.name, lead.organisation, lead.sellingPoint, extra].filter(Boolean).join(' ');

  const all = listTemplates();
  const have = new Set(all.map(t => t.template));
  const named = (BY_TRADE[trade] || []).filter(t => have.has(t));

  const pick = s => new Set(words(s).map(canon).filter(w => !STOP.has(w)));
  const strong = pick(trade.replace(/-/g, ' ') + ' ' + group);
  /* A name only steers the choice when it contains a real trade word.
     "Sunrise Dental" says dentist; "Sunrise Studio" says nothing, and must
     not drag the lead towards the photographers' template. */
  const weak = new Set([...pick(loose)].filter(w => FAMILY[w] && !strong.has(w)));

  const rows = all.map(function (t) {
    const at = named.indexOf(t.template);
    let score = 0;
    let why = '';

    if (at === 0) {
      score = 100;
      why = 'made for ' + tradeWords(trade).toLowerCase();
    } else if (at > 0) {
      score = 90 - at * 5;
      why = 'also suits ' + tradeWords(trade).toLowerCase();
    }

    /* The trade group is a broad bucket ("Professional services"), so it is
       worth something, but never as much as the trade itself. */
    if (group && slug(group) === slug(t.industry)) {
      score += 12;
      if (!why) why = 'same kind of business: ' + String(t.industry).toLowerCase();
    }

    const covered = new Set(words(t.covers + ' ' + t.industry).map(canon));
    const hitStrong = [...strong].filter(w => covered.has(w));
    const hitWeak = [...weak].filter(w => covered.has(w));
    score += hitStrong.length * 14 + hitWeak.length * 4;
    if (!why && (hitStrong.length || hitWeak.length)) {
      why = 'matches "' + hitStrong.concat(hitWeak).slice(0, 3).join('", "') + '"';
    }

    if (score && GENERALIST.has(t.template)) score += 2;

    return Object.assign({}, t, { score: score, why: why || 'a general business page' });
  });

  rows.sort((a, b) => b.score - a.score || a.template.localeCompare(b.template));
  return rows;
}

/* Which template, and why. The reason goes back to the CRM so a person can
   see it was a choice and change it. */
function pickTemplate(input, extra) {
  const rows = rankTemplates(input, extra);
  const top = rows[0];
  if (top && top.score > 0) return { template: top.template, why: top.why };

  const have = new Set(rows.map(t => t.template));
  const fallback = have.has(DEFAULT) ? DEFAULT : (top && top.template);
  const trade = (input && typeof input === 'object') ? input.trade : input;
  return {
    template: fallback,
    why: trade
      ? 'nothing made for "' + slug(trade) + '" yet, so the general one'
      : 'no trade on the lead, so the general one'
  };
}

/* "building-contractor" reads as "Building contractor". */
function tradeWords(trade) {
  const s = String(trade || '').replace(/[-_]+/g, ' ').trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

/* The lead's facts, in the fields every card shares. deriveSwaps() works out
   the rest (the short name, the tel: link, the tagline) the same way it does
   for a site typed in by hand. */
function swapsFor(lead) {
  const out = {};
  const put = (k, v) => { v = String(v || '').trim(); if (v) out[k] = v; };
  put('BUSINESS_NAME', lead.organisation || lead.name);
  put('WHAT_THEY_DO', tradeWords(lead.trade));
  /* A mobile is a WhatsApp number here, and that is the one people use. */
  put('PHONE', lead.whatsapp || lead.phone);
  put('EMAIL', lead.email);
  put('CITY', lead.suburb || String(lead.location || '').split(',')[0]);
  put('ADDRESS', lead.address || lead.location);
  return out;
}

/* What LeadForge found that is worth having beside you while you finish the
   site. It goes in the site's notes, never onto the page: it is research
   about the business, not wording the business chose. */
function notesFor(lead) {
  const lines = ['Made from UtahOp lead ' + (lead.id || '') + '.'];
  const add = (label, v) => { if (v) lines.push(label + ': ' + v); };
  add('Trade', lead.trade);
  add('Selling point', lead.sellingPoint);
  add('Their current website', lead.website);
  add('Facebook', lead.facebook);
  add('Instagram', lead.instagram);
  add('Person to ask for', lead.personName);
  return lines.join('\n');
}

module.exports = { pickTemplate, rankTemplates, swapsFor, notesFor, BY_TRADE };
