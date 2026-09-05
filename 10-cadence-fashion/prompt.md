# Cadence — generation prompt

**Category:** Fashion & Luxury
**Best for:** fashion labels and ateliers, seasonal lookbook or collection launches, concept stores, model and casting agencies, fragrance and beauty brands
**Signature motion:** scroll-velocity skew, where Lenis momentum bends every image on the page, paired with a cursor that grows into a "VIEW" disc over each look

---

Build one self-contained `index.html` for **[BRAND NAME]**, a fashion house in **[CITY, COUNTRY]**, presenting the **[SEASON, e.g. FW26]** collection **[COLLECTION NAME]**. Inline `<style>` and `<script>`. GSAP 3.12.5 plus ScrollTrigger, and Lenis 1.1.13, all via CDN `<script>` tags. Google Fonts via `<link>`. No npm, no build step, no framework.

**Mood.** A magazine masthead, not a shop. This is the most graphically severe page you will build: pure black and white, one stark red, huge condensed type against 10px tracked labels. It should feel printed.

**Colour.** `#000` ink, `#fff` paper, and one accent `#FF1E00` used once or twice only, never as a wash. Sections alternate ground: give inverted sections a class that flips background and text, so the page reads as black, white, black, white as you scroll. Rules are `1px solid currentColor` so they invert for free.

**Type.** **Anton** for display, **Archivo** 400/500/600/700 for everything else. Labels sit at `clamp(9px, .68vw, 11px)`, uppercase, wide tracking. Headlines run at `clamp` sizes up to viewport scale. Nothing lives between the two. That gap is the design.

**Sections, in order.**

1. **Load curtain.** Wordmark, a 000 counter ticking up, a thin progress bar, and three stacked labels: collection name, season, look count. The curtain then lifts and hands off to the hero.
2. **Fixed chrome.** Wordmark left, five tracked nav links right, and a thin label bar at the bottom of the viewport carrying `[SEASON] / PRESS PREVIEW / [LATITUDE, LONGITUDE]`.
3. **Hero.** Full-bleed [MODEL / GARMENT] photograph revealed with a `clipPath: inset(0 0 100% 0)` wipe on `expo.out`. The collection name as one giant Anton word. A short standfirst, then three label-and-value pairs: the collection, the atelier address, the delivery window.
4. **Statement.** Eyebrow `01 &mdash; POSITION`, two short display lines that state the design idea, and three columns of method, production and fit copy.
5. **Lookbook.** Eyebrow `02 &mdash; THE LOOKBOOK`. A pinned horizontal track of ten looks, each a tall image with a number, garment name, fabric and price. Ends with a card offering the remaining looks by appointment. A progress bar tracks the scrub.
6. **Designer's note.** Three real paragraphs signed by **[DESIGNER NAME]**, with an atelier photograph, a caption, and initials set in display type.
7. **Materials.** Four material cards, each a detail photograph with a name, weight, mill and certification.
8. **Specifications.** Four count-up figures, then two real hairline tables: fabric breakdown by weight, and stockists by city with dates.
9. **Request.** A two-line display headline, an email field and a send button, plus a note on press and wholesale access.
10. **Footer.** Four link columns and a bottom bar with the address, **[EMAIL]** and **[PHONE]**.

**Motion.** Wire Lenis properly: `lenis.on('scroll', ScrollTrigger.update)`, a `gsap.ticker` raf loop, `lagSmoothing(0)`.

- **Scroll-velocity skew.** Take Lenis velocity, scale it, and push it through `gsap.quickTo(images, 'skewY')` clamped to plus or minus 4.5 degrees with a `power3` settle. Pre-scale the images to `1.06` so the skew never exposes an edge. Reset to flat on ScrollTrigger's `scrollEnd`.
- **Contextual cursor.** Hide the native cursor. A lerped disc follows the pointer on the `gsap.ticker` and reads `data-cursor` on hover: `view` grows it to full size with a VIEW label, `drag` to 62%, `link` to 30%, idle to a dot. Desktop and fine pointers only.
- **Pinned horizontal lookbook.** Pin the section, scrub `x` across the track, recompute the distance on resize with `invalidateOnRefresh`. Each look reveals via `containerAnimation` ScrollTriggers. Pointer drag on the viewport also scrolls it.
- **Character mask reveals** on the display headlines: split by hand into spans inside `overflow:hidden` wrappers, `yPercent 110 → 0`, `power4.out`, staggered. No SplitText.
- **Count-ups** and light **parallax** on the hero and material images.

**Hard rules.** No decorative gradients, only a dark scrim over a photo if legibility demands it. No coloured icon badges, no emoji bullets. Write real invented content: garment names, fabrics, weights, prices, cities, dates. No lorem ipsum. Responsive: below 1024px drop the pin, the horizontal track becomes a vertical stack, and the custom cursor is off. Under `prefers-reduced-motion: reduce` kill the curtain and every scrub and paint all reveals in their final state.

**Images.** Free-license Unsplash direct URLs, each preceded by `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
