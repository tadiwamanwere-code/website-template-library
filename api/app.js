/* =========================================================================
   api/app.js — the builder, running on Vercel.

   Vercel serves every static file in the repo itself, so this function only
   has to answer the moving parts. vercel.json sends it four things:

     /build        the app
     /bapi/*       its API
     /s/*          a saved site
     /p/*          a site carried inside its own link

   It is the same routes.js the local server uses. One copy, so a page
   cannot come out differently in the two places.
   ========================================================================= */

'use strict';

const { handle, notFound, send } = require('../builder/routes.js');

module.exports = async function (req, res) {
  try {
    const answered = await handle(req, res);
    if (answered === null) {
      return send(res, 404, notFound(req.url || ''), 'text/html; charset=utf-8');
    }
  } catch (err) {
    return send(res, 500, JSON.stringify({ error: String((err && err.message) || err) }), 'application/json; charset=utf-8');
  }
};
