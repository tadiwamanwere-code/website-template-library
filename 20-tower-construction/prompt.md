# Tower Construction — generation prompt

**Category:** Construction · Industrial
**Best for:** builders, civil engineers, contractors, plant hire, roofing, quarrying
**Signature motion:** a scroll-drawn SVG line, routed at runtime through the real positions of the process-step nodes with hard right-angle dog-legs, revealed by scrubbing `stroke-dashoffset`

---

Build a single self-contained `index.html` landing page for **[COMPANY NAME]**, a building
and civil engineering contractor in **[CITY]**, founded **[YEAR FOUNDED]**. Inline `<style>`
and `<script>`. Google Fonts via `<link>`. GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.13 via
CDN `<script>` tags. No npm, no build step, no React.

**The whole point is engineering confidence.** This must feel like a firm that pours
concrete, not a startup. Every corner is 0px — no border-radius anywhere, no box-shadows,
no soft cards. Sections are divided by 1px hairlines and 2px structural rules instead of
whitespace. Every number on the page sits in the mono face with
`font-variant-numeric: tabular-nums lining-nums` so figures align down a column.

**Colour.** Navy `#0E2A5E` (brand ground: header, hero overlay, process section, footer),
deeper navy `#061634` for the CTA band, amber `#F5A833` as the single accent, white `#FFFFFF`
ground below the fold with `#F4F5F7` for the capability band. Ink `#0B1C36`, body grey
`#66738A`, hairline rule `#D9DEE6`. Amber appears only on: the primary button, index numbers,
the drawn line and its head, active nodes, and form focus underlines. Never a background wash.

**Type.** Inter 800/900 for display — uppercase, `letter-spacing:-.035em`, `line-height:.9`,
hero at `clamp(44px, 10.8vw, 152px)`. JetBrains Mono 400/500/700 for every eyebrow, nav link,
label, spec row, stat and figure, tracked `.16em`–`.22em`, uppercase. Two faces only.

**Sections, in order.**
1. **Page-load intro** — navy screen split into two horizontal formwork panels. A mono counter
   ticks 0 → 100 beside the company name while an amber plumb line grows across the width.
   Then the panels slide apart (`power4.inOut`, ~1.05s).
2. **Header** — a slim navy utility bar with address, phone and **[ACCREDITATION]** that
   collapses to 0 height on scroll, then a transparent nav that turns solid navy when stuck.
   Left: a small monochrome tower/crane glyph plus a two-line wordmark. Centre: uppercase
   tracked mono links with an amber underline that wipes in from the left. Right: a square
   amber "Get a Quote" button.
3. **Hero** — full-bleed site photo, a navy layer at `mix-blend-mode: multiply` (opacity ~.88),
   a top-and-bottom legibility scrim, and six faint vertical hairlines across the frame. Content:
   a `—— SINCE [YEAR FOUNDED]` mono eyebrow with a 38px leading amber rule, the company name as a
   two-line hero headline, a mono strapline above a hairline, one paragraph, an amber
   "Request a Quote →" button and a ghost outline "View Our Work". A four-cell mono data strip
   sits along the bottom (established / projects delivered / grading / days without LTI), and a
   vertical "EXPLORE" cue with a running amber bar sits on the right edge.
4. **Ticker** — a thin navy strip of disciplines separated by amber squares. Supporting only.
5. **About + stats** — asymmetric two-column: heavy three-line heading and three paragraphs of
   real company history on the left, a 4:5 photo on the right with a navy data badge overlapping
   its bottom-left corner. Below, a four-column stat row under a 2px rule with count-up figures
   (years trading, projects delivered, square metres built, days without a lost-time injury).
   Group thousands with a thin space, not commas.
6. **Capability statement** — a two-line headline ("Solid Ground. Solid Build." or your own) and
   one paragraph on the left; six capability rows on the right (bonding capacity, plant fleet,
   workforce, batching, survey, quality), each with a mono index, an uppercase title and a
   right-aligned mono figure. Below it a six-cell credentials row of hairline boxes with real
   registration numbers.
7. **Services** — six cells in a 3×2 grid built as `gap:1px` over a rule-coloured background so
   the dividers are true hairlines. Each cell: amber mono index, heavy two-line title, three
   lines of copy, and a mono spec line pinned to the bottom. On hover a navy panel wipes up and
   the text inverts, index goes amber.
8. **Gallery / projects** — six named projects on a 12-column offset editorial grid, each with a
   different column span and a different top offset so nothing lines up. Every project carries a
   mono spec table: location, year/extent, floor area, client type, contract value. Invent real
   figures. Close with a total contract value line and a secondary button.
9. **Process** — navy section, six numbered stages alternating left and right of a central spine,
   with the scroll-drawn line (below).
10. **Quote form** — deep navy. Left: heading, paragraph, a mono contact list and an amber
    outlined "response within 2 working days" chip. Right: a form built as `gap:1px` cells with
    transparent inputs, mono micro-labels and an amber underline that wipes in on focus.
11. **Footer** — navy, four columns (brand + blurb, capability links, company links, a mono
    registrations list), then a bottom bar with the registered company number.

**Motion — at least four, real easing only (`power3.out`, `power4.out`, `power4.inOut`), never
`linear` or default `ease`.**
- **Signature:** generate the process SVG path in JS from the live `getBoundingClientRect()` of
  each step node. Route it with orthogonal dog-legs — down to the midpoint, across, down — so it
  reads as an engineering drawing. Draw it by scrubbing `stroke-dashoffset` on a ScrollTrigger,
  lay a faint grey twin path underneath as the undrawn route, ride an amber diamond along it with
  `getPointAtLength()`, and flip each node and its number to amber as the head passes the length
  fraction that node sits at. Rebuild on resize.
- Count-up statistics on ScrollTrigger enter.
- Hand-split line mask reveals on every big heading: author `.ln > span` wrappers with
  `overflow:hidden`, animate `yPercent: 112 → 0`, stagger 0.075s. Do not reference the paid SplitText.
- Parallax on the hero photo and clip-path reveals on gallery images
  (`inset(0 0 100% 0) → inset(0)` while the image settles from `scale(1.22)`).
- A pinned capability section (`pin:true`, `scrub:.6`) whose progress fills an amber spine and
  lights the six rows in turn.
- Magnetic amber buttons using a `gsap.ticker` lerp, disabled on coarse pointers.

**Hard rules.** No decorative gradients — the only gradient allowed is a dark legibility scrim
over the hero photo. No coloured icon badges, no circular icon chips, no emoji bullets; if an
icon appears it is monochrome, small and functional. One accent colour, used sparingly.
Typography carries the design. Copy must be specific and invented — real project names, real
locations, real contract values, real registration numbers. No lorem ipsum, no "Amazing Feature".
Include a `prefers-reduced-motion` block that kills the intro and paints every heading, row, node
and count in its final state. Below 1024px drop the pin and collapse the nav to a burger; below
900px the process line becomes a straight left-hand rail; below 720px everything stacks to one
column. Use free-license placeholder photography and mark each image
`<!-- PLACEHOLDER: swap for generated asset -->`.
