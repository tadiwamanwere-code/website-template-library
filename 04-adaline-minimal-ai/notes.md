# Fernline — Minimal AI Developer Tools Hero

- **Source:** adaline.ai (cream background, ASCII line-art hero, monospace pill badge, small-caps nav), screenshot in `_inspo-notes/adaline-1.png`.
- **Steal this technique:** the hero visual is a `<canvas>` flow-field — a summed sine/cosine noise function sampled on a 13px grid and rendered as ASCII density characters (`.,:;+*#` by opacity/weight), with one continuous traced curve drawn over it that drifts via a slow-incrementing `t`. Paused via `IntersectionObserver` when off-screen. Reads as generative technical art, not a stock image or gradient blob.
- **Accent color:** `#1F2E1A` (dark forest green), used only on the primary button and its hover state.
- **Intentional deviation:** buttons here are pill/rounded-full (`border-radius: 999px`) rather than the square corners used elsewhere in this library — a deliberate genre choice for the minimal-SaaS/AI aesthetic, not an inconsistency.
