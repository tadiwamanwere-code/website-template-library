# Solstice — generation prompt

**Category:** Hospitality & Travel
**Best for:** resorts and boutique hotels, private islands and lodges, safari and expedition operators, villa rentals, destination spas, luxury travel agents
**Signature motion:** multi-depth parallax chapters, where background plate, mid image and foreground copy move at three different speeds inside one pinned stage, so scrolling feels like moving through the place

---

Build one self-contained `index.html` for **[RESORT NAME]**, a **[PROPERTY TYPE, e.g. private island resort]** at **[LOCATION]** with **[NUMBER]** rooms or villas. Inline `<style>` and `<script>`. GSAP 3.12.5 plus ScrollTrigger, and Lenis 1.1.13, via CDN `<script>` tags. Google Fonts via `<link>`. No npm, no build step, no framework.

**Mood.** Warm, light and unhurried. Full-bleed imagery with a lot of air around small type. The writing should be understated and specific, closer to a good travel essay than to a brochure. Sell the inconvenience as the point.

**Colour.** A bone ground, not white: `#F4EDE2` and `#EADFCC`, with sand `#D8C4A6` and `#BFA47F`. Deep sea ink `#0B1A21`, plus `#12262E` and `#354B53`. Hairlines as `rgba(11,26,33,.16)` on light and `rgba(244,237,226,.20)` on dark. One accent, warm bronze `#B8763F`, on the rule under a chapter number, the enquiry button and small marks. Never a background wash.

**Type.** **Cormorant Garamond** 300/400/500 plus italics for every display line, set large and light with tight leading. **Jost** 300/400/500 for all UI, labels, facts and captions, at small sizes with wide tracking. Labels uppercase.

**Sections, in order.**

1. **Header.** Wordmark, a short nav, and an enquiry link. It inverts to light type over the dark sections.
2. **Hero.** A full-bleed looping muted video with an image poster and a dark-to-transparent legibility scrim. Three eyebrow facts: coordinates, room and land count, year established. One serif headline. A footer row of four facts with real numbers, and a scroll cue naming the chapter count.
3. **Chapters.** The signature. A pinned stage holding four chapters: Arrival, The Rooms, The Water, The Table, or the equivalents for **[RESORT NAME]**. Each chapter has three layers: a full-bleed background plate, a smaller mid-ground figure with a caption, and a foreground block with a chapter number, a serif title, one paragraph and a meta line. A side rail lists the chapters with a fill bar and an `01 / 04` counter.
4. **Scale-through.** A sticky beat where one image starts as an inset card and opens to full bleed on scroll, with a caption fading in beneath it.
5. **The island.** A dark section: one long serif headline about the place, real prose, and a set of clip-revealed image fragments.
6. **Rooms.** Four room types, each with a plate, a name, size, sleeping capacity, outlook and a short description.
7. **Getting here.** A dark section with four count-up figures, then three blocks: the passage (four ways in with times and operators), the year (a month-by-month table of water, wind and what is happening), and the tariff (per unit, per night, in **[CURRENCY]**).
8. **Enquiry.** A serif headline, a short paragraph, a magnetic button, and the reservations **[EMAIL]** and **[PHONE]**.
9. **Footer.** Address, coordinates, link columns, a line about the operating company.

**Motion.** Wire Lenis properly: `lenis.on('scroll', ScrollTrigger.update)`, a `gsap.ticker` raf loop, `lagSmoothing(0)`.

- **Pinned chapter parallax.** One timeline pinned over `+= chapters × 115%` at `scrub: 1`. Inside it each background drifts `yPercent -6 → 6` while scaling down from `1.16`, each mid figure moves `yPercent -20 → 20` with a slight `xPercent` counter-move, and each foreground moves `yPercent 34 → -34`. Chapters cross-fade on `autoAlpha`. Use a spacer tween so one timeline unit equals one chapter, and update the rail, counter and fill bar from `onUpdate`.
- **Scale-through** using `clipPath: inset(30% 34% 30% 34%) → inset(0)` with the image scaling from `1.28` to `1`.
- **Word mask reveals** on every serif headline: split by hand into spans inside `overflow:hidden` wrappers and animate them up on `power4.out` with a stagger. No SplitText.
- **Clip-path reveals** on the island fragments and room plates, `inset(0 0 100% 0) → inset(0)` on `power4.out`, plus scrubbed parallax inside each frame.
- **Count-ups** on the figures, and a **magnetic** enquiry button on a `gsap.ticker` lerp.
- Hero video parallax on scroll.

**Hard rules.** No decorative gradients. The only gradient allowed is the dark scrim over the hero video. No coloured icon badges or emoji bullets. Write real invented content: flight times, temperatures, hectares, villa names, tariffs, month notes. No lorem ipsum. Responsive: gate the pin and the scale-through on a 1024px minimum width so mobile gets a plain vertical stack of chapters. Under `prefers-reduced-motion: reduce` skip the pin and every scrub and paint each chapter in its final state.

**Images.** Free-license Unsplash stills and a Pexels video, each preceded by `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
