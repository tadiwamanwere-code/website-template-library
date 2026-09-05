# Caro Accounting — generation prompt

**Category:** Professional Services · Finance
**Best for:** accountants, law firms, consultancies, insurance brokers, corporate advisory
**Signature motion:** a pinned service stack — the section holds while each service advances on
scroll, its number, copy and photograph all driven by one ScrollTrigger scrub

---

Build a single self-contained `index.html` landing page for **[FIRM NAME]**, a [DISCIPLINE, e.g.
accounting and tax] practice in **[CITY]**, **[COUNTRY]**. Inline `<style>` and `<script>`. GSAP 3 +
ScrollTrigger and Lenis via CDN `<script>` tags, Google Fonts via `<link>`. No npm, no build step,
no React.

**Tone.** Corporate and grown-up, not stiff. The differentiator is hard-edged confidence: it should
look like a firm that files your paperwork correctly. Every claim is specific. No "Amazing Feature",
no lorem ipsum, no stock-photo-and-icon-soup.

**The hard rules.**
- **Square corners everywhere.** Put `border-radius: 0` in the global reset and never override it.
  No pills, no rounded cards, no soft chips. This is the whole personality.
- **One accent colour**, `#17A2B8` teal, used sparingly: the second headline line, the single filled
  button, eyebrow rules, list ticks, live figures, "current" statuses. Never a background wash.
  Everything else is near-black `#0B0E10`, white `#FFFFFF`, paper `#F3F4F5`, grey `#5E686E`.
- No decorative gradients. The only gradients allowed are dark legibility scrims over photography.
- No coloured icon badges or emoji bullets. Icons are monochrome, small and functional. Structure
  comes from hairline rules and hard grid divisions, not from cards with shadows.

**Type.** Two faces. Display: **Archivo** variable at `font-stretch: 76%` / `font-weight: 800`,
uppercase, `line-height: .88` — heavy condensed grotesk so headlines read as structural blocks.
Body: **DM Sans** 400/500/700. Hero headline at `clamp(46px, 9.3vw, 158px)`. Eyebrows at 11px with
`letter-spacing: .24em` and a 38px leading rule. Tabular numerals on every figure, fee and reference.

**Sections, in order.**

1. **Page-load curtain.** Two black halves with the firm's wordmark, a 000 → 100 counter and a teal
   progress bar between them; the halves then split vertically on `power4.inOut`. Not a body fade.
2. **Fixed header.** Wordmark in a square teal-outlined mark, uppercase tracked nav, an
   **"ASK [FIRM] AI"** link with a small monochrome spark glyph, and one square outline CTA.
   Transparent over the hero, solid on scroll, hides on scroll-down.
3. **Hero.** Full-bleed upward-looking [skyscraper / architectural] photograph under a dark wash,
   with six faint vertical hairlines over it. Eyebrow: `[CITY], [COUNTRY] · [SERVICE] · [SERVICE]`.
   **The signature device: a two-tone headline**, three lines, the first white and the rest accent
   teal — e.g. "BUILD A STRONGER, / MORE PROFITABLE / FUTURE". One paragraph, then two square
   buttons (filled teal + outline) pushed to the right. A bottom trust bar with four facts. A
   vertical **"SCROLL"** cue on the right edge with a travelling teal segment.
4. **Marquee** of service terms — supporting decoration only.
5. **The firm.** Asymmetric: four paragraphs of real practice copy against a grayscale photograph
   with a hard black caption block bottom-left, then three values in rule-divided columns.
6. **Services — the pinned stack.** Six services on a near-black ground. Three columns: a numbered
   progress rail, the service panel (number, two-line title, description, "what's included" list,
   "who it's for"), and a photograph. Pin the section and scrub through all six.
7. **Pricing.** Three tiers at **[TIER PRICE]** a month — entry / recommended (inverted to near-black
   with a teal top bar) / top. Each: who it is for, the fee, 5–7 included lines, greyed excluded
   lines, a square CTA. Below it a five-cell strip of one-off fees, and a note on currency and on
   anything the firm does not do itself.
8. **Credentials and compliance.** Four count-up figures (returns filed, clients, years trading,
   on-time rate) over a four-column registration table with row hover states: registration, issuing
   body **[REGULATOR]**, reference, status. Then a four-step onboarding strip.
9. **Client outcomes.** One lead case with a photograph, an overlapping black stat block and three
   KPIs, then two shorter cases. Real figures throughout: amounts, weeks, percentages.
10. **Ask [FIRM] AI.** A working panel — four suggested questions plus a free-text box, keyword-
    matched to canned answers that type out character by character. Say plainly that it is a first
    look, not advice, and that it escalates to a named person.
11. **Closing CTA + full footer.** Four link groups, a huge outlined wordmark in stroke-only type,
    and a bottom bar.

**Motion — at least four, real easing only (`power3.out`, `power4.inOut`, `expo.out`; never
`linear`, never default `ease`; reveals 0.6–1.4s, micro-interactions 0.2–0.3s):**
- **Pinned scrub service stack.** One timeline with `pin: true, scrub: 0.65` moves each panel out on
  `yPercent` while the next enters, wipes the photograph with an animated `clipPath: inset()`, and
  scales the rail's teal fill on `scaleY` from the trigger progress. Stack the panels in one CSS
  grid cell (`grid-area: 1/1`) so the container self-sizes from the tallest one.
- **Hand-split line mask reveals** on the two-tone hero headline and every section headline: split on
  `<br>` into `.mask > span`, `yPercent: 128 → 0`, `power4.out`, 0.08s stagger. Give the mask
  `padding-bottom/margin-bottom: ±.14em` so descenders are not clipped. Do not use SplitText.
- **Count-ups** on the credential figures, on ScrollTrigger enter, with a thousands separator.
- **Multi-depth hero parallax:** photograph, headline, blurb and trust bar on four different speeds.
  Build it after the intro reveal completes so the scrub cannot capture a mid-reveal start state.
- **Self-drawing rules** at each section break: `scaleX 0 → 1` over 1.25s `power3.inOut` with a short
  teal segment riding the drawing head.
- Magnetic buttons on a `gsap.ticker` lerp, desktop and `pointer: fine` only.

**Degradation.** Wire Lenis properly (`lenis.on('scroll', ScrollTrigger.update)` plus a
`gsap.ticker` raf loop, `lagSmoothing(0)`). Gate the pin on viewport **height** as well as width
(`min-width: 1024px and min-height: 680px`) through `gsap.matchMedia`, with the CSS on the identical
query; below it the services become a numbered vertical list with the photographs regrouped as an
index strip. `prefers-reduced-motion: reduce` removes the curtain, kills every scrub and pin, and
paints everything in its final state.

**Images.** Free-license Unsplash direct URLs, grayscale-filtered, each preceded by
`<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
