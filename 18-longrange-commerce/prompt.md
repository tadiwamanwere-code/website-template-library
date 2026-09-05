# HALDEN — generation prompt

**Category:** E-commerce & Retail
**Best for:** homeware and furniture shops, fashion and accessories, food and drink brands, beauty and skincare, small-batch makers, any direct-to-consumer catalogue that needs a real basket
**Signature motion:** a draggable product rail with real momentum, where pointer velocity feeds an inertial glide with friction and rubber-band clamping at both ends

---

Build one self-contained `index.html` storefront for **[BRAND NAME]**, a **[PRODUCT CATEGORY]** brand from **[CITY, COUNTRY]**. Inline `<style>` and `<script>`. GSAP 3.12.5 plus ScrollTrigger, and Lenis 1.1.13, via CDN `<script>` tags. Google Fonts via `<link>`. No npm, no build step, no framework. This is the library's reference e-commerce page: it must actually sell, not just look like a shop.

**Mood.** Scandinavian retail calm. Porcelain ground, hairline rules, product photography doing the merchandising rather than decoration, and a display serif used only for headings.

**Colour.** Porcelain `#F1F2EE`, `#E9EBE5`, `#DFE2DA`, with card white `#FBFCFA`. Ink `#131614` and `#2B302C`, muted `#6C7470` and `#9AA29C`. Rules `#D6DAD1` and `#C2C8BC`. One accent, verdigris `#0F6157`, with `#0A463F` pressed and `#F3F6F3` for text on it. The accent is for badges, the active filter, the pay button and the progress rule. Never a wash.

**Type.** **Instrument Serif** for display headings only. **Schibsted Grotesk** 400/500/600/700 for all UI, prices and body. No mono, nothing condensed.

**Sections, in order.** Intro curtain with a wordmark, a counter and a progress bar. A promo strip marquee. A sticky header with search, nav and a basket button carrying a count badge. Hero: a three-line serif headline, a positioning paragraph, two buttons and a large parallaxed photograph. A category rail. The range grid with filters and a live product count. Two clip-revealed offer tiles. A pinned workshop scene. A stats and care block with an accordion. A newsletter CTA. A full footer. Then the overlays: basket drawer, checkout and toast.

**The commerce layer, which is the point of this template.**

- **Product model.** One flat array. `id`, `name`, `brand`, `category`, `price` always a **number** formatted at render, `badge` from a fixed map of `best`, `new` and `out`, `fit` of `cover` or `contain` for the fixed-height image frame, `stock`, `desc`, `img`, `alt`. Out-of-stock cards grayscale the image, dim the body and disable the add button.
- **Cart.** A reducer with actions `add`, `remove`, `setQty`, `inc`, `dec`, `clear`, persisted to `localStorage` under a versioned key such as `[brand]_cart_v1`. Every storage read and write sits inside try/catch. Store the id and quantity only, never the whole product. `dec` drops the line at zero. `count` and `subtotal` are derived on read, never stored. A `subscribe` function re-renders the badge, the drawer and the checkout on every dispatch.
- **Drawer.** A right-hand panel over a scrim. Opens on an analytic spring used as a GSAP ease function, not a linear slide. Closes on the scrim, the close button and `Escape`. Traps focus, returns focus to the opener, locks body scroll and also calls `lenis.stop()` and `lenis.start()`, restoring the exact scroll position. Real empty state. Line rows with quantity steppers and remove. Totals showing subtotal, delivery and total, with free delivery over **[THRESHOLD]**.
- **Add-to-cart choreography.** The add button spawns a product chip that arcs from the card frame to the basket icon on two tweens with different eases, then the count badge pops on a spring. A toast appears and the button shows a transient "Added" state for about 1.2 seconds.
- **Checkout.** A full-screen overlay with a Details, Payment, Confirmation stepper. Two columns with a sticky order summary that collapses to an expandable row on mobile. Delivery options with prices. Validation **on blur only**, never while typing, with `aria-invalid` and inline messages, and focus moved to the first error on submit. Correct `type`, `inputMode` and `autoComplete` on every field. One stable idempotency key held in `sessionStorage`, reused across retries and cleared on confirmation. The submit button disables and shows a spinner while in flight. The submit itself is a commented stub of about 1.4 seconds: there is no backend. On success show a real receipt with a generated order number such as `[PREFIX]-######`, then clear the cart.

**Motion.** Wire Lenis properly: `lenis.on('scroll', ScrollTrigger.update)`, a `gsap.ticker` raf loop, `lagSmoothing(0)`.

1. **Draggable rail with momentum.** Pointer drag captures velocity, then a `requestAnimationFrame` inertial glide with friction `0.94` and rubber-band clamping at both ends. Arrows are secondary. Below 1024px it degrades to native scroll-snap.
2. **Pinned workshop scene.** `pin` plus `scrub: 0.6` over `+=250%`, cross-fading three copy steps against three images with a progress rule and a live step counter.
3. **Hand-split line mask reveals** on every heading: split on `<br>` into `overflow:hidden` wrappers, `yPercent: 110 → 0`, staggered 0.07s. No SplitText.
4. **Clip-path tile reveals**, `inset(0 0 100% 0) → inset(0)` on `expo.inOut` with the image scaling down from `1.16`.
5. **Count-ups** and hero parallax with the image and tag box on different speeds.

**Hard rules.** No decorative gradients, only scrims over photographs. No coloured icon badges or emoji bullets. Write real invented content: product names, sizes, prices, materials, stock counts, delivery terms. No lorem ipsum. Responsive: below 1024px switch off the pin, the drag rail, the hero parallax and the desktop card lift. Under `prefers-reduced-motion: reduce` remove the intro curtain and land every scene in its final state.

**Images.** Free-license Unsplash direct URLs, each preceded by `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->`.
