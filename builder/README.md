# The site builder

Turns a hand-built template into a client's website and gives you a link to
send them.

**Live:** https://website-template-library-pink.vercel.app/build

**On your own machine:**

```
node builder/server.js      then open http://localhost:4180/build
```

## What it does

1. **My sites** — everything built so far.
2. **Pick a template** — live pages, not screenshots, filtered by industry.
3. **Tell us the basics** — the six usual fields, plus whatever figures that
   particular design puts on the page. Only the name is needed.
4. **Preview and correct** — the real page in the middle, controls around it.
5. **Finish** — the link, a copy button and a QR code.

## The parts

| File | What it is |
|---|---|
| `render.js` | Fills a template. Find and replace, nothing else. Also a CLI. |
| `routes.js` | Everything the app answers. Shared by both ways of running it. |
| `store.js` | Saved sites: on disk here, in Vercel Blob when deployed. |
| `portable.js` | The link that carries the whole site inside it. |
| `server.js` | The local server. |
| `../api/app.js` | The same thing on Vercel. |
| `app/index.html` | The interface. |
| `passes/` | The scripts that made each template reusable. |

## Why it is built this way

- **The link works the moment a site is created,** because the route existed
  before the site did. Finish takes milliseconds, not a deploy.
- **The preview iframe loads the published URL** — the same route the
  prospect opens, the same bytes. The preview cannot lie.
- **A saved site is the inputs, never the finished HTML.** Fix a bug in a
  template and every site ever made from it is fixed.
- **Finish writes a new version, never an overwrite.** The last twenty
  versions are kept in the record.
- **Every page carries `noindex`.** A mockup of a real business must never
  turn up in a search result.
- **Every page credits rylolabz.com** in the footer.
- **No AI anywhere in it.** Filling a template is find and replace, a theme
  is a set of CSS variables, and a link is a slug and a route.

## Where sites are kept

Three places, picked automatically:

| | When | Link looks like |
|---|---|---|
| Disk | you run it yourself | `/s/acme-plumbing-4wjk` |
| Vercel Blob | deployed, with a Blob store | `/s/acme-plumbing-4wjk` |
| The link itself | deployed, no store | `/p/dY1BC4IwAEb…` |

The third needs no database at all: the site is squeezed and encoded into
the address. It is longer to look at, never expires, and works before any
storage exists. It is the safety net, not the main road.

## What you can change

**Words** — click any text on the page and type. An edit is stored exactly
like a swap: the text that was there and the text that replaced it. That is
why it survives a re-render.

**Pictures** — click any picture. Search Unsplash and Pexels together, paste
a link, upload a file, or remove the picture altogether. Uploads become data
URIs so the finished site stays one self-contained file.

**Logo** — upload one in the left rail. It replaces the template's mark and
wordmark in both the header and the footer. Tick *the logo already has the
name in it* to hide the text wordmark beside it.

**Theme** — four approved sets of colours per template, hand-picked.

**Colours** — each template says which of its own colours are safe to move by
hand, and what else has to move with them. The four themes are still the safe
answer: they were checked, a hand-picked colour has not been.

**Type** — the typeface for headings and body, the typeface for labels and
figures, and a size for each. Size is arithmetic on the stylesheet, so it
works on any template without that template knowing about it.

**Sections** — hide any section from the right rail, or click one to jump to it.

## Warnings it gives you

- a swap longer than the design allows, before it overflows
- a `find` string that has drifted out of the template, so `swap.json` is stale
- the template's own brand words surviving a render, which means a field was
  left blank and the template's own detail is still on the page
- an edit whose original text is no longer on the page

## Making another template reusable

Write a `swap.json` next to its `index.html`. Nothing in the template itself
has to change unless it carries a claim that would be false for the next
business — that is the copy pass, and `builder/passes/` shows how each of the
eleven was done. A template with a swap card appears in the picker on its own.

A card needs: `palettes` (four named sets of that template's own CSS
variables), `swaps` (exact strings to replace), `images`, `brandTokens` (the
words that must not survive) and optionally `adjust` (which colours can be
moved by hand). See `20-tower-construction/swap.json` for the shape.

## Keys

`builder/.env`, which git ignores:

```
UNSPLASH_ACCESS_KEY=…
PEXELS_API_KEY=…
```

On Vercel the same names are set in the project's environment settings.
