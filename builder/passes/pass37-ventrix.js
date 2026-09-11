/* =========================================================================
   pass37-ventrix.js — turns the scroll-driven parts of the Ventrix clone
   into plain layouts.

   The original moves three sections with script as you scroll: a pile of
   photographs that deals itself into a row, a process that steps through
   three stages, and industry cards that fade in. A template keeps no
   script, so each is set here in its finished position instead. The look
   is the same; it just does not move.

   Run after clone-site.js, before make-card.js:
     node builder/passes/pass37-ventrix.js
   Safe to run twice: it replaces its own block.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const FILE = path.resolve(__dirname, '..', '..', '37-ventrix-capital', 'index.html');

const CSS = `<style id="static-fixes">
/* The page root is drawn 1920px wide and relies on script to fit the
   window. Without it the page scrolls sideways. */
.framer-WTq9T{width:100%!important;min-width:0!important;}
html,body{overflow-x:clip;}
/* The seller's preview card that sat above their buy button. */
.framer-f9ooi8-container{display:none!important;}

/* --- the photo pile: dealt into a row, with the big line above it ----- */
/* The 400px blocks after the pile exist only to give the scroll room. */
.framer-18lrbo8{height:auto!important;min-height:0!important;}
.framer-18lrbo8>div:not(.framer-14aqihm){display:none!important;}
.framer-14aqihm{position:relative!important;top:0!important;height:auto!important;padding-block:48px 120px!important;gap:56px!important;}
.framer-183jqiz{flex-direction:column!important;height:auto!important;gap:48px!important;overflow:visible!important;}
.framer-1ebrxfs{position:relative!important;left:auto!important;top:auto!important;transform:none!important;width:100%!important;}
.framer-1pp4x6n{position:relative!important;top:auto!important;left:auto!important;transform:none!important;order:2!important;height:auto!important;justify-content:center!important;gap:24px!important;flex-wrap:wrap!important;}
.framer-1pp4x6n>.ssr-variant>div,.framer-1pp4x6n>div:not(.ssr-variant){position:relative!important;inset:auto!important;transform:none!important;width:240px!important;height:290px!important;flex:none!important;opacity:1!important;}
.framer-wuj5yy{opacity:1!important;transform:none!important;}

/* --- the process: the first stage, standing still ---------------------- */
.framer-p7ef8m-container{position:relative!important;top:auto!important;}
.framer-ptxx20,.framer-5yuydf,.framer-1o3sr3x{display:none!important;}
.framer-rwdl4k,.framer-1r9q5jb{height:auto!important;min-height:0!important;}
.framer-1234nc2{height:auto!important;padding-bottom:120px!important;}
.framer-ifyxvv{height:auto!important;}


@media (max-width:809px){
  .framer-1pp4x6n>.ssr-variant>div,.framer-1pp4x6n>div:not(.ssr-variant){width:calc(50% - 12px)!important;height:220px!important;}
}
</style>`;

let html = fs.readFileSync(FILE, 'utf8');
html = html.replace(/<style id="static-fixes">[\s\S]*?<\/style>\s*/, '');
html = html.replace('</head>', CSS + '\n</head>');
/* Framer starts its background videos from script. Muted, looping videos
   may start on their own, so the page says so itself. */
html = html.replace(/<video(?![^>]*\sautoplay)/g, '<video autoplay');
fs.writeFileSync(FILE, html);
console.log('  static fixes written into 37-ventrix-capital/index.html');
