# 24 — SAFEWAY FURNITURE · Fitted furniture & joinery

**Genre:** made-to-measure / fitted furniture. Fitted kitchens, bedroom wardrobes, office furniture and retail shopfitting in Harare since 2012.

**Inspiration:** rebuild of the real client site <https://safewayfurniture.co.zw> (`_inspo-notes/rylo-originals/safeway.png`). Kept from the original: the deep navy ground, the light periwinkle pill CTAs, the heavy tight geometric headline "Built to fit your space.", the dark fitted-kitchen photo under a navy wash, the slim contact bar carrying address and phone above the nav, and the trust line "Established 2012 · Manufacturer & supplier · Free measure and quote".

**Accent:** `#8FB4F0` (periwinkle) — pills, the leading rule on eyebrows, the process progress fill, the reveal handle, active spec tab, cost deltas. Never a background wash.

**Typography:** Outfit 200–900 (heavy geometric display and body, tracking `-0.032em` to `-0.045em` at size) against DM Mono (eyebrows, spec labels, dimensions, prices). Geometric-sans against technical mono — the workshop pairing, deliberately not the serif-luxury or condensed-editorial routes used elsewhere in the library.

## Structural differentiator

Four of the batch-03 originals share one hero skeleton. This one keeps that hero and then goes somewhere none of the others do: **a process-and-materials story**. The page argues for vertical integration by showing the making — the four-step journey with real durations, then a spec sheet naming boards, edging, hinge models and worktop grades, then a look inside the carcass. It is dense-information, not airy-minimal.

## Motion techniques (eight; four is the bar)

1. **Horizontal scroll track through the four process steps** — *the signature.* `ScrollTrigger` pins `.proc-pin` and vertical scroll drives `x` on a wide flex track through measure → design → manufacture → install, with a progress rail and a live step marker underneath. Distance is recomputed on refresh (`invalidateOnRefresh`), so it survives resize.
2. **Per-panel parallax inside the track** — each step photo scales and drifts on its own `ScrollTrigger` using `containerAnimation: hTween`, so the images move against the panel as it crosses the viewport. The step copy fades up from `0.25` opacity on the same axis.
3. **Closed/open clip-path reveal on a fitted unit** — two stacked photos, `clip-path: inset(0 0 0 calc(var(--p) * 1%))` on the top layer. Scroll scrubs the split from 98% to 30% on entry; the moment the user grabs the handle the scroll tween is killed and pointer drag takes over. Arrow keys, Home and End work too (`role="slider"` with a live `aria-valuenow`).
4. **Count-ups on the workshop figures** — 1,240 installs, 13 years, 26-day average lead time, 1,800 m² of workshop floor, each with a hairline bar that draws across the top of its cell.
5. **Staggered spec-row reveals** — the materials sheet staggers its rows in on first scroll, and re-staggers them every time you switch category on the sticky left rail.
6. **Multi-speed parallax on gallery and room imagery** — `data-par` sets each image's own travel (9 to 14 yPercent), so the installation grid does not move as one slab.
7. **Hand-split line mask reveals** — every heading is split on `<br>` into `overflow:hidden` wrappers, `yPercent: 108 → 0`, staggered 0.075s on `power4.out`. No paid SplitText plugin.
8. **Page-load intro** — a tape measure runs out: the ruler ticks wipe in under a clip-path while a mono readout counts 0 → 3,600 mm, then the curtain lifts on `expo.inOut` and the hero's SVG dimension lines draw themselves in with `stroke-dashoffset`.

Supporting only: magnetic pills (rAF lerp toward the pointer, desktop only) and the nav underline sweep.

## Copy

Invented but specific: real hardware model numbers (Blum CLIP top BLUMOTION, TANDEM, LEGRABOX pure, AVENTOS HF, Hettich Sensys 8645i), real board grades (E1 MFC, MR MDF, BS 1088 marine ply), real worktop rates per linear metre, real Harare suburbs on the installations, and honest from-prices with lead times per room type.

## Degradation

- **Below 1024px:** `gsap.matchMedia()` reverts the pin, the horizontal track (steps stack vertically), all parallax and the magnetic buttons. The spec table drops its column heads and relabels each cell inline. The reveal starts part-open and stays draggable by finger (`touch-action: pan-y` keeps the page scrolling).
- **`prefers-reduced-motion`:** the intro is skipped entirely, the track stacks, every heading and count lands in its final state, and no scrub or pin is created.
- **No GSAP / no JS:** an early bail-out paints the final state; a `<noscript>` block unlocks the body and shows all spec rows.

**Assets:** 17 Unsplash placeholders, every one carrying `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.

**Not yet added to the root gallery** (`index.html` template list) — that file is being edited by the other batch-03 builds at the same time, so the row is left for the batch's final pass.
