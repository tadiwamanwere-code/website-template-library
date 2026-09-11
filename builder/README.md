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
| `schemes.js` | The colour schemes every template can wear. |
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

**Pictures** — click any picture, or pick it from the list on the right.
Search Unsplash and Pexels together, paste a link, upload a file, or remove
the picture altogether. An upload is redrawn at the size the page can use —
1800px for a photograph, 900px for a logo — so a photo straight off a phone
is fine and file size is not something you have to think about. They become
data URIs, so the finished site stays one self-contained file.

**Logo** — upload one in the left rail. It replaces the template's mark and
wordmark in both the header and the footer. Tick *the logo already has the
name in it* to hide the text wordmark beside it.

**Theme** — thirteen to seventeen per template, in two lists. The top few were
drawn for that page by the person who made it. The rest are shared schemes
from `schemes.js`, which fill *roles* rather than naming variables, so one
scheme dresses every design. Four of them turn the page dark.

**Colours** — four to seven per template: the accent, the text, the page
background, the section bands, the lines, and whatever else that design lets
you move. Each one carries the tones that have to move with it, so changing
the text colour also moves the quiet grey under it.

**Type** — three typefaces, for headings, body, and the small labels and
figures. Each template says which of its own variables carry them, which is
why this works at all: every design in the library named them differently.
Sizes are arithmetic on the stylesheet.

**Style** — square corners or round, headings in capitals or sentence case,
heavy or light, and how far the small labels are spaced. A theme changes the
colours; these change the manner.

**Sections** — hide any section from the right rail, or click one to jump to
it. Hiding is one CSS rule, so putting it back is that rule taken away.

**Pictures list** — every picture the template has, on the right. Click one to
find it on the page and change it. A picture you removed is not on the page
any more, so this is how it comes back.

## How a change reaches the screen

Two ways, and the difference matters.

A theme, a colour, a typeface, a hidden section and the style levers are all
one block of CSS at the end of `<head>`. The app asks the server for that
block on its own and swaps it in, so the change is instant and the page does
not jump back to the top. It is the same `headBlock()` the published page
uses, so the preview cannot drift from what gets sent.

Only a change to the markup — a logo, a re-worded line, new details — rebuilds
the page, and the scroll position is put back afterwards.

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

A card needs six things. See `20-tower-construction/swap.json` for the shape.

| Field | What it is |
|---|---|
| `swaps` | the exact strings to replace |
| `images` | the pictures that can be changed or removed |
| `brandTokens` | the words that must not survive a render |
| `fontVars` | which of the template's own variables carry the headings, the body and the labels |
| `roleMap` | which of its variables play which role in a shared scheme |
| `adjust` | which colours a person may move by hand, and what moves with them |

`palettes` is optional and holds themes drawn for that one design.
`roleMap` is what earns it the twelve shared ones, so it is worth ten
minutes: open the template, read its `:root`, and say which variable is the
page, which is the text, which is the accent.

`schemes.js` lists every role. A scheme that leaves one empty throws on
load rather than leaving a hole in somebody's page.

## Cloning a live site

`clone-site.js` turns a live page into a template: it writes
every stylesheet into the file, swaps the colours it leans on for CSS
variables so the template can wear a theme, makes every address absolute,
and throws the JavaScript away. `make-card.js` then takes the original
firm's name, people, address, phone and email off the page and writes the
swap card. `clone-specs.js` holds who each cloned site belongs to.

    node builder/passes/clone-site.js 34-sitcha-electric https://example.com/ raw.html --own
    node builder/passes/clone-specs.js

**It only works on sites whose layout is in the CSS.** Seven WordPress law
and finance sites were cloned this way and thrown out: those themes build
their layout in JavaScript, so a page taken without its scripts collapses
into text on top of pictures. A broken template is worse than no template.
Vite, Next and hand-written sites come out right.

**--own matters.** Without it every photograph is replaced with a stock one,
because a cloned page's staff photographs are not ours to ship. Use it only
for sites we own.

## Made from a UtahOp lead

Each lead in the UtahOp CRM has a **Make website** button. It sends the
lead's details to `POST /bapi/leads`, and the builder does the rest:

1. **Picks the template from the trade** LeadForge found. `leads.js` has one
   line per trade: pharmacy to the pharmacy, electrician to Sitcha, and so
   on. A trade not on the list is matched against each card's `covers` line.
   With nothing to go on it uses the accounting template, the most general.
2. **Fills the shared fields:** name, trade, phone (the WhatsApp number
   first, because that is the one people answer), email, town, address. A
   field the design does not have is left out.
3. **Saves it and answers with the link,** plus a Customise link that opens
   the same site in this app (`/build?site=<slug>`).

What LeadForge found about the business (the selling point, their Facebook,
who to ask for) goes in the site's notes, never onto the page. It is
research, not wording the business chose.

Pressing the button again keeps the same link and every change made by hand
here. Only the CRM's facts are sent again.

The request must carry `Authorization: Bearer <BUILDER_API_KEY>`. With no
key set the route refuses everything, so nobody else can fill the store.

## Keys

`builder/.env`, which git ignores:

```
UNSPLASH_ACCESS_KEY=…
PEXELS_API_KEY=…
BUILDER_API_KEY=…      the same value as SITE_BUILDER_KEY in UtahOp
```

On Vercel the same names are set in the project's environment settings.
