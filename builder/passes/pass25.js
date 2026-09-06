/* Template 25 — the universal copy pass.
   This one is written as a story about particular people in a particular
   village. The story is why it works, so the shape stays: what goes is the
   detail that would be false for the next guesthouse. */
const fs = require('fs');
const F = 'C:/Users/USER/Desktop/Website Template Library/25-gordons-bnb/index.html';
let s = fs.readFileSync(F, 'utf8');
let n = 0;
function sub(a, b, expect) {
  expect = expect === undefined ? 1 : expect;
  const hits = s.split(a).length - 1;
  if (hits !== expect) throw new Error('[' + (n + 1) + '] want ' + expect + ' got ' + hits + ' for:\n  ' + a.slice(0, 120));
  s = s.split(a).join(b);
  n++;
}

/* ---- 1. the owners, by name ------------------------------------------- */
sub('<h2 class="js-split">Ruth and Samson took it on in 2009.</h2>',
    '<h2 class="js-split">The owners took it on, and live in it.</h2>');
sub('Ruth grew up two streets away and had walked past the house for thirty years before it came up for sale. Samson cooks. They live on the ground floor at the back, which is why somebody is always in when you arrive.',
    'One of them grew up two streets away and had walked past the house for years before it came up for sale. The other cooks. They live on the ground floor at the back, which is why somebody is always in when you arrive.');
sub('Two people and, at weekends, their daughter Ada. There is no front desk and no night porter.',
    'Two people and, at weekends, one more of the family. There is no front desk and no night porter.');
sub('eggs from four hens named Dot, Marge, Pin and one nobody got round to naming, figs from the courtyard in season',
    'eggs from the hens at the bottom of the garden, fruit from the courtyard in season');
sub('<figcaption>Ruth Gordon &middot; keeper of the house</figcaption>',
    '<figcaption>The keeper of the house</figcaption>');
sub('Thank you. Ruth answers from hello@gordonsbnb.example, usually the same day.',
    'Thank you. We answer from hello@gordonsbnb.example, usually the same day.');
sub('<p class="fact-k">Ruth and Samson took it on</p>', '<p class="fact-k">The owners took it on</p>');
sub('<li><a href="#house" data-scroll>Ruth and Samson</a></li>', '<li><a href="#house" data-scroll>The owners</a></li>');
sub('Walking times measured from the front gate, at an unhurried pace, by Samson, twice.',
    'Walking times measured from the front gate, at an unhurried pace, twice.');
sub('No, sorry. There is a house cat, Biscuit, and she was here first.',
    'No, sorry. There is a house cat, and she was here first.');

/* ---- 2. the village, by name ------------------------------------------ */
sub('<p class="walk-name">Loveridge Bakery</p>', '<p class="walk-name">The village bakery</p>');
sub('Sourdough out at seven, sold out by eleven most days. Take the cash, they have never fixed the card machine.',
    'Sourdough out at seven, sold out by eleven most days. Take cash, the card machine is temperamental.');
sub('<p class="walk-name">The Saturday market, Fenner Street</p>', '<p class="walk-name">The Saturday market</p>');
sub('Vegetables, three cheesemongers, and a man who sells only honey and will talk to you about it for an hour.',
    'Vegetables, cheese, and a man who sells only honey and will talk to you about it for an hour.');
sub('A flat 5.2 km loop on gravel, doable in an hour. Herons at the north end, early.',
    'A flat loop on gravel, doable in an hour. Herons at the far end, early.');
sub('<p class="walk-name">The Crown &amp; Anchor</p>', '<p class="walk-name">The village pub</p>');
sub('<p class="walk-name">Chelmer Hill lookout</p>', '<p class="walk-name">The hill lookout</p>');
sub('Twenty minutes up through the beeches and the whole valley opens underneath you. Best an hour before sunset.',
    'Twenty minutes up through the trees and the whole valley opens underneath you. Best an hour before sunset.');
sub('<p class="walk-name">Bus 14 to the mainline station</p>', '<p class="walk-name">The bus to the station</p>');
sub('Every twenty minutes until 22:40. Eighteen minutes end to end, and it stops at the top of our road.',
    'Every twenty minutes until late. Under half an hour end to end, and it stops at the top of our road.');
sub('alt="The wooded path that runs from the end of Marlow Rise to the reservoir"',
    'alt="The wooded path that runs from the end of the road to the water"');
sub('Chelmer Vale is small. You will not need a car once you have parked',
    'The village is small. You will not need a car once you have parked');

/* ---- 3. guests who do not exist --------------------------------------- */
sub('<p class="score-k">average from 214 stays</p>', '<p class="score-k">average guest score</p>');
sub('<p class="rev-nm">Hannah Leverett</p>', '<p class="rev-nm">Guest &mdash; the top-floor room</p>');
sub('<p class="rev-nm">Anton Pirie</p>', '<p class="rev-nm">Guest &mdash; the west room</p>');
sub('<p class="rev-nm">Fola Adeyemi</p>', '<p class="rev-nm">Guest &mdash; the ground-floor room</p>');
sub('<p class="rev-nm">Grete Sandvik</p>', '<p class="rev-nm">Guest &mdash; the family room</p>');
sub('<p class="rev-mt">The Loft &middot; stayed March 2026</p>', '<p class="rev-mt">Verified stay</p>');
sub('<p class="rev-mt">Room Two, West &middot; stayed January 2026</p>', '<p class="rev-mt">Verified stay</p>');
sub('<p class="rev-mt">The Garden Room &middot; stayed November 2025</p>', '<p class="rev-mt">Verified stay</p>');
sub('<p class="rev-mt">The Old Kitchen &middot; stayed October 2025</p>', '<p class="rev-mt">Verified stay</p>');
sub('Samson noticed I was not eating the eggs and put porridge in front of me the next morning without my having asked. That is the whole place, really.',
    'Somebody noticed I was not eating the eggs and put porridge in front of me the next morning without my having asked. That is the whole place, really.');
sub('Four of us in the Old Kitchen and nobody was on top of anybody. Ruth lent us an umbrella on the Sunday and then refused to take it back.',
    'Four of us in the family room and nobody was on top of anybody. They lent us an umbrella on the Sunday and then refused to take it back.');

/* ---- 4. a year the next house was not built in ------------------------ */
sub('The house&#39;s original 1931 kitchen.', 'The original kitchen of the house.', 0);
sub("The house's original 1931 kitchen.", 'The original kitchen of the house.');

/* ---- 5. library scaffolding and a registration number ------------------ */
sub('<span>&copy; 2026 Gordon&#39;s Bnb &middot; Registered with the Chelmer Vale tourism board, no. 4412</span>', '', 0);
sub("&copy; 2026 Gordon's Bnb &middot; Registered with the Chelmer Vale tourism board, no. 4412",
    "&copy; Gordon's Bnb &middot; Registered guest accommodation");
sub('Template 25 of the library &middot; ', '');

/* ---- 6. a slot an uploaded logo can drop into -------------------------- */
sub('.brand-name{font-family:var(--serif);font-size:22px;letter-spacing:-.01em;white-space:nowrap}',
    '.brand-name{font-family:var(--serif);font-size:22px;letter-spacing:-.01em;white-space:nowrap}\n'
  + '/* an uploaded logo replaces the wordmark, in the header and the footer */\n'
  + '.brand-logo{display:block;height:30px;width:auto;max-width:180px;object-fit:contain;object-position:left center}\n'
  + '.foot-brand .brand-logo{height:34px}');

fs.writeFileSync(F, s);
console.log('25-gordons-bnb: ' + n + ' edits');
