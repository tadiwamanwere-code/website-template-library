/* Template 09 — the universal copy pass.
   A property development written entirely around one street in one city,
   with named architects, named neighbours and a country's estate-agency
   registration on the footer. It also carries a marquee under the hero,
   which the house rules ban.

   The shape of the writing is the value here, so the shape stays. What
   goes is every proper noun that belongs to somebody else. */
require('./pass.js')('C:/Users/USER/Desktop/Website Template Library/09-atlas-realestate/index.html', function (t) {
  const sub = t.sub, cut = t.cut;

  /* ---- 1. the marquee under the hero, and the code that scrolls it ----- */
  cut('<div class="dateline">', '</div>\n  </div>');
  cut('/* ---------------------------------------------------------\n     6. Supporting — dateline marquee (not counted as a technique)', '})();');
  sub(".from('.dateline', { opacity: 0, duration: .9 }, 0.5);", ';');
  cut('/* ---------- dateline ticker (supporting element) ---------- */', '.dateline__row span::after{ content:""; width:4px; height:4px; border-radius:50%; background:var(--accent); opacity:.55; }');
  sub('  .dateline{ margin-top:52px; }', '');

  /* ---- 2. the architects, by name ------------------------------------- */
  sub('Estúdio Mena Ferreira has set two low volumes around a walled garden on the site of the old Casa Vilar seed warehouse, keeping the 1908 façade on Rua do Século and the four jacarandas behind it.',
      'The architects have set two low volumes around a walled garden on the site of an old seed warehouse, keeping the original street façade and the four trees behind it.');
  sub('Written by Estúdio Mena Ferreira with Studio Corvo and issued in full to reserving purchasers.',
      'Written by the architects with the interior designers and issued in full to reserving purchasers.');
  sub('Restoration by Oficina Rebelo.', 'Restoration by specialist conservators.');
  sub('hand-applied by Oficina Rebelo over four coats', 'hand-applied by specialists over four coats');
  sub('planted with strawberry tree, oleander and rosemary by Teresa Roque', 'planted with strawberry tree, oleander and rosemary');
  sub('Inês Mena Ferreira — Estúdio Mena Ferreira', 'The architect');
  sub('run by Estúdio Nove', 'run by a resident instructor');
  

  /* ---- 3. one city, one hill, one street ------------------------------ */
  sub('Nine minutes above <em class="acc">Chiado</em>', 'Nine minutes above <em class="acc">the old town</em>');
  sub("Príncipe Real is Lisbon's garden quarter: a plateau of nineteenth-century palacetes, plant nurseries and small kitchens, held together by the cedar in the middle of its square. Campo Alto sits on its western lip, where the ground begins to fall towards Bica and the river.",
      'The quarter is the city&rsquo;s garden district: a plateau of nineteenth-century townhouses, plant nurseries and small kitchens, held together by the cedar in the middle of its square. The development sits on its western lip, where the ground begins to fall towards the river.');
  sub('The retained 1908 façade of the Casa Vilar seed warehouse, Rua do Século 118.',
      'The retained façade of the original seed warehouse.');
  sub('The warehouse supplied seed to the market gardens of Campolide until 1974, then sat half-empty for four decades. Atlas acquired it in 2022 with a condition attached by the Câmara: keep the street wall, keep the trees, and give the garden back to the block.',
      'The warehouse supplied seed to the market gardens around it for most of a century, then sat half-empty for four decades. We acquired it with a condition attached by the council: keep the street wall, keep the trees, and give the garden back to the block.');
  sub('So the new volumes step back from Rua do Século and sit low', 'So the new volumes step back from the street and sit low');
  sub('below the ridge line of the palacete next door', 'below the ridge line of the house next door');
  sub('Two of the five have a direct view down to the Tejo over the rooftops of Bica.', 'Two of the five have a direct view down to the river over the rooftops.');
  sub('Living level sits half a storey above the garden wall for privacy from Rua do Século.', 'Living level sits half a storey above the garden wall, for privacy from the street.');
  sub('at the Rua do Século gate', 'at the side gate');
  sub('off the Rua do Século gate', 'off the side gate');

  /* ---- 4. six landmarks that belong to one neighbourhood --------------- */
  sub('Jardim do Príncipe Real', 'The public garden');
  sub('The cedar, the Tuesday organic market, and the cisterns underneath it.', 'The cedar, the Tuesday market, and the cisterns underneath it.');
  sub('Praça das Flores', 'The square');
  sub('Six tables outside Tasca Baldracca; the best coffee on the hill at Copenhagen Coffee Lab.', 'Six tables outside the tavern, and the best coffee on the hill.');
  sub('Miradouro de São Pedro de Alcântara', 'The viewpoint');
  sub('The full castle-to-river panorama, two streets down through the gardens.', 'The full panorama, two streets down through the gardens.');
  sub('Elevador da Bica', 'The funicular');
  sub('Down to Cais do Sodré and the river ferries in under four minutes.', 'Down to the waterfront and the river ferries in under four minutes.');
  sub('Chiado &amp; Rua Serpa Pinto', 'The theatre quarter');
  sub('Bertrand, the Teatro São Carlos, and the Baixa beyond it.', 'The bookshop, the opera house, and the old town beyond it.');
  sub('Rato Metro · Yellow line', 'The metro station');
  sub('Eleven stops to the airport with one change at Saldanha.', 'Eleven stops to the airport with one change.');

  /* ---- 5. fittings specified by brand ---------------------------------- */
  sub('<b>Gaggenau 200 series</b>', '<b>Integrated, fully fitted</b>');
  sub('<b>Vola KV1, brushed brass</b>', '<b>Brushed brass mixer</b>');
  sub('<b>Vola 111, brushed brass</b>', '<b>Brushed brass, wall-mounted</b>');
  sub('<b>Duravit Starck 3</b>', '<b>Wall-hung, soft-close</b>');
  sub('<b>Daikin Altherma 3</b>', '<b>Air-source heat pump</b>');
  sub('<b>FSB 1076, bronze</b>', '<b>Solid bronze lever</b>');
  sub('with Technogym Artis equipment', 'with commercial-grade equipment');
  sub('a 40 mm honed Estremoz marble top', 'a 40 mm honed marble top');
  sub('Second bathrooms in full-height Estremoz.', 'Second bathrooms in full-height marble.');
  sub('oiled Portuguese chestnut fronts', 'oiled chestnut fronts');
  sub('lime plaster and Portuguese chestnut.', 'lime plaster and chestnut.');

  /* ---- 6. registrations and a company history ------------------------- */
  sub('<span>AMI 19842</span>', '<span>Registration on request</span>');
  sub('<span>NIPC 514 882 037</span>', '<span>Company number on request</span>');
  sub('Building small, long-life residential buildings in Lisboa and Porto since 2009. Fourteen completed developments, 611 homes.',
      'Building small, long-life residential buildings. Every one finished, handed over and still looked after.');
  sub('Atlas Residential — Development No. 14', 'Atlas Residential');
  sub('© 2026 Atlas Residential, S.A. — Lisboa', '© Atlas Residential');
  sub('&copy; 2026 Atlas Residential, S.A. &mdash; Lisboa', '&copy; Atlas Residential', 0);

  /* ---- 7. library scaffolding on a page a prospect will see ------------ */
  sub('<span>Design reference template — placeholder imagery</span>', '');
  sub('Areas are approximate and measured to RICS IPMS 2.', 'Areas are approximate.');
});
