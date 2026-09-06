/* Template 23 — the universal copy pass.
   An accounting practice written for one country, with named clients and
   real registration numbers. All three have to go: a form name, a statute
   and a client trading name are all things the next firm cannot claim. */
require('./pass.js')('C:/Users/USER/Desktop/Website Template Library/23-caro-accounting/index.html', function (t) {
  const sub = t.sub, cut = t.cut;
  /* ---- 1. the scrolling strip of service words. House rule: never. ------- */
  cut('<div class="ticker" aria-hidden="true">', '</div>\n</div>');
  
  /* ---- 2. one country's revenue authority and its form numbers ----------- */
  sub('file every ZIMRA return on time', 'file every tax return on time');
  sub('<b>ZIMRA returns</b>', '<b>Tax returns</b>', 0);
  sub('<li><a href="#services">Tax &amp; ZIMRA returns</a></li>', '<li><a href="#services">Tax and returns</a></li>');
  sub('Tax &amp; ZIMRA', 'Tax &amp; returns');
  sub('Tax &amp; ZIMRA returns', 'Tax and returns', 0);
  sub('what ZIMRA is currently owed', 'what the tax office is currently owed');
  sub('anyone holding a ZIMRA letter they have not opened yet', 'anyone holding a letter from the tax office they have not opened yet');
  sub('ZIMRA correspondence handled on your behalf', 'Tax correspondence handled on your behalf');
  sub('what is outstanding at ZIMRA', 'what is outstanding at the tax office');
  sub('documents you can produce if ZIMRA asks for them,\n      because sooner or later ZIMRA asks for them.',
      'documents you can produce if the tax office asks for them,\n      because sooner or later it asks for them.');
  sub('Tax &amp; ZIMRA returns', 'Tax and returns', 0);
  sub('<li><a href="#services">Tax &amp; ZIMRA returns</a></li>', '<li><a href="#services">Tax and returns</a></li>', 0);
  
  sub('VAT7 returns, Category A, B and C', 'VAT returns, every category');
  sub('ITF12C self-assessment and QPD provisional payments', 'Self-assessment and provisional payments');
  sub('ITF263 tax clearance and BP number registration', 'Tax clearance and tax-number registration');
  sub('PAYE (P2), NSSA, ZIMDEF and standards levy computation', 'Payroll tax, social security and levy computation');
  sub('ITF16 annual reconciliation and payroll audit file', 'Annual payroll reconciliation and audit file');
  sub('Company formation: CR6, CR14 and incorporation', 'Company formation and statutory filings');
  sub('the payroll and the PAYE schedule agree before the P2 goes out', 'the payroll and the tax schedule agree before the return goes out');
  sub('Bank, petty cash, EcoCash and OneMoney reconciliations', 'Bank, petty cash and mobile money reconciliations');
  sub('from bank statements, EcoCash exports and supplier invoices', 'from bank statements, mobile money exports and supplier invoices', 2);
  sub('Annual income tax return and ITF263 clearance', 'Annual income tax return and tax clearance');
  sub('Monthly VAT7 return, filed and acknowledged', 'Monthly VAT return, filed and acknowledged');
  sub('PAYE (P2) and NSSA submitted by the 10th', 'Payroll tax and social security by the 10th');
  sub('<span>ZIMRA BP number</span>', '<span>Tax number registration</span>');
  sub('<span>Tax clearance ITF263</span>', '<span>Tax clearance certificate</span>');
  sub('companies on\n            quarterly QPDs', 'companies paying\n            quarterly on account');
  sub('VAT by the 25th. PAYE by the 10th.', 'VAT by the 25th. Payroll tax by the 10th.');
  sub('PAYE by the 10th, accounts by the 12th, VAT by the 25th.', 'Payroll tax by the 10th, accounts by the 12th, VAT by the 25th.');
  sub('Annual PAYE variance of <b>US$3,140</b> went to <b>zero</b> in the\n          first quarter, and the monthly run dropped from <b>three days to four hours</b>. ITF16\n          reconciliation now closes without a query.',
      'The annual payroll-tax variance went to zero in the\n          first quarter, and the monthly run dropped from days to hours. The annual\n          reconciliation now closes without a query.');
  sub('<b>PAYE &amp; NSSA</b>', '<b>Payroll tax</b>', 0);
  sub('Tax &amp; ZIMRA returns', 'Tax and returns', 0);
  
  /* ---- 3. the country itself -------------------------------------------- */
  sub('Registered tax agents for 312 Zimbabwean businesses.', 'Registered tax agents and accountants.');
  sub('Kadoma, Zimbabwe &middot; Accounting &middot; Tax &middot; Bookkeeping', 'Accounting &middot; Tax &middot; Bookkeeping');
  sub('Fourteen years in Kadoma, working with millers, hardware groups,\n      clinics, schools, contractors and co-operatives across Mashonaland West. Most clients arrive\n      behind. Nobody stays behind.',
      'Years of practice, working with millers, hardware groups,\n      clinics, schools, contractors and co-operatives. Most clients arrive\n      behind. Nobody stays behind.');
  sub(' Zimbabwean tax deadlines, ZIMRA form sets and our own fee schedule',
      ' the filing calendar, the form sets and our own fee schedule');
  sub('asks for a BP number, a bank login or a payslip', 'asks for a tax number, a bank login or a payslip');
  sub('Registered tax agents and accountants in Kadoma, working with businesses across\n      Mashonaland West and the rest of Zimbabwe since 2012.',
      'Registered tax agents and accountants, working with businesses of every size\n      across the region.');
  sub('Fees are quoted and invoiced in United States dollars, payable in\n        USD or at the prevailing interbank rate in ZWG.',
      'Fees are quoted and invoiced in United States dollars.');
  sub('Statutory audits are signed by an independent PAAB-registered\n        auditor;', 'Statutory audits are signed by an independent registered\n        auditor;');
  sub('<b>Westview, Kadoma<br>Mashonaland West</b>', '<b>Westview, Kadoma</b>');
  sub('<span>Westview, Kadoma, Zimbabwe</span>', '<span>Westview, Kadoma</span>');
  
  /* ---- 4. registrations that belong to one firm -------------------------- */
  sub('Zimbabwe Revenue Authority (ZIMRA)', 'National revenue authority');
  sub('Institute of Chartered Accountants of Zimbabwe (ICAZ)', 'National institute of chartered accountants');
  sub('Institute of Administration &amp; Commerce (IAC)', 'Professional accounting body');
  sub('National Social Security Authority (NSSA)', 'National social security authority');
  sub('Signed by an independent PAAB-registered auditor', 'Signed by an independent registered auditor');
  sub('TA-04871', 'On request');
  sub('PPC-2019/0442', 'On request');
  sub('M-8842', 'On request');
  sub('0114-882-6', 'On request');
  sub('PI-2026/117', 'On request');
  sub('US$250,000 limit, renewed annually', 'Renewed annually');
  sub('Cyber and Data Protection Act [Chapter 12:07]', 'Data protection law');
  sub('Registration numbers shown are illustrative for this template. Replace them\n        with the practice&rsquo;s own before publishing, and never display a certificate reference the\n        firm does not actually hold.',
      'Every reference above reads &ldquo;on request&rdquo; until the practice&rsquo;s own is\n        put in its place. Never display a certificate reference the firm does not hold.');
  sub('ICAZ &middot; ZIMRA', 'Registered');
  sub('<li>ZIMRA tax agent</li>', '<li>Registered tax agent</li>', 0);
  sub('ZIMRA tax agent', 'Registered tax agent');
  sub('ICAZ practice certificate', 'Practice certificate');
  
  /* ---- 5. clients who are somebody else's ------------------------------- */
  sub('Three engagements, with the figures the client agreed we could\n        publish. Names used with permission.',
      'Three engagements of the kind we take on most often.\n        Details are anonymised.');
  sub('<p class="who">Rimuka Milling (Pvt) Ltd &middot; Kadoma &middot; 2024</p>',
      '<p class="who">A maize and stockfeed miller</p>');
  sub('A maize and stockfeed miller arrived with a ZIMRA assessment, no VAT returns since 2021,\n          and a bookkeeper who had left the country.',
      'The client arrived with an assessment, years of unfiled VAT returns,\n          and a bookkeeper who had left the country.');
  sub('We rebuilt thirty-one periods from source, filed every outstanding VAT7 and ITF12C, and\n          took the penalty position to ZIMRA with a full reconciliation attached. The assessed\n          exposure of US$41,200 settled at US$6,850 on a six-month payment plan.',
      'We rebuilt every period from source, filed every outstanding return, and took the\n          penalty position to the tax office with a full reconciliation attached. The assessment\n          settled at a fraction of the sum first demanded, on a payment plan.');
  sub('<p class="who">Patel Hardware Group &middot; Chegutu &amp; Kadoma</p>',
      '<p class="who">A hardware group, four branches</p>');
  sub('Seventy-eight staff across four branches were being paid from a workbook that nobody had\n          rebuilt since 2019.',
      'Staff across four branches were being paid from a workbook nobody had\n          rebuilt in years.');
  sub('<p class="who">Sanyati Cotton Collective &middot; Mashonaland West</p>',
      '<p class="who">A growers&rsquo; co-operative</p>');
  sub('A 214-member growers&rsquo; co-operative had never produced statements a bank would read.\n          We built two comparative years under IFRS for SMEs, prepared the audit file and sat in the\n          credit meeting. Result: a <b>US$120,000</b> input facility approved, at <b>4.2%</b> below\n          the rate first quoted.',
      'A growers&rsquo; co-operative had never produced statements a bank would read.\n          We built two comparative years under IFRS for SMEs, prepared the audit file and sat in the\n          credit meeting. The input facility was approved, below the rate first quoted.');
  sub('<figcaption class="work-stat"><b class="num">US$34,350</b><span>Penalty exposure removed</span></figcaption>',
      '<figcaption class="work-stat"><b class="num">83%</b><span>Penalty exposure removed</span></figcaption>');
  sub('<h3 class="disp">Thirty-one months<br>of unfiled VAT</h3>', '<h3 class="disp">Years of returns<br>brought up to date</h3>');
  sub('alt="Client meeting reviewing rebuilt accounts"', 'alt="A meeting reviewing rebuilt accounts"');
  
  /* ---- 6. the firm's own assistant, named after the firm ----------------- */
  sub('Ask Caro AI first', 'Ask the assistant first');
  
  /* ---- 8. the assistant's canned answers, written for one tax system ----- */
  sub("'Category C files monthly, by the 25th of the following month. Categories A and B file for a two-month period, also by the 25th after that period closes. If you are on the Practice tier we prepare, file and send you the ZIMRA acknowledgement the same day, so nothing sits unconfirmed.'",
      "'Filing frequency depends on the category you are registered in: monthly for the largest, otherwise for a period at a time. If you are on the Practice tier we prepare, file and send you the acknowledgement the same day, so nothing sits unconfirmed.'");
  sub("'PAYE itself comes out of the employee, not out of you. Your own cost is the 3% NSSA employer contribution, the 1% ZIMDEF levy and the standards levy where it applies. On a 40-person payroll that is usually US$260 to US$420 a month, and we submit the P2 by the 10th.'",
      "'Payroll tax itself comes out of the employee, not out of you. Your own cost is the employer social security contribution and the training and standards levies where they apply. We work the figure out from your headcount, and submit the return by the 10th.'");
  sub("'Yes. Name search, CR6 and CR14 lodgement, certificate of incorporation, then the ZIMRA BP number and a first ITF263 clearance. US$180 for the registration, US$95 for the BP number, and it normally runs 9 to 14 working days.'",
      "'Yes. Name search, the statutory lodgements, certificate of incorporation, then the tax number and a first clearance certificate. US$180 for the registration, US$95 for the tax number, and it normally runs 9 to 14 working days.'");
  sub("'That is the most common first job we take. We rebuild from bank statements, mobile money exports and supplier invoices, file everything outstanding, then take the penalty position to ZIMRA with the reconciliation attached. Arrears work is quoted from US$240 per year of records.'",
      "'That is the most common first job we take. We rebuild from bank statements, mobile money exports and supplier invoices, file everything outstanding, then take the penalty position to the tax office with the reconciliation attached. Arrears work is quoted from US$240 per year of records.'");
  sub('placeholder="Ask about VAT, PAYE, ZIMRA deadlines&hellip;"', 'placeholder="Ask about VAT, payroll or filing deadlines&hellip;"');
  sub('to a person with a practice certificate before it goes anywhere near ZIMRA.',
      'to a person with a practice certificate before it goes anywhere near a return.');
  sub('<meta name="description" content="Caro Accounting &amp; Tax. Bookkeeping, accounting, ZIMRA returns, PAYE and payroll, statutory reporting and business advisory for companies in Kadoma and across Zimbabwe. Registered tax agents since 2012.">',
      '<meta name="description" content="Bookkeeping, accounting, tax returns, payroll, statutory reporting and business advisory. Registered tax agents, fixed monthly fees agreed in advance.">');
  
  
  /* ---- 7. a slot an uploaded logo can drop into -------------------------- */
  sub('.brand-txt{', '/* an uploaded logo replaces the wordmark, in the header and the footer */\n'
    + '.brand-logo{display:block;height:30px;width:auto;max-width:180px;object-fit:contain;object-position:left center}\n'
    + '.brand-txt{');
  
});
