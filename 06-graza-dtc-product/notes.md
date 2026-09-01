# 06 — Graza DTC Product (Hotshot Hot Sauce)

- **Inspiration:** graza.co (loud flat single-color brand block, chunky rounded display type, squeeze-bottle product-as-hero) crossed with menkind.co's playful die-cut sticker badges.
- **Animation technique worth stealing:** the tilt-card is split across two nested elements — the outer div runs the continuous CSS `float` keyframe loop (using individual `translate`/`rotate` properties), while an inner div receives the JS `mousemove`-driven `rotateX/rotateY` tilt. Keeping them on separate elements avoids the classic bug where a CSS animation on a node always wins the cascade over an inline `style.transform` set on that same node.
- **Accent color:** `#E4572E` (flat tomato-orange), paired with `#b8431f` as its own pressed/shadow shade — one hue, no gradients.
