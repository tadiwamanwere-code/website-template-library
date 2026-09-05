# Website Template Library

A growing reference library of landing-page designs for agency work. Each template is a **self-contained, single-file landing page** you can open, study, and lift patterns from — layout logic, typographic voice, and scroll behaviour — rather than a product to ship as-is.

---

## Running it

The gallery uses **live iframe previews**, so it needs to be served over HTTP (opening `index.html` straight from disk will break the previews and some CDN scripts).

```bash
cd "C:\Users\USER\Desktop\Website Template Library"
node serve.js
```

Then open **http://localhost:4173**

The gallery lazy-loads each preview as you scroll, so all 18 templates don't boot at once. Filter by palette or genre with the controls, hover a card to inspect, click to open the template full-screen.

Individual templates *can* be opened directly from disk if you just want to look at one, but HTTP is more reliable.

---

## Structure

```
Website Template Library/
├── index.html              ← the gallery (live previews)
├── serve.js                ← local static server
├── DESIGN_SYSTEM.md        ← aesthetic rules every template obeys
├── ANIMATION_PLAYBOOK.md   ← the motion/depth bar for batch 02+
├── _inspo-notes/           ← reference captures from real sites
└── NN-name/
    ├── index.html          ← the template
    ├── notes.md            ← inspiration, motion techniques, accent, type pairing
    └── prompt.md           ← the prompt that rebuilds this page for a new brand
```

---

## The two rulebooks

Read both before adding a template.

- **`DESIGN_SYSTEM.md`** — the aesthetic constraints. The short version: no decorative gradients, no colored icon badges, typography carries the design, one accent colour maximum, self-contained files.
- **`ANIMATION_PLAYBOOK.md`** — the depth bar. Batch 01 was hero-only and motion-light; batch 02 onward requires full landing pages (6+ sections and a real footer), GSAP + ScrollTrigger + Lenis smooth scroll, and at least four distinct motion techniques per template, varied across the set.

The most important rule is the last one in the playbook: **templates must feel like they came from different studios.** Before building a new one, pick a deliberate position on each axis — palette, layout, type personality, signature motion, density — and if it overlaps an existing template on three or more, change direction.

---

## Batches

**Batch 01 (01–06)** — hero sections and signature-section showcases. Two were built to exact client specs (Velora, Healcure); four were drawn from studied references (Geptral, Fernline, Loco®, Hotshot).

**Batch 02 (07–18)** — full landing pages with scroll-driven motion, spanning agency, luxury, and tech genres.

**Batch 03 (19–25)** — real Rylo Labz client sites from `C:dev`, rebuilt as reusable templates. These cover the industries an agency actually gets briefed on: pharmacy e-commerce, construction, education, dental, accounting, fitted furniture and boutique hospitality. The brief was to keep each original's idea and polish it, not redesign it. Originals and design notes are in `_inspo-notes/rylo-originals/`.

---

## Prompts and the `landing-page` skill

Every template ships a **`prompt.md`** — a complete, self-contained prompt that
rebuilds that page for a new brand, with `[SQUARE BRACKET]` placeholders for
anything brand-specific.

In the gallery, each card has **Copy prompt** and **View prompt** buttons. Copy
one, swap the brackets for a client's real details, and generate the site.

There is also a global Claude Code skill at
`~/.claude/skills/landing-page/SKILL.md`. It indexes all templates by industry,
so asking for "a site for a construction company" picks the right template and
its prompt automatically.

---

## Assets

Placeholder imagery and video currently come from free-license sources (Unsplash, Pexels, Coverr). Every one is tagged in the markup:

```html
<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->
```

The Higgsfield MCP server is configured and authenticated for this project. Its tools load at session start, so a fresh Claude Code session can find every tagged asset and replace them in one pass.

---

## Adding a template

1. Read both rulebooks.
2. Pick your five differentiation axes and check them against the existing set.
3. Build `NN-name/index.html` and `NN-name/notes.md`.
4. Add an entry to the `TEMPLATES` array in the gallery's `index.html` — slug, display name, one-line genre, accent hex, three tags, and category keys for the filters.
