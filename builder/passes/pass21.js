/* Template 21 — the universal copy pass.
   A beauty college written around two named UK awarding bodies, its own
   centre numbers, a named graduate and a list of the hotels that employ
   them. Every one of those is a claim the next college cannot make. */
require('./pass.js')('C:/Users/USER/Desktop/Website Template Library/21-mirage-college/index.html', function (t) {
  const sub = t.sub;

  /* ---- 1. awarding bodies and centre numbers -------------------------- */
  
  sub('ITEC / VTCT Accredited · Harare', 'Accredited college');
  sub('ITEC &amp; VTCT, United Kingdom', 'Recognised awarding body');
  
  
  
  
  
  
  sub('ITEC registration and examination fees', 'Registration and examination fees');
  sub('Kit, oils, ITEC registration and exam fees', 'Kit, oils, registration and exam fees');
  sub('VTCT registration, exam fees and product allowance', 'Registration, exam fees and product allowance');
  sub('ITEC and VTCT registration and examination fees are included.', 'Awarding-body registration and examination fees are included.');
  
  sub("and from ITEC's results returns", "and from the awarding body's results returns");
  
  sub('ITEC written and practical, 2023–2025 cohorts combined.', 'Written and practical, recent cohorts combined.');
  sub('Full diplomas awarded across ITEC and VTCT.', 'Full diplomas awarded.');
  
  sub('ITEC centre 1187/ZW · VTCT centre 92341', 'Centre numbers on request');
  sub('Talk: what the ITEC Level 2 year actually looks like', 'Talk: what the Level 2 year actually looks like');
  

  /* ---- 2. one country, one street ------------------------------------- */
  sub('is the first of its kind in Zimbabwe: an accredited beauty school', 'is an accredited beauty school');
  sub('Mirage Spa, Fifth Street, Avondale', 'The teaching spa, on site');
  sub('Mirage Spa on Fifth Street is not a practice room with a plastic couch in it.', 'The teaching spa is not a practice room with a plastic couch in it.');
  sub('ITEC Level 2 Diploma · Ofqual regulated', 'Level 2 Diploma · Accredited');
  sub('ITEC Level 3 Diploma · Ofqual regulated', 'Level 3 Diploma · Accredited');
  sub('VTCT Level 3 Diploma · Ofqual regulated', 'Level 3 Diploma · Accredited');
  sub('ITEC Level 2 · 9 months', 'Level 2 · 9 months', 2);
  sub('ITEC Level 3 · 12 months', 'Level 3 · 12 months', 2);
  sub('VTCT Level 3 · 8 months', 'Level 3 · 8 months', 2);
  sub('Mirage Short Course · Centre certificate', 'Short course · Centre certificate', 2);
  sub('Borrowdale · Bulawayo · Mutare', 'Nationwide');
  sub('14 Fifth Street, Avondale, Harare', '14 Fifth Street', 2);
  sub('An accredited college of beauty therapy in Avondale, Harare, teaching above a working spa since 2015.',
      'An accredited college of beauty therapy, teaching above a working spa.');
  sub('Avondale, Harare', 'Town centre');

  /* ---- 3. employers who have not agreed to be named ------------------- */
  sub('Meikles Hotel Spa', 'City hotel spas');
  sub('Amanzi Spa', 'Independent day spas');
  sub('Victoria Falls Safari Lodge', 'Safari lodge spas');
  sub('Rainbow Towers Wellness', 'Hotel wellness centres');
  sub('Elephant Hills Resort Spa', 'Resort spas', 2);
  sub('Royal Caribbean &amp; Celebrity', 'International cruise lines');
  sub('Emirates Palace Spa', 'Overseas hotel spas');
  
  
  sub('Victoria Falls</span>', 'Resort towns</span>', 2);
  sub('Abu Dhabi', 'Overseas');
  

  /* ---- 4. a graduate who has not agreed to be quoted ------------------- */
  sub('Portrait of Tendai Marowa, a Mirage graduate', 'Portrait of a graduate');
  sub('Tendai Marowa', 'A recent graduate');
  
  sub('ITEC Level 3, class of 2023 · now Senior Therapist, Resort spas',
      'Level 3 diploma · now a senior therapist at a resort spa');

  /* ---- 5. figures a college has to be able to stand behind ------------- */
  sub('Eleven years of graduates, and where they went.', 'Our graduates, and where they went.');
  sub('Graduates since 2015', 'Graduates so far');
  sub('We publish these figures every January, taken from our own placement register',
      'We publish these figures every year, taken from our own placement register');
  sub('around forty paying clients a week', 'paying clients every week');

  /* ---- 6. a slot an uploaded logo can drop into ------------------------ */
  sub('.brand-txt{ display:block; line-height:1.1; }',
      '/* an uploaded logo replaces the mark and wordmark, header and footer */\n'
    + '.brand-logo{display:block;height:34px;width:auto;max-width:190px;object-fit:contain;object-position:left center}\n'
    + '.brand-txt{ display:block; line-height:1.1; }');
});
