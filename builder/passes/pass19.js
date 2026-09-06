/* Template 19 — the universal copy pass.
   A pharmacy written around three named branches in one city, with one
   country's medicines regulator on the footer. It also carries the two
   things the house rules ban outright: a strip above the header, and a
   marquee. Both go. */
require('./pass.js')('C:/Users/USER/Desktop/Website Template Library/19-longrange-pharmacy/index.html', function (t) {
  const sub = t.sub, cut = t.cut;

  /* ---- 1. the strip above the header, and the code that scrolls it ----- */
  cut('<!-- ══ promo strip — coral, urgency only ════════════════════════════════ -->', '</div>\n</div>');
  cut('/* supporting only: the coral promo strip marquee */', '})();');
  cut('.promo-strip{background:var(--coral);color:#fff;overflow:hidden;position:relative}', '.promo-strip .dot{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.65);margin:0 26px}');
  sub('  .promo-strip .track{transform:none!important}', '');

  /* ---- 2. one city ---------------------------------------------------- */
  sub('Delivery across Harare in two to four hours.', 'Delivery across the city in two to four hours.');
  sub('Everything on this page is stock we hold in Harare, priced the same at the till as it is on the screen.',
      'Everything on this page is stock we hold, priced the same at the till as it is on the screen.');
  sub('Carefully selected products, in stock at our Harare branches.', 'Carefully selected products, in stock at our branches.');
  sub('What Harare buys most', 'What our customers buy most');
  sub('Add $50.00 more for free Harare delivery.', 'Add $50.00 more for free delivery.');
  sub('Free delivery over $50', 'Free delivery over $50');
  sub('Community pharmacy and health shop, trading in Harare since 2004.', 'Community pharmacy and health shop, trading since 2004.');
  sub('Harare, Zimbabwe', 'Head office');

  /* ---- 3. a group, a regulator and a year ------------------------------ */
  
  sub('Since 2004 · Bright Health Group', 'A dispensary you can walk into');
  sub('Part of Bright Health Group.', '');
  
  sub('© 2026 Long Range Pharmacies · Bright Health Group. Registered with the Medicines Control Authority of Zimbabwe.',
      '© Long Range Pharmacies. Registered with the national medicines authority.');
  sub('MCAZ registered', 'Fully registered');

  /* ---- 4. branches that belong to one business ------------------------- */
  sub('Graniteside (HQ)', 'Main branch', 2);
  sub('Graniteside dispensary', 'the main dispensary', 3);
  sub('Shop 3, Kelvin Corner, Graniteside, Harare', 'Shop 3, Kelvin Corner');
  sub('Shop 3, Kelvin Corner, Graniteside', 'Shop 3, Kelvin Corner');
  sub('10 Highfield Junction, Southerton, Harare', '10 Highfield Junction');
  sub('Shop 5, Shawasha Hills Shopping Mall, Harare', 'Shop 5, Northside Mall');
  sub('Southerton', 'Second branch', 2);
  sub('Shawasha Hills', 'Third branch', 2);
  sub('Three branches, one bonded store and a pharmacist on the floor at every one of them.',
      'Several branches, one bonded store and a pharmacist on the floor at every one of them.');
  sub('Harare branches', 'branches', 2);

  /* ---- 5. payment methods that only exist in one country --------------- */
  sub('ECOCASH', 'MOBILE');
  sub('ZIPIT', 'TRANSFER');

  /* ---- 6. library scaffolding on a page a prospect will see ------------ */
  sub('Template 19 · Website Template Library', '');
  
  sub('Nothing is uploaded from this demo — the picker is wired, the endpoint is not.',
      'This is a preview. The picker works; the upload is connected when the site goes live.');
  sub('Thank you — a pharmacist will call you back today. (Demo form: nothing was sent.)',
      'Thank you — a pharmacist will call you back today.');
  sub('@longrangepharmacies', '@yourpharmacy');
});
