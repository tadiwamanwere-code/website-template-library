# 19 — Long Range Pharmacies (pharmacy / health e-commerce)

**Original:** the real client site at <https://long-range-pharmacies.vercel.app>.
Source of truth is the local build at `C:\dev\long-range-pharmacies`
(React + Vite + Tailwind), not the URL: the live site is client-rendered, so
fetching it returns a 1.3KB shell with no design in it.

> **Read this before "fixing" anything.** An earlier attempt was built from
> <https://pharmacy.rylolabz.com>, a different and older pharmacy site the client
> does not use. It was deleted. If you are looking for a screenshot of the
> original in `_inspo-notes/rylo-originals/`, there is deliberately none.

**Brief:** the client's own words were "it is amazing, just make more animations
and make it more lively, but as it is". This was a polish-and-animate job, not a
redesign. Structure, brand kit and character are the original's.

## Signature motion

**A three.js layer of floating pills, capsules and molecule spheres** drifting
behind the hero, rebuilt from the original's `Scene3D.jsx`. Capsules are two-tone
like real medicine. It is guarded twice: `typeof window.THREE === 'undefined'`
returns early if the CDN is blocked, and an `IntersectionObserver` stops the
render loop when the hero leaves the viewport, so it costs nothing further down
the page.

Also implemented: staggered product-rail reveals (18 staggers), clip-path reveals
on the split banner, a hero carousel that pauses on hover, and an add-to-cart that
pops the basket count.

## Type and colour

**Montserrat** display, **Inter** and **Manrope** for UI and body, **Permanent
Marker** for a hand-drawn accent. All four are the original's.

Brand kit carried over verbatim from the client's `tailwind.config.js`:
green `#12A85A` / `#04783F`, yellow `#F5E900` / `#F7D51D`, pine `#0B322C`,
ink `#24272A`, muted `#58615C`, ground `#F4F7F5`.

Two decisions from the original that are load-bearing. Do not "simplify" either:

- **The mint studio floor** (`#BFE3DC` floor, `#8DC5BE` podium, `#70A9A2` shadow)
  was sampled off the product render so the CSS floor and the podiums in the
  artwork are the same colour family. That is what makes a transparent product PNG
  read as one continuous set instead of a cut-out pasted onto a background.
- **Coral `#F0644A` is urgency only**: promo strip, sale flashes, basket count.
  Never the add-to-cart button, which is green. A discount badge in the same green
  as the add-to-cart button stops reading as a flag. The code carries this as a
  comment; leave it there.

## The one-accent exception

This template **deliberately breaks the design system's "one accent colour" rule**,
and that is correct. A working storefront needs a commerce palette: green for
add-to-cart, coral for urgency, yellow for highlight. Every other template in the
library still obeys the rule. Do not "fix" this one.

## Structure

11 sections plus a footer, following the original's `Home.jsx` order: hero,
service bar, promo tiles, category strip, product rail, split banner, bestsellers,
offer tiles, prescription upload, visit us, contact, Instagram strip.

16 products with real names, brands, prices and stock state. The category strip
filters the grid client-side. All content is invented but plausible; swap it before
shipping to a client.
