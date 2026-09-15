#!/usr/bin/env node
/* =========================================================================
   watch.js — keeps WebForge on duty.

     node builder/webforge/watch.js

   Every 20 seconds it asks the builder for requests left in the AI panel.
   For each one it starts Claude Code with the webforge agent, on whatever
   Claude account this computer is logged into, and waits for it to finish.
   One request at a time, oldest first.

   Leave it running in a terminal. Stop it with Ctrl+C.
   ========================================================================= */

'use strict';

const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const TOOL = path.join(__dirname, 'tool.js');
const EVERY = 20 * 1000;
const LIMIT = 15 * 60 * 1000;

/* Claude Code looks for agents in ~/.claude/agents. Copy ours there, so
   the agent that runs is always the one in this folder. */
function installAgent() {
  const dir = path.join(os.homedir(), '.claude', 'agents');
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(path.join(__dirname, 'agent.md'), path.join(dir, 'webforge.md'));
  fs.mkdirSync(path.join(__dirname, 'work'), { recursive: true });
}

function tool(args) {
  return execFileSync(process.execPath, [TOOL].concat(args), { cwd: ROOT, encoding: 'utf8' });
}

function runAgent(job) {
  return new Promise(resolve => {
    const ask = 'Handle WebForge request ' + job.id + ' for site ' + job.slug + '.';
    const args = ['-p', '--agent', 'webforge',
      '--allowedTools', 'Bash(node builder/webforge/tool.js *)', 'PowerShell(node builder/webforge/tool.js *)', 'Write', 'Read',
      '--', ask];
    /* On Windows claude is a .cmd file, which only starts through a shell,
       and a shell splits arguments at spaces unless they are quoted. */
    const win = process.platform === 'win32';
    const child = win
      ? spawn(['claude'].concat(args.map(a => /[\s()*]/.test(a) ? '"' + a + '"' : a)).join(' '), [],
        { cwd: ROOT, shell: true, stdio: ['ignore', 'pipe', 'pipe'] })
      : spawn('claude', args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    const timer = setTimeout(() => child.kill(), LIMIT);
    child.stdout.on('data', d => process.stdout.write(d));
    child.stderr.on('data', d => process.stderr.write(d));
    child.on('close', code => { clearTimeout(timer); resolve(code); });
    child.on('error', err => { clearTimeout(timer); console.error('Could not start claude: ' + err.message); resolve(1); });
  });
}

/* When the agent stops without replying, the person in the app would wait
   for ever. Say it failed instead. */
function closeIfLeftOpen(job) {
  try {
    const now = JSON.parse(tool(['jobs'])).find(j => j.id === job.id);
    if (now && (now.status === 'waiting' || now.status === 'working')) {
      if (now.status === 'waiting') tool(['claim', job.id]);
      tool(['reply', job.id, 'failed', 'WebForge stopped before it finished. Try again.']);
    }
  } catch (err) { console.error(err.message); }
}

async function loop() {
  let waiting = [];
  try { waiting = JSON.parse(tool(['jobs', 'waiting'])); }
  catch (err) { console.error(new Date().toLocaleTimeString() + '  ' + err.message.split('\n')[0]); }

  for (const job of waiting.sort((a, b) => a.askedAt.localeCompare(b.askedAt))) {
    console.log('\n' + new Date().toLocaleTimeString() + '  ' + job.name + ': ' + job.prompt.slice(0, 120));
    const code = await runAgent(job);
    closeIfLeftOpen(job);
    console.log(new Date().toLocaleTimeString() + '  finished (' + code + ')');
  }
  setTimeout(loop, EVERY);
}

installAgent();
console.log('WebForge is on duty. Checking for requests every 20 seconds. Ctrl+C to stop.');
loop();
