# 18 — HALDEN · Premium homeware storefront

**Genre:** the library's reference e-commerce template. A retail merchandising landing page for an invented Copenhagen homeware brand (stoneware, cast iron, mouth-blown glass, washed flax) with a real, working commerce layer.

**Inspiration:** the architecture is lifted from `C:\Dev\long-range-pharmacies` (the production React/Vite storefront the `ecommerce` skill encodes) — cart reducer + `localStorage`, right-hand drawer over a scrim, Stripe-style multi-step checkout with a sticky summary. Visually it takes after Scandinavian retail (Frama, Hay, Skagerak): porcelain ground, hairline rules, display serif reserved for headings, product photography doing the merchandising rather than decoration.

**Accent:** `#0F6157` (verdigris) — badges, active filter, the pay button, the progress rule. One accent, never a wash.

**Typography:** Instrument Serif (display, headings only) against Schibsted Grotesk (UI). High-contrast serif vs refined neutral grotesk, no mono, nothing condensed.

## Motion techniques (six; four is the bar)

1. **Draggable product rail with momentum** — *the signature.* Pointer-drag captures velocity, then an rAF inertial glide with friction `0.94` and rubber-band clamping at both ends. Arrows are secondary. Degrades to native scroll-snap below 1024px.
2. **Pinned scroll-scrubbed workshop scene** — `ScrollTrigger` `pin` + `scrub: 0.6` over `+=250%`, cross-fading three copy steps against three images with a progress rule and a live step counter.
3. **Hand-split line mask reveals** — every heading is split on `<br>` into `overflow:hidden` wrappers, `yPercent: 110 → 0`, staggered `0.07s`, fired by ScrollTrigger. No SplitText plugin.
4. **Cart choreography** — the add button spawns a product chip that arcs (two tweens, different eases) from the card frame to the cart icon, then the count badge pops on an analytic spring; the drawer itself opens on that same spring used as a GSAP ease function, not a linear slide.
5. **Clip-path offer-tile reveals** — `inset(0% 0% 100% 0%) → inset(0)` on `expo.inOut` with the image scaling down from `1.16` underneath.
6. **Count-up numbers** + hero parallax layers (image and tag box on different `y` speeds). The promo-strip marquee is present but treated as supporting only.

## Commerce architecture demonstrated

- Flat product model, `price` always a **number**, formatted at render; `fit: cover|contain` for the fixed-height image frame; fixed `best/new/out` badge map.
- Reducer cart (`add / remove / setQty / inc / dec / clear`) with the versioned key `halden_cart_v1`, **every** storage read and write inside `try/catch`, `dec` dropping the line at zero, and `count`/`subtotal` derived rather than stored.
- Drawer: scrim + `Escape` close, focus trap, body-scroll lock that also calls `lenis.stop()` / `lenis.start()` and restores the exact scroll position, real empty state.
- Toast plus a transient "Added ✓" button state (~1.2s).
- Checkout: Details → Payment → Confirmation stepper, two-column with a sticky order summary (collapsible row on mobile), validation **on blur only**, correct `type` / `inputMode` / `autoComplete`, a `sessionStorage` idempotency key cleared on confirmation, submit disabled with a spinner while in flight, and a real receipt state with a generated `HLD-######` order number. The submit is a commented ~1.4s stub — there is no backend.

**Assets:** all Unsplash placeholders, each carrying `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.

**Degradation:** below 1024px the pin, drag rail, hero parallax and desktop card lift all switch off; `prefers-reduced-motion` removes the intro curtain and lands every scene in its final state.
