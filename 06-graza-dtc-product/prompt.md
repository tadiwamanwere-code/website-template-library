# Graza DTC Product — generation prompt

**Category:** Food & Drink
**Best for:** hot sauce, olive oil, coffee and tea brands, craft soda and canned drinks, snacks, supplements, any single-product direct-to-consumer bottle or jar
**Signature motion:** a two-element tilt card, where the outer div runs a continuous CSS float loop and an inner div takes the JavaScript mouse tilt, so the two transforms never fight over the cascade

---

Build a single self-contained `index.html` for **[BRAND NAME]**, a **[PRODUCT, e.g. small-batch hot sauce]** sold direct to consumers. Inline `<style>` and `<script>`. Google Fonts via `<link>`. Vanilla JavaScript. **No GSAP, no React, no build step.**

**Four blocks: nav, hero, two marquee bands, a detail section, a one-line footer.** The mood is loud, flat and cheerful. One saturated colour used as a full background block, chunky rounded display type, and die-cut sticker shapes. It should look like a brand with a sense of humour, not a wellness startup.

**Colour.** Set on `:root`. Brand colour `--hot: #E4572E`, a flat tomato orange, used as a **solid background** for the nav, the hero and the second marquee band. Its pressed and shadow shade `--hot-dark: #b8431f`, used for small labels. Cream `--cream: #FFF7EA` and dimmer cream `--cream-dim: #F3E9D7`. Ink `--ink: #241608`, a warm near-black. **One hue only.** `--hot-dark` is the same hue darkened, not a gradient partner. Add `::selection { background: var(--ink); color: var(--cream); }`.

**Type: three faces.** Baloo 2 (500/700/800) for the logo, `h1`, `h2` and every spec value: this is the chunky rounded display face and it does the heavy lifting. Space Grotesk (400/500/600) for body copy. Space Mono (400/700) for eyebrows, buttons, stickers, marquee items, spec labels and the footer.

**Sections, in order.**

1. **Nav.** Solid `--hot` background, `padding: 26px clamp(20px,5vw,64px)`. Left: the logo **[BRAND NAME]** in Baloo 2. Right: three plain links, e.g. The **[PRODUCT]**, Ingredients, **[CLUB NAME]**.
2. **Hero.** Solid `--hot` background, a `1.05fr 0.95fr` grid, `align-items: center`. A `::before` layer paints thin grid lines at `rgba(255,247,234,0.07)` on a `64px 64px` repeat for texture. That is a texture overlay, not a decorative gradient.
   - **Left, the copy.** A Space Mono eyebrow at 0.8rem, `letter-spacing: .15em`, reading the ingredient and format line, e.g. **"[INGREDIENT A] + [INGREDIENT B] · [SIZE] [FORMAT]"**. Then the `h1` in Baloo 2 800 at `clamp(2.6rem, 6.2vw, 5.2rem)`, `line-height: .98`, in cream, with each line as its own block span: **"[HEADLINE LINE 1]" / "[LINE 2]" / "[LINE 3]"**. Then one paragraph, max 460px, written like a person talks. Then a cream pill button "Grab a **[UNIT]**, **[PRICE]**" beside a Space Mono note "Free shipping over **[THRESHOLD]** · Ships in **[N]** days".
   - **Right, the product.** A `perspective: 1000px` stage holding the bottle shot at `width: min(340px, 70vw)` with `drop-shadow(0 30px 40px rgba(0,0,0,.28))` and an 18px radius. Two die-cut sticker badges sit over it, both built with the **same 20-point starburst `clip-path` polygon**, one 132px in ink on cream text rotated `-9deg` at the top right, one 108px in cream with `--hot-dark` text rotated `11deg` at the bottom left. Content: **"[CLAIM, e.g. COLD PRESSED]"** and **"[BATCH LINE, e.g. SMALL BATCH NO. 014]"**. These are die-cut shapes, not icon badges.
3. **Marquee band one.** Cream background, 3px solid ink rules top and bottom. Seven product facts in Baloo 2 at `clamp(1.2rem, 2.4vw, 1.9rem)`, separated by small dots, with the whole set duplicated in the markup.
4. **Marquee band two, inverted.** `--hot` background, cream text and dots, same 3px ink rules, running in the opposite direction. Six harder facts here: Scoville or strength, what it does not contain, shelf life, packaging, and the subscription line.
5. **Detail section.** Cream. A `0.9fr 1.1fr` grid. Left: a Space Mono label "**[SECTION LABEL, e.g. Why It Slaps]**", an `h2` in Baloo 2 at `clamp(2rem, 4vw, 3.2rem)`, and one honest paragraph that names what the competition does wrong and what you do instead. Right: a six-cell spec grid, each cell with a Space Mono key in `--hot-dark` and a Baloo 2 value: heat or strength, batch size, format, shelf life, diet, made in.
6. **Footer.** One line, ink background, cream Space Mono text: "**[BRAND NAME]**, SMALL BATCH SINCE **[YEAR]**".

**Motion, four techniques.**

- **Signature, the split tilt card.** The **outer** `.tilt-wrap` runs `animation: float 6s ease-in-out infinite`, written with the individual `translate` and `rotate` properties rather than `transform`, going from `0 0 / -2deg` to `0 -18px / 1deg` and back. The **inner** `.tilt-inner` has `transform-style: preserve-3d` and takes only the JavaScript tilt. Keeping them on separate elements is the whole point: a CSS animation on a node always beats an inline `style.transform` on that same node, so putting both on one element would silently kill the tilt.
- **The tilt itself.** On `mousemove` over the wrapper, read the pointer's 0-to-1 position inside `getBoundingClientRect()`, map it to `±14deg` on `rotateY` and inverted `±14deg` on `rotateX`. Lerp `current` toward `target` at `0.12` per frame in a `requestAnimationFrame` loop, and add a `translateZ` lift up to 18px scaled by how far it is tilted. On `mouseleave` set the target back to zero. **Stop the loop when it settles** rather than running forever.
- **Sticker wobble.** Two separate keyframes so the badges never move in sync: `wobble` at 5s with a 0.3s delay, `rotate(-9deg) scale(1)` to `rotate(-4deg) scale(1.04)`, and `wobble2` at 4.5s, `rotate(11deg)` to `rotate(6deg) scale(1.05)`.
- **Marquees.** `width: max-content`, `animation: scroll-left 26s linear infinite`, translating `0` to `-50%`. The second band adds `animation-direction: reverse`. Both pause on section hover.
- **Button.** An ink `::after` panel that starts at `translateX(-101%)` and wipes across on hover while the label flips to cream, plus a `translateY(-4px) scale(1.03) rotate(-1deg)` lift on `cubic-bezier(.34,1.56,.64,1)` and a squash on `:active`.

**Hard rules.** No decorative gradients: the flat brand colour is the look, and the only background-image is the faint hero grid. No coloured icon badges, no icon chips, no emoji bullets. The stickers are typographic die-cuts. Typography carries the design. Write real invented copy for **[BRAND NAME]**: real ingredients, a real batch number, a real Scoville or strength figure, a real price. Never lorem ipsum. Add a `prefers-reduced-motion: reduce` block that stops the float, the wobbles and both marquees, and skips the tilt loop entirely. Responsive: the hero drops to one column at 900px with the stickers pulled inside the frame, the detail grid stacks at 880px, the spec grid goes single column at 520px, and the nav links collapse at 720px. Set `overflow-x: hidden`. Mark the product shot `<!-- PLACEHOLDER: swap for generated asset -->`.
