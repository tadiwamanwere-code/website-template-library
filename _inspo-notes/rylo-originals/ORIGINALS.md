# Rylo Labz client originals — design DNA

Batch 03 of the template library rebuilds seven real client sites from `C:\dev`
(and their live deployments) as full landing-page templates. This file records
what each original actually looks like, measured from the live site, so the
rebuild keeps what made it good.

**The brief was: keep the underlying idea, do not redesign it. Polish it, and
give it real motion.** Screenshots of each original sit next to this file.

---

## A shared house pattern (important)

Four of these sites (Mirage, Gordon's, Safeway, Smile Dentist) were built from the
same skeleton:

> eyebrow with a short leading rule → very large headline → one paragraph →
> two buttons (filled pill + outline with arrow) → a small trust/price line

That is a good pattern and worth keeping. But if all seven templates reuse it
verbatim the library gets seven near-identical cards. **Each rebuild must keep its
own site's spirit while taking a different structural approach below the fold.**
The per-template briefs assign those differences.

---

## 19 · Long Range Pharmacies → pharmacy e-commerce

Live: <https://long-range-pharmacies.vercel.app> · Local: `C:\dev\long-range-pharmacies` (React + Vite + Tailwind)

> **Correction.** An earlier pass used <https://pharmacy.rylolabz.com>, which is a
> different, older pharmacy build. The client confirmed the site above is the real
> one. The screenshot of the wrong site has been deleted, so there is no capture
> of this template here. The local source is the reference: it is client-rendered React, so fetching the
> URL returns only a 1.3KB shell.

- **Type:** Montserrat (display), Inter and Manrope (UI and body), Permanent Marker
  (hand-drawn accent). Not Poppins.
- **Colour (from `tailwind.config.js`, which carries the owner's brand kit):**
  - primary green `#12A85A`, dark `#04783F`, light `#4CC787`
  - brand yellow `#F5E900` / `#F7D51D`
  - `pine` `#0B322C` — deep forest-teal used as near-black ink, keeps a green cast
  - `ink` `#24272A`, `muted` `#58615C`, off-white ground `#F4F7F5`
  - **mint studio palette** `#BFE3DC` floor / `#8DC5BE` podium / `#70A9A2` shadow,
    sampled off the product render so the CSS floor and the podiums in the artwork
    are the same colour family. That is what makes the transparent PNG read as one
    continuous set instead of a cut-out on a background. Keep this trick.
  - `coral` `#F0644A` for urgency only — promo strip, sale flashes, basket count.
    Deliberately **not** the brand green, because a discount badge in the same green
    as the add-to-cart button stops reading as a flag. Keep that reasoning.
- **Hero:** split, roughly 52/48. Left column has an 11px uppercase eyebrow tracked
  to 0.2em, then a display headline at `clamp(2.1rem, 3.6vw, 3.4rem)`, extrabold,
  tracking `-0.035em`, in pine. Right column carries the product render on the mint
  studio floor. A slim progress-bar carousel indicator sits bottom-left. White ground,
  min-height 420-460px.
- **`Scene3D.jsx`:** a lightweight three.js layer of floating capsules, pills and
  molecule spheres drifting gently behind the hero for depth (react-three-fiber +
  drei `Float`). **This is the site's signature move** and the thing worth rebuilding.
- **Home section order:** Hero → ServiceBar → PromoTiles → CategoryStrip → ProductRail
  → SplitBanner → Bestsellers → OfferTiles → Prescription → VisitUs → ContactUs →
  InstagramStrip.
- **App shell:** Lenis smooth scroll, cart drawer, toast, WhatsApp float, auth and cart
  providers, routes for catalogue / checkout / account.
- **Client's own words:** "it is amazing, just make more animations and make it more
  lively, but as it is." Polish and animate. Do not redesign.

## 20 · Tower Construction → construction / civil engineering

Live: <https://tower-construction-ten.vercel.app>

- **Type:** Inter (display, very heavy) + JetBrains Mono (eyebrows, labels, stats).
- **Colour:** `#0E2A5E` navy, `#F5A833` amber CTA, white ground below the fold.
- **Hero:** full-bleed crane photo, navy multiply overlay, `—— SINCE 1980` mono eyebrow,
  huge bold headline, amber "REQUEST A QUOTE" + ghost "VIEW OUR WORK", "EXPLORE" scroll cue.
- **Structure (7):** hero → Building Zimbabwe's Future (about + stats) → Solid Ground.
  Solid Build. → The Work We Take On (services) → Our Gallery → From Consultation to
  Handover (process) → Request a Quote.
- Uppercase tracked nav. Category "A" CIFOZ registration is a real trust signal worth keeping.

## 21 · Mirage International College → education / training

Live: <https://mirage-college.vercel.app>

- Beauty-therapy college, not a general school. ITEC/VTCT accredited, Harare.
- **Type:** high-contrast display serif headline, humanist sans for body.
- **Colour:** warm gold `#BFA05A`, dark olive-green photo wash, cream text.
- **Hero:** soft treatment-room photo, circular "M" monogram, gold pill "Enquire on
  WhatsApp" + outline "Explore courses", price line "Diplomas from US$2,000 · full kit included".
- Trains on real clients inside a working spa. That detail is the whole proposition, keep it.

## 22 · The Smile Dentist → dental / clinic

Live: <https://dentist.rylolabz.com>

- **Colour:** cream `#FAF8F5` ground, muted teal-blue `#5B9DBF`.
- **Hero:** split. Left = mono tracked eyebrow, headline, paragraph, two buttons, then a
  3-up numbered list (01 Preventive / 02 Restorative / 03 Cosmetic). Right = portrait photo
  offset over a solid blue block behind it. Vertical social rail, "SCROLL" cue.
- The offset-photo-over-colour-block is the signature move. Keep it.
- Note: on the live site the h1 renders as a scattered dot cloud, an effect that never
  resolves. The rebuild should make that a headline that actually lands.

## 23 · Caro Accounting & Tax → professional services

Live: <https://caroaccounting.co.zw> · Local: `C:\dev\caro-accounting-tax` (Next.js)

- **Type:** heavy condensed uppercase display, clean sans body.
- **Colour:** teal `#17A2B8`, near-black photo, white.
- **Hero:** upward skyscraper photo, two-tone headline (white line + teal line):
  "BUILD A STRONGER, / MORE PROFITABLE / FUTURE". Square-cornered buttons, not pills.
  Vertical "SCROLL" text on the right edge.
- Has an "ASK CARO AI" nav item. Distinctive, worth keeping as a design element.
- Kadoma, Zimbabwe. Accounting, bookkeeping, tax, payroll, consultancy.

## 24 · Safeway Furnitures → retail / fitted furniture

Live: <https://safewayfurniture.co.zw>

- **Colour:** deep navy ground, light periwhinkle `#8FB4F0` pill CTA.
- **Type:** heavy geometric sans, tight. "Built to fit your space."
- **Hero:** dark fitted-kitchen photo, navy wash, eyebrow rule, two pills, trust line
  ("Established 2012 · Manufacturer & supplier · Free measure and quote"). Address and
  phone sit in a slim bar above the nav.
- Made in own workshop, measured on site, installed by own team. That vertical
  integration is the sales point.

## 25 · Gordon's Bnb → hospitality / boutique stay

Live: <https://gordons.rylolabz.com>

- Same skeleton as Mirage, warmer. Serif display, gold `#B8873F` pill, circular monogram.
- **Hero:** guesthouse photo, warm dark wash, "A quiet retreat, beautifully kept.",
  "Rooms from $135 per night".
- Small guesthouse, slow mornings, handful of rooms. The tone is unhurried. The rebuild
  should feel calm, not busy. This is the one template where restraint beats motion.
