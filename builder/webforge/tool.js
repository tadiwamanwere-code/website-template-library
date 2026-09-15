#!/usr/bin/env node
/* =========================================================================
   tool.js — WebForge's hands on the builder.

   WebForge is a Claude Code agent that runs on this computer, on a Claude
   subscription. It reaches the builder only through these commands, which
   call the builder's /bapi/webforge routes with the AI passcode.

     node builder/webforge/tool.js sites
     node builder/webforge/tool.js jobs [waiting|working|done|failed]
     node builder/webforge/tool.js claim <jobId>
     node builder/webforge/tool.js brief <slug> [jobId]
     node builder/webforge/tool.js apply <slug> <answer.json> [jobId]
     node builder/webforge/tool.js reply <jobId> <done|failed> <message> [question ...]
     node builder/webforge/tool.js undo <slug>

   Which builder: WEBFORGE_URL, else the live one. Passcode:
   BUILDER_AI_PASSCODE from the environment or builder/.env.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

function envFile(name) {
  const file = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(file)) return '';
  const m = fs.readFileSync(file, 'utf8').match(new RegExp('^\\s*' + name + '\\s*=\\s*(.*?)\\s*$', 'm'));
  return m ? m[1].replace(/^["']|["']$/g, '') : '';
}

const BASE = (process.env.WEBFORGE_URL || 'https://website-template-library-pink.vercel.app').replace(/\/+$/, '');
const PASS = process.env.BUILDER_AI_PASSCODE || envFile('BUILDER_AI_PASSCODE');

async function call(route, body, query) {
  const qs = query ? '?' + new URLSearchParams(query).toString() : '';
  const res = await fetch(BASE + route + qs, {
    method: body ? 'POST' : 'GET',
    headers: { 'content-type': 'application/json', 'x-builder-passcode': PASS },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let out;
  try { out = JSON.parse(text); } catch { out = { error: text.slice(0, 300) }; }
  if (!res.ok) throw new Error(res.status + ': ' + (out.error || text.slice(0, 300)));
  return out;
}

const print = v => console.log(typeof v === 'string' ? v : JSON.stringify(v, null, 2));

async function main() {
  const [cmd, a, b, c, ...rest] = process.argv.slice(2);
  if (!PASS) throw new Error('No BUILDER_AI_PASSCODE in the environment or builder/.env.');

  if (cmd === 'sites') {
    const res = await fetch(BASE + '/bapi/sites');
    return print((await res.json()).map(s => ({ slug: s.slug, name: s.name, template: s.template, version: s.version })));
  }
  if (cmd === 'jobs') return print(await call('/bapi/webforge/jobs', null, a ? { status: a } : null));
  if (cmd === 'claim') return print(await call('/bapi/webforge/claim', { id: a }));

  if (cmd === 'brief') {
    const out = await call('/bapi/webforge/brief', null, Object.assign({ slug: a }, b ? { id: b } : {}));
    return print([
      'SITE: ' + out.slug + ' (version ' + out.version + ')',
      'LIVE PAGE: ' + BASE + out.preview,
      '',
      '=== RULES ===', out.rules,
      '',
      '=== ANSWER SHAPE (write this as JSON, then run apply) ===', JSON.stringify(out.answerShape),
      '',
      '=== BRIEF ===', out.brief
    ].join('\n'));
  }

  if (cmd === 'apply') {
    const answer = JSON.parse(fs.readFileSync(b, 'utf8'));
    return print(await call('/bapi/webforge/apply', { slug: a, answer: answer, id: c || undefined }));
  }

  if (cmd === 'reply') {
    return print(await call('/bapi/webforge/reply', { id: a, status: b, reply: c || '', questions: rest }));
  }

  if (cmd === 'undo') return print(await call('/bapi/ai/undo', { slug: a }));

  console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 18).join('\n'));
}

main().catch(err => { console.error('WebForge tool: ' + err.message); process.exit(1); });
