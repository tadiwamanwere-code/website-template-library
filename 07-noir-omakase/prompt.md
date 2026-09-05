# Noir Omakase — generation prompt

**Category:** Food & Drink
**Best for:** tasting-menu and chef's-counter restaurants, fine dining, wine bars and speakeasies, private dining rooms, whisky and sake brands, members' clubs
**Signature motion:** a pinned tasting-menu scrub, where the section holds the viewport while six courses advance and the plate images cross-dissolve through clip-path, with a numbered index rail whose buttons scrub the same timeline

---

Build a single self-contained `index.html` for **[RESTAURANT NAME]**, a **[SEAT COUNT]**-seat **[FORMAT, e.g. omakase counter]** in **[NEIGHBOURHOOD, CITY]**. Inline `<style>` and `<script>`. Google Fonts via `<link>`. GSAP 3.12.5 plus ScrollTrigger from cdnjs and Lenis 1.1.13 from jsDelivr, all as CDN `<script>` tags. No npm, no build step, no React.

**The mood is near-black and quiet.** This is a room with fourteen chairs and one light. Nothing bounces. Every easing is `expo.out`, `power2.inOut` or `power3.out`. The page should feel expensive because it is restrained, not because it is busy.

**Colour.** On `:root`: ink `--ink: #0b0b0c`, panel `--ink-2: #101012`, lit surface `--ink-3: #17171a`, warm off-white text `--paper: #EFE8DC`, secondary `--paper-dim: #A79F92`, tertiary `--paper-faint: #6B655C`, and one accent, `--lacquer: #A32B1E`, a deep lacquer red. The accent goes on the Reserve button's dot, active index marks and the progress bar. Never a background wash. Also set `--rule: rgba(239,232,220,.13)` for hairlines and `--gut: clamp(20px, 5vw, 76px)`.

**Type: two faces.** Cormorant Garamond (300 to 600 plus italic) for every display heading, course name and pull quote. JetBrains Mono (300/400/500) for every label, index number, spec line and figure, at 11px with `letter-spacing: .22em`, uppercase. Hero title at `clamp(3.4rem, 12.4vw, 12.2rem)`, weight 300, `line-height: .94`. Section `h2` at `clamp(2.6rem, 6vw, 5.6rem)`. Body at `clamp(17px, 1.05vw, 19px)`, `line-height: 1.62`.

**Sections, in order.**

1. **Load intro.** A full-screen curtain with the wordmark rising from `yPercent: 40`, a mono counter ticking `00` to **[SEAT COUNT]** beside the address line, and a hairline bar growing to 100%. Then the curtain panels retract with `scaleY: 0`, `transformOrigin: 50% 0%`, `expo.inOut`, staggered 0.065s, while the hero title characters rise from `yPercent: 115` and the hero photo settles from `scale: 1.14`. Lenis stays stopped until the intro completes.
2. **Header.** Wordmark left, three tracked mono links with an underline that wipes in, and a magnetic "Reserve" button carrying a small accent dot. It gains an `is-stuck` class past 80px of scroll.
3. **Hero.** Full-bleed photo with `data-parallax="0.18"`, a dark scrim, and a **grain layer**: an inline `feTurbulence` SVG as a `data:` URL at `opacity: .4`. Three mono eyebrow facts across the top (established, address, service days). The title on three lines with the second line indented `clamp(0px, 14vw, 20vw)` so it steps across the frame. A foot row above a hairline: one sentence about the chef, and a "Scroll" cue.
4. **Manifesto.** A mono section number and title, "001" then "Intent", beside three short paragraphs at `clamp(1.1rem, 1.5vw, 1.45rem)`. Say what the restaurant will not do: no à la carte, no wine list on the table, the price per guest, how long it takes.
5. **The pinned menu.** Six courses, each with a plate photograph in a clipped frame, a caption, a "Movement 01 / 06" mono line, the course name in serif with an italic clause, one honest tasting note, and a drinks pairing line. A vertical numbered index rail down one side, and a progress bar along the bottom.
6. **The chef.** Section number, the chef's name as a big serif `h2`, one quote in serif, a portrait revealed by clip-path, then three paragraphs of real history: where they trained, how long, what they shipped in, what they buy and from where. Close with three mono credit lines.
7. **The room, horizontal track.** A pinned horizontal gallery of four things worth arriving early for, each with a photo and a serif `h3`, driven by vertical scroll.
8. **Proof.** Four count-up statistics with mono prefixes and suffixes (seats, price per guest, minutes of service, year opened), each with one sentence under it. Then an accordion of four "before you book" panels: seatings and the booking window, dietary requirements, cancellation and transfers, and the house rules. Write these as a person would actually explain them, with real times and real numbers.
9. **Closing CTA** over a parallaxed photo: section number, a two-word serif headline, three mono facts, and a large magnetic "Request a seat" button linking to a real email address.
10. **Footer.** Wordmark, full address, phone, and link columns.

**Motion, six techniques.**

- **Signature, the pinned scrub.** A GSAP timeline with `trigger: '#menu'`, `start: 'top top'`, `end: () => '+=' + window.innerHeight * n * 0.85`, `pin: '#menuStage'`, `scrub: 0.7`, `anticipatePin: 1`, `invalidateOnRefresh: true`. For each step, fade the outgoing copy out and up 44px, bring the incoming copy in from 44px below, and cross-dissolve the plates with `clipPath` from `inset(100% 0 0 0)` to `inset(0)` while the outgoing plate wipes to `inset(0 0 100% 0)` and scales to 1.06. Pad the tail with an empty tween so the last course holds. `onUpdate` sets the progress bar width and the active index. Each index button scrolls the page via `lenis.scrollTo(st.start + (st.end - st.start) * ((k + 0.35) / n))`, so the rail scrubs the same timeline rather than jumping.
- **Split reveals.** Write your own splitter: `[data-split="chars"]` and `[data-split="words"]` are broken into pieces, wrapped in `overflow: hidden`, and animated `yPercent: 115 → 0` with `expo.out`, 1.15s for chars and 0.95s for words. Do not reference the paid SplitText.
- **Horizontal track.** Also inside the same `gsap.matchMedia('(min-width: 1024px)')` block, tween the gallery track's `x` to `-(scrollWidth - innerWidth)` with `ease: 'none'`, `pin: '#gallery'`, `scrub: 0.6`. Measure the distance from the real track width so it never drifts, and return a cleanup function that clears inline styles.
- **Clip-path reveals** on portraits and figures, **parallax** on the hero and CTA photos, and **count-up** statistics on ScrollTrigger enter.
- **Magnetic buttons** using a lerp, gated behind `window.innerWidth >= 1024 && matchMedia('(pointer:fine)')`.
- Wire Lenis with `lenis.on('scroll', ScrollTrigger.update)` and a `gsap.ticker` raf loop.

**Hard rules.** No decorative gradients: only dark scrims over photography. No coloured icon badges, no icon chips, no emoji bullets. Typography carries the design. Every word of copy must be specific and invented for **[RESTAURANT NAME]**: real course names, real suppliers and ports, real prices, a real waiting-list number, a real corkage policy. Never lorem ipsum. Read `prefers-reduced-motion` at the top of the script and, when it is set, skip the intro, skip every pin and scrub, and paint the page in its final state. Put both pinned sections inside `gsap.matchMedia('(min-width: 1024px)')` so they never run on phones, where the courses and gallery stack vertically. Mark every image `<!-- PLACEHOLDER: swap for generated asset -->`.
