/* =========================================================================
   pass-project-names.js — two templates name a thing that is not the
   business: a housing development, and a fashion collection.

   Neither had a field, so both survived a render and the brand check called
   them out, correctly. A development called Campo Alto on a page selling
   somebody else's flats is exactly the kind of detail that must not go out.

   This gives each of them a field, defaulted to something true, and takes
   the doubled words out of the two lines where the development name and the
   place would otherwise be printed twice.

   Run: node builder/passes/pass-project-names.js
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const LIB = path.resolve(__dirname, '..', '..');
const misses = [];

function edit(template, jobs) {
  const file = path.join(LIB, template, 'index.html');
  let s = fs.readFileSync(file, 'utf8');
  for (const [find, replace, note] of jobs) {
    const before = s;
    s = s.split(find).join(replace);
    if (s === before) misses.push(template + ': ' + (note || find.slice(0, 50)));
  }
  return { file: file, write: () => fs.writeFileSync(file, s) , done: () => s };
}

/* ------------------------------------------------------------------- 09 */

const nine = edit('09-atlas-realestate', [
  /* The tab and the search result printed the development, the developer,
     the district and the city. Once the district follows the client's own
     city, two of those are the same word twice. */
  ['<title>Campo Alto — Atlas Residential, Príncipe Real, Lisboa</title>',
   '<title>Campo Alto — Príncipe Real</title>', 'title'],
  ['content="Campo Alto: 42 residences in Príncipe Real, Lisboa. By Atlas Residential. Completion Q2 2027. From €785,000."',
   'content="Campo Alto: 42 residences in Príncipe Real. By Atlas Residential."', 'meta description'],
  ['Campo Alto — Príncipe Real, Lisboa', 'Campo Alto — Príncipe Real', 'intro foot line']
]);

/* ------------------------------------------------------------------- 10 */

const ten = edit('10-cadence-fashion', [
  ['<title>CADENCE — SEVERANCE / FW26 Lookbook</title>',
   '<title>CADENCE — SEVERANCE</title>', 'title'],
  ['content="CADENCE. SEVERANCE, Fall–Winter 2026. Twenty-four looks cut in Antwerp."',
   'content="CADENCE. SEVERANCE. Twenty-four looks."', 'meta description']
]);

if (misses.length) {
  console.error('\n  These did not land, so nothing was written:\n');
  for (const m of misses) console.error('    - ' + m);
  process.exit(1);
}
nine.write();
ten.write();
console.log('  two titles and two descriptions trimmed');

/* ----------------------------------------------------------- the new fields */

function addSwaps(template, rows) {
  const file = path.join(LIB, template, 'swap.json');
  const card = JSON.parse(fs.readFileSync(file, 'utf8'));
  const have = new Set((card.swaps || []).map(s => s.key));
  const added = [];
  for (const row of rows) {
    if (have.has(row.key)) continue;
    card.swaps.push(row);
    added.push(row.key);
  }
  fs.writeFileSync(file, JSON.stringify(card, null, 2) + '\n');
  console.log('  ' + template.padEnd(24) + (added.length ? 'added ' + added.join(', ') : 'already had them'));
}

addSwaps('09-atlas-realestate', [
  { key: 'PROJECT_NAME', find: 'Campo Alto', label: 'Development name', maxChars: 22, group: 'details',
    hint: 'The scheme being sold. Defaults to the business name.' },
  { key: 'PLACE_NAME', find: 'Príncipe Real', label: 'District or neighbourhood', maxChars: 24, group: 'details',
    hint: 'Defaults to the city.' }
]);

addSwaps('10-cadence-fashion', [
  { key: 'COLLECTION_CAPS', find: 'SEVERANCE', label: 'Collection name in capitals', maxChars: 18, group: 'details' },
  { key: 'COLLECTION', find: 'Severance', label: 'Collection name', maxChars: 18, group: 'details',
    hint: 'The season or range this page is about.' }
]);
