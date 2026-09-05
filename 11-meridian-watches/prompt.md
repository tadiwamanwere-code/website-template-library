# Meridian & Cie — generation prompt

**Category:** Fashion & Luxury
**Best for:** watchmakers and jewellers, precision instrument makers, bespoke tailors, high-end audio and camera brands, luxury car restorers, any product sold on engineering rather than image
**Signature motion:** a scroll-scrubbed exploded view, where stacked component layers pull apart on scroll while SVG leader lines draw themselves to label each part as it arrives

---

Build one self-contained `index.html` for **[BRAND NAME]**, an independent [WATCHMAKER / MAKER] in **[TOWN, COUNTRY]**, presenting **[PRODUCT NAME]**, a limited run of **[QUANTITY]** pieces. Inline `<style>` and `<script>`. GSAP 3.12.5 plus ScrollTrigger, and Lenis 1.1.13, via CDN `<script>` tags. Google Fonts via `<link>`. No npm, no build step, no framework.

**Mood.** Technical documentation, not luxury advertising. This should read like a spec sheet issued by an atelier: hairline rules, sheet and revision numbers, coordinates, leader-dot rows, everything measured. Restraint is the luxury signal.

**Colour.** A warm paper ground, not white. Bone `#EAE7E0`, paper `#F3F1EC`, sand `#E1DDD3`, shade `#D8D4C9`. Ink `#131418` with greys `#4C4E54` and `#8A8B8F`. Rules `#C7C2B7`. One accent, blued steel `#1E3A63`, reserved strictly for technical annotation: leader lines, the primary button, revision tags, the progress fill. Never a background wash.

**Type.** **IBM Plex Mono** 400/500/600 for every label, spec, figure and table cell. **Instrument Sans** variable 400 to 700 for headlines and prose. Tabular numerals throughout so columns align. Italics inside headlines carry the second word for contrast.

**Sections, in order.**

1. **Loader.** A status line, a 000 counter, a progress rail, then the curtain lifts.
2. **Header.** Wordmark, chapter nav, and a live UTC clock in a tag.
3. **Hero.** A measuring ruler strip with tick marks and numbers across the top. Four tags: reference number, winding or mechanism type, town with latitude and longitude, and the edition size in accent. A two-line display headline. One paragraph of real technical prose. Two buttons. A summary rail on the right, a definition list of leader-dot rows: calibre, reserve, jewels, frequency, diameter.
4. **The exploded assembly.** The signature. A pinned stage holding a stacked component illustration built from CSS and inline SVG discs, not a photograph. Define the layers in a JS array, each with a name, a spec line, a side and a spin. On scroll the layers separate, each rotates slightly, and a leader line draws from the part to its label. A heads-up display below shows the phase name, a fill bar and a percentage.
5. **The mechanism.** A chapter explaining one detail of how **[PRODUCT]** works, with a hand-drawn inline SVG figure whose paths draw themselves, and two columns of prose.
6. **The atelier.** A pinned horizontal track of six finishing or process techniques, each with a name, a description and a detail image. An index counter and a fill bar below.
7. **Technical specification.** Six count-up figures, then a real table split into lettered groups: Movement, Chronometry, Case, Dial and strap, Delivery. Each group header shows a row count.
8. **Register interest.** Honest copy about allocation, a form with name, email, a serial band select and a note field, plus tags showing pieces allocated and next release date.
9. **Footer.** Four link columns, address, **[EMAIL]**, **[PHONE]**.

**Motion.** Wire Lenis properly: `lenis.on('scroll', ScrollTrigger.update)`, a `gsap.ticker` raf loop, `lagSmoothing(0)`.

- **Scrubbed exploded view.** One ScrollTrigger with `pin` and `scrub: 0.85` drives every layer's `y`, `rotate` and opacity. Leader lines animate `stroke-dashoffset` from `getTotalLength()` to `0` as each part lands, and their labels fade in behind them. Hold the fully annotated state to the end of the scrub.
- **Self-drawing SVG figures** using the same `stroke-dashoffset` technique.
- **Pinned horizontal track** for the atelier, `scrub: 0.7`, distance recomputed on resize.
- **Line mask reveals** on headlines: split by hand into spans inside `overflow:hidden` wrappers, animate `yPercent` to zero on `power4.out` with a stagger. No SplitText.
- **Count-ups** on the technical figures, with a thousands separator and a decimal option so the diameter reads correctly.
- **Clip reveals** and gentle scrubbed parallax on images.

**Hard rules.** No decorative gradients. No coloured icon badges or emoji bullets. Write real invented content: component names, tolerances, temperatures, serial numbers, dates. No lorem ipsum. Responsive: use `gsap.matchMedia` so below 1024px both pins are torn down, the assembly paints in its final annotated state and the horizontal track stacks. Under `prefers-reduced-motion: reduce` skip the loader and every scrub and render everything final.

**Images.** Free-license Unsplash direct URLs, each preceded by `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
