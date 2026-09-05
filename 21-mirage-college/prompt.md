# Mirage College — generation prompt

**Category:** Education · Training
**Best for:** colleges, vocational schools, academies, training providers, short-course businesses
**Signature motion:** a pinned course browser — one held viewport where the scroll steps through a numbered course index while the detail panel and its photograph cross-dissolve

---

Build a single self-contained `index.html` landing page for **[SCHOOL NAME]**, a [COURSE FIELD] college in **[CITY]** accredited by **[ACCREDITATION BODY]**. Inline `<style>` and `<script>`. GSAP 3 + ScrollTrigger + Lenis via CDN. Google Fonts via `<link>`. No build step, no React.

**The proposition, and it must stay front and centre:** students train on **[REAL-WORLD PRACTICE SETTING]** — real, paying customers — before they graduate. Every section should serve one question: is this worth enrolling in?

**Palette.** Deep olive-dark ground `#1A2117` (deeper `#0E1310` for footer and curtain), warm paper `#F6F2E9` and `#EFE9DB` for light sections, cream text `#F4EFE4`, ink `#1B211A` on paper. One accent only: warm gold `#BFA05A` (use `#9C7F3E` on paper for contrast). No decorative gradients — a dark-to-transparent scrim over a photo is the only gradient allowed. No coloured icon badges, no emoji bullets.

**Type.** Two faces. Playfair Display (high-contrast display serif, weight 500) for every headline; Source Sans 3 (humanist sans, 300–600) for body, labels and UI. Hero headline `clamp(46px, 8.2vw, 132px)`, line-height `.98`, letter-spacing `-.022em`. Eyebrows are 12px uppercase, `letter-spacing: .19em`, gold, preceded by a 38px hairline rule. Tabular numerals everywhere.

**Sections, in order.**

1. **Page-load curtain.** Full-screen dark panel: circular monogram of the school's initial, the name in serif, a small-caps line, a gold hairline that draws left to right, then the whole curtain lifts (`yPercent: -100`, `power4.inOut`) while the hero photo un-scales from 1.14.
2. **Header.** Circular monogram lockup (letter in a 46px ringed circle) + two-line wordmark. Text nav, gold pill "Enquire". Turns to a blurred dark bar after 70px of scroll.
3. **Hero, full-bleed.** Photograph of the real practice setting, olive multiply tint plus a legibility scrim. Eyebrow "[ACCREDITATION BODY] ACCREDITED · [CITY]", three-line serif headline with one italic gold word, one paragraph, a gold pill CTA plus an outline CTA with an arrow that slides on hover, then a price line: "Diplomas from **[FEE]** · full kit included".
4. **Intake bar.** Four hairline-divided facts: next intake date, accreditation, class size, where you train.
5. **Courses — the biggest section, on paper.** Left: a numbered 01–05 index with title and one-line meta. Right: the active course — awarding body, serif title, two-line description, a 2×2 spec grid (duration / timetable / next intake / fee), then two columns, "What's included" and "Where it takes you", with 3–4 gold-ticked lines each, beside a tall photograph with a caption. Invent 4–5 real courses with genuine detail: levels, hours, kit, intake dates, job titles.
6. **The proposition, on dark.** Asymmetric: serif statement and two paragraphs beside two overlapping parallax photographs. Below, a four-step week-by-week progression with each item stepped lower than the last. Close on a large serif line carrying the hard numbers ("**[N] supervised client hours** before graduation").
7. **Gallery.** Broken 12-column grid, six images, small uppercase captions, clip-path reveals.
8. **Outcomes, on paper.** Four count-up figures (graduates, hours logged, pass rate, in work within six months), then a hairline list of employers with locations, and one graduate quote with a portrait.
9. **Open day and enrolment.** Big serif date, a timed running order, address and CTAs, beside a numbered four-step enrolment path ending in the deposit.
10. **Fees table.** Course, paid in full, two instalment plans, deposit. Row hover slides a gold rule in and indents the first cell. Below it, plain-language notes: what is included, resit cost, refund window.
11. **Closing CTA over a dark photo, then a five-column footer** with real link groups, address, hours and registration numbers.

**Motion — at least four, real ones.**
- **Pinned course browser (signature).** `ScrollTrigger` with `pin: true`, `scrub: true`, `end: '+=' + innerHeight * 0.92 * n`, and `snap: { snapTo: 1/(n-1) }`. `onUpdate` maps progress to `Math.round(progress * (n-1))`; on change, fade the outgoing panel out over 0.5s and the incoming one in over 0.68s, scale its photo 1.13 → 1 over 1.5s, and stagger the detail lines up 20px at 0.055s apart. A vertical gold rail fills with progress. Index buttons scroll to `start + (end - start) * (i/(n-1))`.
- **Line mask reveals.** Split headings by hand: wrap words in spans, group them into lines by `offsetTop`, put each line in an `overflow:hidden` wrapper, animate `yPercent: 112 → 0`, `power4.out`, 0.075s stagger, on ScrollTrigger.
- **Count-ups** on the outcome figures, 2.2s, `power3.out`, thousands separators, `once: true`.
- **Clip-path reveals** on imagery: `inset(0% 0% 100% 0%) → inset(0)` over 1.35s `power4.inOut`, with the inner image counter-scaling 1.24 → 1.
- Supporting: multi-speed parallax plates, magnetic gold buttons (rAF lerp, never raw mousemove), hairline rules drawing with `scaleX`.

**Hard rules.** Easing is `power3.out` / `power4.out` / `power4.inOut` only, never `linear` or default `ease`. Reveals run 0.6–1.4s. `prefers-reduced-motion` disables the curtain, pin and scrubs, and stacks the courses vertically in their final state. Below 1024px the pin is not created at all: the same course markup becomes plain stacked blocks and the index is hidden. Wire Lenis properly (`lenis.on('scroll', ScrollTrigger.update)` plus a `gsap.ticker` raf loop) and route anchor links through it. Every image is a free-license placeholder carrying `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`, with an `onerror` fallback that turns the frame into a textured olive plate.

**Tone.** Calm, expensive, aspirational. A school selling a career, not a bootcamp selling urgency. No countdown timers, no "only 3 seats left", no exclamation marks. Every number should read as if it came from a register, not a marketing meeting.
