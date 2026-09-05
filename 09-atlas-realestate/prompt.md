# Atlas Real Estate — generation prompt

**Category:** Property & Architecture
**Best for:** new-build residential developments, luxury estate agents, property developers, build-to-rent and branded residences, land promoters, hotel residences
**Signature motion:** sticky stacking residence cards, where each card pins at the top of the viewport and scales and dims as the next slides over it, giving a physical deck-of-cards feel driven entirely by scroll

---

Build a single self-contained `index.html` for **[DEVELOPMENT NAME]**, a **[UNIT COUNT]**-residence development by **[DEVELOPER NAME]** in **[NEIGHBOURHOOD, CITY]**. Inline `<style>` and `<script>`. Google Fonts via `<link>`. GSAP 3.12.5 plus ScrollTrigger from cdnjs and Lenis 1.1.13 from jsDelivr as CDN `<script>` tags. No npm, no build step, no React.

**The tone is warm, calm and residential.** This is a premium property brochure, deliberately not stark and not fashion-loud. Sand and bone paper, warm ink, one terracotta accent. It should feel like something you would be handed in a sales gallery.

**Colour.** On `:root`: sand `--sand: #F2EDE6`, bone `--bone: #E9E2D7`, clay `--clay: #DDD3C4`, shadow `--shadow: #CFC4B3`, ink `--ink: #1E1C19`, secondary ink `--ink-2: #46423B`, tertiary `--ink-3: #7E776C`, hairline `--line: #D3C9BA`. One accent: `--accent: #A0563A`, a muted terracotta, used on section eyebrows, the primary button, one italic word in a headline, and prices. Never a background wash. Also `--m: clamp(20px, 5.2vw, 96px)` for the page margin, `--gap: clamp(20px, 2.4vw, 40px)` and `--e-out: cubic-bezier(.16,1,.3,1)`.

**Type: two faces.** Newsreader (optical-size and italic axes, weights 300 to 500) as the display serif for every heading and lede. Archivo (400/500/600) for nav, labels, spec rows and all figures. Display scale: `.d1` at `clamp(58px, 12.4vw, 196px)` weight 300, `line-height: .86`; `.d2` at `clamp(38px, 6.2vw, 96px)`; `.d3` at `clamp(28px, 3.4vw, 52px)`; `.d4` at `clamp(22px, 2.1vw, 32px)`. Labels are Archivo 11px, `letter-spacing: .16em`, uppercase. Body is 15.5px, `line-height: 1.72`, `max-width: 56ch`.

**Sections, in order.**

1. **Load intro.** The developer name split into letter spans, a growing bar, a mono counter ticking `00` upward, and the development line with completion quarter. Then five vertical curtains lift away.
2. **Nav.** The developer wordmark, four links, and a terracotta "Register interest" button.
3. **Hero.** Left is text: an eyebrow with a small dot, the development name as a two-line `.d1` with the second line indented, a serif lede naming the materials, one paragraph naming the architect and what was kept on site, and two buttons. Right is **three overlapping photo layers** at different depths, one carrying a small caption card. Along the bottom, a scrolling dateline of facts: unit count, location, architect, interiors, size range, price from, completion, availability.
4. **01 The Residences.** A section head with an accent eyebrow, a `.d2` heading, and two paragraphs of real detail (ceiling heights, aspects, how many have outdoor space, how many are reserved). Then **the stacking cards**: four residence types, each a full-width card with a photograph and an availability tag on one side and, on the other, an index number, a plan-type label, a named `.d3` title, a paragraph about what makes that plan different, and a `<dl>` spec list (internal area in both metric and imperial, outdoor space, aspect, price from). Alternate which side the photo sits on.
5. **02 The Neighbourhood.** A `.d2` heading with one italic word in the accent. An offset figure pair, a large image with a smaller one overlapping it and a caption about what was retained on site. Beside it a `.d3` column telling the site's real history, plus a pull quote from the architect with a citation. Then a numbered walking-times list: six places, each with an index, a name, one honest sentence, and a walking time in tabular figures.
6. **The scale-through showcase.** A pinned stage where a framed image opens from `inset(22% 26% 22% 26%)` to full bleed while a scrim and a copy block fade in over it. Use it for the best shared room, with real square metres, real hours and who staffs it.
7. **03 Shared Rooms.** A `.d2` heading, the service charge stated plainly in figures per square metre per month, then four amenity blocks with roman-numeral indices and genuinely specific copy: pool length and temperature, studio floor area and equipment, locker counts, bike racks and charger counts.
8. **04 The Numbers.** A dark section. Four count-up statistics with unit suffixes and a one-line note under each. Then the specification: an aside column, and an accordion of numbered panels (kitchens, bathrooms, floors, glazing, heating, security). Each panel carries a paragraph plus a spec `<ul>` of named brands and real values.
9. **05 Register.** Left: heading, a paragraph about the sales gallery, and a meta list (address, hours, telephone, email, reservation fee and refund window). Right: a **client-side enquiry form** with floating labels, a residence-type `<select>`, a message field, a privacy note, and a success message on submit. No backend.
10. **Footer.** Brand column with a one-line company history, then link columns and legal lines.

**Motion, five techniques.**

- **Signature, the sticky stack.** Give `.stack` **no `overflow` property at all**, so the sticky context stays the viewport. Each `.stack-item` is `position: sticky; top: 0; height: 100vh`, so it contributes exactly one viewport of scroll and pins at the top. The card inside is shorter (`min(84vh, 740px)`) and centred, so the next card visibly slides over the one beneath. For card N, drive `scale: 0.915` and `yPercent: -3.5` from a ScrollTrigger on **item N+1** running `start: 'top bottom'` to `end: 'top top'`, which is exactly the window when N+1 covers N. Append a `.rescard__veil` div and fade it to `opacity: 0.55` on the same range: animating a veil is far cheaper than animating `filter` or `blur`.
- **Card content reveals** as each card arrives: title and description from `y: 34, opacity: 0` at `start: 'top 62%'`, `once: true`, then the spec rows staggered at `top 55%`.
- **Multi-depth hero parallax.** Each `[data-par]` layer tweens `yPercent` by its own depth value on a `scrub: 0.6` trigger across the hero, with a slower `[data-par-slow]` variant for editorial images.
- **Slow inner-image drift** inside each card, `scale: 1.14 → 1.02` with `yPercent: -3 → 3`, `ease: 'none'`, `scrub: 0.8`.
- **Clip-path scale-through** on the showcase, pinned with `scrub: 0.7`, plus **count-up statistics** with thousands separators via a `data-sep` flag.
- Wire Lenis with `lenis.on('scroll', ScrollTrigger.update)` and a `gsap.ticker` raf loop. Use `overflow-x: clip` rather than `hidden` on the page: `hidden` would create a scroll container and silently kill every `position: sticky`.

**Hard rules.** No decorative gradients: only scrims over photography. No coloured icon badges, no icon chips, no emoji bullets. Typography carries the design. Every fact must be specific and invented for **[DEVELOPMENT NAME]**: named plan types, real square metres and square feet, real prices, real walking times, real appliance brands, a real reservation fee. Never lorem ipsum. Read `prefers-reduced-motion` at the top of the script, and put the whole motion block behind `gsap.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')` so it never runs when it should not. Add a matching CSS `@media (prefers-reduced-motion: reduce)` block that turns `.stack-item` back into `position: relative; height: auto` so the cards simply stack. Do the same below 1024px. Mark every image `<!-- PLACEHOLDER: swap for generated asset -->`.
