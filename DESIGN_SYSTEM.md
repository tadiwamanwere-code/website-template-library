# Website Template Library — Shared Design Rules

> **Scope note:** this document covers the *aesthetic* rules for every template.
> From batch 02 (templates 07+) onward it is paired with **`ANIMATION_PLAYBOOK.md`**,
> which raises the bar on scope and motion: full landing pages rather than heroes,
> GSAP + ScrollTrigger + Lenis, and at least four distinct motion techniques each.
> Read both before building. The aesthetic rules below still apply in full.

This library is a growing set of **standalone design showcases** (hero + a couple of signature sections each), not full working sites. Each template is a single self-contained `index.html` (inline CSS + JS, Google Fonts via `<link>`, no build step) that opens directly in a browser. The goal is a design *reference/skill library* an agency can lift patterns, typography, and motion from — not a finished product.

## Hard rules (apply to every template, no exceptions)

1. **No AI-slop gradients.** Never use a decorative rainbow/purple-blue gradient fill on backgrounds, buttons, or text as a stylistic crutch. Gradients are only allowed as a thin legibility scrim over a photo/video (dark-to-transparent overlay), never as the "brand" look.
2. **No colored icon badges / emoji bullets.** No circular gradient-filled icon chips, no colorful feature-icon grids. If an icon is used it's monochrome (currentColor / white / black), small, and functional — not decorative.
3. **Typography carries the design.** Every template leans on one strong display typeface pairing (see per-template spec) at large sizes as the primary visual interest — not stock photography with icon soup.
4. **Real motion, not just fade-ins.** Use word/line reveal on scroll, hover-weight text (variable font weight on mousemove), marquee/scroll-linked transforms, magnetic buttons, or number count-ups — something with actual craft, matching the reference site behavior for that template.
5. **One accent color per template max**, used sparingly (a button, an underline, a badge outline) — never as a background wash. Everything else is near-black / near-white / true grays.
6. **Self-contained.** Inline `<style>` and `<script>`, Google Fonts `<link>` tag, no npm/build step, no external JS frameworks unless loaded via CDN `<script>` tag (e.g. GSAP is fine via CDN if genuinely needed for scroll effects).
7. **Assets:** the `higgsfield` MCP server is **authenticated and connected**. Its tools load at session start, so a session begun before authentication will not see them — start a fresh session to use it. Until an asset is regenerated, templates use free-license placeholders (Unsplash / Pexels / Coverr direct URLs) chosen to match each template mood. Every placeholder carries an HTML comment `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->` so a swap pass is a simple find-and-replace.
8. **Responsive**, but desktop-first polish matters most since these are design references.
9. Every template folder gets: `index.html`, `notes.md` (2-3 lines: what real site inspired it, the one animation technique worth stealing, the accent color hex).

## Reference sites actually studied for this batch (via Playwright, screenshots in `_inspo-notes/`)

- **godaylight.com** — serif display headline over dark photo, solid-orange (not gradient) brand block, monospace data-readout labels, thin grid overlay lines.
- **adaline.ai** — cream/off-white background, generative ASCII-art line drawing as hero visual (instead of photo/gradient), monospace pill badge, small-caps nav.
- **locomotive.ca** — bold serif display type mixed with mono tag boxes, duotone-red photo treatment, asymmetric layout, glitch/pixel-block accent.

## Roster

**Batch 01 — hero-only showcases** (built before `ANIMATION_PLAYBOOK.md` existed; lighter motion, shorter pages)

| # | Folder | Genre |
|---|--------|-------|
| 01 | `01-velora-dark-luxury` | Dark luxury car rental (exact client spec) |
| 02 | `02-healcure-medical` | Healthcare landing, Tailwind (exact client spec) |
| 03 | `03-geptral-eco-cinematic` | Cinematic nature-tech |
| 04 | `04-adaline-minimal-ai` | Minimal AI product, generative canvas |
| 05 | `05-locomotive-editorial` | Editorial agency, CSS duotone |
| 06 | `06-graza-dtc-product` | Playful DTC product |

**Batch 02 — full landing pages** (GSAP + ScrollTrigger + Lenis, 4+ motion techniques each)

| # | Folder | Genre | Signature motion |
|---|--------|-------|------------------|
| 07 | `07-noir-omakase` | Omakase counter | Pinned tasting-menu scrub |
| 08 | `08-brut-architecture` | Architecture studio | Horizontal project track |
| 09 | `09-atlas-realestate` | Residential development | Sticky stacking cards |
| 10 | `10-cadence-fashion` | FW26 fashion lookbook | Contextual cursor + velocity skew |
| 11 | `11-meridian-watches` | Independent horology | Scrubbed exploded view + SVG callouts |
| 12 | `12-frequency-artist` | Recording artist | Canvas visualiser |
| 13 | `13-ledger-fintech` | Treasury platform | Scroll-drawn SVG charts |
| 14 | `14-orbit-devtool` | Developer tooling | Replayed terminal session |
| 15 | `15-solstice-resort` | Private island resort | Multi-depth parallax chapters |
| 16 | `16-monolith-portfolio` | Creative portfolio | WebGL hover distortion |
| 17 | `17-select-conference` | Dev conference | Coded 1-bit dithered portraits |

## Previewing

`node serve.js` from the library root, then open <http://localhost:4173>. The gallery at `index.html` renders every template as a **live scaled iframe**, so the grid shows real running pages rather than screenshots. Serving over HTTP (rather than opening `file://`) matters: iframes, canvas `getImageData`, and CORS-dependent WebGL textures all misbehave on `file://`.

More templates get added to this library over time — keep new ones consistent with the rules above and with `ANIMATION_PLAYBOOK.md`.
