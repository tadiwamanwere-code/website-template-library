# 23 — Caro Accounting & Tax (professional services / finance)

**Original.** Rebuild of a real client site: Caro Accounting & Tax, Kadoma, Zimbabwe
(<https://caroaccounting.co.zw>, local source `C:\dev\caro-accounting-tax`, screenshot at
`_inspo-notes/rylo-originals/caro.png`). Kept the original's whole identity: the upward-looking
skyscraper hero under a dark wash, the two-tone headline where "BUILD A STRONGER," is white and
"MORE PROFITABLE / FUTURE" is teal, the vertical SCROLL cue on the right edge, the ASK CARO AI nav
item, and above all the **square corners**. Nothing on this page has a rounded edge — no pills, no
rounded cards, no soft chips. `border-radius: 0` is set globally in the reset and never overridden.
That hard-edged confidence is what separates this template from the softer ones in the batch.

**Accent:** `#17A2B8` teal. One accent, used only for the second and third headline lines, the
primary button, the eyebrow rules, list ticks, the pinned-stack progress rail, live figures and the
"current" compliance statuses. Everything else is near-black `#0B0E10`, white and grey.

**Type pairing:** **Archivo** variable (`wdth 76% / wght 800`, uppercase) for every display line —
a genuinely condensed heavy grotesk, so headlines read as structural blocks rather than as
lettering — against **DM Sans** 400/500/700 for body, lists and tables. Hero at
`clamp(46px, 9.3vw, 158px)` on `line-height: .88`. Tabular numerals on every figure, fee and
reference number so the pricing and compliance columns align to the pixel.

## Motion techniques (7 distinct + 1 supporting)

1. **Pinned, scrubbed service stack** *(the signature — the one worth stealing)*. `#services` pins
   for `100vh × 5 × 0.92` with `scrub: 0.65`. One scrubbed timeline drives three things at once:
   each service panel exits on `yPercent -7` / `autoAlpha 0` while the next enters from `+7`; the
   matching photograph wipes with an animated `clipPath: inset()` from the bottom edge; and the
   progress rail's teal fill scales on `scaleY` with the raw trigger progress. The `01 /06` counter
   snaps to the rounded index in `onUpdate`, and the rail numbers are clickable — they solve for
   the scroll position inside the pinned range and hand it to Lenis. The panels stack in a single
   CSS grid cell (`grid-area: 1/1`), so the held section sizes itself from the tallest panel and
   there is no magic height to keep in sync with the copy.
2. **Hand-split line mask reveals.** The two-tone hero headline and every section headline are split
   by hand on `<br>` into `.mask > span` wrappers, `yPercent: 128 → 0`, `power4.out`, 0.075–0.085s
   stagger. The mask carries `padding-bottom/margin-bottom: ±.14em` so descenders survive the
   `overflow: hidden` at `line-height: .88`. No paid SplitText anywhere.
3. **Count-ups on the credential figures.** 11,940 returns filed, 312 clients, 14 years, 99.4% filed
   on time — each ticks on ScrollTrigger enter with a thousands-separator formatter and a decimal
   variant, so digit width never jitters mid-count.
4. **Four-depth hero parallax.** Photograph `yPercent 15 + scale 1.06`, headline block `-120`,
   eyebrow `-46`, blurb `-74`, trust bar `-32`, all on one scrub. Built only *after* the intro
   reveal finishes, so the scrub never captures a mid-reveal value as its start state.
5. **Self-drawing section rules.** Each section break is a hairline that draws itself left-to-right
   on `scaleX` over 1.25s `power3.inOut`, with a 96px teal segment riding the drawing head and
   fading out as it lands.
6. **Page-load curtain.** A 000 → 100 counter and a teal progress bar between two black halves,
   which then split vertically on `power4.inOut` — hard edges, no fade.
7. **Magnetic buttons.** Pointer-radius pull on a `gsap.ticker` lerp, with the inner label
   parallaxed at 0.28 of the button's own offset. Desktop and `pointer: fine` only.
8. **Ask Caro AI** — a working panel, not a picture of one: four suggested questions plus a free-text
   box, keyword-matched to real answers on VAT categories, employer PAYE cost, company registration
   and books in arrears, typed out character by character behind a blinking caret.
   *Supporting only:* the service-terms marquee under the hero.

**Degradation.** `prefers-reduced-motion: reduce` removes the curtain entirely, skips every scrub
and reveal, paints all headlines and figures in their final state, and switches the AI answers to
instant. The pin is gated on viewport **height** as well as width
(`min-width: 1024px and min-height: 680px`) via `gsap.matchMedia`, with the CSS gated on exactly the
same query — a held section that does not fit the screen is worse than a list. Below that the six
services become a clean numbered vertical list, the six photographs regroup as a 3-across index
strip above it, and the magnetic buttons and rail are torn down.

## Improved over the original

- Six services with real scope: what is included and who it is for, using actual Zimbabwean
  compliance work (VAT7, ITF12C, QPDs, ITF263, P2, NSSA, ZIMDEF, ITF16, CR6/CR14).
- A real pricing section: three tiers at US$120 / US$340 / US$780 a month with what each includes,
  plus a one-off work strip and a note on currency and on audits being signed by an independent
  PAAB-registered auditor.
- A credentials and compliance section: four count-up figures over a registration table with hover
  states (ZIMRA tax agent, ICAZ practice certificate, IAC, NSSA, indemnity cover, data protection).
- Three client outcomes with figures the copy claims are published with permission — a 31-period VAT
  catch-up, a 78-staff payroll migration, and a co-operative's first IFRS-for-SMEs statements.
- The chat bubble in the corner of the original became a full **Ask Caro AI** section, which keeps
  the nav item honest.

**Note before reuse:** every registration number, fee, client name and outcome figure on this page
is invented for the template. The page says so in its own compliance note. Replace them with the
firm's real details before publishing, and never display a certificate reference a firm does not
hold.

**Placeholder assets:** nine Unsplash images (hero skyline, office, six service photographs, one case
study), each carrying `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
