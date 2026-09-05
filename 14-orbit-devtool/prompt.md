# orbit — generation prompt

**Category:** Tech & SaaS
**Best for:** developer tools and CLIs, open-source infrastructure projects, API and platform products, technical SaaS sold to engineers, security and observability tooling
**Signature motion:** a replayed terminal session that types itself out character by character with the real command's measured pauses, so the visitor watches a build finish

---

Build one self-contained `index.html` for **[PRODUCT NAME]**, a **[CATEGORY, e.g. content-addressed build cache]** for **[AUDIENCE, e.g. teams with a large monorepo]**. Inline `<style>` and `<script>`. GSAP 3.12.5 plus ScrollTrigger, and Lenis 1.1.13, via CDN `<script>` tags. Google Fonts via `<link>`. No npm, no build step, no framework.

**Mood.** Light, technical and quiet. The product surface does the selling. This reads like good documentation: a paper ground, hairline rules, section markers such as `§ 01`, and code as a first-class design element. No marketing adjectives, no hero illustration, no feature cards with icons.

**Colour.** Paper `#fafaf8` and `#f3f2ed`. Ink `#111110` with `#34342f`, muted `#75756b` and `#9b9b90`. Rules `#e4e3dc` and `#d2d1c9`. Code surfaces on a cool grey `#edeff2` with border `#d9dce2`. One accent, indigo `#5b5bd6`, with `#4646a8` for the pressed state and `#ecebfb` as a tint for the primary button, the status dot, the winning benchmark bar and one anchor rule. Keep code syntax colouring monochrome plus that one accent.

**Type.** **JetBrains Mono** 400/500/700 plus italic for all code, labels, figures and section markers. **Inter Tight** 400/500/600 for headlines and prose, with a `66ch` measure. Notes in the side rails open with a mono comment marker such as `// no daemon.`

**Sections, in order.**

1. **Header.** Wordmark with a status dot and a version tag, five nav links, a GitHub star count, one accent Install button.
2. **Hero.** A version and licence tag. One flat declarative headline, no slogan. A lede paragraph that explains the mechanism in plain terms. An install block with four tabs (curl, homebrew, npm, cargo) that swap the command, and a working copy button. Two buttons. A meta row of four small figures. A right-hand rail of three mono notes stating what the product does not do.
3. **Stats strip.** Five count-up figures with two-line labels.
4. **Terminal replay.** Section `§ 01`. A framed terminal with a title bar, a live or done state pill and a Replay button. It types a real transcript from **[PROJECT NAME]** line by line, then prints output with the recorded latencies. Beside it three notes explaining what is being watched.
5. **How it resolves.** Section `§ 02`. Four numbered steps against a code panel, pinned and scrubbed so each step activates in turn.
6. **Benchmarks.** Section `§ 03`. Two bar charts built from `data-pct` values. Be honest: include the case the product loses, marked as a loss. A methodology note beside them.
7. **Documentation blocks.** Three alternating prose-and-code blocks, each with a real sub-heading that makes a technical claim.
8. **Architecture.** Section `§ 05`. A hand-authored inline SVG diagram of five nodes and labelled arrows, then a supported-runtimes grid, an internals FAQ, and an open-metrics block.
9. **Closing CTA.** Section `§ 06`. Headline, a paragraph that invites the reader to delete the product if it does not pay off, install and methodology buttons, and a brief honest pricing note.
10. **Footer.** Link columns, licence, repository.

**Motion.** Wire Lenis properly: `lenis.on('scroll', ScrollTrigger.update)`, a `gsap.ticker` raf loop, `lagSmoothing(0)`.

- **Terminal replay.** A `requestAnimationFrame` state machine types each character with per-token latency jitter, then pauses for the recorded output timing. Start it with an `IntersectionObserver` and pause it when off-screen. The Replay button restarts it. Under reduced motion print the final transcript instantly.
- **Pinned scrubbed step sequence** through `gsap.matchMedia`, so the pin only exists on desktop.
- **SVG path draw** on the architecture diagram: set `stroke-dasharray` and `stroke-dashoffset` from `getTotalLength()`, then scrub them to zero, staggered.
- **Count-ups** on the stats strip, with a decimals option and a thousands separator.
- **Line reveals** on headlines, split by hand, animated up inside `overflow:hidden` wrappers. Bars grow on `scaleX` when their section enters.

**Hard rules.** No decorative gradients. No coloured icon badges or emoji bullets: the copy and GitHub glyphs are plain monochrome SVG. Write real invented content: file counts, hashes, timings, region names, prices. No lorem ipsum. Responsive: below the desktop breakpoint the pin is dropped, the grids collapse to one column, and the terminal shrinks. Under `prefers-reduced-motion: reduce` skip every scrub and pin, print the transcript whole and paint all reveals final.

**Images.** None needed. The diagram is inline SVG, marked `<!-- PLACEHOLDER: swap for Higgsfield-generated asset -->` if replaced.
