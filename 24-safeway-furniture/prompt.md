# Safeway Furniture — generation prompt

**Category:** Retail · Manufacturing
**Best for:** fitted furniture, joinery, kitchens, interiors, cabinetmakers, made-to-measure trades
**Signature motion:** a pinned horizontal track where vertical scrolling drives the four process steps sideways, each panel's photo drifting on its own axis via GSAP `containerAnimation`

---

Build a single self-contained `index.html` landing page for **[COMPANY NAME]**, a made-to-measure furniture maker in **[CITY]** trading since **[YEAR FOUNDED]**. They measure on site, manufacture **[PRODUCT TYPE]** in their own workshop, and install with their own team. That vertical integration is the entire sales argument — the page must show the making, not just the finished room.

**Tone:** solid, made-by-hand, unfussy. A real workshop that does careful work. Not a luxury boutique, not a flat-pack warehouse. Dark, warm, confident.

## Palette and type

Deep navy ground `#0A1120`, panels at `#0D1526` and `#111B2F`, hairlines `rgba(143,180,240,.13)`, text `#EDF1F8`, muted `#94A3BF`. **One accent: periwinkle `#8FB4F0`** for pill CTAs, the short leading rule on eyebrows, progress fills, the drag handle and cost figures. Never as a background wash, never a gradient.

Two faces only: **Outfit** (200–900) for display and body, tracking `-0.032em` to `-0.045em` at large sizes, and **DM Mono** for eyebrows, spec labels, dimensions and prices. Hero headline `clamp(3.3rem, 9.1vw, 9.4rem)`, weight 800, line-height 0.9.

## Layout, section by section

1. **Slim contact bar above the nav** — opening hours left, street address and phone right, mono, 11.5px, tracked.
2. **Nav** — monochrome logo mark, wordmark with a mono subtitle, text links with an underline that sweeps in from the left, one periwinkle "Get a quote" pill. Add a blurred navy background after 30px of scroll.
3. **Page-load intro** — a tape measure runs out: ruler ticks wipe in under an animated `clip-path` while a mono readout counts 0 → **[ROOM WIDTH]** mm, then the whole panel lifts on `inset(0 0 100% 0)` with `expo.inOut`.
4. **Hero** — full-bleed dark interior photo under a navy multiply layer plus a left-to-right legibility scrim. Eyebrow with a 36px leading rule, a two-line headline, one paragraph, a filled pill and an outline pill with an arrow, then a mono trust line: "Established [YEAR FOUNDED] · Manufacturer & supplier · Free measure and quote". On the right, a thin SVG dimension-line overlay (arrowed extension lines with mm labels) that draws itself in — it reads as a survey sheet, not decoration.
5. **Under one roof** — an argument paragraph against middlemen, beside a four-cell hairline grid of count-up figures: installs completed, years trading, average lead time in working days, workshop floor area.
6. **The four-step journey** — measure → design → manufacture → install, as a horizontal track. Each panel: photo with a step index and a huge ghost numeral, then heading, a duration chip, a real paragraph of what actually happens, a four-item spec list (where / who / what you get / cost) and a mono footnote (tolerance, deposit terms, guarantee).
7. **Materials and finishes** — a genuine spec sheet. Sticky left rail of six categories (carcass board, doors and fronts, edging, hinges and runners, worktops, handles), right side a five-column table: option, specification, thickness, where we use it, cost delta. Name real grades and models. Close with a line telling the reader to demand the same sheet from competing quotes.
8. **Inside the unit** — a closed/open clip-path reveal on one fitted run, with a draggable divider, then a four-cell strip of what is behind the door (back thickness, adjustable feet, shelf-pin system, drawer load rating).
9. **What we fit** — four room types in a two-column broken grid with alternating vertical offsets, each with a photo, three specific bullets, a from-price and a lead time in working days (e.g. "from $2,850 per 4 m run · 24–32 working days").
10. **Recent installations** — a 12-column grid of six shots at mixed spans, captioned with room type, suburb and year.
11. **Free measure and quote** — copy plus a numbered "what happens next" list on the left, a real form on the right (name, phone, suburb, room type select, preferred week, notes) that confirms locally with a generated reference number.
12. **Footer** — four columns, showroom and workshop addresses in a bordered definition list, then an oversized outlined wordmark and a mono bottom bar.

## Motion (GSAP 3.12.5 + ScrollTrigger + Lenis, all via CDN)

Wire Lenis with `lenis.on('scroll', ScrollTrigger.update)` and a `gsap.ticker` raf loop. Use at least these:

1. **Pinned horizontal track** for the four steps — `pin: true`, `scrub: 0.85`, `end: () => '+=' + travel()`, `invalidateOnRefresh: true`, plus a progress rail with a live step marker.
2. **Per-panel parallax inside the track** using `containerAnimation` on the horizontal tween.
3. **Closed/open clip-path reveal** — scrub the split on entry, then hand control to pointer drag and arrow keys the instant the user touches it.
4. **Count-ups** on the workshop figures, `once: true`, with a hairline bar drawing across each cell.
5. **Staggered spec rows** on first scroll and again on every category switch (0.045–0.055s apart).
6. **Multi-speed parallax** on gallery and room imagery via a `data-par` value per image.
7. **Hand-split line masks** on every heading — split on `<br>`, wrap in `overflow:hidden`, `yPercent: 108 → 0`, stagger 0.075s. Never reference the paid SplitText plugin.

Easing is `power3.out`, `power4.out` or `expo.inOut`. Reveals 0.6–1.4s, micro-interactions 0.2–0.3s. Never `linear`, never default `ease`.

## Hard rules

- One file. Inline `<style>` and `<script>`. Google Fonts via `<link>`. CDN `<script>` tags only. No npm, no build step, no React.
- No decorative gradients (a dark-to-transparent scrim over a photo is the only exception), no coloured icon badges, no emoji bullets, one accent colour.
- Copy must be specific and invented for the brand — real hardware model numbers, board grades, worktop rates per linear metre, real suburb names, honest lead times. No lorem ipsum, no "Amazing Feature".
- Use `gsap.matchMedia()` so that below 1024px the pin, the horizontal track, all parallax and the magnetic buttons revert and the steps stack vertically. The spec table must relabel its cells inline on mobile.
- Ship a `prefers-reduced-motion` path that skips the intro and lands every element in its final state, and a no-JS bail-out that paints the finished page.
- Free-license placeholder images, each marked `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
