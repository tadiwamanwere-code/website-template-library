/* Template 10 — the universal copy pass.
   A fashion label written with a named designer, a real VAT number, eight
   real mills and six real stockists. Naming a shop that does not carry the
   collection is the worst kind of claim on a page like this, so the mills
   become their regions and the stockists become their kind. */
require('./pass.js')('C:/Users/USER/Desktop/Website Template Library/10-cadence-fashion/index.html', function (t) {
  const sub = t.sub;

  /* ---- 1. the designer, by name --------------------------------------- */
  sub('Marit Halvorsen Founder &amp; Creative Director Antwerp, March 2026', 'Founder &amp; Creative Director', 0);
  sub('Marit Halvorsen', 'The founder', 2);
  sub('<span class="display d-sm">M.H.</span>', '<span class="display d-sm">&mdash;</span>');

  /* ---- 2. the atelier and the company --------------------------------- */
  sub('BE 0742.118.336', 'Company number on request');
  sub('&copy; 2026 CADENCE NV &mdash; ALL RIGHTS RESERVED', '&copy; CADENCE &mdash; ALL RIGHTS RESERVED');
  sub('51.2194&deg;N 4.4025&deg;E', 'BY APPOINTMENT');
  sub('An Antwerp label founded in 2019 by The founder. Nine collections.', 'An independent label. Nine collections.');

  /* ---- 3. mills named as suppliers ------------------------------------ */
  sub('Vitale Barberis Canonico, Biella.', 'Woven in Biella.');
  sub('Taroni, Como.', 'Woven in Como.');
  sub('Todd &amp; Duncan yarn, woven in Scotland.', 'Scottish yarn, woven in Scotland.');
  sub('T&auml;rnsj&ouml; Garveri, Sweden.', 'A Swedish tannery.');
  sub('Gold-rated LWG tannery; hides traced to four farms within 300&nbsp;km of the works.',
      'Gold-rated tannery; hides traced to farms within 300&nbsp;km of the works.');
  sub('<td>V.B.C. &mdash; Biella, IT</td>', '<td>Biella, IT</td>');
  sub('<td>Michell &mdash; Arequipa, PE</td>', '<td>Arequipa, PE</td>');
  sub('<td>Todd &amp; Duncan &mdash; Kinross, UK</td>', '<td>Kinross, UK</td>');
  sub('<td>Albini &mdash; Bergamo, IT</td>', '<td>Bergamo, IT</td>');
  sub('<td>Taroni &mdash; Como, IT</td>', '<td>Como, IT</td>');
  sub('<td>Zegna Baruffa &mdash; Biella, IT</td>', '<td>Biella, IT</td>');
  sub('<td>T&auml;rnsj&ouml; &mdash; T&auml;rnsj&ouml;, SE</td>', '<td>Sweden</td>');
  sub('<td>Bianchini &mdash; Lyon, FR</td>', '<td>Lyon, FR</td>');
  sub('vegetable-tanned calf, T&auml;rnsj&ouml; SE', 'vegetable-tanned calf, Sweden');

  /* ---- 4. stockists who have not agreed to be listed ------------------- */
  sub('<td>Dover Street Market</td>', '<td>Concept store</td>');
  sub('<td>The Broken Arm</td>', '<td>Concept store</td>');
  sub('<td>SSENSE</td>', '<td>Online retailer</td>');
  sub('<td>Antonioli</td>', '<td>Boutique</td>');
  sub('<td>Dover Street Market Ginza</td>', '<td>Department store</td>');
  sub('<td>Graanmarkt 13</td>', '<td>Concept store</td>');

  /* ---- 5. library scaffolding on a page a buyer will see --------------- */
  sub('TEMPLATE 10 &middot; DESIGN REFERENCE ONLY', '');
  
});
