# Universal Copy Rules

How to turn a hand-built template into one that any business in its industry
can put its name on. Written after doing `20-tower-construction` end to end.
Read this before starting the next template.

---

## The one rule

**If a sentence would be a lie for the next client in that industry, rewrite it.**

Every template was written for a specific imaginary firm, and the writing is
good, which is why nobody noticed the problem. But a page that says "Est. 1980"
and "312 projects delivered" becomes a page full of lies the moment a different
builder's name goes on it.

---

## What to strip

| Strip | Because |
|---|---|
| Founding years, "Est. 1980", "since 2012" | Nobody else has that year |
| Any "X years" claim | Same |
| Counts: projects, staff, patients, rooms, plant, clients | Numbers belong in the swap card |
| Money: contract values, prices, turnover, bonding capacity | Never guess a client's figures |
| Named people and their qualifications | Never invent a person |
| Street addresses and suburbs | The client has their own |
| Country-specific bodies and registration numbers | CIFOZ, PRAZ, ZIMRA, NSSA, ISO cert numbers |
| Specific dates | "No injury since 12 September 2019" |
| Origin stories with real detail | "started with two tipper trucks in Marondera" |
| Named past clients and projects | They are not the new client's projects |

## What to keep

- What the business does, in plain words
- **How** they work, described as a method
- What a customer can expect
- Why that matters to the customer

A method claim survives a change of owner. A fact does not.

---

## Worked examples

> **Before:** Tower Construction started in 1980 with two tipper trucks and a
> contract to build a grain depot outside Marondera. Forty-five years on we hold
> Category "A" registration with the Construction Industry Federation of
> Zimbabwe, run sixty-eight owned plant units out of the Msasa yard, and employ
> three hundred and forty people directly.
>
> **After:** We started small, with a few machines and a willingness to take the
> jobs other firms turned down. We still run our own plant, we still employ our
> crews directly, and we still price every job ourselves. That is the whole
> method, and it is why clients come back.

| Before | After |
|---|---|
| Category "A" registered with CIFOZ | Fully registered, insured and bonded |
| No lost-time injury since 12 September 2019 | A safety record we protect on every site |
| R. T. Mutasa, Managing Director, Pr.Eng, ZIE | The Managing Director *(or drop the attribution)* |
| Total contract value shown · US$ 49.4M | Project list and client references · on request |
| Average time to breaking ground · 9 weeks | Six stages, one contracts manager · 01 → 06 |

### Tone

Plain words. Short sentences. Say what the business does and why it matters.
Never: elevate, seamless, solutions, journey, passionate, bespoke, world-class,
cutting-edge.

### Length

**Keep the replacement the same length as what it replaces.** Count the
characters. These designs break when a line grows: heroes overflow, nowrap spec
columns push grids wider than the page, two-line headings become three. The
renderer warns past +20%, but a warning is not a fix.

---

## Stats are the one exception

Big number blocks cannot sit empty. So:

- the **number** moves to the swap card
- the **label** stays in the template and must be universal

Good labels: Years trading · Projects delivered · Team on the books · Trades in-house
Bad labels: Days without LTI · CIFOZ grading · Square metres built

If a client will not give a number, change the label to one they can answer.
Never invent a number.

---

## Find-and-replace traps

The swap mechanism replaces whole strings, longest first. Two things bite:

1. **A default word that appears twice.** `Construction` was both the second
   half of the business name and the name of a process step, so filling in a
   client name renamed the process step too. Rename the collision in the
   template, do not weaken the swap.
2. **Bare numbers are unsafe finds.** `40` matches inside `18 400`. Anchor
   numeric swaps in their attribute instead, and give the entry a `format`:
   `{ "find": "data-count=\"40\"", "format": "data-count=\"{}\"" }`.

Check both by searching the rendered output for the template's own brand words.
`render()` does this automatically through `brandTokens` in `swap.json`.

---

## Images are part of the copy pass

Four of the six gallery photographs in template 20 showed the wrong subject
entirely: a person at a computer captioned "Water & Sewer Mains", office towers
captioned "Clinics", an electrician captioned "Mining Workshops". The captions
had been written first and the photo IDs guessed to match.

**Look at every image before you write a caption for it.** Build a contact
sheet, open it, and check the subject and the orientation. A portrait source in
a full-bleed 16:9 hero crops to a useless band.

---

## House rules that also apply

- **No top utility strip.** No thin address/phone/hours band above the header.
  The header starts at the top of the page.
- **No scrolling marquee strip under the hero.**
- **Do not lean on tinting the hero photo.** A heavy colour multiply flattens
  a photograph into a wash. Use a light brand tint and put a scrim only where
  the type actually sits.
- Everything in `DESIGN_SYSTEM.md` and `ANIMATION_PLAYBOOK.md` still applies.

---

## Mobile is not a fallback

390px and 768px are first-class widths, checked in a real browser. Faults found
in template 20 that the desktop view completely hid:

- the header had a fixed height with a wordmark, a tagline and a CTA competing
  for 370px, so the logo was pushed out of the bar
- `grid-template-columns: 1fr` takes its **min-content** width, so a `nowrap`
  spec column pushed the capability grid wider than the page, where the
  section's `overflow:hidden` quietly clipped it. Use `minmax(0, 1fr)`
- nearly every tap target was under 44px: burger 38, form inputs 35, footer
  links 17
- the mono micro-labels sit at 8.5–10px, which is house style on a desktop and
  unreadable on a phone. Lift them to an 10–11px floor and cut the tracking
- a scrim tuned for a wide frame covers the whole picture at 390px

A headed browser will not go below about 480px wide. Test true phone widths by
loading the page in an iframe of that size: `builder/out/_probe.html?src=…&w=390&h=844`.

---

## The order that works

1. Read every visible line and list the fiction.
2. Rewrite it, counting characters.
3. Look at every image; fix the ones that do not match.
4. Add the theme table (six values, four themes) and derive everything else.
5. Write `swap.json`.
6. Render a test client and check the output for the template's own name.
7. Check 390px in the browser and fix what you find.
8. Update `notes.md` so it still describes the template that exists.

## Done means

- Not one visible line names a year, a count, a price, a person, a street or a
  registration body.
- A stranger in that industry could put their name and phone on it and every
  word would still be true.
- Stat labels are universal; the numbers come from the swap card.
- Four themes swap cleanly and none looks worse than the original.
- Searching the rendered output for the template's default business name
  returns zero hits.
- No horizontal scroll and no tap target under 44px at 390px.
