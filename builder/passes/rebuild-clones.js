/* =========================================================================
   rebuild-clones.js — builds every cloned template again from its saved
   snapshot.

   A clone is made in three steps: clone-site.js (layout and colours),
   a per-template fix pass where one exists, then clone-specs.js (the copy
   pass and the swap card). When any of those improve, every clone has to be
   made again, and doing it by hand is how one gets left behind.

   The snapshots live outside the repo: they are somebody else's page, and
   only what comes out the far end belongs here.

     node builder/passes/rebuild-clones.js [folder]
   ========================================================================= */

'use strict';

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const HERE = __dirname;
const SNAPS = process.env.CLONE_SNAPSHOTS
  || 'C:/Users/USER/AppData/Local/Temp/claude/c--Users-USER-Desktop-Bmw-and-Benz-Auto-Spares/577a7fb5-fab2-464b-b891-8ebd058f248f/scratchpad';

const CLONES = [
  { folder: '37-ventrix-capital', origin: 'https://ventrix-cap.framer.website/', snap: 'ventrix.html', fix: 'pass37-ventrix.js' },
  { folder: '38-parvis-family-law', origin: 'https://lindsayparvis.com/', snap: 'lindsay.html' },
  { folder: '39-wegner-law', origin: 'https://attorneywegner.com/', snap: 'wegner.html' },
  { folder: '40-connolly-law', origin: 'https://connollylawoffice.com/', snap: 'connolly.html' },
  { folder: '41-hamilton-partners', origin: 'https://www.hamiltonpartners.com/', snap: 'hamilton.html' },
  { folder: '42-jag-capital', origin: 'https://www.jagcap.com/', snap: 'jag.html' },
  { folder: '43-cermak-legal', origin: 'https://www.cermaklegal.com/', snap: 'cermak.html' },
  { folder: '44-berch-construction', origin: 'https://www.berch.ch/', snap: 'berch.html' }
];

const only = process.argv[2];
const run = (file, args) => process.stdout.write(execFileSync(process.execPath, [path.join(HERE, file)].concat(args), { encoding: 'utf8' }));

let done = 0, skipped = [];
for (const c of CLONES.filter(c => !only || c.folder === only)) {
  const snap = path.join(SNAPS, c.snap);
  if (!fs.existsSync(snap)) { skipped.push(c.folder + ' (no snapshot at ' + snap + ')'); continue; }
  console.log('======== ' + c.folder);
  run('clone-site.js', [c.folder, c.origin, snap]);
  if (c.fix) run(c.fix, []);
  run('clone-specs.js', [c.folder]);
  done++;
}
console.log('\n  ' + done + ' rebuilt' + (skipped.length ? ', ' + skipped.length + ' skipped:\n    ' + skipped.join('\n    ') : ''));
