# The site builder

Turns a hand-built template into a client's website and gives you a link to
send them.

```
node builder/server.js      then open http://localhost:4180
```

## What it does

1. **My sites** — everything built so far.
2. **Pick a template** — live pages, not screenshots.
3. **Tell us the basics** — six fields and a notes box. Only the name is needed.
4. **Preview and correct** — the real page in the middle, with the controls
   around it.
5. **Finish** — the link, a copy button and a QR code.

## The parts

| File | What it is |
|---|---|
| `render.js` | Fills a template. Find and replace, nothing else. Also a CLI. |
| `store.js` | Saved sites, one JSON file each, in `builder/sites/`. |
| `server.js` | The app, and `/s/:slug` which serves the sites. |
| `app/index.html` | The interface. |

## Why it is built this way

- **The link works the moment a site is created,** because the route existed
  before the site did. Finish takes milliseconds, not a deploy.
- **The preview iframe loads `/s/:slug`** — the same route the prospect opens,
  the same bytes. The preview cannot lie about what gets published.
- **A saved site is the inputs, never the finished HTML.** Fix a bug in a
  template and every site ever made from it is fixed. The HTML is rebuilt on
  every request and can be thrown away.
- **Finish writes a new version, never an overwrite.** The last twenty
  versions are kept in the record.
- **Every page carries `noindex`.** A mockup of a real business must never
  turn up in a search result.
- **No AI anywhere in it.** Filling a template is find and replace, a theme is
  six CSS variables, and a link is a slug and a route. Nothing here needs
  judgement, so nothing here asks a model.

## What you can change

**Words** — click any text on the page and type. An edit is stored exactly
like a swap: the text that was there and the text that replaced it. That is
why it survives a re-render.

**Pictures** — click any picture. Paste a link, or upload a file. Uploads
become data URIs so the finished site stays one self-contained file.

**Logo** — upload one in the left rail. It replaces the template's mark in
both the header and the footer. Tick *the logo already has the name in it* to
hide the text wordmark beside it.

**Theme** — four approved sets of six colours per template.

**Colours** — any of the six can be set by hand if the four presets are not
right. The four presets are still the safe answer: they were checked for
contrast, a hand-picked colour has not been.

**Type** — the typeface for headings and body, the typeface for labels and
figures, and a size for each. The families are a fixed list on purpose, the
same reason there are four themes and not a colour picker.

**Sections** — hide any section from the right rail, or click one to jump to it.

## Warnings it gives you

- a swap that is longer than the design allows, before it overflows
- a `find` string that has drifted out of the template, so `swap.json` is stale
- the template's own brand words surviving a render, which means a swap was
  missed
- an edit whose original text is no longer on the page, so it could not be
  re-applied

## Not done yet

- This runs on your machine. Putting it online, so a prospect can open the
  link from anywhere, is a Cloudflare Worker plus R2 or KV — the same two
  routes, about thirty lines. See `MASTER_PROMPT.md` §4.4.
- Only `20-tower-construction` has a swap card so far, so it is the only
  template in the picker. Each one that gets the pass in
  `UNIVERSAL_COPY_RULES.md` appears here automatically.
