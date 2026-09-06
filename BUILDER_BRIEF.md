# Build brief: turn the template library into our own site builder

Paste this whole file as the prompt. It is the spec.

---

## What we are building

A build tool that takes **one finished template** plus **one client content file** and writes a finished static website to disk in under a second.

No framework in the output. No CMS. No server. Exactly the kind of files we ship today, just assembled instead of hand-edited.

Anything the client has not given us (a headline, a paragraph, a photo) is filled by AI. The AI is wired in later, but the shape must be built now.

---

## Five non-negotiables

1. **The output is plain static HTML, CSS and JS.** Same as what we ship today. A client who says yes gets that exact folder as their live site. No rework.
2. **Templates stay hand-built.** The tool fills templates, it never designs. All craft stays in the template. The tool is dumb on purpose.
3. **Content is fully separate from design.** A template knows nothing about any client. A client file knows nothing about any template. They meet only at build time.
4. **Missing content is filled through a file handshake, not a function call.** The builder writes a file of gaps. Something else fills it. The builder reads it back. That something is Claude Code today and could be anything later, and the builder never changes.
5. **The vocabulary is industry-neutral.** The same model must describe a dentist, a builder, a lodge and a law firm. Never name anything after an industry.

---

## The content model

Four levels. This is the fundamental part. Get it right and everything else follows.

```
Site      one client
 |- Page          one route: /, /about, /services
     |- Section   one band of the page: hero, stats, offer list
         |- Part  the smallest fillable thing: a heading, a photo, a number
```

Every part has a stable address: `page.section.part`.

```
home.hero.headline
home.offers.items[2].title
contact.footer.phone
```

That address is the only thing shared between a template and a client file.

### Part types

Nine types cover every template we own and every business we will ever sell to.

| Type | Holds | Example |
|---|---|---|
| `text.short` | One line. Headline, label, button. | "Same day fitting" |
| `text.long` | A paragraph. | An about paragraph |
| `list` | Ordered items, each with its own parts | Services, steps, features |
| `number` | A figure plus its unit and caption | "28 years in business" |
| `image` | src, alt, focal point, aspect | Hero photo |
| `link` | href plus label | "Book a call" |
| `contact` | phone, email, address, hours | Footer details |
| `logo` | Wordmark or an image file | Header brand |
| `colour` | One brand accent | Accent colour |

Nothing else. If something does not fit, it is one of these in disguise.

### Section types

Name a section by the **job it does**, never by the industry. These cover all 25 templates we already have.

| Type | Job |
|---|---|
| `hero` | Say who this is and what they do |
| `proof-strip` | A thin band of reassurance: years, accreditations, hours |
| `story` | Who they are, in prose, with a picture |
| `stats` | Three or four numbers |
| `offer-list` | What you can buy or book |
| `process` | How it works, step by step |
| `people` | The person or team |
| `gallery` | Their work or their place |
| `enquiry` | The form or the phone number |
| `footer` | Details, hours, legal |

The dental template's "Treatments" is an `offer-list`. "Your first visit" is a `process`. "Practitioner" is `people`. The construction template's "Projects" is a `gallery`. Same list everywhere.

---

## Step 1: tokenise a template

One-time pass per template. Do not touch the design.

Add a `data-slot` attribute to every element whose content changes per client.

```html
<h1 class="hero-h1" data-slot="home.hero.headline">Smile Dental</h1>
<p data-slot="home.hero.blurb">Gentle dentistry in the heart of town.</p>
<img data-slot="home.hero.photo" src="..." alt="...">
```

Repeating blocks mark the container and keep exactly one child as the pattern:

```html
<ol data-slot-repeat="home.offers.items" data-slot-min="3" data-slot-max="6">
  <li>
    <h3 data-slot="title">Check-ups</h3>
    <p data-slot="blurb">Twenty minutes, twice a year.</p>
    <span data-slot="price">From $40</span>
  </li>
</ol>
```

Whole sections can be dropped:

```html
<section data-section="stats" data-section-optional>
```

**The existing copy stays in the file.** It is the fallback and it is the length reference. A template must still open correctly on its own.

### Then write `content.schema.json` next to it

One entry per slot. This file is the brain of the whole system.

```json
{
  "template": "22-smile-dental",
  "sections": [
    { "id": "hero",   "type": "hero",       "required": true  },
    { "id": "offers", "type": "offer-list", "required": true  },
    { "id": "stats",  "type": "stats",      "required": false }
  ],
  "slots": {
    "home.hero.headline": {
      "type": "text.short",
      "maxChars": 24,
      "hint": "The business name, short form. Sits at 12vw and does not wrap.",
      "fallback": "keep"
    },
    "home.hero.blurb": {
      "type": "text.long",
      "minWords": 12,
      "maxWords": 22,
      "hint": "What they do and who for. Plain, no marketing language."
    },
    "home.hero.photo": {
      "type": "image",
      "aspect": "3:4",
      "hint": "The premises or the owner at work. Never a stock handshake."
    }
  }
}
```

**The character and word limits are the most important thing in this file.** Our designs break when copy is the wrong length. A 40-character headline in a 24-character slot destroys the hero. Every limit must be measured from the real template, not guessed.

---

## Step 2: the client file

One JSON file per client. Nothing but content.

```json
{
  "slug": "smile-dental-harare",
  "template": "22-smile-dental",
  "brand": {
    "name": "Smile Dental Harare",
    "shortName": "Smile Dental",
    "accent": "#1F5F5B",
    "logo": "logo.svg"
  },
  "content": {
    "home.hero.headline": "Smile Dental",
    "home.hero.blurb": "Family dentistry in Borrowdale, open six days a week.",
    "home.offers.items": [
      { "title": "Check-ups", "blurb": "Twenty minutes, twice a year.", "price": "From $40" }
    ]
  },
  "contact": {
    "phone": "+263 ...",
    "email": "...",
    "address": "...",
    "hours": "Mon to Sat, 8am to 5pm"
  }
}
```

Anything absent is a gap. That is the normal case, not an error.

---

## Step 3: the builder

```
node build.js <template-slug> <client.json> [--out dist/<slug>] [--strict]
```

What it does:

1. Read the template `index.html` and its `content.schema.json`.
2. Read the client file.
3. Walk every `data-slot`. Fill it from the client file.
4. Expand every `data-slot-repeat` to the number of items given.
5. Drop optional sections with no content.
6. Apply brand tokens: accent colour into the CSS variable, logo into the header.
7. Copy assets into the output folder and rewrite the paths.
8. Strip every `data-slot` attribute so the output is clean.
9. Write anything unfilled to `gaps.json`.
10. Write the finished site to `dist/<slug>/`.

Rules:

- **Never leave a bracket or a slot marker in the output.**
- With no client value and no gap fill, keep the template's own copy. A page must never ship with an empty heading.
- `--strict` fails the build if anything is unfilled. Use it for real client sites, not for pitch mockups.
- Enforce every length limit. Over-long copy is a build warning naming the slot, the limit and the actual length.

Use **cheerio** for the HTML rewriting. One build-time dependency. Regex on HTML is fragile and will silently eat a template. The published output stays zero-dependency.

---

## Step 4: the AI gap fill

This is the part that must be designed now and wired later.

The builder writes `gaps.json`. It carries the brand context at the top so whatever fills it can write in the right voice.

```json
{
  "brand": {
    "name": "Smile Dental Harare",
    "what": "Family dental practice",
    "where": "Borrowdale, Harare",
    "tone": "warm, plain, not clinical"
  },
  "gaps": [
    {
      "slot": "home.story.body",
      "type": "text.long",
      "minWords": 40,
      "maxWords": 60,
      "hint": "How the practice started and who runs it.",
      "existing": "Placeholder copy currently in the template."
    },
    {
      "slot": "home.hero.photo",
      "type": "image",
      "aspect": "3:4",
      "hint": "The practice reception, daylight, no people."
    }
  ]
}
```

Something fills it and writes `generated.json` in the same shape, with values. Then:

```
node build.js <template> <client.json> --merge generated.json
```

**Right now the filler is Claude Code on this subscription.** It reads `gaps.json`, writes the copy, calls the Higgsfield tools for any image gaps, saves the files into the client's assets folder, and writes `generated.json`. No API key. No per-call billing. The subscription is the inference.

Because the handshake is two files on disk, we can later replace the filler with an API call, a different model, or a person typing, and the builder never changes. Build it that way from day one.

Add a helper so the loop is one command:

```
node fill.js <client.json>
```

It runs the build, and if `gaps.json` is not empty it prints a single ready instruction to hand to Claude Code. When `generated.json` appears it merges and rebuilds.

### Rules for generated copy

- Match the length limit exactly. Long copy breaks the design.
- Plain words. No "elevate", "seamless", "solutions", "journey".
- Never invent a fact that could embarrass us: no prices, no dates, no qualifications, no claims about years in business. If a fact is needed and missing, write neutral copy that works without it and flag it in `generated.json` as `needsClientConfirmation: true`.
- Generated images go in `dist/<slug>/assets/generated/` and every one is recorded in `generated.json` with the prompt used, so we can redo it.

---

## Step 5: deploying

One repo. One hosting project. Every client is a folder.

```
dist/
  smile-dental-harare/
  tower-construction-demo/
```

Deploy the whole `dist` folder. Each client is then live at `/<slug>/`. New client means a new folder and one redeploy, about 30 seconds.

Put this on **Cloudflare Pages**, not Vercel Hobby. Cloudflare allows commercial use on the free plan. Vercel Hobby does not, and this is agency work.

---

## Build order

Do not tokenise all 25 templates. Prove the loop first.

1. `build.js` and the slot filling, working on **one** template end to end. Use `22-smile-dental`.
2. `content.schema.json` for that template, with every limit measured from the real file, not guessed.
3. `gaps.json` and the merge step.
4. One real client file, built and deployed, link in hand.
5. Only then tokenise the next two templates.

Pick the second and third from different archetypes so the model gets tested properly. `20-tower-construction` and `25-gordons-bnb` are the right pair: one heavy trade, one hospitality.

## Done means

- `node build.js 22-smile-dental clients/smile-dental-harare.json` writes a finished folder in under a second.
- The page opens with no missing images, no empty headings, no leftover brackets, no `data-slot` attributes.
- Deleting half the client file still produces a page that opens cleanly, and `gaps.json` lists exactly what is missing.
- The design is pixel-identical to the template where content lengths match.
