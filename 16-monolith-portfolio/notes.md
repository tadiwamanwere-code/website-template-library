# 16 — Monolith / Ivo Marchetti (creative-director portfolio)

**Inspiration:** the cursor-led WebGL portfolio lineage — `bruno-simon.com`-adjacent shader craft applied to an
`activetheory.net` / `studio-lxr` style type index, with the spare near-black chrome and mono metadata of
`locomotive.ca` and `godaylight.com`. Invented brand: **Monolith**, the one-director studio of Ivo Marchetti,
Berlin, active since 2013 — identity systems, editorial direction and launch film.

**The technique worth stealing:** the **OGL fragment-shader hover distortion**. A single fullscreen triangle
draws the hovered project image as a rectangle positioned at the *lerped* cursor, with an RGB-split whose
offset direction and magnitude are driven by **pointer velocity** — plus a concentric ripple, a directional
shear and a mild bulge that all ride the same velocity term. The plate is near-desaturated in-shader, and the
chromatic fringe is tinted toward the accent orange so the one colour in the palette only ever appears
*because the user moved*. Crossfades between projects run on a two-texture ping-pong (`uMix` 0↔1) rather
than a hard swap. Remote textures set `img.crossOrigin = 'anonymous'` — without it the texture upload throws.

**Graceful degradation (the part that matters):** OGL is pulled with a dynamic `import()` inside try/catch,
`Renderer` construction is wrapped, and a 5s watchdog fires if the module never boots (blocked CDN, no ESM,
no GL context). Any of those paths calls `enableCssFallback()`, which swaps in a fixed `<div>` reveal lerped
to the cursor with `gsap.quickTo` — transform/opacity only. Below 1024px the canvas and the fallback are both
off and each row shows a static inline thumbnail. Under `prefers-reduced-motion` the whole motion layer is
skipped and every element renders in its final state.

## Motion techniques (7 used; 4 required)

1. **WebGL shader hover distortion** (signature) — OGL, RGB-split + ripple + shear driven by pointer velocity.
2. **Lerped custom cursor** — 44px signal ring at 0.13 lerp + a 5px dot at 0.42, with a `View` state that
   fills the ring on project rows. rAF via `gsap.ticker`, never raw `mousemove` assignment.
3. **Hand-split character / word mask reveals** — recursive splitter that preserves inline tags, spans inside
   `overflow:hidden` lines, `yPercent 105 → 0`, `power4.out`, 0.022–0.035s stagger, ScrollTrigger-driven.
4. **Scroll-velocity skew** — Lenis `velocity` piped through `gsap.quickTo` to `skewY` on the work list,
   archive track and stat row, clamped to ±5.5° with a decay so it settles flat.
5. **Pinned horizontal scroll** — the Process Archive pins and scrubs `x` across five plates, with the images
   counter-moving `xPercent -5 → 5` inside their frames (parallax within the horizontal timeline).
6. **Parallax layers** — studio portrait scrubbed `yPercent -4 → 4`; hero name and hero base drift apart at
   different rates as the hero leaves.
7. **Page-load intro** — 000→100 counter, accent progress rule, staggered wordmark, then a
   `clip-path: inset(0 0 100% 0)` curtain lift that hands off into the hero character reveal.

Supporting only (not counted): client marquee, row outcome-line `grid-template-rows: 0fr → 1fr` expand,
award-row hover indent.

## Specs

- **Accent:** `#ff4d17` (signal orange) — cursor, shader fringe, hover index numerals, one underline. Nothing else.
- **Palette:** `#0a0a0a` ink / `#ededea` off-white / `#8f8f8a` + `#4a4a46` grays.
- **Type pairing:** **Anybody** (variable grotesk, `wdth` 104–134 / `wght` 400–800) for the display set —
  hero name at `clamp(56px, 13.4vw, 200px)`, project titles at `clamp(30px, 6.4vw, 104px)` — against
  **Spline Sans Mono** at 9–11px with `0.14–0.20em` tracking for all metadata. Extreme scale contrast is the
  whole idea: nothing lives between 20px and 56px except the pull quote.
- **Tech:** GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.13 (`lenis.on('scroll', ScrollTrigger.update)` +
  `gsap.ticker` raf loop, `lagSmoothing(0)`), OGL 1.0.11 as an ES module. No build step.
- **Assets:** Unsplash placeholders, every one marked `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
