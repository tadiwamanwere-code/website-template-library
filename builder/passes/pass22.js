/* Template 22 — the universal copy pass.
   Every claim that would be a lie for the next dental practice is rewritten
   so the default is true for any of them. What is left is identity, and
   identity is what swap.json fills in. Same length wherever it matters. */
const fs = require('fs');
const F = 'C:/Users/USER/Desktop/Website Template Library/22-smile-dental/index.html';
let s = fs.readFileSync(F, 'utf8');
let n = 0;
function sub(a, b, expect) {
  expect = expect === undefined ? 1 : expect;
  const hits = s.split(a).length - 1;
  if (hits !== expect) throw new Error('[' + (n + 1) + '] want ' + expect + ' got ' + hits + ' for:\n  ' + a.slice(0, 120));
  s = s.split(a).join(b);
  n++;
}

/* ---- 1. a street the next practice will not be on ---------------------- */
sub('in one calm surgery on Fife Avenue, Harare.', 'in one calm surgery.');
sub('care in one calm surgery on Fife Avenue.', 'care in one calm surgery.');
sub('Years on Fife Avenue', 'Years in practice');
sub('Patients treated since 2007', 'Patients treated');
sub('Average rating from 212 reviews', 'Average patient rating');
sub('Nobody at Linden will make you feel bad', 'Nobody here will make you feel bad');
sub('A small practice on Fife Avenue, Harare, doing preventive, restorative and cosmetic dentistry slowly and properly since 2007.',
    'A small practice doing preventive, restorative and cosmetic dentistry slowly and properly.');
sub('and the Fife Avenue rank is a two-minute walk.', 'and the taxi rank is a short walk away.');
sub('alt="The Linden surgery, bright and uncluttered"', 'alt="The surgery, bright and uncluttered"');
sub('alt="The treatment room at Linden"', 'alt="The treatment room"');
sub('alt="A clinician greeting a patient at Linden"', 'alt="A clinician greeting a patient"');
sub('alt="A patient smiling after treatment at Linden Dental Studio"', 'alt="A patient smiling after treatment"');
sub('alt="Dr Rutendo Mabika, principal dentist at Linden Dental Studio"', 'alt="The principal dentist"');
sub('alt="Dr Rutendo Mabika, principal dentist"', 'alt="The principal dentist at work"');

/* ---- 2. prices. A figure the client never gave is a lie, so the default
          is "on request" and the swap card carries the real one. -------- */
sub('A first examination and X-rays is $45. If you decide to go no further',
    'A first examination and X-rays is priced up front. If you decide to go no further');
sub('<span class="acc__price">from $45</span>', '<span class="acc__price">on request</span>');
sub('<span class="acc__price">from $30</span>', '<span class="acc__price">on request</span>');
sub('<span class="acc__price">from $70</span>', '<span class="acc__price">on request</span>');
sub('<span class="acc__price">from $240</span>', '<span class="acc__price">on request</span>');
sub('<span class="acc__price">from $260</span>', '<span class="acc__price">on request</span>');
sub('<span class="acc__price">from $1,400</span>', '<span class="acc__price">on request</span>');
sub('Anything above $400 can be spread over three months, interest free.',
    'Larger plans can be spread over three months, interest free.');
sub('Treatment over $400 can be split across three monthly payments',
    'Larger treatments can be split across three monthly payments');
sub('<b>Also at Linden &mdash;</b> single-tooth implants from $1,150, wisdom-tooth removal from $180, night guards from $140, and same-day emergency relief for registered patients.',
    '<b>Also here &mdash;</b> single-tooth implants, wisdom-tooth removal, night guards and same-day emergency relief for registered patients.');
sub('Free for under-fives booked alongside a parent&rsquo;s check-up.',
    'Ask about children booked alongside a parent&rsquo;s check-up.');
sub('Guaranteed for two years.', 'Guaranteed, and we will tell you for how long.');
sub('and so is a top-up syringe twelve months later', 'and so is a top-up syringe later on');

/* ---- 3. country-specific schemes and money ----------------------------- */
sub('<b>Direct billing</b><span>CIMAS, PSMAS, First Mutual Health and Generation Health claimed for you.</span>',
    '<b>Direct billing</b><span>Medical aid claimed for you, so you settle the shortfall only.</span>');
sub('Cash in US dollars, EcoCash, Visa and Mastercard, or bank transfer. We claim directly from the four schemes below, so you settle the shortfall only and never the full amount up front.',
    'Cash, mobile money, Visa and Mastercard, or bank transfer. We claim directly from the schemes below, so you settle the shortfall only and never the full amount up front.');
sub('<div class="aidlist"><span>CIMAS</span><span>PSMAS</span><span>First Mutual Health</span><span>Generation Health</span></div>',
    '<div class="aidlist"><span>Medical aid</span><span>Cash</span><span>Card</span><span>Bank transfer</span></div>');

/* ---- 4. claims that are not true of every practice ---------------------- */
sub('<b>Same week</b><span>92% of new patients are seen within five working days.</span>',
    '<b>Same week</b><span>Most new patients are seen within five working days.</span>');
sub('<b>Step-free</b><span>Ground-floor surgery, wide doors, parking in the courtyard.</span>',
    '<b>Access</b><span>Tell us what you need for the visit and we will arrange it.</span>');
sub('<b>Sedation</b><span>Inhalation sedation for anxious adults and children, at no extra charge.</span>',
    '<b>Comfort</b><span>Numbing gel before every injection, and a break whenever you want one.</span>');
sub('Sedation for a root canal I had been dreading for two years.',
    'A root canal I had been dreading for two years.');
sub('<div class="acc__tags"><span>Restorative</span><span>Sedation available</span><span>Magnification</span></div>',
    '<div class="acc__tags"><span>Restorative</span><span>Rubber dam</span><span>Magnification</span></div>');
sub('Ground floor, step-free from the courtyard, wide doorways throughout. Secure parking behind the building,',
    'Tell us before you come if you need step-free access or extra time. Parking nearby,');

/* ---- 5. a named person with named qualifications ------------------------ */
sub('&ldquo;Nobody has ever been talked<br>into treatment in this practice.<br>',
    '&ldquo;Nobody is ever talked into<br>treatment in this practice.<br>');
sub('<b>Dr Rutendo Mabika</b>Principal dentist &middot; Linden Dental Studio &middot; MDPCZ D-4471',
    '<b>The principal dentist</b>The person who examines you is the person who treats you');
sub('<li><a href="#team">Dr Rutendo Mabika</a></li>', '<li><a href="#team">The dentist</a></li>');

sub('<li><b>BDS, University of the Witwatersrand</b>Johannesburg, 2007</li>',
    '<li><b>Dental degree and registration</b>Full details on request</li>');
sub('<li><b>MSc Conservative Dentistry, King&rsquo;s College London</b>2013, distinction</li>',
    '<li><b>Continuing professional development</b>Kept current every year</li>');
sub('<li><b>Certificate in Inhalation Sedation</b>SAAD, 2016</li>',
    '<li><b>Cross-infection control</b>Autoclaved instruments, single use where it matters</li>');
sub('<li><b>Clear aligner provider, level II</b>Recertified 2025</li>',
    '<li><b>Radiographs</b>Digital, at the lowest useful dose</li>');

sub('<li><b>Medical &amp; Dental Practitioners Council of Zimbabwe</b>Registration D-4471, in good standing</li>',
    '<li><b>National dental council</b>Registered and in good standing</li>');
sub('<li><b>Dental Association of Zimbabwe</b>Member since 2008, council 2019&ndash;2022</li>',
    '<li><b>National dental association</b>Member in good standing</li>');
sub('<li><b>Practice registration P-1187</b>Inspected annually</li>',
    '<li><b>Practice registration</b>Inspected annually</li>');
sub('<li><b>Indemnity: Dental Protection</b>Full clinical cover</li>',
    '<li><b>Professional indemnity</b>Full clinical cover</li>');

sub('<li><b>Dr Farai Chikomo</b>Associate dentist &middot; BDS (UZ), Dip. Implant Dentistry, RCS Edinburgh</li>',
    '<li><b>Associate dentist</b>Restorative work and implant dentistry</li>');
sub('<li><b>Nyasha Muzenda</b>Oral hygienist &middot; Dip. Oral Hygiene, University of the Western Cape</li>',
    '<li><b>Oral hygienist</b>Cleaning, gum care and sealants</li>');
sub('<li><b>Chiedza Nyoni</b>Practice manager &middot; handles every medical-aid claim in the building</li>',
    '<li><b>Practice manager</b>Handles every medical-aid claim in the building</li>');
sub('<li><b>Two dental nurses</b>Both trained in paediatric behaviour management</li>',
    '<li><b>Dental nurses</b>Trained in looking after nervous children</li>');

/* ---- 6. reviews attributed to people who do not exist ------------------- */
sub('4.9 from 212 verified reviews, collected by SMS after treatment. We publish every one, including the three-star ones.',
    'Reviews are collected by text message after treatment. We publish every one, including the three-star ones.');
sub('<footer><b>Tarisai M.</b>Examination &amp; hygiene &middot; March</footer>',
    '<footer><b>Patient review</b>Examination &amp; hygiene</footer>');
sub('<footer><b>Blessing N.</b>Crown &amp; root canal &middot; February</footer>',
    '<footer><b>Patient review</b>Crown &amp; root canal</footer>');
sub('<footer><b>Chipo D.</b>Children&rsquo;s check-up &middot; April</footer>',
    '<footer><b>Patient review</b>Children&rsquo;s check-up</footer>');
sub('<footer><b>Ian W.</b>Root canal treatment &middot; January</footer>',
    '<footer><b>Patient review</b>Root canal treatment</footer>');
sub('<footer><b>Nomsa Z.</b>Clear aligners &middot; May</footer>',
    '<footer><b>Patient review</b>Clear aligners</footer>');
sub('<footer><b>Kudzai R.</b>Emergency bonding &middot; December</footer>',
    '<footer><b>Patient review</b>Emergency bonding</footer>');
sub('&ldquo;Tarisai, 14 months after&rdquo;', '&ldquo;A patient, after treatment&rdquo;', 0);
sub('Tarisai, 14 months after', 'A patient, after treatment');
sub('The number on the written plan was the number I paid at the end. That almost never happens anywhere in this city, for anything.',
    'The number on the written plan was the number I paid at the end. That almost never happens anywhere, for anything.');

/* ---- 7. registration numbers in the footer ----------------------------- */
sub('<span>MDPCZ practice registration P-1187</span>', '<span>Registered dental practice</span>');
sub('&copy; 2026 Linden Dental Studio', '&copy; Linden Dental Studio');

/* ---- 8. a slot an uploaded logo can drop into -------------------------- */
sub('.hdr .btn{padding:.95em 1.35em}',
    '.hdr .btn{padding:.95em 1.35em}\n'
  + '/* an uploaded logo replaces the wordmark, in the header and the footer */\n'
  + '.brand__logo{display:block;height:34px;width:auto;max-width:180px;object-fit:contain;object-position:left center}\n'
  + '.ft .brand__logo{height:30px}');

fs.writeFileSync(F, s);
console.log('22-smile-dental: ' + n + ' edits');
