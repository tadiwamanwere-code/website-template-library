# Ledger — generation prompt

**Category:** Professional Services
**Best for:** B2B fintech and payments platforms, treasury and banking software, data and analytics products, insurance and risk platforms, compliance and RegTech, institutional asset managers
**Signature motion:** a hand-authored SVG chart that draws itself on scroll, with a readhead riding the curve and monospace readouts interpolating the real underlying numbers

---

Build one self-contained `index.html` for **[COMPANY NAME]**, a **[CATEGORY, e.g. treasury operating system]** sold to **[BUYER, e.g. group finance teams]**. Inline `<style>` and `<script>`. GSAP 3.12.5 plus ScrollTrigger, and Lenis 1.1.13, via CDN `<script>` tags. Google Fonts via `<link>`. No npm, no build step, no framework.

**Mood.** Bloomberg terminal density with Stripe-grade restraint. This is deliberately not a bubbly SaaS page. No hero illustration, no cards with icons, no three friendly benefits. Real tables, aligned numeric columns, hairline rules, and figures as the primary visual interest. Every number should look like it came out of a system.

**Colour.** Near-black navy ink `#070b12`, panels `#0b111c`, `#0e1523` and `#121a2a`. Foreground `#eef2f7`, secondary `#96a1b3`, muted `#8c97a9`, dim `#5b6679`. Hairlines as `rgba(255,255,255,.075)` stepping up to `.22`. One accent, `#3ddc97`, used only for data-positive states: rising series, positive deltas, in-policy bars, settled tags, the status dot, and the single primary button. Never a background wash.

**Type.** **Inter** 400/500/600 for prose. **JetBrains Mono** 400/500/700 for every figure, table cell, axis and chart label, with `font-variant-numeric: tabular-nums lining-nums` so columns align to the pixel. Hero headline at `clamp(44px, 8.9vw, 146px)`.

**Sections, in order.**

1. **Page-load intro.** A counter ticks from zero to the headline figure between two hairlines, then the curtain splits vertically on `power4.inOut`.
2. **Header.** Wordmark, section nav, a status dot, one accent button.
3. **Hero.** Three faint vertical rules. Eyebrows naming the product, the offices and the version with a release date. A two-line headline with one figure set in accent. A lede paragraph carrying real numbers inline. Two buttons. A compliance fine-print line listing real-sounding certifications and licences. Beside it a mini live surface: a bordered panel with a header bar, a real table of entities, currencies, available balances and 24-hour deltas, and a total row. Below, a four-cell stat rail.
4. **FX ticker marquee.** Supporting decoration only.
5. **The scrubbed chart.** The signature. Section `02`, pinned for `+=2800` at `scrub: 0.6`. A hand-authored 24-point volume chart in inline SVG, no charting library, data hard-coded in a JS array. Beside it three narrative steps that cross-fade with a progress-pip rail. Below the chart, eight quarterly bars.
6. **Products.** Section `03`, three product rows. Each has a giant ghost numeral, an ID line, a two-line masked heading, two paragraphs of specific prose, and a spec list of labelled figures.
7. **The product surface.** Section `04`, a pinned horizontal track of five panels, each a real table or readout from a fake tenant, with a header bar and a timestamp.
8. **Coverage and evidence.** Section `05`, a band of four count-up figures each with a label and a comparison line, then a seven-column corridor table: corridor, pair, rail, p50, p99, 30-day volume, cut-off. Then a named quote with a real title.
9. **Closing CTA.** Section `06`, a two-line headline, a paragraph that says something concrete and slightly against interest, and two buttons.
10. **Footer.** Link columns, legal entity names, registration numbers.

**Motion.** Wire Lenis properly: `lenis.on('scroll', ScrollTrigger.update)`, a `gsap.ticker` raf loop, `lagSmoothing(0)`.

- **Scroll-scrubbed data viz.** The accent line draws via `stroke-dasharray` and `stroke-dashoffset`. The area fill is revealed by an animated `<clipPath>` rect tracking the line head. A readhead placed with `getPointAtLength` rides the curve while mono readouts interpolate the real array. The eight bars grow with a per-bar cubic-out offset. All of it on one ScrollTrigger.
- **Hand-split line mask reveals** on every headline: `.mask > span` wrappers, `yPercent: 110 → 0`, `power4.out`, 0.07s stagger. No SplitText.
- **Count-ups** with a thousands-separator formatter and a decimals option so digit width never jitters mid-count.
- **Magnetic CTA** on a `gsap.ticker` lerp, with the inner label parallaxed at a lower factor. Never raw `mousemove` assignment.

**Hard rules.** No decorative gradients. No coloured icon badges or emoji bullets. Write real invented content: entity names, currencies, latencies, licence numbers, dates. No lorem ipsum. Responsive: build the chart and the horizontal track in functions that rebuild on resize, so below 1024px the pin and the horizontal scroll are torn down, the chart draws once on enter, the panels stack, and the narrative steps become a plain column. Under `prefers-reduced-motion: reduce` kill the intro, unpin everything, and paint the chart, bars and headlines in their final state.

**Images.** At most one photograph, on a single showcase panel, preceded by `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`. Everything else is type, rules and data.
