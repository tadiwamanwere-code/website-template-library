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

/* LeadForge's trade names, one template each. Checked by hand against the
   `covers` line of every card. A trade missing from here falls through to
   matching words, then to the default. */
const BY_TRADE = {
  'pharmacy': '19-longrange-pharmacy',
  'medical-supplies': '19-longrange-pharmacy',
  'clinic-hospital': '22-smile-dental',
  'medical-practice': '22-smile-dental',
  'dentist': '22-smile-dental',
  'primary-school': '21-mirage-college',
  'secondary-school': '21-mirage-college',
  'training-provider': '21-mirage-college',
  'building-contractor': '20-tower-construction',
  'engineering-services': '20-tower-construction',
  'borehole-driller': '20-tower-construction',
  'steel-supplier': '20-tower-construction',
  'haulage-transport': '20-tower-construction',
  'mining': '20-tower-construction',
  'estate-agent': '09-atlas-realestate',
  'apartment': '09-atlas-realestate',
  'law-firm': '23-caro-accounting',
  'consultancy': '23-caro-accounting',
  'financial-services': '23-caro-accounting',
  'insurance-broker': '23-caro-accounting',
  'marketing-agency': '23-caro-accounting',
  'office-services': '23-caro-accounting',
  'it-support': '23-caro-accounting',
  'isp-networking': '23-caro-accounting',
  'web-design': '23-caro-accounting',
  'security-firm': '23-caro-accounting',
  'lodge': '15-solstice-resort',
  'hotel': '15-solstice-resort',
  'travel-tour-operator': '15-solstice-resort',
  'attraction': '15-solstice-resort',
  'guesthouse': '25-gordons-bnb',
  'restaurant': '25-gordons-bnb',
  'clothing-boutique': '10-cadence-fashion',
  'beauty-salon': '10-cadence-fashion',
  'event-services': '10-cadence-fashion',
  'printing': '10-cadence-fashion',
  'furniture-store': '33-cloud-home',
  'home-garden': '33-cloud-home',
  'supermarket-grocery': '18-longrange-commerce',
  'wholesaler-distributor': '18-longrange-commerce',
  'electronics-computer': '18-longrange-commerce',
  'hardware-store': '18-longrange-commerce',
  'retail-gifts': '18-longrange-commerce',
  'auto-spares': '18-longrange-commerce',
  'bar-bottlestore': '18-longrange-commerce',
  'car-dealer': '18-longrange-commerce',
  'electrician': '34-sitcha-electric',
  'solar-installer': '34-sitcha-electric',
  'utilities-energy': '34-sitcha-electric',
  'auto-repair': '34-sitcha-electric',
  'cleaning-pestcontrol': '34-sitcha-electric',
  'manufacturer': '24-safeway-furniture'
};

const DEFAULT = '23-caro-accounting';

const words = s => String(s || '').toLowerCase().split(/[^a-z]+/).filter(w => w.length > 3);

/* Which template, and why. The reason goes back to the CRM so a person can
   see it was a choice and change it. */
function pickTemplate(trade, extra) {
  const all = listTemplates();
  const have = new Set(all.map(t => t.template));
  const key = String(trade || '').toLowerCase().trim();
  if (BY_TRADE[key] && have.has(BY_TRADE[key])) {
    return { template: BY_TRADE[key], why: 'trade "' + key + '"' };
  }
  /* Words from the trade and whatever else is known, against each card's
     list of the trades it covers. Plural and singular both count. */
  const want = new Set(words(key + ' ' + (extra || '')).flatMap(w => [w, w.replace(/s$/, '')]));
  let best = null;
  for (const t of all) {
    const got = words(t.covers + ' ' + t.industry).map(w => w.replace(/s$/, ''));
    const score = got.filter(w => want.has(w)).length;
    if (score && (!best || score > best.score)) best = { template: t.template, score };
  }
  if (best) return { template: best.template, why: 'closest match to "' + (key || extra) + '"' };
  return { template: DEFAULT, why: key ? 'no template for "' + key + '" yet, so the general one' : 'no trade on the lead, so the general one' };
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

module.exports = { pickTemplate, swapsFor, notesFor, BY_TRADE };
