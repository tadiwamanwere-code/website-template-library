/* =========================================================================
   ai.js — one place the builder talks to a language model.

   Two ways to power it, picked from what the server has:

     ANTHROPIC_API_KEY   Claude (claude-opus-5). The best writer of the two,
                         and the one to use when the key exists.
     GEMINI_API_KEY_1-3  Google Gemini, the same keys UtahOp already uses, so
                         the builder works on the day it is switched on.

   A Claude subscription (Pro or Max) cannot power this. A subscription is
   for a person using the Claude apps; a server needs an API key from
   console.anthropic.com, billed per use.

   Every call asks for JSON that matches a schema and gets parsed JSON back,
   or throws an error whose message a person can act on.
   ========================================================================= */

'use strict';

const CLAUDE_MODEL = 'claude-opus-5';

/* Gemini models to try in order. A list because one pinned id dies when
   Google retires it, and one alias fails under load: UtahOp measured both. */
const GEMINI_MODELS = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest'];

function provider() {
  const anthropic = (process.env.ANTHROPIC_API_KEY || '').trim();
  if (anthropic) return { name: 'claude', key: anthropic, model: CLAUDE_MODEL };
  const gemini = [1, 2, 3].map(n => (process.env['GEMINI_API_KEY_' + n] || '').trim()).filter(Boolean);
  if (gemini.length) return { name: 'gemini', keys: gemini, model: GEMINI_MODELS[0] };
  return null;
}

class AiError extends Error {}

/* ------------------------------------------------------------------ Claude */

async function askClaude(p, system, user, schema) {
  const mod = require('@anthropic-ai/sdk');
  const Anthropic = mod.default || mod;
  const client = new Anthropic({ apiKey: p.key });

  let response;
  try {
    response = await client.beta.messages.create({
      model: p.model,
      max_tokens: 16000,
      /* Declined requests are re-run server-side on Anthropic's recommended
         model for that kind of decline, instead of coming back empty. */
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      thinking: { type: 'adaptive' },
      output_config: { format: { type: 'json_schema', schema: schema } },
      /* The rules never change between requests, so they are cached. */
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: user }]
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) throw new AiError('The Anthropic API key was rejected.');
    if (err instanceof Anthropic.RateLimitError) throw new AiError('The AI is rate limited right now. Try again in a minute.');
    if (err instanceof Anthropic.APIError) throw new AiError('The AI failed (' + err.status + '). Try again.');
    throw new AiError('Could not reach the AI. Try again.');
  }

  if (response.stop_reason === 'refusal') throw new AiError('The AI declined that request.');
  if (response.stop_reason === 'max_tokens') throw new AiError('The AI ran out of room. Ask for fewer changes at once.');
  const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
  return parse(text);
}

/* ------------------------------------------------------------------ Gemini */

async function askGemini(p, system, user, schema) {
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: [{ text: user + '\n\nReply with JSON only, matching this schema:\n' + JSON.stringify(schema) }] }],
    /* Gemini's thinking is charged against the output cap but is not part of
       the reply, so the cap has room for both. */
    generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 16000 }
  });

  let last = 'no attempt was made';
  for (const model of GEMINI_MODELS) {
    for (const key of p.keys) {
      let res;
      try {
        res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body: body
        });
      } catch (e) { last = 'network'; continue; }
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        const text = ((json.candidates || [])[0]?.content?.parts || []).map(x => x.text || '').join('');
        return parse(text);
      }
      last = res.status + ' ' + ((json.error && json.error.message) || '');
      if (res.status === 401 || res.status === 403) break;          // this key is bad; the next may not be
      if (res.status === 400) throw new AiError('The AI could not read that request.');
    }
  }
  if (/^429/.test(last)) throw new AiError('The AI is rate limited right now. Try again in a minute.');
  throw new AiError('The AI is busy or unavailable (' + last.slice(0, 60) + '). Try again in a minute.');
}

/* ------------------------------------------------------------------ shared */

function parse(text) {
  const clean = String(text || '').trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
  try { return JSON.parse(clean); } catch { }
  const block = clean.match(/\{[\s\S]*\}/);
  if (block) { try { return JSON.parse(block[0]); } catch { } }
  throw new AiError('The AI answered, but not in a form the builder can use. Try again.');
}

async function ask(system, user, schema) {
  const p = provider();
  if (!p) throw new AiError('No AI key is set on the builder. Add ANTHROPIC_API_KEY or GEMINI_API_KEY_1.');
  return p.name === 'claude' ? askClaude(p, system, user, schema) : askGemini(p, system, user, schema);
}

function status() {
  const p = provider();
  return p ? { enabled: true, provider: p.name, model: p.model } : { enabled: false };
}

module.exports = { ask, status, AiError };
