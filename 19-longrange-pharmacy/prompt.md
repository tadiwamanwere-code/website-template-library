# Long Range Pharmacy — generation prompt

**Category:** Healthcare · E-commerce
**Best for:** pharmacies, clinics with a shop attached, supplement and vitamin brands, medical supply retailers, veterinary dispensaries, health food stores
**Signature motion:** a three.js layer of two-tone pills, capsules and molecule spheres drifting slowly behind the hero, paused when it scrolls out of view

---

Build one self-contained `index.html` for **[BRAND NAME]**, a pharmacy and health shop in **[CITY]**. Inline `<style>` and `<script>`. Load GSAP 3.12.5 with ScrollTrigger, Lenis 1.1.13, and three.js r128 from CDN `<script>` tags. Google Fonts by `<link>`. No npm, no build step, no framework.

**Mood.** Bright, clean and commercial. This is a shop, so it must look like one: clear prices, obvious buttons, stock states, a basket that responds. Warm and reassuring rather than clinical. It should feel like a well run high-street chemist, not a hospital.

**Type.** **Montserrat** for display headings, weights 500 to 900. **Inter** and **Manrope** for interface text, body copy, prices and labels. **Permanent Marker** used once or twice only, as a hand-drawn accent: a circled offer, a scribbled note beside a promise. Do not let the marker font spread.

**Colour.** Ground is off-white `#F4F7F5`, not pure white. Primary green `#12A85A` with `#04783F` for hovers and dark fills. Brand yellow `#F5E900` and `#F7D51D` for highlights. Body ink is `#24272A`, muted text `#58615C`. Headings use pine `#0B322C`, a deep forest teal that reads as near-black but keeps a green cast.

Two colour rules that carry real reasoning. Follow both.

1. **Build a mint studio floor** for the hero product: `#BFE3DC` for the floor, `#8DC5BE` for a podium mid-tone, `#70A9A2` for its shadow face. Sit the product image on it. Sampling the floor from the same family as the product's own lighting is what stops a cut-out image looking pasted on.
2. **Coral `#F0644A` is for urgency only**: the promo strip, sale flashes, the basket count. Never use it on the add-to-cart button, which must be green. A discount badge in the same green as the buy button stops reading as a flag.

**Sections, in order.**

1. **Header.** Sticky. Logo, a search field, a phone number, and a basket with a live count in a coral badge.
2. **Hero.** Split roughly 52/48. Left: an 11px uppercase eyebrow tracked to `0.2em`, then a display headline at `clamp(2.1rem, 3.6vw, 3.4rem)`, extrabold, letter-spacing `-0.035em`, in pine. A short paragraph and two buttons. Right: the product on the mint studio floor. A slim progress-bar carousel indicator sits bottom-left and advances automatically, pausing on hover.
3. **Service bar.** Four promises in a row: free delivery over [AMOUNT], licensed pharmacists, same-day dispatch, [PAYMENT METHOD] accepted.
4. **Promo tiles.** Two or three offer cards, coral flashes on the discounted ones.
5. **Category strip.** Pills that actually filter the product grid below, client-side.
6. **Product rail.** Horizontally scrolling cards. Each shows image, brand, name, price, an old price struck through where discounted, and an add-to-cart button.
7. **Split banner.** Full-bleed image one side, claim the other, revealed with a clip-path wipe on scroll.
8. **Bestsellers grid.** The filtered grid the category pills drive. Out-of-stock items are desaturated with a disabled button.
9. **Prescription upload.** A file picker, what to expect, and a turnaround time. Make it feel real.
10. **Visit us.** Branch addresses with opening hours.
11. **Contact and newsletter**, then a full footer with payment marks.

**Products.** Invent 12 to 16 with real-sounding names, brands, categories, prices, and stock state. Plausible medicines, supplements and personal care. Never lorem ipsum, never "Product 1".

**Motion.** At least four techniques.

- **The signature:** a three.js canvas behind the hero with slowly floating capsules, pills and molecule spheres. Capsules should be two-tone, like real medicine. Write the drift yourself. **Guard it twice:** return early if `typeof window.THREE === 'undefined'` so a blocked CDN cannot break the hero, and use an `IntersectionObserver` to stop the render loop when the hero leaves the viewport.
- Staggered reveals on the product rails as they enter view, about 0.06s apart.
- Clip-path reveal on the split banner.
- A pop animation on the basket count when something is added.

Use real easing such as `power3.out` or `expo.out`. Never `linear`. Include a `prefers-reduced-motion` block that lands everything in its final state. Below 1024px, drop the three.js layer and stack the grids.

**Hard rules.** No decorative gradients: a gradient is only ever a dark scrim over a photo for legibility. No coloured icon badges or rainbow feature chips; icons are monochrome and functional. Every image is a free-license placeholder carrying an HTML comment marking it for replacement. The page must be fully responsive, and it must still look finished if GSAP fails to load.

**Placeholders to fill:** `[BRAND NAME]`, `[CITY]`, `[PHONE]`, `[AMOUNT]`, `[PAYMENT METHOD]`, `[BRANCH ADDRESS]`, `[OPENING HOURS]`.
