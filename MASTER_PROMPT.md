# MASTER PROMPT: turn the template library into a website builder

Paste this whole file as the prompt. It is self-contained. Assume the session
reading it knows nothing about this project.

`REUSABLE_TEMPLATES_BRIEF.md` and `BUILDER_BRIEF.md` in this folder are earlier
drafts. This file supersedes both. Read them only if you want more detail on a
point.

---

## 0. What already exists

We are a web agency. We have a finished library of hand-built landing page
templates at:

```
C:\Users\USER\Desktop\Website Template Library\
```

- **25 templates**, each in its own numbered folder: `NN-name/`
- Each folder holds `index.html` (one self-contained file, HTML + CSS + JS
  inline), plus `notes.md` and `prompt.md`
- `index.html` at the root is a gallery with live iframe previews
- `serve.js` runs a local server on port 4173. Run `node serve.js`. Needed
  because `file://` breaks the iframe previews
- `DESIGN_SYSTEM.md` and `ANIMATION_PLAYBOOK.md` at the root are binding
  rulebooks. Read both before touching any template
- Live at <https://website-template-library-pink.vercel.app>, repo at
  <https://github.com/tadiwamanwere-code/website-template-library>

The templates are good. The design work is done and approved. **Do not
redesign anything.**

---

## 1. The goal

Build a tool where we:

1. Open the app
2. Click New site
3. Pick a template
4. Type a few details about the business
5. See the finished website immediately
6. Try different colour themes, fix any wording, swap any image
7. Click Finish
8. Get a link we can send to the prospect

The same ten templates get reused forever. Only the name, the phone number, the
logo, the colours and optionally the photos change.

---

## 2. Non-negotiables

1. **The output is plain static HTML, CSS and JS.** One self-contained file per
   site, same as the templates. No framework in the output. A client who says
   yes gets that exact file as their real website, with no rework.
2. **Templates stay hand-built.** The tool fills templates. It never designs.
   All craft lives in the template. The tool is deliberately dumb.
3. **The app must work with the AI switched off.** AI is a helper for writing
   words and making pictures. It is never load-bearing. If the app cannot ship
   a link without AI, it is the wrong shape.
4. **One rendering path.** The preview and the published page are the same HTML
   produced by the same function. Never two paths, or the preview will lie.
5. **Never invent a fact about a real business.** No prices, no dates, no
   qualifications, no staff names, no accreditations, no "X years in business".

---

## 3. House design rules

From `DESIGN_SYSTEM.md` and `ANIMATION_PLAYBOOK.md`. These are why the library
looks like one library. They apply to the app's own interface too.

- **No slop gradients.** No purple-blue decorative washes. A gradient is only
  ever a dark scrim over a photo, for legibility.
- **No coloured icon badges.** No circular gradient chips, no rainbow feature
  grids. Icons are monochrome and functional.
- **Typography carries the design**, not stock photography with icon soup.
- **Real motion only.** Scroll-driven reveals, pinned sections, mask reveals.
  Never a blanket fade-in.

---

# PART ONE: make ten templates reusable

This is the foundation. Do it before writing any app code.

## 3.1 The ten industries and their template

| # | Industry | Template | Also covers |
|---|---|---|---|
| 1 | **Construction and trades** | `20-tower-construction` | Builders, civils, roofing, plant hire, electrical, plumbing |
| 2 | **Consultancy and professional services** | `23-caro-accounting` | Accountants, lawyers, auditors, advisers, brokers, HR |
| 3 | **Medical and clinics** | `02-healcure-medical` | GP practices, private clinics, physio, opticians, labs |
| 4 | **Dental** | `22-smile-dental` | Dentists, orthodontists, single-practitioner clinics |
| 5 | **Pharmacy** | `19-longrange-pharmacy` | Pharmacies, medical supply, supplement shops |
| 6 | **Education** | `21-mirage-college` | Colleges, schools, academies, driving schools, training |
| 7 | **Hospitality and lodging** | `25-gordons-bnb` | Guesthouses, lodges, B&Bs, self-catering, small hotels |
| 8 | **Food and drink** | `07-noir-omakase` | Restaurants, cafés, caterers, bars |
| 9 | **Motor trade** | `01-velora-dark-luxury` | Garages, parts, detailing, car hire, dealerships |
| 10 | **Retail and made-to-measure** | `24-safeway-furniture` | Furniture, joinery, kitchens, blinds, tiles, flooring |

Two spares, only after the ten are working:

| 11 | **Property** | `09-atlas-realestate` | Estate agents, developments, letting |
| 12 | **Online shop** | `18-longrange-commerce` | Anything needing a cart and checkout |

## 3.2 The swap card: everything that changes per client

```
BUSINESS NAME        Tower Construction
SHORT NAME           Tower                (for the giant hero type)
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

Twelve lines. Ten minutes per client. Images and theme are optional. If we
change nothing but the name, the site still works.

## 3.3 The universal copy pass. This is the real work.

Every template is currently full of invented specifics. They read well, which
is why nobody noticed. But they are fiction, and they are what makes the
templates un-reusable.

Sitting in `20-tower-construction` right now:

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

Put a new client's name on that page and every one of those lines is a lie.

### The rule

**If a sentence would be a lie for the next client in that industry, rewrite
it.**

Strip out: founding years, any "X years" claim, counts of projects or staff or
clients or patients or rooms, money figures, prices, named people and their
qualifications, street addresses and suburbs, country-specific bodies and
registration numbers, specific dates, origin stories with real detail, named
past clients or projects.

Keep: what the business does in plain words, how they work described as a
method, what a customer can expect, why that matters.

### Worked examples

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

Before: "Category 'A' registered with the Construction Industry Federation of
Zimbabwe."
After: "Fully registered, insured and bonded for the work we take on."

Before: "No lost-time injury since 12 September 2019."
After: "A safety record we protect on every site, every day."

Before: "R. T. Mutasa, Managing Director, Pr.Eng, ZIE"
After: cut the name and title. Keep the quote, attribute it to "The Managing
Director" or drop the attribution entirely.

### Tone

Plain words. Short sentences. Say what the business does and why it matters to
the customer. Never use: elevate, seamless, solutions, journey, passionate,
bespoke, world-class, cutting-edge.

**Keep the replacement the same length as the copy it replaces.** These designs
break when a line gets longer. Count the characters.

## 3.4 Stats are the one exception

The designs have big number blocks and they cannot sit empty. The numbers move
into the swap card. The **label** stays in the template and must be universal.

- Good labels: "Years trading", "Projects delivered", "Team on the books"
- Bad labels: "Days without LTI", "CIFOZ grading", "Square metres built"

If a client will not give a number, swap the label for one they can answer.
Never invent a number.

## 3.5 Themes

Every template already keeps its colours in one `:root` block. Add a named
theme table above it. Each theme is only six values:

```css
--brand      main colour, headings and dark panels
--accent     highlight, buttons and rules
--ink        body text
--paper      page background
--paper-2    alternate band background
--rule       hairlines and borders
```

**Four themes per template**, tested and approved. Never a free colour picker:
one bad orange wrecks a good layout. Name them plainly:

`navy-amber`, `charcoal-rust`, `forest-brass`, `slate-teal`

Every other colour in the file must derive from those six, or be a neutral that
works with all four.

## 3.6 The swap mechanism

Each template gets a `swap.json` listing every string that changes, with the
default currently in the file:

```json
{
  "template": "20-tower-construction",
  "swaps": [
    { "key": "BUSINESS_NAME", "find": "Tower Construction", "label": "Business name" },
    { "key": "SHORT_NAME",    "find": "Tower",              "label": "Short name for the hero", "maxChars": 12 },
    { "key": "PHONE",         "find": "+263 24 277 1980",   "label": "Phone" },
    { "key": "CITY",          "find": "Harare",             "label": "City" },
    { "key": "STAT_1_VALUE",  "find": "312",                "label": "Projects delivered" }
  ]
}
```

Rules for the replacement code:

- Replace whole strings only, **longest first**, so "Tower" does not corrupt
  "Tower Construction".
- Warn if a `find` string is not present in the file. That means the template
  drifted and `swap.json` is stale.
- Warn if a replacement is more than 20 percent longer than what it replaces.
  That is the length trap that breaks heroes.
- Never write into a template folder. Always write elsewhere.

---

# PART TWO: the app

## 4.1 The screens

**1. My sites.** Everything made so far: name, template, theme, link, draft or
finished, last touched. One button: New site.

**2. Pick a template.** The ten as live preview cards, not screenshots. Filter
by industry.

**3. Tell us about the business.** Five fields, not thirty:

```
Business name
What they do          one line
City
Phone
Their current website or Facebook page      optional
```

Plus a logo upload and a free notes box. That is the entire intake.

**4. Preview and correct.** The page renders full size in the middle. Theme
swatches down one side, section list down the other.

**5. Finish.** Mints the link. Shows it with a copy button and a QR code.

## 4.2 The rule that keeps it usable

**Every screen except picking a template must be skippable.** Someone who picks
a template, types a business name and clicks Finish must get a complete,
sensible website.

Part One is what makes this possible. Once the copy is universal, a template
with only a name filled in is already a real page.

## 4.3 Editing: click the page, not a form

Do not build a side panel of forty labelled fields. Nobody will fill it in.

The preview **is** the editor:

- Click any text. It becomes editable where it sits. Type. It saves.
- Hover a section: outline plus a small toolbar. Move up, move down, hide,
  reset to default.
- Hover an image: replace, reframe, regenerate.
- Theme swatches on the side. Click one, the page changes instantly, because a
  theme is six CSS variables.

Reason: a form field is a translation step. The user has to work out which
field controls which part of the page. Every translation step is where people
give up. Clicking the thing you want to change has no translation step.

Show a character counter when an edit nears the template's limit, red past it.

## 4.4 The link

### What a link actually is

A URL is a promise: when a browser asks, something answers with HTML. The
domain resolves, something answers on it, it has the page. That is the whole
mechanism. No intelligence is involved anywhere in it.

### Two ways to make one

**Deploy per site.** Write the folder, push to Cloudflare Pages. Twenty to
forty seconds. No server to run. But every save costs a build, so it cannot
happen on every click.

**Serve from storage.** The app is deployed once, up front. Finished sites are
saved into storage and one route serves all of them. Clicking Finish writes one
record. **The link works immediately, because the route existed before the site
did.** Milliseconds, not seconds.

**Use the second.** Keep the first for later, when a client says yes and wants
their own domain.

### The shape

A Cloudflare Worker plus R2 or KV. About thirty lines.

```
POST /api/sites     save { slug, template, swaps, theme, html }   returns the link
GET  /s/:slug       look it up, return the HTML
```

Free tier covers 100,000 requests a day. A pitch link gets a few dozen views.

### Three rules that are not optional

1. **Every generated page carries `<meta name="robots" content="noindex">`.** A
   mockup of a real business must never appear in Google.
2. **Slugs must be unique.** Two clients will be called Smile Dental. Append a
   short random suffix: `smile-dental-k4x9`.
3. **Finish writes a new version, never overwrites.** People break things and
   want yesterday back.

## 4.5 What a saved site is

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
bug in a template fixes every site ever made from it. Cache the rendered HTML
too, but treat it as something you can throw away and rebuild.

## 4.6 What is code and what is AI

**First principle: AI is needed only where judgement about meaning is needed.
Everything else is code.**

Pure code, no AI near it:

| Job | Why it is code |
|---|---|
| Filling a template with a client's details | Find and replace. Deterministic. |
| Switching themes | Six CSS variables |
| The live preview | An iframe of the exact file that gets published |
| Saving, versioning, listing sites | Reading and writing records |
| **Generating the link and serving it** | **A slug and a route. No intelligence involved.** |
| Editing text | The user types it |
| Cropping, resizing, compressing images | Maths |
| Length warnings | Counting characters |
| Publishing to a real domain later | A CLI command |

Needs AI, because it needs judgement:

| Job | Why AI |
|---|---|
| Writing copy the client did not give us | Right meaning, right length, right voice |
| Reading a prospect's existing site for name, phone, hours, services | The page is a mess. Understanding it is judgement. |
| Making images when they have none | Nothing else can |
| Suggesting a template for a business | Optional. A dropdown does this job. |
| Suggesting a theme from a logo | Optional. Four swatches do this job. |

## 4.7 How the AI is wired

Use a **two-file handshake**, never a direct function call.

The renderer writes `gaps.json`: everything missing, with the brand context at
the top so whatever fills it writes in the right voice, and the length limit for
each gap. Something fills it and writes `generated.json` in the same shape. The
renderer merges and re-renders.

Right now the filler is **Claude Code on this subscription**. It reads
`gaps.json`, writes the copy, calls the Higgsfield tools for image gaps, saves
the files, writes `generated.json`. No API key. No per-call billing.

Because the handshake is two files on disk, the filler can later become an API
call, a different model, or a person typing, and nothing else changes.

Rules for generated copy: match the length limit exactly, plain words, and never
invent a fact. If a fact is needed and missing, write neutral copy that works
without it and flag it in `generated.json` as `needsClientConfirmation: true`.

---

# PART THREE: build order

Do these in order. Do not skip ahead.

1. **`20-tower-construction` end to end.** Universal copy pass, four themes,
   `swap.json`, one test client rendered and opened in a browser. Get this one
   perfect before touching another template.
2. **Write `UNIVERSAL_COPY_RULES.md`** at the library root recording what you
   learned, so the other nine go faster.
3. **The renderer as a plain function.** No UI.
   `render(template, swaps, theme) -> html`. Prove it in the terminal.
4. **The Worker: save and serve.** Hard-code one site record and prove the link
   opens in a browser. Do this before any interface exists. The link is the
   thing that has to be certain.
5. **The preview screen with theme switching.** Read-only.
6. **Click-to-edit.**
7. **The intake form.**
8. **`23-caro-accounting` and `02-healcure-medical`.** Different shapes, so the
   copy rules get properly tested.
9. **The AI fill.**
10. **The remaining seven templates, then the two spares.**

If you build the AI first you get a clever demo that cannot ship a link. Build
the link first and the clever part becomes optional, which is what it should be.

## Hosting

Put this on **Cloudflare Pages**, not Vercel. Cloudflare allows commercial use
on the free plan and gives unlimited bandwidth on static assets. Vercel's free
Hobby plan is personal, non-commercial only, and this is agency work.

---

# Known traps

Real problems already hit on this codebase. Do not rediscover them.

- **`overflow-x: hidden` on `html, body` forces `overflow-y` to compute to
  `auto`.** That makes `<body>` a scroll container, silently breaks every
  `position: sticky`, and turns `window.scrollTo` into a no-op. Use
  `overflow-x: clip`.
- **`scroll-behavior: smooth` makes synchronous `scrollY` and
  `getBoundingClientRect` reads return pre-scroll values.** When testing scroll
  behaviour, probe with `behavior: 'instant'` and await a frame, or the test
  lies.
- **Giant hero type is often `white-space: nowrap` at around 12vw.** A long
  business name overflows the viewport. This is exactly why `SHORT NAME` is its
  own field in the swap card, with a character limit.
- **Header wordmarks collide with the nav** on medium screens. Long names need
  responsive font-size step-downs.
- **Subagents share one Playwright browser.** A screenshot taken while others
  run can silently capture the wrong page.
- **Long agent runs get killed.** Write the complete file to disk early, then
  refine. Anything unwritten is lost.

---

# Done means

**Part One, for each of the ten templates:**

- Read every visible line. Not one names a year, a count, a price, a person, a
  street, or a registration body.
- A stranger in that industry could put their name and phone on it and every
  word would still be true.
- Stat labels are universal, numbers come from the swap card.
- Four themes swap cleanly and none looks worse than the original.
- Searching the rendered output for the template's default business name returns
  zero hits.

**Part Two:**

- You can send a stranger a link and it opens.
- Removing the AI entirely leaves the app fully working.
- The preview and the published page are the same HTML from one function.
- Finish to working link takes under a second.
- Every generated page carries noindex.
- Deleting a client's images still leaves a page that opens cleanly.
- Picking a template, typing only a business name, and clicking Finish produces
  a complete, sane, shareable website.
