# Monolith — generation prompt

**Category:** Creative & Agency
**Best for:** creative directors and designers, film and photography studios, branding and identity agencies, architects, motion and 3D artists, one-person consultancies selling taste
**Signature motion:** a WebGL fragment shader that reveals each project image at the cursor with an RGB split, ripple and shear all driven by pointer velocity, so the one colour in the palette only appears because the visitor moved

---

Build one self-contained `index.html` for **[NAME]**, a **[DISCIPLINE, e.g. creative director]** working as **[STUDIO NAME]** in **[CITY]**, active since **[YEAR]**. Inline `<style>` and `<script>`. GSAP 3.12.5 plus ScrollTrigger, and Lenis 1.1.13, via CDN `<script>` tags. OGL 1.0.11 as an ES module. Google Fonts via `<link>`. No npm, no build step.

**Mood.** A type index, not a gallery. Near-black chrome, monospace metadata, and project titles set enormous. Images are never laid out on the page: they only exist under the cursor. It should feel like a studio that does not need to show off.

**Colour.** Ink `#0a0a0a`, off-white `#ededea`, greys `#8f8f8a` and `#4a4a46`. Hairlines as `rgba(237,237,234,.13)`. One accent, signal orange `#ff4d17`, on the cursor ring, the shader fringe, hover index numerals and one underline. Nothing else.

**Type.** **Anybody** variable, width 104 to 134 and weight 400 to 800, for the display set: the name at `clamp(56px, 13.4vw, 200px)`, project titles at `clamp(30px, 6.4vw, 104px)`. **Spline Sans Mono** at 9 to 11px with `0.14em` to `0.20em` tracking for all metadata. Nothing lives between 20px and 56px except the pull quote. That gap is the design.

**Sections, in order.**

1. **Load intro.** A 000 to 100 counter, an accent progress rule, a staggered wordmark, then a `clip-path: inset(0 0 100% 0)` curtain lift handing off into the hero reveal.
2. **Header.** Wordmark, three nav links, availability.
3. **Hero.** A mono eyebrow row: disciplines, city with coordinates, active since. The name in two display lines, the surname italic. Below, four stats and one honest paragraph about how the studio actually works.
4. **Selected Work.** The signature section. Six rows, each an anchor carrying `data-img`, with an index numeral, a large project title, a mono meta line, and an outcome line that expands on hover using `grid-template-rows: 0fr → 1fr`.
5. **Studio.** A pull quote split by words, a mono aside, a parallaxed studio photograph with a figure caption, and four numbered approach steps.
6. **Process Archive.** A pinned horizontal track of five plates, each with a caption. Images counter-move `xPercent -5 → 5` inside their frames.
7. **Recognition and Register.** Four count-up figures, then an award table: year, award, project, city.
8. **Contact.** A two-line display headline, an availability note, a mailto link, address and **[PHONE]**.
9. **Footer.** Client marquee, colophon, credits.

**The WebGL layer, exactly.** A fullscreen fixed `<canvas>` behind the work list. Load OGL with a dynamic `import()` inside try/catch, trying `https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm` first and falling through two more sources. Build a `Renderer`, a `Triangle` geometry and a `Program`, all wrapped in try/catch. Also set a 5 second watchdog: if nothing has booted, treat it as a failure. The fragment shader draws the hovered image as a rectangle centred on the lerped cursor and discards outside it. Inside: a concentric ripple `sin(r * 24 - time * 3.2)`, a directional shear from the velocity uniform, a mild bulge, and an RGB split whose offset direction and size ride that same velocity. Desaturate the plate almost fully, then mix the accent orange into the chromatic fringe. Crossfade between projects with a two-texture ping-pong on a `uMix` uniform tweened 0 to 1, never a hard swap. Remote textures must set `img.crossOrigin = 'anonymous'` or the upload throws.

**The fallback, which matters as much.** Any failure path calls one `enableCssFallback()` function: hide the canvas, show a fixed `<div>` holding an `<img>`, lerp it to the cursor with `gsap.quickTo`, and animate transform and opacity only. On row `pointerenter` swap the image and scale it from 1.16 down. Below 1024px disable both the canvas and the fallback, and show a static inline thumbnail in each row instead. Under `prefers-reduced-motion: reduce` skip the whole motion layer and render everything in its final state.

**Other motion.** Wire Lenis properly: `lenis.on('scroll', ScrollTrigger.update)`, a `gsap.ticker` raf loop, `lagSmoothing(0)`.

- **Lerped custom cursor:** a 44px ring at 0.13 lerp plus a 5px dot at 0.42, with a View state that fills the ring on project rows. Drive it from `gsap.ticker`, never raw `mousemove` assignment.
- **Hand-split character and word mask reveals** with a recursive splitter that preserves inline tags. Spans inside `overflow:hidden` lines, `yPercent 105 → 0`, `power4.out`, 0.022 to 0.035s stagger.
- **Scroll-velocity skew:** Lenis velocity through `gsap.quickTo` to `skewY` on the work list, archive track and stat row, clamped to plus or minus 5.5 degrees with a decay back to flat.
- **Parallax** on the studio portrait and the hero layers.

**Hard rules.** No decorative gradients. No coloured icon badges or emoji bullets. Write real invented content: client names, years, award bodies, cities, an address. No lorem ipsum. Responsive throughout.

**Images.** Free-license Unsplash direct URLs, each preceded by `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
