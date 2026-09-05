# 22 — Smile Dental (dental practice / clinic)

**Original.** The Smile Dentist, `dentist.rylolabz.com` (Rylo Labz client site), brief in
`_inspo-notes/rylo-originals/ORIGINALS.md` section 22. Kept: the cream `#FAF8F5` ground, the
muted teal `#5B9DBF`, the split hero (mono tracked eyebrow, very large headline, one paragraph,
filled pill plus outline button, then a 3-up numbered list 01 Preventive / 02 Restorative /
03 Cosmetic), the portrait photo offset over a solid teal block, the vertical social rail and
the SCROLL cue.

**The headline bug is fixed on purpose.** ORIGINALS.md records that on the live site the h1
renders as a scattered dot cloud that never resolves, so the client's own headline is
unreadable. Here the cloud is real, but it converges onto the actual letterforms and hands over
to live type inside 1.55s. That hand-over is the point of the template. If you ever see dots
that stay, something is broken.

**The position in the library: clinical calm.** This is the quiet, serif-led one. Newsreader
carries the body copy as well as the headings, which no other template does, so the page reads
like a letter rather than a brochure. Corners are 4px or 5px at most, there are no shadows, and
sections are separated by hairlines on cream. The copy leads with money and consent (a written
price before anything starts, stop at any time, a tooth we can watch we watch) because that is
what a nervous patient is actually reading for.

## Motion techniques (7 distinct + supporting)

1. **Dot cloud that resolves into the headline** *(the signature, and the one worth stealing)*.
   The h1 is split into per-character spans, and each character's real
   `getBoundingClientRect()` becomes a target box. A 2D canvas over the headline seeds up to
   760 dots, each with a random start point scattered from the box it belongs to, a per-dot
   delay, a cubic ease, and an alpha curve that fades up fast then dies away as the dot lands.
   At the same time GSAP flies the characters themselves in from random x, y, rotation, scale
   and a 7px blur on `expo.out` with a `from:'random'` stagger. The dots die exactly as the
   letters arrive, so the type appears to condense out of the dust.
2. **Pinned first-visit scene.** `#visitStage` pins for `+=312%` (four steps at 78% each) with
   `scrub: .5`. Progress cross-fades the four step panels, cross-fades their four photographs
   with a 1.06 scale settle, scales a hairline progress bar and drives an `01 / 04` mono
   counter. `gsap.matchMedia()` tears the whole thing down below 1024px and swaps in a stacked
   list with a staggered enter.
3. **Accordion-driven sticky treatment image.** Six treatments, one open at a time. Opening one
   animates the panel height on `power3.inOut`, staggers its paragraph and tags in, and wipes
   the matching sticky photograph in with `clipPath: inset(0 0 100% 0)` to `inset(0)` plus a
   settle from `scale 1.06`. `ScrollTrigger.refresh()` runs on every open and close so the pin
   further down the page never drifts.
4. **Two-depth hero parallax.** The teal block travels `yPercent 9`, the offset photo `-7`, and
   the image inside the photo `+6`, all on one `scrub: .6`. Three speeds on one composition is
   what makes the offset block read as depth rather than as decoration. Desktop only.
5. **Hand-split line mask reveals.** Every `.splitlines` heading is split on its `<br>` tags
   into `overflow:hidden` wrappers, `yPercent: 112 -> 0`, `power4.out`, 0.075s stagger. No paid
   SplitText.
6. **Clip-path figure reveals with a counter-scale.** `[data-clip]` figures wipe open from the
   bottom on `expo.out` while the image settles from `scale 1.18`.
7. **Magnetic buttons** on `gsap.quickTo` (0.24 of the pointer offset on x, 0.34 on y), gated to
   `(min-width:1024px) and (pointer:fine)` and torn down with a real cleanup function.
   Plus a **page-load curtain**: a teal rule draws across under the wordmark, retracts to the
   right, and the cream panel lifts on `power4.inOut`.
   *Supporting only:* count-ups on the four statistics, the review-card stagger, the generic
   `[data-rev]` fade, the nav underline sweep, the running scroll cue.

## Structural differentiator

Four of the batch-03 originals share one hero skeleton. Below the fold this one is
**booking-led**. The page is organised around getting an appointment: honest from-prices in the
treatments accordion, then a pinned walkthrough of exactly what happens on a first visit, then a
working client-side appointment picker. The picker is a real widget, not a picture of one. Seven
treatments with durations and prices, the next seven open days generated live from today's date
skipping Sundays, half-hour slots whose last appointment changes on Friday and Saturday, a
sticky summary panel that fills in as you choose, inline validation with an elastic nudge on
failure, and a generated `LDN-#####` reference on the confirmation panel. Nothing else in the
library has a scheduler. Mirage (21) is course-led, Gordon's (25) is room-led, Safeway (24) is
process-and-materials, Caro (23) is a pinned service stack.

**Accent:** `#5B9DBF` muted teal, with `#3B7897` for small type on cream so it still reads. Used
only for eyebrow rules, index numbers, the filled button, the active chip, the progress fill,
focus underlines and the dots. `#8CC0DA` is the same accent lifted for the dark booking section.
Never a background wash, never a gradient.

**Type pairing:** Newsreader 200-500 plus italic (display *and* body, optical sizing on) against
DM Mono 300/400/500 for every eyebrow, nav link, label, price, stat key and button, tracked
`.06em` to `.42em`. The Newsreader face also appears in 09 Atlas, but paired with Archivo and
used for headings only. This pairing, and this use of a serif for body copy, are unique here.

**Degradation.** `prefers-reduced-motion` removes the curtain and the dust canvas, paints the
headline and every reveal in its final state, unstacks the pinned steps and stops the scroll
cue. Below 1180px the social rail, the desktop nav and the header phone number go, and a burger
appears that simply scrolls to the booking form. Below 1024px the pin, the parallax and the
magnets are reverted by `matchMedia`, the sticky treatment image is hidden, and the visit steps
stack. Below 640px everything is one column.

## Do not "fix" these

- **`.h1-dust` sizes itself with `calc(100% + 120px)` / `calc(100% + 180px)`, not `inset`.** A
  canvas is a replaced element, so `inset: -90px -60px` on its own leaves it at its intrinsic
  300x150 and the dust disappears. The negative `left` and `top` plus the padded width and
  height is the version that works.
- **`runDust()` is fired by `tl.call(fn, null, 0)` inside the hero timeline, not called
  directly.** Called directly it starts while the timeline is still being built, runs its full
  1.55s behind the intro curtain, and is over before anyone sees it.
- **`body` carries `overflow-x:hidden` and then `overflow-x:clip`.** The first is the fallback.
  The second is what keeps `position:sticky` alive on the treatment image.
- **The `html.no-gsap` / `html:not(.js)` block above the responsive rules.** It is the safety net
  for a blocked CDN: the pinned visit steps are absolutely stacked and would print on top of
  each other without it.
- **The booking widget is client-side only and never touches the network.** Which slots show as
  taken comes from a deterministic FNV-1a hash of the date plus the time, so the same day always
  shows the same gaps and screenshots stay stable.
- **`--teal-tint` is declared and unused.** Harmless, and there if a future section needs a tint.
- Prices, registration numbers (MDPCZ D-4471, practice P-1187), medical-aid schemes, staff and
  every review are invented for the template. Replace them before anyone publishes this.

**Placeholder assets:** 14 image slots drawing on 7 Unsplash photographs, each marked
`<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
