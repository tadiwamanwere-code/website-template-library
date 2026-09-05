# Geptral Eco Cinematic — generation prompt

**Category:** Tech & SaaS
**Best for:** climate tech, energy and utilities, environmental consultancies, impact funds, infrastructure engineering, research institutes, deep-tech companies with a mission
**Signature motion:** a real variable-font wordmark whose letters snap thin or heavy depending on which way your mouse is travelling, each letter staggered 16ms behind the last

---

Build a single self-contained `index.html` for **[BRAND NAME]**, a **[SECTOR, e.g. nature restoration]** company. Inline `<style>` and `<script>`. Google Fonts via `<link>`. Vanilla JavaScript only: **no GSAP, no animation library, no build step, no React.** The whole thing runs on CSS transitions, `IntersectionObserver` and one `requestAnimationFrame` loop.

**Three sections only:** a full-screen video hero, an image collage, and a focus-areas grid. No footer, no pricing, no testimonials. The mood is dark, cinematic and grown-up. It should read like the opening title card of a documentary, not a startup deck.

**Colour.** Set these on `:root`. Ground `--bg: #1b1b1b`. Foreground `--fg: #ffffff`. Muted text `--muted: #888888`. Hairlines `--line: rgba(255,255,255,0.15)` and `--divider: rgba(255,255,255,0.25)`. One accent, `--accent: #DE7D4D`, a burnt orange. **Use the accent in exactly one place: the 1px underline that wipes across a nav link on hover.** Nowhere else. That restraint is the design. Also set `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` and use it for every transition.

**Type.** Inter Tight, loaded as a true variable font with the range syntax: `family=Inter+Tight:wght@100..900`. That single request matters, because it serves one variable file, which makes `font-weight` a genuinely animatable property. One family for everything.

**Sections, in order.**

1. **Hero.** `height: 100vh`, `min-height: 720px`, `overflow: hidden`. A full-bleed muted looping `<video>` under a dark scrim. Header row across the top: the wordmark **[BRAND NAME]** on the left, split into one `<span>` per letter; three uppercase nav links (12px, `letter-spacing: .12em`) in the centre; then "Sign In" and a solid white "Join [BRAND NAME]" button with `border-radius: 3px` on the right. Below the header a 1px divider rule that grows from 0% to full width over 1.4s. At 46% height, two small uppercase tag lines pushed to the outer edges of the frame, `pointer-events: none`. At `bottom: 110px`, the headline **"[HEADLINE, e.g. Preserving Nature for Future Generations]"** at `clamp(40px, 7.4vw, 96px)` over two lines, and one paragraph saying plainly what the company does. At `bottom: 24px`, a footer row: a mission line on the left, "Scroll to Explore" on the right.
2. **Collage.** One masked headline at `clamp(30px, 4.6vw, 58px)`: a single sentence with a real idea in it, not a slogan. Below it a horizontal row of five photographs, `display: flex`, `align-items: flex-end`, 18px gap, `overflow-x: auto` with the scrollbar hidden. Deliberately mismatched sizes so the tops stagger: widths 26%, 20%, 24%, 18%, 20% and heights 420px, 310px, 480px, 260px, 360px. `border-radius: 2px`.
3. **Focus areas.** A two-column grid. Left column is sticky: a mono-feeling eyebrow carrying the section number then "Focus Areas", and one sentence of context. Right column holds four items in a 2x2 grid, each with a thin rule above it, an `<h3>` discipline name, and a four-item plain `<ul>` of concrete capabilities. Real specifics, never feature-speak.

**Motion, four techniques.**

- **Signature, the hover-weight wordmark.** Listen for `mousemove` on the wordmark. Read `event.movementX`. If it is positive, set every letter's `style.fontWeight` to `200`; if negative, `900`. Give each letter `transitionDelay = i * 16` milliseconds so the change ripples along the word. On `mouseleave` restore all letters to `900`. This works because the variable font makes weight a real interpolated property, so it is a genuine morph, not a cross-fade.
- **Word-mask scroll reveal.** For each `[data-reveal]` heading, split its text on whitespace in JavaScript, wrap each word in a `.word-mask` with `overflow: hidden` holding a `.word-inner` span, and set each inner span's `transitionDelay` to `i * 0.055s`. An `IntersectionObserver` at `threshold: 0.35` adds `.in-view`, which slides the inner spans up into place, then unobserves.
- **Custom cursor chip.** A fixed 64px circle holding a small monochrome arrow SVG. It fades and scales in only when the pointer is over a collage image. Its position lerps toward the mouse at `0.16` per frame inside a `requestAnimationFrame` loop, so it trails the cursor rather than tracking it exactly. Gate the whole thing behind `matchMedia('(min-width: 1025px)')` and hide it under 1024px.
- **Hero load-in.** Elements carry a `--d` custom property (0, 1, 2) used as a stagger index. Add an `is-loaded` class to the hero on `window.load`, with a 1.2s `setTimeout` fallback so a slow video can never hold the text hostage.
- Plus a video watchdog: retry `play()` on `pause`, `ended`, `loadedmetadata`, on `visibilitychange` when the tab returns, and from a 1500ms interval whenever `video.paused`.

**Hard rules.** No decorative gradients: the hero scrim is the only gradient and it exists for legibility. No coloured icon badges, no icon chips, no emoji bullets. Typography carries the design. Write real invented copy for **[BRAND NAME]**: real discipline names, real capability lines, a headline that says something. Never lorem ipsum. Add a `prefers-reduced-motion: reduce` block that paints every reveal in its final state, stops the divider growth, hides the cursor chip and pauses the video. Responsive: below 1024px kill the cursor chip; below 780px the collage images become `72vw` wide and 320px tall in a nowrap scroller, the focus grid collapses to one column, the sticky left column goes static, and the "Scroll to Explore" line is hidden. Mark every image and the video `<!-- PLACEHOLDER: swap for generated asset -->`.
