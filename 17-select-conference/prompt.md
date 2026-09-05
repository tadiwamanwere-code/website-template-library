# OFFSET — generation prompt

**Category:** Events & Music
**Best for:** developer and technical conferences, single-track summits, meetups and unconferences, workshop series, hackathons, film or design festivals with a fixed programme
**Signature motion:** speaker portraits dithered to 1-bit in code with a real Floyd-Steinberg kernel, where white maps to transparent so the card colour shows through and the whole portrait recolours on hover

---

Build one self-contained `index.html` for **[EVENT NAME]**, a one-day **[SUBJECT]** conference at **[VENUE]**, **[CITY]**, on **[DATE]**. Inline `<style>` and `<script>`. GSAP 3.12.5 plus ScrollTrigger, and Lenis 1.1.13, via CDN `<script>` tags. Google Fonts via `<link>`. No npm, no build step, no framework.

**Mood.** A technical document on warm paper. Hairline rules, bracketed section numbers such as `[ 01 ]`, monospace everywhere, and a computational 1-bit feel. Honest, slightly blunt copy: say what the event is not.

**Colour.** Cream ground `#f5f2ed` with `#ece7dd` and `#e3ddd0` for panels. Ink `#0d0d0c` and `#26251f`, muted `#6e6b60` and `#96917f`. Rules `#d8d2c4` and `#c3bcaa`. One accent, `#3ECF8E`, on the schedule playhead, the slash in the wordmark, the live row wash and the filled ticket button, with a dark ink `#08301f` for text sitting on it.

**Type.** **IBM Plex Mono** 400/500/600 plus italic for essentially everything, with tabular numerals on the schedule and count-ups. **Inter** 400/500 only for the three long prose paragraphs in the brief. Hero headline at `clamp(56px, 13.8vw, 202px)`.

**Sections, in order.**

1. **Boot intro.** A 000 to 100 counter over a scrambling hex character field with an accent progress rail, then a curtain lift on `power4.inOut` that hands off into the hero line reveals.
2. **Hero.** Full-bleed photograph of a packed hall with a dark-to-transparent legibility scrim and six faint vertical hairlines over it. A badge reading the edition and format, coordinates and the venue address. The event name in two huge lines, the second carrying an accent slash. One sentence of positioning. A four-cell definition list: date, city, capacity, ticket price, each with a small second line.
3. **Ticker.** A marquee of four facts. Supporting only.
4. **The brief.** Section `[ 00 ]`. A left aside of six label-and-value rows (format, sessions, talk length, sponsor slots, recording, code of conduct) against three real paragraphs of prose. Then four count-up figures, including one that is zero.
5. **Signal.** A framed character grid labelled like a device path, with a status readout.
6. **Speakers.** Section `[ 01 ]`. Six cards, each a dithered `<canvas>` portrait with a name, role, company and talk title, plus a shorter list of the remaining lightning speakers.
7. **Schedule.** Section `[ 02 ]`. A real `<table>` from 08:30 to 18:20 with time, session, speaker and room, plus a playhead, a meter and a session counter.
8. **Venue.** Section `[ 03 ]`. Photographs, practical detail about the building and travel, an attendee quote with attribution, and four proof figures.
9. **Tickets.** Section `[ 04 ]`. Three tiers, the first struck through as sold out, plus a magnetic buy button and a plain note about payment and refunds.
10. **Footer.** Contact, code of conduct, previous editions, **[EMAIL]**.

**Motion.** Wire Lenis properly: `lenis.on('scroll', ScrollTrigger.update)`, a `gsap.ticker` raf loop, `lagSmoothing(0)`, and stop it during the boot curtain.

- **Dithered portraits.** Load each photo with `img.crossOrigin = 'anonymous'`, draw it cover-cropped into a 220 by 275 offscreen canvas, convert to luminance with a gamma lift and a contrast push, then run a real Floyd-Steinberg error diffusion kernel (7/16, 3/16, 5/16, 1/16) to strict 1-bit. Black becomes ink, white becomes fully transparent. Cache the result as `ImageData` and reveal it with a scanline wipe: ScrollTrigger scrubs a 0 to 1 progress that `putImageData`s row by row behind a 1px accent scan bar. Set `image-rendering: pixelated`. If the image fails or the canvas taints, fall back to a procedural dithered plate.
- **Animated character grid.** A DOM grid of `<i>` cells up to 150 by 13 cycling through ` .·:-=+*#%@`, driven by three summed sine waves plus a pointer-tracked circular interference term. Lerp the pointer on rAF, feed Lenis scroll velocity into the amplitude, touch the DOM only when a cell's character or class actually changes, throttle to about 26fps, and pause off-screen with an `IntersectionObserver`.
- **Pinned scrubbed schedule.** Use `gsap.matchMedia()` to pin above 1024px while the playhead sweeps down the table, rows flip to past and live states, the meter fills and the counter updates. Below that, a staggered in-flow reveal instead.
- **Hand-split line mask reveals:** measure word `offsetTop` to find real line breaks, rewrap each line in an `overflow:hidden` mask, animate `yPercent: 108 → 0` on `power4.out` with a 0.07 stagger.
- **Count-ups** on the figures, and a **magnetic** ticket button on the `gsap.ticker`, desktop only.

**Hard rules.** No decorative gradients. The only gradient is the hero scrim. No coloured icon badges or emoji bullets. Write real invented content: speaker names, talk titles, times, prices, seat counts. No lorem ipsum. Responsive: below 1024px drop the pin and the magnetic button, use fewer grid rows and stack the speaker cards. Under `prefers-reduced-motion: reduce` remove the curtain, set every reveal, count and dither to its final state and drop the pin.

**Images.** Free-license Unsplash direct URLs, each preceded by `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
