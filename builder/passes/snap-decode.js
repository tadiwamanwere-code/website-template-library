/* snap-decode.js — the browser tool saves a rendered page as a JSON string.
   This turns it back into HTML.
     node builder/passes/snap-decode.js <snap.json> <out.html> */
'use strict';
const fs = require('fs');
const [from, to] = process.argv.slice(2);
fs.writeFileSync(to, JSON.parse(fs.readFileSync(from, 'utf8')));
fs.rmSync(from);
console.log('  ' + Math.round(fs.statSync(to).size / 1024) + 'KB of rendered page');
