# 17 — OFFSET/26 (one-day developer conference)

**Inspiration:** [select.supabase.com](https://select.supabase.com/) — Supabase's "Select26" one-day conference site: warm cream ground, one saturated green, monospace everywhere, 1-bit dithered speaker portraits, hairline-ruled technical document layout. Deliberate deviation from the reference: the ASCII hero band is replaced by a **full-bleed photographic hero** (Unsplash conference hall) with a dark-to-transparent legibility scrim; the cream computational system resumes immediately below it, and the ASCII band survives as an animated character-grid section further down the page.

**Accent:** `#3ECF8E` (single accent — playhead, slash in the wordmark, live-row wash, CTA fill). Ground `#f5f2ed`, ink `#0d0d0c`.

**Typography:** IBM Plex Mono 400/500/600 for essentially everything (tabular numerals on the schedule and count-ups) + Inter used only for the three long prose paragraphs in the brief. Hero headline `clamp(56px, 13.8vw, 202px)`.

## Motion techniques (6)

1. **Floyd–Steinberg dithered portraits, drawn in code.** Each speaker photo is loaded with `img.crossOrigin = 'anonymous'`, drawn cover-cropped into a 220×275 offscreen canvas, converted to luminance with a gamma lift + contrast push, then run through a real Floyd–Steinberg error-diffusion kernel (7/16, 3/16, 5/16, 1/16) to strict 1-bit. Black pixels become ink, white pixels become **transparent** — so the card background shows through and the portrait inverts to ink-on-green on hover. The result is cached as an `ImageData` and revealed with a **scanline wipe**: ScrollTrigger scrubs a 0→1 progress that `putImageData`s row-by-row behind a 1px green scan bar. `image-rendering: pixelated` keeps the 1-bit grain chunky. Falls back to a procedural dithered plate if the image fails or the canvas taints.
2. **Animated character grid** (`#chargrid`) — the homage to the reference hero. A DOM grid of `<i>` cells (up to 150×13) cycling through ` .·:-=+*#%@`, driven by three summed sine waves plus a pointer-tracked circular interference term. Pointer position is rAF-lerped, Lenis scroll velocity feeds the amplitude, cells only touch the DOM when their character or class actually changes, throttled to ~26fps and paused off-screen via IntersectionObserver.
3. **Pinned + scrubbed schedule.** `gsap.matchMedia()` pins the schedule stage above 1024px while a green playhead sweeps down a real `<table>`; rows flip to past/live states, the 08:30→18:20 meter fills, and the session counter updates. Below 1024px the pin is dropped for a staggered in-flow reveal.
4. **Hand-split line mask reveals.** `splitLines()` measures word `offsetTop` to find real line breaks, rewraps each line in an `overflow:hidden` mask and animates `yPercent: 108 → 0` at `power4.out` with a 0.07 stagger — on the hero from the boot timeline, on section headings from ScrollTrigger.
5. **Count-up figures** — 480 seats / 8 sessions / 11h / 0 sponsor keynotes, plus the proof strip (940 attendees, 96% would return, 34 countries), scrubbed once on entry with `power3.out`.
6. **Page-load boot intro + magnetic CTA + hero parallax.** The boot curtain runs a 000→100 counter with a scrambling hex character field and a green progress rail, then lifts on `power4.inOut` and hands off into the hero line reveals. The ticket button lerps toward the pointer on the `gsap.ticker` (desktop only).

**Craft:** Lenis wired properly (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker` raf loop + `lagSmoothing(0)`, stopped during the boot curtain). `prefers-reduced-motion` removes the curtain, sets every reveal/count/dither to its final state and drops the pin. Below 1024px: no pin, no magnetic button, fewer grid rows, two-up then one-up speaker cards.

**Worth stealing:** the transparent-white 1-bit dither — mapping the dithered white to `alpha 0` instead of a colour means one canvas works on any background, so a hover state can recolour the whole portrait for free.
