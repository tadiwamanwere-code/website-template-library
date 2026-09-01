# Geptral — Dark Cinematic Eco-Restoration

- **Source:** adapted from a large Geptral React/Framer-Motion spec (dark nature-restoration-tech brand) down to hero + collage + focus-areas, rebuilt in vanilla JS/CSS, no build step.
- **Steal this technique:** the wordmark hover-weight effect uses Google Fonts' variable-range syntax (`Inter+Tight:wght@100..900`), which serves one true variable-font file — so each letter's `font-weight` is a real animatable CSS property, not a cross-fade hack. `mousemove` reads `event.movementX` sign to snap all letters toward 200 (thin) moving left-to-right and back to 900 moving right-to-left, each letter staggered 16ms for a cascading wave. Runs identically to the framer-motion original with zero JS animation libraries.
- **Accent color:** `#DE7D4D` (burnt orange) — used in exactly one place, the nav-link hover underline, so it never reads as a brand wash.
