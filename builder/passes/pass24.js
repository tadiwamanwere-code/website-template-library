/* Template 24 — the universal copy pass.
   A fitted-furniture maker, written around one workshop in one city. The
   trade detail is universal and stays. What goes is the city, the year, the
   headcount, the floor area and the suburbs. */
require('./pass.js')('C:/Users/USER/Desktop/Website Template Library/24-safeway-furniture/index.html', function (t) {
  const sub = t.sub;

  /* ---- 1. one city ---------------------------------------------------- */
  sub('Safeway Furniture — Greendale, Harare', 'Safeway Furniture — Greendale');
  sub('Home and office furniture &middot; Harare', 'Home and office furniture');
  sub('Most fitted-furniture companies in Harare are middlemen.', 'Most fitted-furniture companies are middlemen.');
  sub('and office furniture in Zimbabwe since 2012 — measured on site',
      'and office furniture since 2012 — measured on site');
  sub('and office furniture in Zimbabwe since 2012. Measured on site',
      'and office furniture since 2012. Measured on site');
  sub('Closed, every fitted kitchen in Harare looks the same.', 'Closed, every fitted kitchen looks the same.');
  sub('supplied and installed in Harare.', 'supplied and installed.');
  sub('Free within 40 km of Harare CBD', 'Free within 40 km of the workshop');
  sub('We survey anywhere inside 40 km of Harare CBD free of charge', 'We survey anywhere inside 40 km of the workshop free of charge');
  sub('Bulawayo, Mutare and Gweru surveys are quoted per trip.', 'Surveys further out are quoted per trip.');
  sub('<div class="fig-l">Workshop floor<br>Msasa, Harare</div>', '<div class="fig-l">Workshop floor<br>Under one roof</div>');
  sub('<dd>Msasa workshop, 1 800 m²</dd>', '<dd>Our own workshop</dd>');
  sub('<dd>Stand 7, Martin Drive, Msasa, Harare<br>1 800 m² &middot; Visits by appointment</dd>',
      '<dd>Stand 7, Martin Drive<br>Visits by appointment</dd>');
  sub('Greendale studio', 'Our own studio');
  sub('<span>Harare, Zimbabwe</span>', '<span>Head office</span>');

  /* ---- 2. a workshop this size, with these people --------------------- */
  sub('It is why a Safeway kitchen leaves the floor in 26 working days instead of 60.',
      'It is why a kitchen leaves our floor in weeks rather than months.');
  sub('<dd>14 cabinetmakers, 3 sprayers</dd>', '<dd>Our own cabinetmakers and sprayers</dd>');
  sub('96% of our installs in 2025 finished on or before the promised date.',
      'Almost every install finishes on or before the promised date.');
  sub('Every one of these was measured, made and fitted by Safeway. Addresses withheld, suburbs are real.',
      'Every one of these was measured, made and fitted by us. Addresses withheld.');

  /* ---- 3. suburbs that belong to one city ----------------------------- */
  sub('<span>Borrowdale Brooke</span>', '<span>Private house</span>');
  sub('<span>Mount Pleasant</span>', '<span>Private house</span>');
  sub('<span>Greendale</span>', '<span>Private house</span>');
  sub('<span>Msasa</span>', '<span>Company office</span>');
  sub('<span>Highlands</span>', '<span>Company office</span>');
  sub('<span>Avondale</span>', '<span>Retail unit</span>');

  /* ---- 4. a slot an uploaded logo can drop into ------------------------ */
  sub('.brand-word{', '/* an uploaded logo replaces the wordmark, in the header and the footer */\n'
    + '.brand-logo{display:block;height:28px;width:auto;max-width:180px;object-fit:contain;object-position:left center}\n'
    + '.brand-word{');
});
