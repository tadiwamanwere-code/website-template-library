# 20 — Tower Construction (building & civil engineering)

**Reusable.** This is the first template through the universal copy pass
(`UNIVERSAL_COPY_RULES.md`). Every invented fact is gone, it carries four
approved themes and a `swap.json`, and it is the template the renderer
(`builder/render.js`) was built against.

**Original.** `tower-construction-ten.vercel.app` (Rylo Labz client site),
screenshot in `_inspo-notes/rylo-originals/tower.png`. Kept: Inter + JetBrains
Mono, the navy/amber palette, the full-bleed hero photograph, uppercase tracked
nav, amber primary + ghost secondary, the `EXPLORE` scroll cue, and the
seven-section order (hero → about + stats → capability → services → work →
process → quote).

**The position in the library: engineering confidence.** Every corner is 0px.
No shadows, no rounded cards, no soft anything. Sections are separated by
hairline and 2px structural rules rather than whitespace. Every number is
JetBrains Mono with `tabular-nums lining-nums`, so figures align down a column
to the pixel. It should read like a firm that pours concrete, not a startup.

## Themes

Four approved themes, six values each, set on the root element as
`<html data-theme="…">`:

| Theme | Brand | Accent |
|---|---|---|
| `navy-amber` *(default)* | `#0E2A5E` | `#F5A833` |
| `charcoal-rust` | `#282B31` | `#E07E47` |
| `forest-brass` | `#123529` | `#C08F33` |
| `slate-teal` | `#1E3138` | `#18B0B0` |

Everything else — the two darker brand tones, the accent hover, three greys,
the second rule tone and the third paper tone — is derived from those six with
`color-mix()`. Nothing else in the file holds a colour. The three new accents
were tuned so their contrast on the dark panels matches the approved original
(4.6–5.4:1, against the original's 7:1), while sitting better on white than the
original amber did (2.7–2.9:1 against 2.0:1).

## Motion techniques (6 distinct)

1. **Scroll-drawn SVG line through the process** *(the signature — worth
   stealing)* — the path is **generated at runtime** from the real
   `getBoundingClientRect()` of each of the six step nodes, routed with
   orthogonal dog-legs so it reads as an engineering drawing rather than a
   curve. `stroke-dasharray`/`stroke-dashoffset` is scrubbed to a ScrollTrigger,
   a faint grey twin path sits underneath as the undrawn route, an amber diamond
   head rides the line via `getPointAtLength()`, and each node flips to the
   accent as the head passes it. Rebuilt on resize, so it re-routes to a
   straight vertical rail below 900px.
2. **Pinned capability scrub** — `#capability` pins for `+=2100` with
   `scrub: .6`; progress fills the accent spine (`scaleY`), lights the six rows
   one at a time, and drives the `01 / 06` mono counter. Torn down below 1024px
   by `gsap.matchMedia()`.
3. **Count-up statistics** — four figures, all supplied by the swap card.
   Thousands are grouped with a thin space by a formatter, so tabular digits
   never jitter mid-count.
4. **Hand-split line mask reveals** — every big heading is authored as
   `.ln > span` wrappers, `yPercent: 112 → 0`, `power4.out`, 0.075s stagger.
   No paid SplitText.
5. **Clip-path gallery reveals + parallax** — each work image wipes open with
   `clipPath: inset(0 0 100% 0) → inset(0)` while the image settles from
   `scale 1.22`; the hero and about photos run at different scrub speeds.
6. **Magnetic buttons** — the accent CTAs pull toward the pointer through a
   `gsap.ticker` lerp. Disabled on coarse pointers.
   Plus a **page-load intro**: a mono counter ticks 0 → 100 while an accent
   plumb line grows across the width, then the brand formwork splits.

## What changed in the reusable pass

- **Every invented fact removed** — founding year, "forty-five years", CIFOZ
  grading and registration numbers, PRAZ/ISO/ZIMRA/NSSA numbers, the street
  address and plant yard, the managing director's name and qualifications,
  bonding capacity, plant and staff counts, six named projects with locations
  and contract values, the LTI date, the total contract value.
- **The six work cards became types of work**, each one written to match the
  photograph that is actually in it. Four of the six original photographs
  showed the wrong subject entirely.
- **The top utility strip and the scrolling service ticker under the hero are
  gone** — both are banned house-wide now.
- **The hero photograph does the work.** The brand multiply dropped from 88% to
  28% and the scrim is now placed only where type sits, instead of a blanket
  wash over the whole image.
- **Two latent bugs fixed:** the hero fact strip was never full width (a flex
  child with `margin: 0 auto` stops stretching), and the header background was
  wired inside the GSAP branch, so with reduced motion the white wordmark sat
  invisible on the white sections.
- **A full mobile pass** — see `UNIVERSAL_COPY_RULES.md` for the list.

**Accent:** the theme's `--accent` — CTA fills, index numbers, the drawn line
and its head, the active node, the spine fill, focus underlines on the form.
The brand colour is the ground, not a second accent.

**Type pairing:** Inter 800/900 for display (uppercase, `-.035em` tracking,
hero at `clamp(44px, 10.8vw, 152px)`) + JetBrains Mono 400/500/700 for every
eyebrow, label, spec row, stat and figure.

**Degradation.** `prefers-reduced-motion` removes the intro, paints every
heading, row, node and count in its final state and forces the line fully
drawn. Below 1024px the pin is removed and the nav collapses to a burger; below
900px the process line becomes a straight left-hand rail; below 720px the work
grid, form and footer stack to one column.

**Placeholder assets:** 8 Unsplash direct URLs, each marked
`<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`. Every one has been
looked at and matches its caption. The hero wants a purpose-made image when
Higgsfield credits are available; `swap.json` lists it as `HERO`.
