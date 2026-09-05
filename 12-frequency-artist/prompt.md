# Frequency — generation prompt

**Category:** Events & Music
**Best for:** recording artists and bands, record labels, album or single launches, DJs and producers, festivals and club nights, podcast or audio studios
**Signature motion:** a canvas frequency visualiser that runs procedurally and upgrades itself to a live Web Audio analyser when a clip plays, sitting behind the type as living album art

---

Build one self-contained `index.html` for **[ARTIST NAME]**, releasing the album **[ALBUM TITLE]** on **[LABEL]**, out **[RELEASE DATE]**. Inline `<style>` and `<script>`. GSAP 3.12.5 plus ScrollTrigger, and Lenis 1.1.13, via CDN `<script>` tags. Google Fonts via `<link>`. No npm, no build step, no framework.

**Mood.** A record sleeve, an A0 gig poster and a mastering-desk readout in one page. Loud display type on near-black, one acid accent, monospace metadata everywhere. Nothing pretty or soft.

**Colour.** Background `#050505`, panels `#0b0b0b` and `#101010`, ink `#f2f2f0`, dim grey `#82827d`, dimmer `#4a4a46`. Hairlines as `rgba(242,242,240,.13)`. One accent, acid yellow-green `#c8ff3d`, on the visualiser trace, the play ring, the solid button and a single stroked word. Never as a background wash.

**Type.** **Archivo Black** for display, sized to fill the viewport width. **JetBrains Mono** 300/400/500/700 for every label, catalogue number, timecode, tracklist row and readout. Tabular figures. Uppercase and wide tracking on labels.

**Sections, in order.**

1. **Hero.** Faint vertical grid lines, a clipped performance photograph, a kicker tag reading `[RELEASE TYPE] · [LABEL]` with one sentence of real context, and a side note about the poster edition. The album title in two lines, the second word filled with a masked image. A stamp with track count and runtime. Then a definition list of release, format, catalogue number, producer and mastering house. A ticker marquee across the bottom.
2. **Frequency response.** The signature. A large `<canvas>` spectrum in a bordered stage with a scanline overlay, corner labels naming the track, a running clock and the analyser settings. Four live readouts: Peak, RMS, Band, Drive. A round play button. Copy that says plainly the spectrum runs procedurally and switches to the live analyser when the clip plays. Include an `<audio>` element with no `src` so the page works with no asset present.
3. **Sessions.** A giant ghost word drifting behind the copy, a lead line about where the record was made, two or three paragraphs of real studio detail, and a clipped photograph.
4. **Tracklist.** Rendered from a JS array: number, title, runtime, and a note. A small waveform canvas draws inside each row on hover. A head block with track count, runtime and sides, and a foot line stating the side split and the pressing.
5. **Live.** Four count-up figures, a heading, then a tour list from a JS array: date, city, venue, status. A venue image follows the cursor across the list.
6. **Pre-save CTA.** One display line with a stroked-outline word, a short paragraph, two magnetic buttons, and a formats note.
7. **Footer.** Wordmark, link columns, booking and press contacts, **[EMAIL]**.

**Motion.** Wire Lenis properly: `lenis.on('scroll', ScrollTrigger.update)`, a `gsap.ticker` raf loop, `lagSmoothing(0)`.

- **Canvas visualiser.** One `requestAnimationFrame` loop. In procedural mode sum several sines at different rates to fake a spectrum. If an audio source exists, create an `AudioContext` and `createAnalyser`, and read frequency data instead. Wrap the whole audio path in try/catch so a blocked or tainted source silently falls back to procedural. Scroll position drives the amplitude either way, and the readouts show real numbers from the current frame.
- **Character mask reveals** on every display heading: split by hand into character spans inside `overflow:hidden` wrappers and animate them up on `expo.out` with a small stagger. No SplitText.
- **Scroll-velocity skew** on the tracklist rows, using a `gsap.quickSetter` for `skewY` with a decay back to flat.
- **Magnetic buttons** on a `gsap.ticker` lerp, desktop only.
- **Clip-path reveals** on the hero photograph and the session photograph, plus a pinned scrub on the visualiser and parallax on the ghost word and hero layers.
- **Count-ups** on the tour figures.

**Hard rules.** No decorative gradients. No coloured icon badges or emoji bullets: the play and pause glyphs are plain monochrome SVG paths. Write real invented content: track titles, runtimes, venues, catalogue numbers, studio names. No lorem ipsum. Responsive: below 1024px drop the pin, the magnetic buttons and the hover waveforms. Under `prefers-reduced-motion: reduce` skip the reveals and scrubs, paint everything final, and leave the visualiser static.

**Images.** Free-license Unsplash direct URLs, each preceded by `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
