# 25 — Gordon's Bnb (boutique stay / small guesthouse)

- **Inspiration:** `gordons.rylolabz.com` (Rylo Labz client original). Kept from it: the display-serif
  headline "A quiet retreat, beautifully kept.", the warm gold `#B8873F` pill CTA, the circular
  monogram lockup, the guesthouse photo under a warm dark wash, and the "Rooms from $135 per night"
  price line.
- **Steal this:** the **slow full-bleed crossfade sequence** ("One morning at Gordon's"). Five frames
  pinned to the viewport, each given a full screen-height of scroll — roughly two thirds hold, one
  third crossfade — with a 1.0→1.075 ken-burns drift underneath so the frame is alive without moving
  fast enough to pull your eye. Timestamps and one line of copy per frame. It buys the page a long,
  quiet stretch where the only thing to do is look.

## The four motion techniques

1. **Pinned crossfade image sequence** (signature) — `ScrollTrigger` pin + `scrub: 1.1` on `.seq-stage`,
   crossfades of `0.38` units at each frame boundary, `power1.inOut`, plus a hairline progress rail and
   a frame counter.
2. **Line-mask reveals on the serif headings** — hand-rolled splitter (no paid SplitText). Words are
   measured by `offsetTop`, grouped into lines, each line wrapped in `overflow:hidden`,
   `yPercent: 118 → 0`, `duration: 1.45`, `power3.out`, `stagger: 0.09`. These are the slowest reveals
   in the library, on purpose.
3. **Quiet parallax on the room photography** — `yPercent: -4 → 4` only, `scrub: 1.2` so it lags behind
   the wheel. Off below 900px.
4. **Soft count-up on the live booking total** — `0.95s`, `power2.out`, no overshoot. Fires once when the
   booking block first comes into view, then again on every date / room / guest change. The review score
   (9.7) uses the same helper.

Supporting only, not counted: nav ground change at the hero boundary, the curtain intro, hairline hover
states on the area list and house notes.

## Read this before "adding energy"

**This is the restrained template.** `ORIGINALS.md` says so in writing: *"The tone is unhurried. The
rebuild should feel calm, not busy. This is the one template where restraint beats motion."* The motion
budget here is deliberately the smallest in batch 03:

- **Deliberately not used:** marquees, magnetic buttons, custom cursors, velocity skew, horizontal
  tracks, stagger snaps, anything with `back` / `elastic` easing.
- **Deliberately slow:** Lenis `duration: 1.45` (most templates run ~1.0), anchor scrolls at 1.7s,
  a 3.3s load intro, ~5.25 viewports of scroll for the five-frame sequence.
- If a section here feels "empty", that is the whitespace doing its job. Do not fill it.

## Structural differentiator

Mirage (21) shares the same hero skeleton from the client originals — eyebrow rule → very large
headline → paragraph → filled pill + outline arrow button → price line. Below the fold this template
goes **room-first**: four full editorial room rows carrying real specs (size, bed, view, rate, and the
one thing that makes each different) feed straight into a client-side booking block. The rooms are the
biggest section and every "Check dates for this room" button sets the booking form and scrolls to it.
Nothing here is a feature grid.

## Specs

- **Accent:** `#B8873F` (warm gold, mandated by the brief). Darkened to `#8C6027` for 11px eyebrow type
  on the cream ground so it still reads — same accent, legible weight.
- **Ground:** warm oat paper `#F2EBDF`, warm near-black `#221C14`, dark sections `#17120C`.
- **Type:** Playfair Display (high-contrast display serif, 400/500 + italic) + DM Sans (UI, 300/400/500,
  tabular figures on every number). Both unused elsewhere in the library.
- **Not to be confused with 15 (Solstice):** also hospitality, but that one is bone/ocean-ink, Cormorant,
  multi-depth parallax chapters and a resort. This is oat/warm-brown, Playfair, a held image sequence
  and a four-room guesthouse you can price out on the page.
- **Booking is client-side only.** No backend, no fetch. Rates, capacities and the one-off $30
  housekeeping charge live in the `ROOMS` object at the top of the booking script.
- **Reduced motion:** curtain removed, pin and scrub skipped, sequence falls back to a stacked list,
  everything renders in its final state. **Mobile (<1024px):** no pin, sequence stacks vertically;
  parallax off below 900px.
