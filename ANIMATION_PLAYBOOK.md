# Animation & Depth Playbook — Batch 02 Standard

Batch 01 was hero-only and motion-light. **This is the new bar.** Every template from batch 02 onward must clear it. Read this together with `DESIGN_SYSTEM.md` (whose aesthetic rules — no slop gradients, no colored icon badges, typography-led, one accent max — still fully apply).

---

## 1. Scope: FULL landing page, not a hero

Each template is a complete landing experience, minimum **6 sections plus a real footer**:

1. **Page-load intro** — a curtain/counter/mask reveal that runs once before the hero settles. Not a plain body fade.
2. **Hero** — the signature statement.
3. **A pinned or scroll-driven section** — something that holds position while content advances (see §3).
4. **A content section with genuine layout invention** — asymmetric grid, broken grid, editorial columns, overlapping type. Never a centered 3-column icon-card row.
5. **A showcase section** — horizontal-scroll gallery, stacking cards, image sequence, or a marquee-driven index.
6. **A proof/detail section** — numbers that count up, an accordion/list with real interaction, a comparison, or a spec table with hover states.
7. **A closing CTA + full footer** — multi-column footer with real link groups, not one line of copyright.

Copy must be **specific and invented for the brand** — real product names, real-sounding claims, actual numbers. Never "Lorem ipsum", never "Your Headline Here", never generic filler like "Amazing Feature".

---

## 2. Required tech

- **GSAP 3 + ScrollTrigger via CDN** (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` and `.../ScrollTrigger.min.js`). Also allowed: `SplitText` alternatives written by hand (split text into chars/words/lines yourself — the official SplitText is a paid plugin, do NOT reference it).
- **Lenis smooth scroll** via CDN (`https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js`) wired into ScrollTrigger — this single addition is most of what makes a site feel "expensive". Hook it up properly with `lenis.on('scroll', ScrollTrigger.update)` and a `gsap.ticker` raf loop.
- Optional where it genuinely serves the design: **Three.js / OGL** for shader work.
- Still a **single self-contained `index.html`** per template (inline `<style>` + `<script>`, CDN `<script>` tags allowed, Google Fonts via `<link>`). No npm, no build step.

---

## 3. Motion techniques — use AT LEAST FOUR per template, and vary which four across templates

- **Pinned scroll section** — `ScrollTrigger` with `pin: true` and `scrub`, where content transforms as the user scrolls through a held viewport.
- **Horizontal scroll panel** — vertical scroll drives `x` translation of a wide track.
- **Character/word/line mask reveal** — split text by hand into spans, each inside an `overflow:hidden` wrapper, `yPercent: 100 → 0`, staggered. Driven by ScrollTrigger, not just on load.
- **Clip-path / mask image reveals** — `clipPath: inset(...)` or `circle()` animated on scroll.
- **Scroll-scrubbed image sequence or scale-through** — an image that scales from a small card to full-bleed as you scroll, or a canvas-drawn frame sequence.
- **Magnetic buttons / custom cursor** — cursor lerps toward target; buttons pull toward the pointer within a radius. Must use `requestAnimationFrame` easing, never raw `mousemove` assignment.
- **Stacking / overlapping cards** — cards that stack with `position: sticky` and scale down as later ones cover them.
- **Count-up numbers** — driven by ScrollTrigger entering the viewport.
- **SVG path draw** — `stroke-dasharray`/`stroke-dashoffset` animated on scroll.
- **Marquee** — but only as a *supporting* element, never as one of your four; it's too cheap to count.
- **Parallax layers** — different `y` speeds per depth layer on scroll.

**Anti-patterns that do NOT count as animation:** a plain opacity fade-in, a hover color change, a CSS `transition` on a button. Those are baseline hygiene, not motion design.

---

## 4. Craft requirements

- **Easing:** use real curves — `power3.out`, `power4.inOut`, `expo.out`, or custom `CustomEase`-style cubic-beziers. Never `linear`, never default `ease`.
- **Stagger:** grouped elements animate in sequence (0.04–0.09s apart), never all at once.
- **Durations:** 0.6–1.4s for reveals. Snappy micro-interactions 0.2–0.3s. No 3-second fades.
- **`prefers-reduced-motion`:** every template must include a media query that disables scrub/pin animations and shows content in its final state.
- **Mobile:** disable pinning, horizontal scroll, and custom cursors below 1024px — degrade to clean vertical stacking. Test the layout mentally at 390px width.
- **Performance:** animate only `transform` and `opacity` where possible. Use `will-change` sparingly. Lazy-load below-fold images.

---

## 5. Typography bar

- Two typefaces maximum per template, and they must **contrast** (e.g. a high-contrast display serif against a neutral grotesk; or a wide grotesk against a mono).
- The hero headline should be genuinely large — `clamp()` scaling into the 80–200px range on desktop.
- Use real typographic detail: optical alignment, tracking adjustments on uppercase (`letter-spacing: 0.08em+`), tabular numerals for stats, hanging punctuation where it reads well.
- Vary the type personality hard across templates — a brutalist architecture site and a luxury watch site must not feel like siblings.

---

## 6. Per-template deliverables

```
NN-name/
  index.html    ← the full landing page
  notes.md      ← inspiration source, the 4+ motion techniques used, accent hex, typography pairing
```

Every placeholder asset keeps its `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->` comment so assets can be swapped in one pass.

---

## 7. The differentiation rule (most important)

The 10 templates in this batch must feel like they came from **10 different studios**. Before building, deliberately choose a distinct position on each axis:

- **Palette:** dark / light / cream / duotone / high-key color
- **Layout:** centered / asymmetric / broken-grid / full-bleed editorial / dense-brutalist
- **Type personality:** serif-luxury / grotesk-neutral / mono-technical / condensed-editorial / rounded-playful
- **Signature motion:** pin-scrub / horizontal / stacking-cards / cursor-driven / shader-distortion
- **Density:** airy-minimal / dense-information

If a new template shares three or more axis positions with an existing one, change direction before writing code.
