# 13 — Ledger (B2B fintech / treasury management)

**Invented brand.** Ledger — a treasury operating system for multi-entity groups: live cash
positioning (Ledger Cash), FX exposure captured at booking (Ledger FX), and settlement on
own-licensed instant rails (Ledger Rail). $412.8bn settled TTM, 1,840 entities, 47 currencies,
p50 240 ms / p99 890 ms, 99.995% uptime, SOC 2 Type II + FCA/DNB/MAS licensed.

**Inspiration.** Bloomberg terminal density and Stripe/Modern Treasury docs restraint, filtered
through the hairline-rule + mono-data-readout language noted from godaylight.com in
`_inspo-notes/`. Deliberately *not* a bubbly SaaS page: no cards-with-icons, no hero illustration —
real tables, aligned numeric columns, hairline rules, and figures as the primary visual interest.

## Motion techniques (6 distinct + 1 supporting)

1. **Scroll-scrubbed inline-SVG data viz** *(the signature — worth stealing)* — a hand-authored
   24-point settlement-volume chart. The accent line draws via `stroke-dasharray`/
   `stroke-dashoffset`, the area fill is revealed by an animated `<clipPath>` rect that tracks the
   line head, and a readhead (`getPointAtLength`) rides the curve while the mono readouts
   interpolate the real underlying array. Below it, 8 quarterly bars grow with a per-bar
   cubic-out offset. All of it scrubbed to one ScrollTrigger — no charting library, data hard-coded.
2. **Pinned section** — `#volume` pins for `+=2800` with `scrub: 0.6`; progress drives the chart,
   the bars, and a three-step narrative cross-fade with a progress-pip rail.
3. **Horizontal scroll panel** — the five product-surface panels; vertical scroll drives `x` on a
   `max-content` track, pinned, `scrub: 0.7`, distance recomputed on resize.
4. **Hand-split line mask reveals** — every headline is split by hand into `.mask > span`
   wrappers, `yPercent: 110 → 0`, `power4.out`, 0.07s stagger, fired by ScrollTrigger.
   (No paid SplitText.)
5. **Count-up numbers** — tabular-numeral figures tick on ScrollTrigger enter, with a
   thousands-separator formatter so digit width never jitters mid-count.
6. **Magnetic CTA** — pointer-radius pull with a `gsap.ticker` lerp on both the button and its
   inner label (parallaxed at a lower factor). Never raw `mousemove` assignment.
   Plus a **page-load intro**: counter ticks 0 → 412.8 between two hairlines, then the curtain
   splits vertically on `power4.inOut`.
   *Supporting only:* the FX ticker marquee under the hero.

**Degradation.** `prefers-reduced-motion` kills the intro, unpins everything and paints the chart,
bars and headlines in their final state. Below 1024px the pin and horizontal scroll are torn down
(`buildViz` / `buildShow` rebuild on resize) — the chart draws once on enter, the showcase stacks
vertically, the narrative steps become a normal column.

**Accent:** `#3ddc97` — used only for data-positive states (rising series, positive deltas,
in-policy hedge bars, "Settled" tags, status dot) and the single primary CTA. Everything else is
near-black navy `#070b12`, white and greys.

**Type pairing:** Inter 400/500/600 for prose + JetBrains Mono 400/500/700 for every figure,
table, axis and chart label, with `font-variant-numeric: tabular-nums lining-nums` so numeric
columns align to the pixel. Hero at `clamp(44px, 8.9vw, 146px)`.

**Placeholder asset:** one Unsplash image in showcase panel 05, marked
`<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
