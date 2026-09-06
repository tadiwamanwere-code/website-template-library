/* Template 18 — the universal copy pass.
   A homewares shop written around one Danish workshop, its clay pit, its
   company registration and the villages its glass and linen come from.
   It also carries a strip above the header, which the house rules ban. */
require('./pass.js')('C:/Users/USER/Desktop/Website Template Library/18-longrange-commerce/index.html', function (t) {
  const sub = t.sub, cut = t.cut;

  /* ---- 1. the strip above the header, and the code that scrolls it ----- */
  cut('<!-- ============================= PROMO STRIP ============================= -->', '</div>\n</div>');
  cut('     15. PROMO STRIP MARQUEE (supporting element only)', '})();');
  cut('.strip{height:34px;background:var(--ink);', '.strip__dot{width:3px;height:3px;border-radius:50%;background:var(--accent);flex:none;}');

  /* ---- 2. one country, one town, one clay pit ------------------------- */
  sub('Est. Copenhagen', 'Objects for the table');
  sub('HALDEN<sup>CPH</sup>', 'HALDEN');
  sub('Stoneware fired in Jutland, glass blown outside Lyon, flax woven in Guimar&atilde;es.',
      'Stoneware fired in one workshop, glass blown in another, flax woven in a third.');
  sub('<dt>Ships from</dt><dd>Copenhagen</dd>', '<dt>Ships from</dt><dd>The workshop</dd>');
  
  
  sub('The kiln at Vejle', 'The kiln', 2);
  sub('Every batch starts as 340kg of Jutland stoneware clay', 'Every batch starts as 340kg of stoneware clay');
  sub('01 &mdash; Clay store, Vejle', '01 &mdash; The clay store');
  sub('Jutland stoneware', 'Stoneware');
  sub('Blown in soda-lime glass near Lyon', 'Blown in soda-lime glass by hand');
  sub('Grown in Normandy, spun and woven in Guimar&atilde;es', 'Grown in Europe, spun and woven in Europe');
  sub('Washed European flax', 'Washed European flax');
  sub('Designed in Copenhagen, made in six workshops across Denmark, Portugal and France since 1998.',
      'Made in six small European workshops.');
  sub('Objects for the everyday table.', 'Objects for the everyday table.');
  sub('Gothersgade 41, 1123 K&oslash;benhavn', 'Gothersgade 41');
  sub('&copy; 2026 Halden Husflid ApS &middot; CVR 28 41 90 03', '&copy; Halden &middot; Company number on request');
  sub('The <b>Skagen</b> dinner service, reissued in the bone glaze', 'The <b>house</b> dinner service, reissued in the bone glaze');
  sub('Skagen Dinner Plate', 'House Dinner Plate');
  sub('Skagen Serving Bowl', 'House Serving Bowl');
  sub('skagen', 'house', 2);
  sub('Our six makers', 'Our makers');
  sub('MOBILEPAY', 'APPLE PAY');
  sub('Prices include VAT &middot; Shipping to the UK &amp; EU', 'Prices include VAT');

  /* ---- 3. figures the next workshop cannot claim ---------------------- */
  sub('<span>Workshop opened</span>', '<span>Workshop opened</span>', 0);
  sub('Workshop opened 1998', 'Workshop opened', 0);
});
