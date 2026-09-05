# Locomotive Editorial — generation prompt

**Category:** Creative & Agency
**Best for:** design and branding studios, digital agencies, film and motion houses, photographers, editorial and publishing brands, independent creative consultancies
**Signature motion:** a CSS-only duotone photo treatment, built from a grayscale luminosity layer under a solid accent multiply layer, with a randomly generated flickering pixel-block strip across the top

---

Build a single self-contained `index.html` for **[STUDIO NAME]**, a **[DISCIPLINE, e.g. digital-first design]** agency in **[CITY]**. Inline `<style>` and `<script>`. Google Fonts via `<link>`. Vanilla JavaScript, and only about twenty lines of it. **No GSAP, no React, no build step.**

**This is a hero screen, not a full site.** Nav, a mono tag cluster, a big duotone hero, a marquee, a thin footer strip. Then it stops. The mood is editorial and slightly rough: dark, confident, a bit corrupted at the edges. It should look like a studio that has opinions.

**Colour.** Set on `:root`. Ground `--bg: #0c0c0c`. Foreground `--fg: #ededea`. Dim text `--fg-dim: #9a9a96`. Hairline `--line: #333330`. Accent `--accent: #8a1c1f`, a deep red, used as the photo tint. Brighter variant `--accent-bright: #c23a2e` for link hovers, the marquee separators and the pulsing status dot. Also set `::selection { background: var(--accent); color: #fff; }`.

**Type: three faces.** Fraunces (loaded with the italic and optical-size axes, weights 300/500/600 plus italic 400) for the wordmark, the headline and the marquee. JetBrains Mono (400/500/700) for the tag boxes, the inline headline mark, the marquee separators and the footer strip. Inter (400/500/600) for the nav links and body.

**Layout, top to bottom.**

1. **Nav.** `padding: 28px clamp(20px,4vw,56px) 20px`. Left: the wordmark **[STUDIO NAME]** in Fraunces at 22px with a small `<sup>®</sup>`. Centre: four links (Work, Agency, Careers, Store) in dim grey with an underline that grows in on hover. Right: an outlined "Let's talk" button that inverts to solid foreground on hover.
2. **Tag cluster.** Directly under the nav, an `inline-flex` of bordered JetBrains Mono boxes at 11px, joined with `margin-right: -1px` so their borders share a single hairline. First box "OPS", second box stacked into two lines, "DES" over "DEV". Use **[3-LETTER CAPABILITY CODES]** for your own brand.
3. **Hero.** `min-height: 88vh`, `flex-direction: column`, `justify-content: flex-end`, `overflow: hidden`. Content is pinned to the bottom of the frame.
   - **The duotone photo.** An absolutely positioned portrait at `object-fit: cover`, `object-position: center 20%`, with `filter: grayscale(1) contrast(1.25) brightness(.85)` and `mix-blend-mode: luminosity`. A `::before` layer of solid `var(--accent)` at `opacity: .92` with `mix-blend-mode: multiply` supplies the colour. A `::after` layer supplies legibility: a four-stop vertical black scrim plus a radial vignette from transparent at 35% to `rgba(0,0,0,.55)` at the edge. **No image editing needed, and the photo swaps freely.**
   - **The glitch strip.** An absolutely positioned CSS grid across the top of the hero, 110px tall, `repeat(24, 1fr)` by `repeat(3, 1fr)`, `pointer-events: none`, every cell a solid black div.
   - **The headline.** Fraunces weight 400 at `clamp(2.6rem, 8.6vw, 7.4rem)`, `line-height: .98`, `letter-spacing: -.015em`, `max-width: 18ch`, over two lines: **"[HEADLINE LINE 1]"** and **"[HEADLINE LINE 2]"**. Give the second line a small underlined JetBrains Mono mark at `.28em` set inline, reading **[SHORT CODE, e.g. the studio's initials]**. Below it two underlined text links, "View our work" and "Start a project", which turn `--accent-bright` on hover.
4. **Marquee.** A full-width band with a hairline above and below, 16px padding. Four identical spans in Fraunces italic at `clamp(1.1rem, 3vw, 2rem)` reading **"[TAGLINE]"** then **"[CAPABILITIES]"**, with a long dash character between and after them, set in JetBrains Mono at half size in `--accent-bright`.
5. **Footer strip.** JetBrains Mono at 11px, dim. Left: a 6px accent dot then "Available for new projects, **[QUARTER, e.g. Q4 2026]**". Right: "**[CITY]** · Remote".

**Motion, four techniques, all cheap.**

- **The glitch strip is generated in JavaScript.** Loop 24 × 3 = 72 times, create a div per cell, and give each a random base opacity between 0.1 and 0.95 stored both on `style.opacity` and on a `--o` custom property. Roughly 18% of cells get opacity 0, so the photo punches through. Roughly 22% get a `.flick` class that runs a `flicker` keyframe on `steps(1)` timing over 3.6s, infinite, with a random `--d` animation delay between 0 and 3s. `steps(1)` is what makes it read as a corrupted signal rather than a fade.
- **Headline line masks.** Each line lives in a `.headline-row` with `overflow: hidden` holding an inline-block span that starts at `translateY(110%)` and runs a `rise` keyframe over 0.9s on `cubic-bezier(.16,1,.3,1)`, `forwards`. Delay line one by `.05s` and line two by `.18s`.
- **Marquee.** `width: max-content`, `animation: scroll-x 26s linear infinite`, translating `0` to `-50%`. Because the content is duplicated, the loop is seamless. Pause it with `animation-play-state: paused` on wrapper hover.
- **Status dot.** A 2s ease-in-out `pulse` keyframe between opacity 1 and 0.25.
- Hero links animate `border-color`, `color` and `letter-spacing` together over 0.3s.

**Hard rules.** No decorative gradients: the only gradients are the scrim and vignette in `.duotone::after`, and both are for legibility. No coloured icon badges, no icon chips, no emoji bullets. Typography carries the design. Write real invented copy for **[STUDIO NAME]**: a real tagline, real capability codes, a real availability line. Never lorem ipsum. Add a `prefers-reduced-motion: reduce` block that stops the marquee, the flicker and the dot pulse, and paints the headline lines in place. Responsive: below 600px the hero drops to `82vh`, the glitch strip shrinks to 64px tall on `repeat(14, 1fr)` columns, and the footer strip stacks left-aligned; below 760px collapse the nav links. Set `overflow-x: hidden` on `body`. Mark the photo `<!-- PLACEHOLDER: swap for generated asset -->`.
