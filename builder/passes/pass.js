/* Shared helper for the universal copy passes.

   Each pass is a list of exact substitutions with an expected hit count, so
   a template that has drifted fails loudly instead of quietly doing nothing.
   Whitespace between words is matched loosely, because the line wrapping in
   a template is whatever the formatter left there.

   Misses are collected rather than thrown, so one run tells you everything
   that needs fixing instead of the first thing. Nothing is written unless
   every substitution landed. */

'use strict';
const fs = require('fs');

module.exports = function pass(file, build) {
  let s = fs.readFileSync(file, 'utf8');
  const misses = [];
  let done = 0;
  let step = 0;

  function sub(a, b, expect) {
    step++;
    expect = expect === undefined ? 1 : expect;
    const pattern = String(a).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    const re = new RegExp(pattern, 'g');
    const hits = (s.match(re) || []).length;
    if (hits !== expect) {
      misses.push('[' + step + '] wanted ' + expect + ', found ' + hits + ' -- ' + String(a).replace(/\s+/g, ' ').slice(0, 96));
      return;
    }
    if (expect === 0) { done++; return; }
    s = s.replace(re, function () { return b; });
    done++;
  }

  /* Take out a whole block, from the opening marker to the end of the
     closing one. Used for things like a scrolling strip that goes entirely. */
  function cut(startMark, endMark) {
    step++;
    const i = s.indexOf(startMark);
    const j = i === -1 ? -1 : s.indexOf(endMark, i);
    if (i === -1 || j === -1) { misses.push('[' + step + '] cut failed -- ' + startMark.slice(0, 60)); return; }
    s = s.slice(0, i) + s.slice(j + endMark.length);
    done++;
  }

  function has(text) { return s.indexOf(text) !== -1; }
  function count(text) { return s.split(text).length - 1; }

  build({ sub: sub, cut: cut, has: has, count: count, get text() { return s; } });

  const name = file.split(/[\\/]/).slice(-2)[0];
  if (misses.length) {
    console.log(name + ': NOT WRITTEN. ' + done + ' of ' + step + ' landed, ' + misses.length + ' missed:');
    misses.forEach(function (m) { console.log('  ' + m); });
    process.exitCode = 1;
    return;
  }
  fs.writeFileSync(file, s);
  console.log(name + ': ' + done + ' edits, written.');
};
