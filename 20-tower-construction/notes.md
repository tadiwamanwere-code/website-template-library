# 20 — Tower Construction (building & civil engineering)

**Original.** `tower-construction-ten.vercel.app` (Rylo Labz client site), screenshot in
`_inspo-notes/rylo-originals/tower.png`. Kept: Inter + JetBrains Mono, `#0E2A5E` navy,
`#F5A833` amber CTA, white ground below the fold, the full-bleed crane photo with a navy
multiply overlay, the `—— SINCE 1980` mono eyebrow with its short leading rule, uppercase
tracked nav, amber primary + ghost secondary, the `EXPLORE` scroll cue, the Category "A"
CIFOZ trust signal, and the seven-section order (hero → about + stats → capability →
services → gallery → process → quote).

**The position in the library: engineering confidence.** Every corner is 0px. No shadows,
no rounded cards, no soft anything. Sections are separated by hairline and 2px structural
rules rather than whitespace. Every number on the page is JetBrains Mono with
`font-variant-numeric: tabular-nums lining-nums`, so figures align down a column to the
pixel. It should read like a firm that pours concrete, not a startup.

## Motion techniques (6 distinct + 1 supporting)

1. **Scroll-drawn SVG line through the process** *(the signature — worth stealing)* — the
   path is **generated at runtime** from the real `getBoundingClientRect()` of each of the
   six step nodes, routed with orthogonal dog-legs (down, across, down) so it reads as an
   engineering drawing rather than a curve. `stroke-dasharray`/`stroke-dashoffset` is
   scrubbed to a ScrollTrigger, a faint grey twin path sits underneath as the undrawn
   route, an amber diamond head rides the line via `getPointAtLength()`, and each node
   +number flips to amber as the head passes the length fraction that node sits at.
   Rebuilt on resize, so it re-routes as a straight vertical rail below 900px.
2. **Pinned capability scrub** — `#capability` pins for `+=2100` with `scrub: .6`; progress
   fills the amber spine (`scaleY`), lights the six capability rows one at a time, and
   drives the `01 / 06` mono counter. Torn down below 1024px by `gsap.matchMedia()`, which
   swaps in a per-row enter trigger instead.
3. **Count-up statistics** — 45 years, 312 projects, 1 480 000 m², 2 190 days without an
   LTI. Thousands are grouped with a thin space (SI style, not commas) by a formatter, so
   tabular digits never jitter mid-count.
4. **Hand-split line mask reveals** — every big heading is authored as
   `.ln > span` wrappers, `yPercent: 112 → 0`, `power4.out`, 0.075s stagger, fired by
   ScrollTrigger. No paid SplitText.
5. **Clip-path gallery reveals + parallax** — each project image wipes open with
   `clipPath: inset(0 0 100% 0) → inset(0)` on `power4.inOut` while the image itself
   settles from `scale 1.22`; the hero photo and the about photo run at different scrub
   speeds.
6. **Magnetic buttons** — the amber CTAs pull toward the pointer through a `gsap.ticker`
   lerp, never raw `mousemove` assignment. Disabled on coarse pointers.
   Plus a **page-load intro**: a mono counter ticks 0 → 100 while an amber plumb line
   grows across the width, then the navy formwork splits horizontally on `power4.inOut`.
   *Supporting only:* the discipline ticker under the hero.

**Changed from the original.** Six real named projects replace the plain photo grid, each
with location, year, floor area, client type and contract value in a mono spec table, laid
out on a 12-column offset editorial grid rather than a square gallery. The process section
became a proper numbered zig-zag sequence with the drawn line. A six-cell credentials row
(CIFOZ, PRAZ, ISO, ZIMRA, NSSA) was added under the capability statement.

**Accent:** `#F5A833` amber — CTA fills, index numbers, the drawn line and its head, the
active node, the spine fill, focus underlines on the form. Navy `#0E2A5E` is the brand
ground, not a second accent.

**Type pairing:** Inter 800/900 for display (uppercase, `-.035em` tracking, hero at
`clamp(44px, 10.8vw, 152px)`) + JetBrains Mono 400/500/700 for every eyebrow, label, spec
row, stat and figure, at `.16em`–`.22em` tracking.

**Degradation.** `prefers-reduced-motion` removes the intro, paints every heading, row,
node and count in its final state and forces the line fully drawn. Below 1024px the pin is
removed and the nav collapses to a burger; below 900px the process line becomes a straight
left-hand rail; below 720px the gallery, form and footer stack to one column.

**Placeholder assets:** 8 Unsplash direct URLs, each marked
`<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
