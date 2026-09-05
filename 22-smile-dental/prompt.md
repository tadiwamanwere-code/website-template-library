# Smile Dental — generation prompt

**Category:** Healthcare · Clinic
**Best for:** dentists, GP and private clinics, opticians, physio, cosmetic and wellness practices
**Signature motion:** a canvas dot cloud seeded from the real `getBoundingClientRect()` of every character in the h1, which converges onto the letterforms and dies away exactly as the live type flies in behind it

---

Build a single self-contained `index.html` landing page for **[CLINIC NAME]**, a dental practice
in **[CITY]** led by **[PRACTITIONER]**. Inline `<style>` and `<script>`. Google Fonts by
`<link>`. GSAP 3.12.5 plus ScrollTrigger and Lenis 1.1.13 from CDN script tags. No npm, no build
step, no React.

**The whole point is calm.** This page is read by people who have been putting the dentist off,
sometimes for years. Nothing shouts. Warm paper ground, light serif type, one soft blue accent,
and copy that talks about price and consent before it talks about equipment.

**Colour.** Cream ground `#FAF8F5`, second band `#F2EEE8`, white cards `#FFFFFF`. Ink `#141A1E`,
body `#42525C`, muted `#7F8D96`. Hairlines `#E4DDD3` and the lighter `#EFEAE3`. One accent: muted
teal `#5B9DBF`, with `#3B7897` for small type on cream so it still reads. The booking section
inverts to ink `#141A1E` with panel `#191F23`, borders `#2E383E`, text `#EDE9E3`, dim text
`#78848C`, and `#8CC0DA` for its eyebrow. Teal appears only on eyebrow rules, index numbers, the
filled button, the active chip, the progress fill, focus underlines and the dots. Never a
background wash.

**Type.** Newsreader for display **and** body, weights 200 to 500 plus italic, optical sizing on.
DM Mono 300/400/500 for every eyebrow, nav link, label, price, stat key and button. Two faces
only. Hero at `clamp(2.9rem, 6.4vw, 6.6rem)`, weight 300, `line-height:.99`, tracking `-.026em`,
with one word set italic in `#3B7897`. Section headings `clamp(2.1rem, 4.1vw, 3.5rem)`, also
weight 300, also with one italic word. Mono is uppercase and tracked `.14em` to `.24em`. Body
17px / 1.68. Container 1400px, padding `clamp(20px, 5vw, 74px)`.

**Sections, in order.**
1. **Load curtain** on the cream ground: the practice name in tracked mono with a teal rule that
   draws across beneath it, retracts to the right, then the panel lifts on `power4.inOut`.
2. **Fixed header**, 76px, transparent until scrolled then cream at 92% with a 10px blur and a
   hairline. Serif wordmark plus a mono descriptor, six mono nav links with an underline that
   wipes in from the left, **[PHONE]** with a small line icon, and a filled "Book appointment".
3. **Vertical social rail** on the right edge: rotated "FOLLOW", a hairline, four monochrome
   stroke icons.
4. **Hero**, split roughly 1.02fr / 0.9fr. Left: mono eyebrow, a two-line headline with one
   italic teal word, one paragraph, a filled and an outline button, then a 3-up numbered list
   (01 Preventive / 02 Restorative / 03 Cosmetic) above a hairline. Right: **the signature
   composition**, a portrait photo offset down and left over a solid teal block with a small mono
   caption hanging off its bottom-right corner. A "SCROLL" cue with a running teal bar underneath.
5. **Reassurance strip**: four hairline-divided cells (wait time, step-free access, sedation,
   direct billing).
6. **Approach**: two overlapping figures left, a three-line heading and two paragraphs right,
   then four numbered pledges as hairline rows. Write real promises about price, watching rather
   than drilling, stopping on request, and continuity of clinician.
7. **Statistics band** on the second cream: four count-ups, one with a decimal.
8. **Treatments and prices**: a sticky photograph and a "before you commit" price box on the
   left, six accordion rows on the right, each with a mono index, title, duration, a real
   from-price and a plus/minus sign. Opening a row swaps the sticky photograph. Close with a line
   of extra services and prices.
9. **Pinned first visit**: four steps (arrive, talk, look, plan) cross-fading in a held viewport
   against four cross-fading photographs, with a progress bar and an `01 / 04` counter.
10. **[PRACTITIONER]**: a large italic serif pull-quote, a portrait with a teal hairline down its
    left side, then three columns of credentials.
11. **Booking**, on ink: a four-step form (treatment chips, day chips, time slots, name and
    **[PHONE]**) beside a sticky summary panel that fills in live. Generate the next seven open
    days from today's date, skip the closed day, mark some slots taken from a deterministic hash
    so they never change between reloads, validate inline, and replace the form with a
    confirmation panel carrying a generated reference. Client-side only, no network.
12. **Reviews**: six cards on white with drawn star glyphs, not emoji, one of them four stars,
    each naming the treatment and the month.
13. **Practical**: an opening-hours table that highlights today and shows a live "Open now" or
    "Closed" pill, payment and insurance, and the address.
14. **Closing CTA**, centred, then a four-column footer and a mono bottom bar.

**Motion, at least four, real easing only (`power3.out`, `power4.out`, `expo.out`,
`power4.inOut`), never `linear` or default `ease`.**
- **Signature:** split the h1 into per-character spans, measure each one's
  `getBoundingClientRect()` against an absolutely positioned canvas, and seed up to 760 dots
  whose targets sit inside those boxes. Give each dot a scattered random start, a per-dot delay,
  a cubic ease, and an alpha that rises fast then falls to zero as it lands. Run it while GSAP
  flies the characters in from random x, y, rotation, scale and blur on `expo.out` with a
  `from:'random'` stagger, so the type condenses out of the dust. Size the canvas with
  `calc(100% + …)`, not `inset`: a canvas is a replaced element and will not stretch. Fire the
  canvas loop from inside the timeline, or it runs out behind the load curtain unseen.
- Pinned first-visit scene with `scrub`, cross-fades and a progress counter, reverted below
  1024px by `gsap.matchMedia()`.
- Two-depth parallax on the hero composition: block, photo and the image inside it on three
  different speeds.
- Hand-split line mask reveals on every heading (`yPercent: 112 -> 0`, `power4.out`, 0.075s
  stagger). Do not reference the paid SplitText plugin.
- Clip-path figure reveals with a counter-scale, count-ups on the statistics, and magnetic
  buttons via `gsap.quickTo`, desktop and `pointer: fine` only.

**Hard rules.** No decorative gradients. No coloured icon badges, no circular icon chips, no
emoji bullets: any icon is a small monochrome stroke drawing. One accent, used sparingly.
Typography carries the design. Copy must be specific and invented: real treatment names,
durations, honest from-prices, named staff with real qualifications, and reviews that say what
was actually done. No lorem ipsum, no "Amazing Feature". Ship a `prefers-reduced-motion` block
that kills the curtain and the canvas and paints everything in its final state, and a `no-gsap`
fallback so nothing is left invisible or stacked if the CDN is blocked. Use free-license
placeholder photography and mark each image
`<!-- PLACEHOLDER: swap for generated asset -->`.
