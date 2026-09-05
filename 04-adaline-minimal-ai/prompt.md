# Fernline Minimal AI — generation prompt

**Category:** Tech & SaaS
**Best for:** developer tools, AI infrastructure, observability and monitoring products, API companies, data platforms, technical B2B startups
**Signature motion:** a canvas flow-field rendered as ASCII density characters, with one continuous traced line drifting through it, paused when it scrolls out of view

---

Build a single self-contained `index.html` for **[BRAND NAME]**, a **[PRODUCT CATEGORY, e.g. self-correcting agent runtime]** for developers. Inline `<style>` and `<script>`. Google Fonts via `<link>`. Vanilla JavaScript only: **no GSAP, no React, no build step.** The hero visual is a `<canvas>` you draw yourself.

**Short page: nav, hero, a logo strip, and one capability section.** That is all. The mood is quiet, technical and confident. Cream paper, dark ink, one deep green. It should feel like a tool built by people who read papers, not like a marketing site.

**Colour.** Set these on `:root`. Cream ground `--cream: #f5f3ee`. Ink `--ink: #17190f`. Body grey `--gray: #6b6a63`. Muted grey `--gray-light: #9a988f`. Hairline `--line: #d9d6cc`. Accent `--accent: #1f2e1a`, a dark forest green, with `--accent-light: #37502e` for hover. The accent appears on the primary buttons and, at 55% alpha, on the traced canvas curve. Never as a background wash.

**Type: three faces, each with a job.** Fraunces (optical-size axis, weights 400/500/600) for the wordmark, `h1`, `h2`, `h3` and two of the fake client logos. Inter (400/500/600) for body copy and nav. IBM Plex Mono (400/500) for the badge, the capability index labels, the "TRUSTED BY" label and the canvas characters. Load all three in one Google Fonts request.

**Note the deliberate deviation:** buttons and the badge here are `border-radius: 999px` pills, not the square corners used elsewhere in this library. That is a genre choice for minimal AI product pages. Keep it.

**Layout, in order.**

1. **Nav.** Left: a 16px monochrome inline SVG mark (a simple stroked chevron or peak, `stroke: currentColor`, `stroke-width: 1.4`) beside the wordmark **[BRAND NAME]** set in Fraunces at 20px, weight 500. Right: two uppercase mono-tracked links (Docs, Changelog) at 12.5px with `letter-spacing: .08em`, then a dark green pill "Get Started".
2. **Hero, two columns.** Left is copy. An outlined pill badge in IBM Plex Mono, uppercase, 11px, 1px ink border, with an `↗` added via `::after`, reading **"[POSITIONING LINE, e.g. THE SELF-CORRECTING RUNTIME]"**. Then the `h1` in Fraunces at `clamp(40px, 4.6vw, 64px)`, weight 500, `line-height: 1.04`, `letter-spacing: -.02em`: **"[HEADLINE, e.g. Ship agents that watch themselves]"**. Then one 16.5px paragraph, `max-width: 460px`, that says exactly what the product does and what pain it removes. Then a row with a dark green pill "Get Started" and a plain text "Read the docs" link. Right column is the canvas visual.
3. **Trusted strip.** A mono uppercase "TRUSTED BY TEAMS AT" label at 11px, then five fake client names set as **text, not logo images**, each in a different face and weight so the row reads like real logotypes: Fraunces 600, Inter 600 tight, IBM Plex Mono 500, Inter 400 loose, Fraunces 400 italic. The whole row gets `filter: grayscale(1)` and `opacity: .55`.
4. **Capability strip.** A head row with the `h2` on the left at `clamp(26px, 2.6vw, 34px)` and a one-line qualifier on the right, aligned to the baseline. Below it three cards. Each carries a mono index in the form `01 / TRACE`, an `h3` in Fraunces, and one honest sentence of what it does. Three cards only. No icons.

**Motion.**

- **Signature, the generative canvas.** Size the canvas to its parent with `devicePixelRatio` capped at 2 and `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)`. Write a `field(x, y, t)` function that sums three sine and cosine waves at unrelated frequencies: `sin(x*0.012*1.3 + t*0.6)*0.5 + cos(y*0.02*1.7 - t*0.45)*0.35 + sin((nx+ny)*0.9 + t*0.3)*0.4`. Sample it on a 13px grid. Map the absolute value to a character from the ramp `.,:;+*#` and to an alpha of `0.14 + abs*0.5`, drawn in `9px "IBM Plex Mono"` in the ink colour. Skip any cell under `0.12` so the field stays airy. Over the top, trace one continuous path across the full width in 4px steps, its `y` driven by the same field at `t * 1.15` plus a slow `sin` wobble, stroked at `1.1px` in `rgba(31, 46, 26, 0.55)`. Advance `t` by `0.006` per frame in a `requestAnimationFrame` loop. Redraw on resize.
- **Be a good citizen:** an `IntersectionObserver` on the canvas cancels the frame loop when it leaves the viewport and restarts it when it returns.
- **Staggered load reveal.** Elements carry `class="reveal" data-d="0|1|2|3"`. On `DOMContentLoaded`, add an `in` class after `80 + d * 110` milliseconds, which fades and lifts each into place.
- Buttons lift `translateY(-1px)` and darken to `--accent-light` over 0.25s on hover.

**Hard rules.** No decorative gradients anywhere: this page has none at all, and it should stay that way. No coloured icon badges, no icon chips, no emoji bullets. The only icon is the small monochrome brand mark. Typography carries the design. Write real invented copy for **[BRAND NAME]**: real capability names, real client names, sentences a developer would believe. Never lorem ipsum, never "Amazing Feature". Add a `prefers-reduced-motion: reduce` block that shows every `.reveal` in its final state and freezes the canvas on a single drawn frame instead of looping. Responsive: the hero stacks to one column below roughly 900px, with the canvas keeping a fixed height, and the capability grid collapses to one column on small screens. If you use photography anywhere, mark it `<!-- PLACEHOLDER: swap for generated asset -->`.
