# Brut Architecture — generation prompt

**Category:** Property & Architecture
**Best for:** architecture and urbanism practices, structural and civil engineers, planning consultancies, industrial design studios, construction technology firms, heritage and adaptive-reuse specialists
**Signature motion:** a horizontal project track, where vertical scroll drives `x` translation through full-height panels, each with its own internal parallax, and the pin distance is measured from the real track width so it never drifts

---

Build a single self-contained `index.html` for **[PRACTICE NAME]**, an architecture and urbanism practice in **[CITY, COUNTRY]**, founded **[YEAR]**. Inline `<style>` and `<script>`. Google Fonts via `<link>`. GSAP 3.12.5 plus ScrollTrigger from cdnjs and Lenis 1.1.13 from jsDelivr as CDN `<script>` tags. No npm, no build step, no React.

**This is a brutalist technical document, not a brochure.** Set `border-radius: 0 !important` on `*, *::before, *::after` and mean it. No box shadows, no soft cards. Structure is drawn with 1px and 2px hairlines and a visible column grid overlay. Every figure sits in the mono face. The page should read like a set of drawings.

**Colour.** On `:root`: concrete ground `--ground: #e8e6e1`, paper white `--paper: #f4f2ee`, darker block `--slab: #dedbd4`, ink `--ink: #111110`, mid grey `--ink-60: #6e6a62`, light grey `--ink-40: #9a958c`, hairlines `--line: rgba(17,17,16,.14)` and `--line-2: rgba(17,17,16,.28)`. One accent: `--accent: #ff3c00`, signal orange. It appears on the primary button, the drawn plan line, the progress bar and a handful of active states. Never a background wash. Also set `--pad: clamp(14px, 2.2vw, 34px)`, `--nav-h: 46px`, `--bar-h: 34px` and `--e-out: cubic-bezier(.16,1,.3,1)`.

**Type: two faces.** Archivo loaded with **both** variable axes, `wdth,wght@62..125,100..900`, so headings can be genuinely condensed or extended through `font-variation-settings`. IBM Plex Mono (400/500/600) for every label, section number, spec row, table cell and figure, uppercase and tracked. Nothing else.

**Sections, in order.**

1. **Loader.** Six full-height concrete columns over a face panel: the practice name and "Est. **[CITY]** **[ROMAN YEAR]**" across the top, a display line **"[POSITION STATEMENT, e.g. Structure as argument]"** in the middle, a growing bar, and a mono counter ticking `000` upward beside "Loading register, **[N]** built works".
2. **Persistent chrome.** A fixed 12-line grid overlay across the whole page, and a custom cursor element.
3. **Nav.** A small square mark plus the wordmark on the left, five tracked mono links in the centre, and on the right the studio's real latitude and longitude plus a **live ticking clock** updated every second.
4. **Hero.** A two-line display headline where the second line switches to a thinner width axis. Below it a three-part band: a lead paragraph and two buttons on the left, a mono `<dl>` spec list in the middle (founded, studio, principals, staff, registration number, built floor area to date), and a captioned photograph on the right with a `Fig. 01` caption.
5. **Ticker.** A thin strip of project names and years, duplicated for a seamless loop.
6. **§ 01 Position.** Section heads use a three-part row: a mono `§ NN`, the heading, and a mono meta line. Left column is a large statement paragraph plus a smaller policy paragraph and two partner signatures. Right column is the **drawn plan**: an inline SVG floor plan at `viewBox="0 0 820 470"` with a drawing-number tag above it.
7. **§ 02 Selected works.** The horizontal track. An intro panel with a three-line headline and a "Scroll to advance →" hint, then six full-height project panels, each with a photograph, a name, and a mono metadata block. A HUD along the bottom: the current index, a progress bar, and the total.
8. **§ 03 In detail.** One project examined properly. A full-bleed image stage with a hairline cross rule and four mono overlay figures at the corners, then three columns: **The problem**, **The move**, **The result**. Write these as real engineering prose with real dimensions, tonnages and costs.
9. **§ 04 Practice in numbers.** Four count-up statistics, each with a unit suffix and a horizontal bar that fills to a `data-bar` percentage. Below them a full project register table: number, project, location, year, area, typology.
10. **§ 05 Recognition.** A plain `<table>` of awards: year, award, project, category, result. Eight rows, real names, real outcomes including shortlists and longlists.
11. **§ 06 Commissions.** A three-line display headline over a grid-line backdrop, an email button, and the studio's email, phone and postal address.
12. **Footer.** Four link columns plus the registration numbers.

**Motion, seven techniques.**

- **Signature, the horizontal track.** Inside `gsap.matchMedia('(min-width: 1024px)')`, tween the track's `x` to `-(track.scrollWidth - window.innerWidth)` with `ease: 'none'`, `pin: true`, `pinSpacing: true`, `scrub: 1`, `anticipatePin: 1`, `invalidateOnRefresh: true`. Measuring the distance from the real width in a function is what stops the pin drifting when images load or the window resizes. `onUpdate` writes the progress bar width and the zero-padded index.
- **Per-panel parallax inside the track.** Each panel's image tweens `xPercent: -9 → 9` with its own ScrollTrigger using `containerAnimation: horizTween`, `start: 'left right'`, `end: 'right left'`. Each metadata block lifts and fades in the same way. Return a cleanup function that kills every sub-trigger.
- **SVG path draw.** Set `stroke-dasharray` and `stroke-dashoffset` from `getTotalLength()` and scrub the offset to zero on a ScrollTrigger at `scrub: 0.8`. Careful with units: `getTotalLength()` returns user units, so do not mix in percentage-based lengths or the draw desyncs.
- **Scrubbed clip-path reveal** on the showcase image, from `inset(14% 22% 14% 22%)` to `inset(0)`, with a parallax on the same image behind it.
- **Count-up statistics** with unit suffixes, plus the bars filling to their `data-bar` values.
- **Line-mask reveals** on every `[data-lines]` heading and word reveals on `[data-words]` paragraphs, authored by hand with `.line > span` wrappers and `overflow: hidden`.
- **Magnetic buttons** that pull within a radius, and a custom cursor that changes on `[data-hot]` elements.
- Wire Lenis with `lenis.on('scroll', ScrollTrigger.update)` and a `gsap.ticker` raf loop.

**Hard rules.** No decorative gradients anywhere. No coloured icon badges, no icon chips, no emoji bullets. Zero border-radius, no shadows. Typography carries the design. Every fact must be specific and invented for **[PRACTICE NAME]**: real project names and cities, real floor areas, real embodied-carbon figures, real award results, a real registration number and address. Never lorem ipsum. Read `prefers-reduced-motion` at the top of the script and, when set, skip the loader, kill every pin and scrub, paint the counts at their final values and show all content. Add a matching CSS `@media (prefers-reduced-motion: reduce)` block. Below 1024px, `gsap.matchMedia` swaps the horizontal track for a plain vertical stack with simple staggered entrances. Mark every image `<!-- PLACEHOLDER: swap for generated asset -->`.
