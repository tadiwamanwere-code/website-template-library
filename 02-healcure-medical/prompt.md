# Healcure Medical — generation prompt

**Category:** Healthcare
**Best for:** clinics, private hospitals, dental practices, physiotherapy and rehab centres, telehealth platforms, medical aesthetics, veterinary practices
**Signature motion:** word-by-word reveal, where JavaScript wraps every word in its own span and staggers the delay so the headline types itself in with blur and lift

---

Build a single self-contained `index.html` for **[BRAND NAME]**, a healthcare provider in **[CITY]**. Inline `<style>` and `<script>`. Tailwind via the CDN `<script>` tag at `https://cdn.tailwindcss.com`. Google Fonts via `<link>`. No npm, no build step, no React.

**This is one hero section only.** No services grid, no doctor cards, no testimonials block, no footer. Deliberately **no logo banner or "proudly worked with" strip**. The page is a single `min-h-screen` frame and it ends.

**The layout is bottom-aligned, and that is the point.** The section is `flex flex-col justify-end`, so the nav sits at the top and everything else is pushed down against the bottom edge, leaving a large open area of photograph above the headline. Do not centre the content.

**Colour.** Ground is `bg-black`. All type is white or white at reduced opacity: headline pure white, body `text-white/70`, nav links `text-white/80`. Buttons are white fill with black text, or transparent with a `border-white/40` outline. **No accent colour at all.** The only chip on the page is a white "Trusted" pill. Keep it that way.

**Type.** Inter only, weights 400 to 700. Nothing else.

**Layout, top to bottom.**

1. **Background.** A full-bleed photograph, `absolute inset-0 w-full h-full object-cover object-center`. Over it a single legibility scrim: `bg-gradient-to-b from-black/70 via-black/30 to-black/90`. That is the only gradient permitted on the page.
2. **Content column.** Everything sits in a `relative z-10 mx-auto` wrapper capped at `max-width: 1340px`, with `px-6` on small screens and `lg:px-0` once the cap takes over.
3. **Nav.** `pt-8`. Left: the wordmark **[BRAND NAME]** at `text-2xl font-semibold tracking-tight`. Centre: five plain links (Home, About, Services, [PRACTITIONER PLURAL, e.g. Doctors], Blog) at 14px, hidden below `md`. Right: a white rounded-full "Book An Appointment" button carrying a small inline arrow SVG stroked with `currentColor`, hidden below `sm`. No logo, no icon chips.
4. **Trust pill.** `pt-24` above the headline. A `rounded-full` glass chip: `bg-white/10`, `border-white/15`, `backdrop-blur-sm`. Inside it a small solid white sub-pill reading "Trusted" with black 11px text, then "**[PATIENT COUNT, e.g. 20,000+]** Patients Worldwide" in 14px white.
5. **Headline.** `id="mainHeading"`, 42px, `font-medium`, `leading-[1.08]`, `max-w-2xl`, broken over two lines with a literal `<br />`: **"[HEADLINE LINE 1, e.g. Healthcare for Good]" / "[HEADLINE LINE 2, e.g. Today. Tomorrow. Always.]"**.
6. **Subtext.** `id="subText"`, 15px, `text-white/70`, `mt-5`, `max-w-xl`, also broken with a `<br />`. Two clauses about what the practice actually does.
7. **Buttons.** `mt-8`, wrapping row, 12px gap. Primary: white rounded-full "Book An Appointment" with the arrow SVG. Secondary: transparent rounded-full "About Us" with a `border-white/40` outline, filling to `bg-white/10` on hover.
8. **Social proof.** `mt-12`. Four small round patient portraits at `w-10 h-10` overlapping with `-space-x-3`, each with a `border-2 border-black` ring. Beside them five white star SVGs and the line "Based on **[REVIEW COUNT]** Reviews" at 13px.

**Motion.** No animation library. Everything is CSS keyframes driven by JavaScript-set delays.

- Write a `splitToWords(el)` function. Split the element's `innerHTML` on `<br />` to keep the line breaks, then split each line on spaces, wrap every word in a `<span class="word-reveal">` holding an inner `<span>` with a non-breaking space after the word, and rebuild the element with real `<br>` nodes between lines.
- The `.word-reveal span` starting state is `opacity: 0; transform: translateY(14px); filter: blur(4px)`. A `revealWord` keyframe animates to `opacity: 1`, `translateY(0)`, `blur(0)` over `0.6s` with `cubic-bezier(0.22, 1, 0.36, 1)`, `forwards`.
- A `stagger(el, startDelay, step)` helper walks the spans and sets `animationDelay` per index. Run the headline at `0.15s` start with `0.09s` per word, and the subtext at `0.15 + 0.09 * 8` seconds with a faster `0.045s` step so it flows out of the headline rather than racing it.
- Wrap the whole section in a `fade-in-page` class that runs a `0.9s` opacity fade on load, so the photograph arrives before the words do.

**Hard rules.** No decorative gradients: the black scrim is the only one and it exists for legibility. No coloured icon badges, no circular icon chips, no emoji bullets. The arrow and star SVGs are monochrome, inline and small. Typography carries the design. Write real invented copy for **[BRAND NAME]**, real patient numbers and a real review count. Never lorem ipsum. Add a `prefers-reduced-motion: reduce` block that sets every `.word-reveal span` to `opacity: 1`, no transform, no blur, no animation, and drops the page fade. Set `overflow-x: hidden` and `max-width: 100vw` on `html, body`. Mark every image `<!-- PLACEHOLDER: swap for generated asset -->`.
