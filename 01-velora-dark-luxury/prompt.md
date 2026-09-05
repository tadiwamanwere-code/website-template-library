# Velora Dark Luxury — generation prompt

**Category:** Automotive
**Best for:** luxury car rental, exotic car hire, chauffeur and executive transfer firms, performance dealerships, private jet or yacht charter, high-end detailing studios
**Signature motion:** a full-bleed background video that can never stop, guarded by a play watchdog, under a giant gradient-clipped wordmark that sits behind the nav

---

Build a single self-contained `index.html` for **[BRAND NAME]**, a luxury [PRODUCT, e.g. car rental] company in **[CITY]**. Inline `<style>` and `<script>`. Google Fonts via `<link>`. No build step, no React, no CSS framework.

**This is one hero section only.** Do not add feature grids, testimonials, pricing or a footer. The whole page is a single `100vh` frame, `min-height: 720px`, that fills the screen and stops. The mood is quiet money: black, glass, restraint. Nothing shouts.

**Colour.** Near-black ground `#0a0a0b`. White `#fff` and off-white `#FAF9F5` for type. Body copy at `rgba(255,255,255,0.82)`. Glass buttons are `rgba(255,255,255,0.08)` fill with a `rgba(255,255,255,0.2)` hairline border. **There is no accent colour at all.** That is the design. Do not add one.

**Type.** Archivo only, weights 400 to 800. One family for the whole page.

**Layers, back to front.**

1. **Video, z-index 0.** A full-bleed muted looping `<video>` with `autoplay loop muted playsinline preload="auto"`, `object-fit: cover` and `object-position: center 60%` so the subject sits low in frame. `pointer-events: none`.
2. **Scrim, z-index 1.** A four-stop vertical gradient over the video: `rgba(8,8,10,.55)` at the top, easing to `.15` at 30%, `.25` at 55%, then `.92` at the bottom. This is a legibility scrim, not decoration. It is the only gradient allowed on the page apart from the headline text clip.
3. **Giant headline, z-index 2.** The word or two-word phrase **[HERO WORDMARK, e.g. REGAL DRIVE]**, uppercase, centred, absolutely positioned `top: 92px`, `font-size: 13.3vw`, weight 800, `line-height: .9`, `letter-spacing: -.03em`, `white-space: nowrap`, `pointer-events: none`. Fill it with a `linear-gradient(180deg, #ffffff 55%, #b8b8bd 100%)` clipped to the text with `background-clip: text` and `-webkit-text-fill-color: transparent`. This headline is the artwork. It must sit **behind** the nav and copy, so real elements overlap its letters. That overlap is the whole trick.
4. **Nav, z-index 3.** Absolutely positioned across the top, `34px 56px` padding. Left: four plain links (Home, About, [PRODUCT PLURAL], Contact), 14px, weight 500, the active one white with a 2px white bottom border. Centre: the wordmark **[BRAND NAME]** at 26px, weight 700, `letter-spacing: .04em`. Right: a glass pill button "Browse [PRODUCT PLURAL] →", 10px radius, which inverts to `#e9e9ec` fill with black text on hover.
5. **Hero copy, z-index 3.** Bottom left at `56px`. A headline **"[HEADLINE, e.g. Rent Your Dream Luxury Car Today]"** at `clamp(38px, 5.8vw, 66px)`, weight 600, `line-height: .98`. One short paragraph at 15px, max 480px wide. Then a glass "DISCOVER NOW ↗" button with `backdrop-filter: blur(6px)`, 32px above it, which inverts to solid white on hover.

**Motion.** There is no scroll animation and no animation library. The craft is elsewhere: a JavaScript watchdog that keeps the video playing no matter what. Call `play()` on `pause`, `ended`, `loadedmetadata` and `canplay`, again on `visibilitychange` when the tab returns, and again from a `setInterval` every 1000ms if `video.paused`. Swallow the rejected promise with an empty `catch`. Clear the interval on `beforeunload`. Buttons animate only through 0.25s CSS `transition` on background, colour and border.

**Hard rules.** No decorative gradients: the scrim and the headline text clip are the only two, and both are functional. No coloured icon badges, no icon chips, no emoji bullets. Typography carries the design. Write real invented copy for **[BRAND NAME]**, never lorem ipsum or "Amazing Feature". Add a `prefers-reduced-motion: reduce` block that pauses the video, holds a still poster frame and removes the hover transitions. Responsive: below 860px drop nav padding to `22px 24px`, shrink the links to 12px and let the hero copy run full width; below 560px hide the left nav links entirely. Set `overflow-x: hidden` and `max-width: 100vw` on `html, body` so the `13.3vw` headline can never cause a sideways scrollbar. Mark the video source `<!-- PLACEHOLDER: swap for generated asset -->`.
