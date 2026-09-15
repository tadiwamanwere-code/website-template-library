/* =========================================================================
   routes.js — everything the builder answers, in one place.

   The same handler runs on your machine (builder/server.js) and on Vercel
   (api/app.js). One copy, so the app cannot behave differently in the two
   places, which is the same reason there is only one render().

     /build                the app
     /bapi/templates       what can be built from
     /bapi/fonts           the typefaces on offer
     /bapi/photos          picture search, through Unsplash and Pexels
     /bapi/sites           saved sites: list, create
     /bapi/sites/:slug     one site: read, delete (delete needs the key)
     /bapi/leads           a site made straight from a CRM lead (UtahOp)
     /s/:slug              a saved site, rendered
     /p/:payload           a site carried inside its own link

   The API sits under /bapi and not /api so that Vercel does not confuse it
   with the folder that holds the function itself.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');
const { render, deriveSwaps, listTemplates, loadTemplate, fontList, headBlock, HIDE } = require('./render.js');
const store = require('./store.js');
const portable = require('./portable.js');
const leads = require('./leads.js');
const ai = require('./ai.js');
const aiSite = require('./ai-site.js');

const APP = path.join(__dirname, 'app', 'index.html');

/* ------------------------------------------------------------------- env
   Keys live in builder/.env, which git ignores. On Vercel they come from
   the project's environment settings instead. */

function loadEnv() {
  const file = path.join(__dirname, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, '');
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}
loadEnv();

const UNSPLASH = process.env.UNSPLASH_ACCESS_KEY || process.env.VITE_UNSPLASH_ACCESS_KEY || '';
const PEXELS = process.env.PEXELS_API_KEY || '';
/* The shared secret UtahOp sends with a lead. No key set means the door is
   shut, not open: anyone could otherwise fill the store with sites. */
const LEADS_KEY = process.env.BUILDER_API_KEY || '';
/* The AI spends money on every request, and /build has no login, so the
   AI routes want a passcode the app asks for once. UtahOp's key works too. */
const AI_PASSCODE = process.env.BUILDER_AI_PASSCODE || '';
function aiAllowed(req) {
  const auth = String(req.headers.authorization || '');
  if (LEADS_KEY && auth === 'Bearer ' + LEADS_KEY) return true;
  return !!AI_PASSCODE && String(req.headers['x-builder-passcode'] || '') === AI_PASSCODE;
}

/* ---------------------------------------------------------------- replies */

function send(res, code, body, type) {
  res.writeHead(code, {
    'Content-Type': type || 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

const json = (res, code, obj) => send(res, code, JSON.stringify(obj, null, 2), 'application/json; charset=utf-8');

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);   // Vercel parses it for us
    let raw = '';
    req.on('data', c => {
      raw += c;
      if (raw.length > 8e6) { reject(new Error('Too big')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

/* -------------------------------------------------------------- the site --
   One rendering path. The preview and the published page both come through
   here, so they are the same HTML by construction. */

function buildSite(record) {
  const filled = deriveSwaps(record.template, record.swaps || {});
  return render(record.template, filled, record.theme, {
    noindex: true,                    // a mockup of a real business must never be indexed
    edits: record.edits || [],
    style: record.style || {}
  });
}

/* ---------------------------------------------------------------- pictures
   Two libraries, searched together and proxied so the keys never reach the
   browser. Unsplash asks that a download is registered when a photo is
   actually used, which is what /bapi/photos/use does. */

async function fromUnsplash(query, page, orientation) {
  if (!UNSPLASH) return [];
  const url = 'https://api.unsplash.com/search/photos'
    + '?query=' + encodeURIComponent(query)
    + '&per_page=18&page=' + (Number(page) || 1)
    + (orientation ? '&orientation=' + encodeURIComponent(orientation) : '');

  const res = await fetch(url, { headers: { Authorization: 'Client-ID ' + UNSPLASH, 'Accept-Version': 'v1' } });
  if (!res.ok) return [];
  const body = await res.json();

  return (body.results || []).map(p => ({
    id: 'u-' + p.id,
    source: 'unsplash',
    thumb: p.urls && p.urls.small,
    /* w=2000 is enough for a hero on a 2x screen and keeps the page light */
    full: p.urls && (p.urls.raw ? p.urls.raw + '&auto=format&fit=crop&w=2000&q=80' : p.urls.regular),
    alt: p.alt_description || p.description || '',
    by: p.user && p.user.name,
    download: p.links && p.links.download_location
  }));
}

async function fromPexels(query, page, orientation) {
  if (!PEXELS) return [];
  const url = 'https://api.pexels.com/v1/search'
    + '?query=' + encodeURIComponent(query)
    + '&per_page=18&page=' + (Number(page) || 1)
    + (orientation ? '&orientation=' + encodeURIComponent(orientation) : '');

  const res = await fetch(url, { headers: { Authorization: PEXELS } });
  if (!res.ok) return [];
  const body = await res.json();

  return (body.photos || []).map(p => ({
    id: 'p-' + p.id,
    source: 'pexels',
    thumb: p.src && p.src.medium,
    full: p.src && (p.src.large2x || p.src.large),
    alt: p.alt || '',
    by: p.photographer,
    download: null                    // Pexels asks for a credit, not a ping
  }));
}

/* Both libraries, shuffled together a few at a time, so one of them does not
   fill the whole panel. */
/* Unsplash asks for a ping when one of its photos is used. */
function usePhoto(download) {
  if (UNSPLASH && download && /^https:\/\/api\.unsplash\.com\//.test(download)) {
    fetch(download, { headers: { Authorization: 'Client-ID ' + UNSPLASH } }).catch(function () { });
  }
}

async function searchPhotos(query, page, orientation) {
  if (!UNSPLASH && !PEXELS) {
    return { error: 'No photo library keys set. Add UNSPLASH_ACCESS_KEY or PEXELS_API_KEY to builder/.env', results: [] };
  }
  const [a, b] = await Promise.all([
    fromUnsplash(query, page, orientation).catch(() => []),
    fromPexels(query, page, orientation).catch(() => [])
  ]);

  const mixed = [];
  for (let i = 0; i < Math.max(a.length, b.length); i += 3) {
    mixed.push(...a.slice(i, i + 3), ...b.slice(i, i + 3));
  }
  if (!mixed.length) return { error: 'Nothing came back from the photo libraries.', results: [] };
  return { total: mixed.length, results: mixed };
}

/* ------------------------------------------------------------------ routes */

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');

  /* Vercel rewrites everything to this one function and hands the original
     path across in ?p=. On your own machine there is no rewrite, so the URL
     is already the real one. */
  const asked = url.searchParams.get('p') || url.pathname;
  const route = decodeURIComponent(asked).replace(/\/+$/, '') || '/';
  const method = (req.method || 'GET').toUpperCase();

  /* ---- the app ---- */
  if (route === '/build' || route === '/build/index.html') {
    return send(res, 200, fs.readFileSync(APP), 'text/html; charset=utf-8');
  }

  /* ---- what can we build from ---- */
  if (route === '/bapi/templates') {
    const rows = listTemplates().map(t => {
      const { card } = loadTemplate(t.template);
      return Object.assign({}, t, {
        fields: (card.swaps || []).map(s => ({
          key: s.key, label: s.label, maxChars: s.maxChars || null,
          type: s.type || 'text', optional: !!s.optional, hint: s.hint || null,
          /* only fields a template explicitly puts in the details group
             show up on the form; everything else is edited by clicking it */
          group: s.group || null
        })),
        images: (card.images || []).map(i => ({
          key: i.key, label: i.label, kind: i.kind || 'photo',
          ratio: i.ratio || null, hint: i.hint || null,
          search: i.search || null,
          /* the URL the template ships with, so the preview can tell which
             slot an image on screen belongs to */
          value: i.format ? null : (Array.isArray(i.find) ? i.find[0] : i.find)
        })),
        adjust: Object.keys(card.adjust || {}).map(k => ({
          key: k, label: card.adjust[k].label || k, cssVar: card.adjust[k].var || k
        }))
      });
    });
    return json(res, 200, rows);
  }

  /* ---- which template suits this business ------------------------------
     The CRM asks this before it makes anything, so a rep can see what the
     system would choose, and every other design it could have chosen, with
     the reason beside each. Same key as /bapi/leads: it answers questions
     about the library, and only the agency's own CRM may ask.
     GET /bapi/suggest?trade=law-firm&group=Professional+services&name=… */
  if (route === '/bapi/suggest') {
    if (!LEADS_KEY) return json(res, 503, { error: 'BUILDER_API_KEY is not set on the builder' });
    if (String(req.headers.authorization || '') !== 'Bearer ' + LEADS_KEY) {
      return json(res, 401, { error: 'Wrong or missing key' });
    }
    const q = url.searchParams;
    const lead = {
      trade: q.get('trade') || '',
      tradeGroup: q.get('group') || '',
      organisation: q.get('name') || '',
      sellingPoint: q.get('note') || ''
    };
    const ranked = leads.rankTemplates(lead);
    const best = leads.pickTemplate(lead);
    return json(res, 200, {
      pick: best.template,
      why: best.why,
      templates: ranked.map(t => ({
        template: t.template,
        title: t.title,
        industry: t.industry,
        covers: t.covers,
        why: t.why,
        /* Not a score out of a hundred, and not shown as one. It is here so
           the CRM can tell a real match from the tail of the list. */
        score: t.score,
        fits: t.score > 0,
        preview: '/' + t.template + '/index.html',
        recommended: t.template === best.template
      }))
    });
  }

  if (route === '/bapi/fonts') return json(res, 200, fontList());

  /* ---- the look, on its own -------------------------------------------
     A theme, a colour, a typeface and a hidden section are all one block of
     CSS at the end of <head>. Asking for just that block lets the preview
     change instantly instead of reloading the whole page, and because it is
     the same headBlock() the published page uses, the two cannot drift. */
  if (route === '/bapi/style' && method === 'POST') {
    const b = await readBody(req);
    let card;
    try { card = loadTemplate(b.template).card; }
    catch (e) { return json(res, 400, { error: String(e.message || e) }); }

    const swaps = b.swaps || {};
    const slots = new Set((card.images || []).map(function (i) { return i.key; }));
    const hidden = Object.keys(swaps).filter(function (k) {
      return slots.has(k) && String(swaps[k]).trim() === HIDE;
    });
    return json(res, 200, { head: headBlock(card, b.theme, b.style || {}, hidden) });
  }

  /* ---- what this deployment can do, so the app can be honest about it ---- */
  if (route === '/bapi/env') {
    return json(res, 200, {
      storage: store.DRIVER,
      photos: !!(UNSPLASH || PEXELS),
      shortLinks: store.DRIVER === 'blob' || !process.env.VERCEL
    });
  }

  /* ---- pictures ---- */
  if (route === '/bapi/photos') {
    const q = (url.searchParams.get('q') || '').trim();
    if (!q) return json(res, 200, { results: [] });
    return json(res, 200, await searchPhotos(q, url.searchParams.get('page'), url.searchParams.get('orientation')));
  }

  /* ---- the AI ----
     status says whether a key is set and which model answers. POST /bapi/ai
     takes { slug, prompt }, lets the model change the site, and saves the
     result as a new version. /bapi/ai/undo puts the version before back. */
  if (route === '/bapi/ai/status') return json(res, 200, ai.status());

  if (route === '/bapi/ai' && method === 'POST') {
    if (!aiAllowed(req)) return json(res, 401, { error: 'The AI needs its passcode.' });
    const b = await readBody(req);
    const record = b.slug ? await store.read(b.slug) : null;
    if (!record) return json(res, 404, { error: 'Save the site first.' });
    const prompt = String(b.prompt || '').trim().slice(0, 3000);
    if (!prompt) return json(res, 400, { error: 'Say what you want changed.' });
    try {
      const out = await aiSite.improve(record, prompt, { searchPhotos: searchPhotos, usePhoto: usePhoto });
      const log = (record.aiLog || []).concat([{ at: new Date().toISOString(), prompt: prompt, summary: out.summary }]).slice(-30);
      const saved = await store.write(Object.assign({}, out.draft, { slug: record.slug, aiLog: log }));
      const { warnings } = buildSite(saved);
      return json(res, 200, { summary: out.summary, questions: out.questions, done: out.done,
        skipped: out.skipped, version: saved.version, warnings: warnings });
    } catch (err) {
      const known = err instanceof ai.AiError;
      if (!known) console.error('[ai]', err);
      return json(res, known ? 502 : 500, { error: known ? err.message : 'The AI step failed. Try again.' });
    }
  }

  if (route === '/bapi/ai/undo' && method === 'POST') {
    if (!aiAllowed(req)) return json(res, 401, { error: 'The AI needs its passcode.' });
    const b = await readBody(req);
    const record = b.slug ? await store.read(b.slug) : null;
    const prev = record && (record.history || []).slice(-1)[0];
    if (!prev) return json(res, 404, { error: 'There is no earlier version to go back to.' });
    const saved = await store.write({ slug: record.slug, theme: prev.theme, swaps: prev.swaps || {},
      edits: prev.edits || [], style: prev.style || {} });
    return json(res, 200, { version: saved.version });
  }

  /* ---- WebForge ----
     An agent that runs on someone's own computer, on their Claude
     subscription. The app leaves a request here. The agent claims it, reads
     the brief, sends changes back, and leaves a reply. Its changes go
     through the same checks as the built-in AI, so it cannot write HTML or
     put a line on the page that was not asked for. */
  if (route.startsWith('/bapi/webforge/')) {
    if (!aiAllowed(req)) return json(res, 401, { error: 'WebForge needs the AI passcode.' });
    const b = method === 'POST' ? await readBody(req) : {};
    const jobs = await store.readJobs();
    const job = id => jobs.find(j => j.id === String(id || ''));

    if (route === '/bapi/webforge/ask' && method === 'POST') {
      const record = b.slug ? await store.read(b.slug) : null;
      if (!record) return json(res, 404, { error: 'Save the site first.' });
      const prompt = String(b.prompt || '').trim().slice(0, 3000);
      if (!prompt) return json(res, 400, { error: 'Say what you want changed.' });
      const j = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), slug: record.slug,
        name: (record.swaps && record.swaps.BUSINESS_NAME) || record.slug, prompt: prompt,
        status: 'waiting', askedAt: new Date().toISOString() };
      await store.writeJobs(jobs.concat([j]));
      return json(res, 200, j);
    }

    if (route === '/bapi/webforge/jobs') {
      const slug = url.searchParams.get('slug');
      const status = url.searchParams.get('status');
      return json(res, 200, jobs.filter(j => (!slug || j.slug === slug) && (!status || j.status === status)));
    }

    if (route === '/bapi/webforge/claim' && method === 'POST') {
      const j = job(b.id);
      if (!j) return json(res, 404, { error: 'No such request.' });
      if (j.status !== 'waiting') return json(res, 409, { error: 'That request is already ' + j.status + '.' });
      j.status = 'working';
      j.startedAt = new Date().toISOString();
      await store.writeJobs(jobs);
      return json(res, 200, j);
    }

    if (route === '/bapi/webforge/brief') {
      const slug = url.searchParams.get('slug');
      const record = slug ? await store.read(slug) : null;
      if (!record) return json(res, 404, { error: 'No such site.' });
      const j = job(url.searchParams.get('id'));
      const prompt = j ? j.prompt : String(url.searchParams.get('prompt') || '');
      const p = aiSite.prepare(record, prompt);
      return json(res, 200, { slug: record.slug, version: record.version, preview: '/s/' + record.slug,
        rules: aiSite.RULES, answerShape: aiSite.SCHEMA, brief: p.brief });
    }

    if (route === '/bapi/webforge/apply' && method === 'POST') {
      const record = b.slug ? await store.read(b.slug) : null;
      if (!record) return json(res, 404, { error: 'No such site.' });
      const answer = b.answer || {};
      const j = job(b.id);
      const prompt = j ? j.prompt : String(b.prompt || '');
      try {
        const out = await aiSite.apply(record, aiSite.prepare(record, prompt), {
          summary: answer.summary || '', fields: answer.fields || [], textEdits: answer.textEdits || [],
          pictures: answer.pictures || [], theme: answer.theme || '', questions: answer.questions || []
        }, prompt, { searchPhotos: searchPhotos, usePhoto: usePhoto });
        const log = (record.aiLog || []).concat([{ at: new Date().toISOString(), by: 'webforge', prompt: prompt, summary: out.summary }]).slice(-30);
        const saved = await store.write(Object.assign({}, out.draft, { slug: record.slug, aiLog: log }));
        const { warnings } = buildSite(saved);
        return json(res, 200, { version: saved.version, done: out.done, skipped: out.skipped, warnings: warnings });
      } catch (err) {
        console.error('[webforge]', err);
        return json(res, 500, { error: String(err.message || err) });
      }
    }

    if (route === '/bapi/webforge/reply' && method === 'POST') {
      const j = job(b.id);
      if (!j) return json(res, 404, { error: 'No such request.' });
      j.status = b.status === 'failed' ? 'failed' : 'done';
      j.reply = String(b.reply || '').slice(0, 4000);
      j.questions = (Array.isArray(b.questions) ? b.questions : []).map(String).slice(0, 8);
      j.finishedAt = new Date().toISOString();
      await store.writeJobs(jobs);
      return json(res, 200, j);
    }

    return json(res, 404, { error: 'No such WebForge route.' });
  }

  if (route === '/bapi/photos/use' && method === 'POST') {
    const b = await readBody(req);
    /* Unsplash asks for this ping when a photo is actually used. It is a
       condition of the free API, so it is not optional. */
    if (UNSPLASH && b.download && /^https:\/\/api\.unsplash\.com\//.test(b.download)) {
      try { await fetch(b.download, { headers: { Authorization: 'Client-ID ' + UNSPLASH } }); } catch { }
    }
    return json(res, 200, { ok: true });
  }

  /* ---- saved sites ---- */
  if (route === '/bapi/sites' && method === 'GET') {
    const all = await store.list();
    return json(res, 200, all.map(s => ({
      slug: s.slug,
      name: (s.swaps && s.swaps.BUSINESS_NAME) || 'Untitled',
      template: s.template, theme: s.theme, status: s.status,
      version: s.version, updatedAt: s.updatedAt, url: '/s/' + s.slug
    })));
  }

  if (route === '/bapi/sites' && method === 'POST') {
    const b = await readBody(req);
    if (!b.template) return json(res, 400, { error: 'template is required' });

    const draft = {
      template: b.template,
      theme: b.theme || null,
      swaps: b.swaps || {},
      edits: b.edits || [],
      style: b.style || {},
      notes: b.notes || '',
      status: b.status || 'draft'
    };

    /* The link that always works, whatever storage exists. */
    let link = null;
    try { if (portable.fits(draft)) link = '/p/' + portable.encode(draft); } catch { }

    let record = null;
    let saveError = null;
    try {
      const slug = b.slug && (await store.read(b.slug))
        ? b.slug
        : store.slugify((b.swaps && b.swaps.BUSINESS_NAME) || b.template);
      record = await store.write(Object.assign({ slug }, draft));
    } catch (err) {
      saveError = String((err && err.message) || err);
    }

    const { warnings } = buildSite(record || draft);
    return json(res, 200, {
      slug: record ? record.slug : null,
      url: record ? '/s/' + record.slug : link,
      portable: link,
      version: record ? record.version : null,
      saveError,
      warnings
    });
  }

  if (route.startsWith('/bapi/sites/')) {
    const slug = route.slice('/bapi/sites/'.length);
    /* Deleting needs the same key as the CRM. The app never deletes, so
       nothing a person does in it is lost by this; a stranger with a slug
       can no longer take a client's site down. */
    if (method === 'DELETE') {
      if (!LEADS_KEY || String(req.headers.authorization || '') !== 'Bearer ' + LEADS_KEY) {
        return json(res, 401, { error: 'Wrong or missing key' });
      }
      return json(res, 200, { deleted: await store.remove(slug) });
    }
    const record = await store.read(slug);
    if (!record) return json(res, 404, { error: 'No such site' });
    return json(res, 200, record);
  }

  /* ---- a site made from a CRM lead ----
     UtahOp posts the lead; this picks the template from the trade, fills the
     fields, saves it and answers with the link. Posting again with the slug
     it got back updates that same site. */
  if (route === '/bapi/leads' && method === 'POST') {
    if (!LEADS_KEY) return json(res, 503, { error: 'BUILDER_API_KEY is not set on the builder' });
    if (String(req.headers.authorization || '') !== 'Bearer ' + LEADS_KEY) {
      return json(res, 401, { error: 'Wrong or missing key' });
    }

    const b = await readBody(req);
    const lead = b.lead || {};
    if (!(lead.organisation || lead.name)) return json(res, 400, { error: 'The lead has no name' });

    const known = new Set(listTemplates().map(t => t.template));
    const pick = b.template && known.has(b.template)
      ? { template: b.template, why: 'chosen by hand' }
      : leads.pickTemplate(lead);

    /* A remake keeps what a person already changed in the app: the theme,
       the edits, the pictures. Only the CRM's own facts are refreshed. */
    const old = b.slug ? await store.read(b.slug) : null;
    const same = old && old.template === pick.template ? old : null;
    /* Only the fields this design has. A pharmacy page with no email line
       would otherwise warn about the email on every lead. */
    const fields = new Set((loadTemplate(pick.template).card.swaps || []).map(s => s.key));
    const facts = leads.swapsFor(lead);
    for (const k of Object.keys(facts)) if (!fields.has(k)) delete facts[k];
    const draft = {
      template: pick.template,
      theme: same ? same.theme : null,
      swaps: Object.assign({}, same ? same.swaps : {}, facts),
      edits: same ? same.edits || [] : [],
      style: same ? same.style || {} : {},
      notes: old ? old.notes || '' : leads.notesFor(lead),
      status: old ? old.status || 'draft' : 'draft',
      lead: { source: 'utahop', id: lead.id || null },
      /* What LeadForge and the rep know, kept for the AI to work from. It
         never reaches the page on its own. */
      context: leads.contextFor(lead)
    };

    let record;
    try {
      record = await store.write(Object.assign({ slug: old ? old.slug : store.slugify(draft.swaps.BUSINESS_NAME) }, draft));
    } catch (err) {
      return json(res, 500, { error: 'Could not save: ' + String((err && err.message) || err) });
    }
    const { warnings } = buildSite(record);
    return json(res, 200, {
      slug: record.slug,
      url: '/s/' + record.slug,
      editUrl: '/build?site=' + encodeURIComponent(record.slug),
      template: pick.template,
      why: pick.why,
      /* What else would have suited, so the CRM can offer a swap on the spot
         instead of sending the rep back to ask. */
      alternatives: leads.rankTemplates(lead)
        .filter(t => t.template !== pick.template && t.score > 0)
        .slice(0, 6)
        .map(t => ({ template: t.template, title: t.title, industry: t.industry, why: t.why })),
      version: record.version,
      warnings
    });
  }

  /* ---- a saved site ---- */
  if (route.startsWith('/s/')) {
    const record = await store.read(route.slice(3));
    if (!record) return send(res, 404, notFound(route), 'text/html; charset=utf-8');
    return send(res, 200, buildSite(record).html, 'text/html; charset=utf-8');
  }

  /* ---- a site carried inside its own link ---- */
  if (route.startsWith('/p/')) {
    try {
      const record = portable.decode(route.slice(3));
      return send(res, 200, buildSite(record).html, 'text/html; charset=utf-8');
    } catch {
      return send(res, 400, notFound('that link'), 'text/html; charset=utf-8');
    }
  }

  return null;                       // not ours; the caller decides what to do
}

function notFound(what) {
  return '<!doctype html><meta charset="utf-8"><title>Not found</title>'
    + '<body style="margin:0;background:#0d0f12;color:#e8eaee;font:14px ui-monospace,SFMono-Regular,Menlo,monospace">'
    + '<div style="padding:40px;max-width:640px">'
    + '<p style="letter-spacing:.2em;text-transform:uppercase;font-size:11px;color:#7d8794">404</p>'
    + '<p style="font-size:18px;margin:14px 0 0">Nothing at ' + String(what).replace(/[<&]/g, '') + '</p>'
    + '<p style="margin-top:20px"><a href="/build" style="color:#8fb4f0">Back to the builder</a></p>'
    + '</div>';
}

module.exports = { handle, buildSite, notFound, send, json };
