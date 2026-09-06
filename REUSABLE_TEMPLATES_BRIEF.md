# Prompt: make ten templates reusable for any client in their industry

Paste this whole file as the prompt.

This replaces `BUILDER_BRIEF.md` as the plan for now. That file describes a
bigger builder with slots, schemas and AI gap-filling. Keep it for later. It is
more machinery than we need to start selling.

---

## The goal

Pick one template per basic industry. Rewrite the words inside it so they are
true for **any** business in that industry, anywhere. Then selling a site is:
change the name, change the phone number, drop in the logo, pick a colour, ship
it.

Nothing else changes. The template is the product. We rotate the same ten
templates forever.

---

## The ten industries and their template

| # | Industry | Template | Also covers |
|---|---|---|---|
| 1 | **Construction and trades** | `20-tower-construction` | Builders, civils, roofing, plant hire, electrical, plumbing |
| 2 | **Consultancy and professional services** | `23-caro-accounting` | Accountants, lawyers, auditors, advisers, brokers, HR firms |
| 3 | **Medical and clinics** | `02-healcure-medical` | GP practices, private clinics, physio, opticians, labs |
| 4 | **Dental** | `22-smile-dental` | Dentists, orthodontists, small single-practitioner clinics |
| 5 | **Pharmacy** | `19-longrange-pharmacy` | Pharmacies, medical supply, supplement shops |
| 6 | **Education** | `21-mirage-college` | Colleges, schools, academies, driving schools, training centres |
| 7 | **Hospitality and lodging** | `25-gordons-bnb` | Guesthouses, lodges, B&Bs, self-catering, small hotels |
| 8 | **Food and drink** | `07-noir-omakase` | Restaurants, cafés, caterers, bars |
| 9 | **Motor trade** | `01-velora-dark-luxury` | Garages, parts, detailing, car hire, dealerships |
| 10 | **Retail and made-to-measure** | `24-safeway-furniture` | Furniture, joinery, kitchens, blinds, tiles, flooring |

Two spares to do after the ten are working:

| 11 | **Property** | `09-atlas-realestate` | Estate agents, developments, letting agents |
| 12 | **Online shop** | `18-longrange-commerce` | Anything needing a cart and checkout |

---

## What changes per client. Exactly this and nothing else.

Every template gets one block at the very top of the file. This is the whole
customisation surface.

```
BUSINESS NAME        Tower Construction
SHORT NAME           Tower                 (for the giant hero type)
WHAT THEY DO         Building and Civil Engineering Contractors
CITY                 Harare
PHONE                +263 24 277 1980
EMAIL                hello@example.com
ADDRESS              14 Bessemer Road, Graniteside
HOURS                Mon to Fri, 7am to 5pm
LOGO                 logo.svg
THEME                navy-amber
STAT 1               Years trading           28
STAT 2               Projects delivered      312
STAT 3               Team on the books       40
```

That is it. Twelve lines. Ten minutes per client.

**Optional, only if we want to:** swap the photographs, or pick a different
named theme. If we do not, we change nothing and the site still works.

---

## The real work: the universal content pass

Every one of the ten templates is currently full of invented specifics. They
read well, which is why nobody noticed. But they are fiction, and they make the
template un-reusable.

Here is what is actually sitting in `20-tower-construction` right now:

- "Est. 1980" and "Forty-five years"
- "CIFOZ Category A, Reg. 0143/A"
- "14 Bessemer Road, Graniteside, Harare"
- "312 projects delivered", "2,190 days without LTI"
- "R. T. Mutasa, Managing Director, Pr.Eng, ZIE"
- "started in 1980 with two tipper trucks and a contract to build a grain depot
  outside Marondera"
- "sixty-eight owned plant units out of the Msasa yard"
- "three hundred and forty people directly"
- "US$ 25M bonding capacity"
- "No lost-time injury since 12 September 2019"

Rewrite all of it. Do the same for the other nine.

### The rule

**If a sentence would be a lie for the next client in that industry, rewrite it.**

Strip out:

- Founding years and any "X years" claim in prose
- Counts of projects, staff, clients, patients, rooms, vehicles
- Money figures, prices, bonding capacity, turnover
- Named people and their qualifications
- Street addresses, suburbs, provinces
- Country-specific bodies and registration numbers (CIFOZ, ZIE, Reg. numbers)
- Specific dates and any origin story with real detail in it
- Named past clients or projects

Keep in:

- What the business does, in plain words
- How they work, described as a method
- What a customer can expect
- Why that matters

### Before and after

Before:

> Tower Construction started in 1980 with two tipper trucks and a contract to
> build a grain depot outside Marondera. Forty-five years on we hold Category
> "A" registration with the Construction Industry Federation of Zimbabwe, run
> sixty-eight owned plant units out of the Msasa yard, and employ three hundred
> and forty people directly.

After:

> We started small, with a few machines and a willingness to take the jobs other
> firms turned down. We still run our own plant, we still employ our crews
> directly, and we still price every job ourselves. That is the whole method and
> it has not changed.

True for any builder. Nothing to edit.

Before:

> Category "A" registered with the Construction Industry Federation of Zimbabwe.

After:

> Fully registered, insured and bonded for the work we take on.

Before:

> No lost-time injury since 12 September 2019.

After:

> A safety record we protect on every site, every day.

Before:

> R. T. Mutasa, Managing Director, Pr.Eng, ZIE

After: cut the name and title. Keep the quote, attribute it to
"The Managing Director" or drop the attribution entirely.

### Tone rules

- Plain words. Short sentences.
- Say what the business does and why it matters to the customer.
- No "elevate", "seamless", "solutions", "journey", "passionate", "bespoke",
  "world-class", "cutting-edge".
- Never write a claim that could get a client in trouble: no guarantees, no
  qualifications, no accreditations, no "the best in", no medical or legal
  advice.
- Keep the exact same length as the copy it replaces. These designs break when
  a line gets longer. Count the characters.

---

## Stats are the one exception

The designs have big number blocks and they cannot sit empty. So the numbers
stay, but they move into the swap card at the top.

The **label** stays in the template and must be universal:

- Good: "Years trading", "Projects delivered", "Team on the books"
- Bad: "Days without LTI", "CIFOZ grading", "Square metres built"

The **number** comes from the client. If a client will not give one, the label
gets swapped for one they can answer. Never invent a number.

---

## Themes

Every template already has its colours in one `:root` block at the top. Keep
that. Add a named theme table above it so a swap is one paste.

Give each template four themes. Each one is only these six values:

```css
--brand      the main colour, used for headings and dark panels
--accent     the highlight, used for buttons and rules
--ink        body text
--paper      page background
--paper-2    the alternate band background
--rule       hairlines and borders
```

Four themes per template, tested and approved. Never a free colour picker. One
bad orange will wreck a good layout. Name them plainly:

`navy-amber`, `charcoal-rust`, `forest-brass`, `slate-teal`

Every other colour in the file must already be derived from those six, or be a
neutral that works with all four.

---

## How the swap works mechanically

Keep it simple. No build system.

Each template gets a `swap.json` listing every string that changes, with the
default that is currently in the file:

```json
{
  "template": "20-tower-construction",
  "swaps": [
    { "key": "BUSINESS_NAME", "find": "Tower Construction",  "label": "Business name" },
    { "key": "SHORT_NAME",    "find": "Tower",               "label": "Short name for the hero" },
    { "key": "PHONE",         "find": "+263 24 277 1980",    "label": "Phone" },
    { "key": "CITY",          "find": "Harare",              "label": "City" },
    { "key": "STAT_1_VALUE",  "find": "312",                 "label": "Projects delivered" }
  ]
}
```

Each client gets a small `client.json` with the values.

Then one script, about forty lines:

```
node make.js 20-tower-construction clients/acme-builders.json
```

It reads the template HTML, applies every replacement, applies the named theme
block, copies the folder to `dist/acme-builders/`, and stops.

Rules for the script:

- Replace whole strings only, longest first, so "Tower" does not corrupt
  "Tower Construction".
- Warn if any `find` string is not present in the file. That means the template
  drifted and `swap.json` is stale.
- Warn if a replacement is more than 20 percent longer than the string it
  replaces. That is the length trap that breaks the hero.
- Never write into the template folder. Always write to `dist/`.

---

## Order of work

1. **`20-tower-construction` first.** Universal copy pass, four themes,
   `swap.json`, and one test client built and opened. Get this one perfect.
2. **Write down what you learned** in `UNIVERSAL_COPY_RULES.md` at the library
   root, so the other nine go faster.
3. **Then `23-caro-accounting` and `02-healcure-medical`.** Different shapes,
   so the rules get properly tested.
4. **Then the remaining seven.**
5. **Then the two spares.**

Do not start all ten at once. The first one teaches you the rules.

---

## Done means

For each of the ten templates:

- Open the file and read every visible line. Not one of them names a year, a
  count, a price, a person, a street, or a registration body.
- A stranger in that industry could put their name and phone on it and every
  word would still be true.
- The stat labels are universal and the numbers come from the swap card.
- Four themes swap cleanly and none of them look worse than the original.
- `node make.js <template> <client.json>` produces a finished folder that opens
  with no leftover default names anywhere in it.
- Search the output for the template's default business name. Zero hits.

---
---

# Part 2: the app around the templates

Part 1 is the engine. This is the thing we click.

## The screens

**1. My sites.** Everything made so far. Name, template, theme, link, whether it
is a draft or finished, when it was last touched. One button: New site.

**2. Pick a template.** The ten, as live preview cards, not screenshots.
Filter by industry. Click one.

**3. Tell us about the business.** Five fields. Not thirty.

```
Business name
What they do          one line
City
Phone
Their current website or Facebook page      optional
```

Plus a logo upload and a free notes box. That is the entire intake.

**4. Preview and correct.** The page renders full size in the middle. Themes
down one side as swatches. Sections listed down the other. This is where the
work happens.

**5. Finish.** Mints the link. Shows it with a copy button and a QR code.

## The rule that keeps it usable

**Every screen except picking a template must be skippable.** Someone who
picks a template, types a business name, and clicks Finish must get a complete,
sensible website. Everything else is refinement, never a requirement.

That is only possible because of Part 1. The universal copy means a template
with nothing but a name filled in is already a real page.

## Editing: click the page, not a form

Do not build a side panel of forty labelled fields. Nobody will fill it in.

The preview **is** the editor:

- Click any text, it becomes editable where it sits, type, it saves.
- Hover a section, get an outline and a small toolbar: move up, move down,
  hide, reset to default.
- Hover an image, get: replace, reframe, regenerate.
- Theme swatches on the side. Click one, the whole page changes instantly,
  because a theme is six CSS variables.

Reason: a form field is a translation step. The user has to work out which
field controls which bit of the page. Every translation step is a place where
people give up. Clicking the thing you want to change has no translation step.

Show a character counter when an edit gets near the template's limit, and turn
it red past it. That is the guard against the hero overflow.

## The link

### What a link actually is

A URL is a promise: when a browser asks, something answers with HTML. Three
things must be true. The domain resolves. Something answers on it. It has the
page.

That is all. It is file serving, the oldest thing on the web. No intelligence
is involved anywhere in it.

### Two ways to make one

**Deploy per site.** Write the folder, push it to Cloudflare Pages. Twenty to
forty seconds. No server to run. But every save costs a build, so you cannot do
it on every click.

**Serve from storage.** The app is deployed once, up front. Finished sites are
saved into storage, and one route serves them all: `/s/<slug>`. Clicking Finish
writes one record. The link works immediately, because **the route already
existed before the site did.** Milliseconds, not seconds.

Use the second one. That is what makes Finish feel instant. Keep the first for
later, when a client says yes and wants their own domain.

### The shape

A Cloudflare Worker plus R2 or KV. About thirty lines.

```
POST /api/sites     save { slug, template, swaps, theme, html }   returns the link
GET  /s/:slug       look it up, return the HTML
```

Free tier covers 100,000 requests a day. A pitch link gets a few dozen views.
We will never reach it.

### Three rules that are not optional

1. **Every generated page carries `<meta name="robots" content="noindex">`.**
   A mockup of a real business must never turn up in Google. This one matters
   more than it looks.
2. **Slugs must be unique.** Two clients will be called Smile Dental. Append a
   short random suffix: `smile-dental-k4x9`.
3. **Finish writes a new version, it never overwrites.** People break things
   and want yesterday back.

### Will it work, and is it fast

Yes, and it keeps working. It is a static string in storage, served over HTTPS
by a CDN. There is no database query worth worrying about, nothing to expire,
nothing to go down.

The link appears the instant you click Finish, because minting it is writing
one record. The page then loads at CDN speed anywhere in the world.

The slow part was never the link. It is deciding what the page should say.

## What is code and what is AI

**First principle: AI is needed only where judgement about meaning is needed.
Everything else is code.**

Pure code, no AI anywhere near it:

| Job | Why it is code |
|---|---|
| Filling a template with a client's details | Find and replace. Deterministic. |
| Switching themes | Six CSS variables |
| The live preview | An iframe of the exact file that gets published |
| Saving, versioning, listing sites | Writing and reading records |
| **Generating the link and serving it** | **A slug and a route. No intelligence involved.** |
| Editing text | The user types it |
| Cropping, resizing, compressing images | Maths |
| Length warnings | Counting characters |
| Publishing to a real domain later | A CLI command |

Needs AI, because it needs judgement:

| Job | Why AI |
|---|---|
| Writing copy the client did not give us | The right meaning, at the right length, in the right voice |
| Reading a prospect's existing site and pulling out name, phone, hours, services | The page is a mess. Understanding it is judgement. |
| Making images when they have none | Nothing else can |
| Suggesting which template suits a business | Optional. A dropdown does this job. |
| Suggesting a theme from their logo | Optional. Four swatches do this job. |

**Build it so that switching the AI off leaves a working app.** If the AI is
unavailable, every screen still works, the templates still carry their universal
copy, and the user types the words themselves. AI is a helper. It is never
load-bearing. If the app cannot function without it, it is the wrong shape.

## What a saved site is

```json
{
  "slug": "acme-builders-k4x9",
  "template": "20-tower-construction",
  "theme": "charcoal-rust",
  "swaps": { "BUSINESS_NAME": "Acme Builders", "PHONE": "+263 ..." },
  "images": { "hero": "r2://acme-builders/hero.jpg" },
  "version": 3,
  "status": "finished",
  "createdAt": "2026-09-06T10:00:00Z"
}
```

**Store the inputs, not the finished HTML.** Re-render on save. Then fixing a
bug in a template fixes every site ever made from it. Keep the rendered HTML
too, but treat it as a cache you can always throw away and rebuild.

## Build order for the app

1. **The renderer as a plain function.** No UI at all.
   `render(template, swaps, theme) -> html`. Prove it in the terminal.
2. **The Worker: save and serve.** Hard-code one site record and prove the link
   opens in a browser. Do this on day one, before any interface exists. The
   link is the thing that has to be certain.
3. **The preview screen with theme switching.** Read-only.
4. **Click-to-edit.**
5. **The intake form.**
6. **The AI fill. Last.**

If you build the AI first you will end up with a clever demo that cannot ship a
link. Build the link first and the clever part becomes optional, which is
exactly what it should be.

## Done means

- You can send a stranger a link and it opens.
- Removing the AI entirely leaves the app fully working.
- The preview and the published page are the same HTML. One rendering path,
  never two, or the preview will lie.
- Finish to working link takes under a second.
- Every generated page carries noindex.
- Deleting a client's images still leaves a page that opens cleanly.
