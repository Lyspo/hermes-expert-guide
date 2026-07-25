# Design system

The visual authority for this project. Durable rules only — anything provisional is marked as such and gets settled by the first build.

Derivation and the candidates that lost are recorded in [`research/design/03-direction-derivation.md`](research/design/03-direction-derivation.md). Reference material and the pattern audit are in `research/design/01-reference-sites.md`; type, motion, and motif research in `research/design/02-type-motion-motifs.md`.

---

## The world

**A bound laboratory notebook and its protocols.**

Paginated, dated, stamped, signed. Printed procedures corrected by hand in the margins across successive runs. Results tipped in as pasted specimen slips. Nothing erased — only struck through and re-entered above it, so the whole revision history stays legible on the page.

It was chosen because it carries all three of the product's hard parts at once, and nothing else on the candidate list carried more than two:

| The product's mechanism | The world's device |
|---|---|
| An agent that writes and revises its own procedures | A printed protocol corrected in its own margins, run after run |
| Memory that accumulates across sessions | A dated, paginated record that only ever grows |
| An audit trail an autonomous system cannot quietly rewrite | Append-only convention: struck through, never erased |
| A curriculum with a real sequence | You work *through* a notebook, page by page |
| Systems that must be understood structurally | The technical plate, bound into the same volume |

The classical reading of the name "Hermes" — dark ground, engraved capitals, gold — was ranked and rejected. It is the literal reading of a product name, it collides with a known AI-convergence look, and rendered as comps it actively fought the reading task: inscribed letters on a stoichedon grid are beautiful at hero scale and unusable for sixty lessons of dense prose.

**Register.** Institutional, exact, unhurried. The voice of a record that expects to be audited. Never precious, never cosy, never nostalgic — this is a working document, not memorabilia. If a surface starts to feel like a scrapbook or a Moleskine advertisement, it has failed.

## Colour

**Strategy: restrained, with three functional roles.** The paper and the ink are substrate rather than palette. Three further colours exist, and each earns its place by *meaning* — never by decoration. If a colour appears without carrying its meaning, remove it.

| Token | Value (provisional) | Role — and the only thing it is allowed to mean |
|---|---|---|
| `--paper` | `#E8E6DE` | The page. Cool, dense cellulose — not cream, not warm |
| `--paper-deep` | `#DCD9CF` | Recessed page areas, table zebra, the gutter |
| `--rule` | `#B9BDC0` | The quadrille grid and hairline rules |
| `--ink` | `#1E2A32` | Iron-gall blue-black. All body text and keylines |
| `--ink-soft` | `#4A5A63` | Secondary text, captions, figure labels |
| `--annotation` | `#A8321E` | **Correction and attention.** Marginal marks, the struck line, the active part in a plate. Never a brand accent, never a button fill |
| `--stamp` | `#4B3A78` | **Provenance.** Dates, version chips, verification marks. Applied as an impression, never as flat fill |
| `--brass` | `#8A7A4E` | **Navigation hardware.** Index tabs, the bound edge, instrument plates. Structural, never typographic |
| `--plate` | `#14181B` | The pasted terminal specimen. Darker than the ink |

Prohibitions this world does not need and will not have: gradients as surface, any glow or zero-offset coloured halo, glassmorphism, gradient text, coloured side-stripe borders above 1px, and terracotta — which is a slop-cluster tell and sits one hue-step from `--annotation`, so the red must stay oxide and dark rather than drifting warm.

## Light and dark

Dark or light is not a category choice here; it comes from the object. A record is paper, so the default surface is paper. Two consequences follow, and both are load-bearing.

**Terminal transcripts are dark plates pasted into the light page.** This is how the world earns a dark surface without a theme switch: the code is a photographic plate tipped into a printed book. The contrast is material, not stylistic — and it means the thing readers came to look at is the thing that stands out on the page.

**Night mode is the archival negative, not lamplight.** Archives keep the same record twice: the paper original and the photographic negative. So the second mode inverts the page — ground to a dense iron-black, the quadrille to fine cool lines, ink to bone — while the pasted terminal plates *stay dark and gain a hairline edge*. The one element that was always dark does not flip. That inversion is truthful to the material and, unlike a warm dimmed "reading lamp" treatment, it is not the rendition every model reaches for.

Both modes are full commitments with their own token values, not one palette with filters applied.

## Type

Every face is openly licensed, and every one is here because of what it sets rather than what it evokes. The full evaluation, including the faces rejected and why, is in `research/design/02-type-motion-motifs.md`.

| Role | Face | Why this one |
|---|---|---|
| Display | **Faculty Glyphic** (OFL) | A 2024 tribute to Wolpe's Albertus — glyphic, incised, flared terminals, upright only. Albertus lived on engraved bronze plates, Faber jackets, and City of London signage, which is close to a literal match for this world's brass tabs and stamped headers. Single weight, which is honest: cut letterforms have no bold |
| Lesson body | **Bitter** (OFL, Huerta Tipográfica) | A Clarendon-genre slab — the one serif classification with a direct nineteenth-century lineage to legal and official documents. It replaces the literary humanist serif that was the obvious first reach, because that warmth on pale paper is precisely the cream-plus-serif convergence risk |
| Dense technical text | **Public Sans** (OFL, USWDS) | Commissioned for United States government documents. In a world made of official records that is earned rather than borrowed — it is the register, not a reference to it |
| Tightest labels | **Archivo Narrow** (OFL) | Index tabs and table headers, where Public Sans runs too wide |
| Code, data, measurement | **JetBrains Mono** (OFL) | Chosen for character disambiguation (`0`/`O`, `1`/`l`/`I`): a misread character in a lesson is a comprehension failure, not an aesthetic one. Its home is the dark terminal plate, which is the most literal possible case of content that genuinely *is* code |

**The monospace rule.** Mono sets real code, real terminal output, real timestamps, versions, durations, and measurements. It is never a costume for "technical" applied to arbitrary labels, chips, or eyebrows. This constraint is not decorative modesty — it is what keeps the mono meaningful when it does appear.

Mechanics: hierarchy comes from size, tracking, and case, since the display face has one weight. Tracking floor is `-0.04em` and `-0.02em` to `-0.03em` usually reads better. Display caps at `6rem`. Body measure stays between 65 and 75 characters. More space above a heading than below it, everywhere.

## Structure

**The quadrille is a real grid.** The graph ruling is the layout system, not a background image: every element aligns to it, and the visible ruling is the proof. A grid you can see but that nothing aligns to is decoration, and decoration is what this project exists to avoid.

**Page furniture, used functionally.** Page numbers that count real pages. Index tabs that navigate. Dates that record when a lesson was verified. A bound edge that marks where the volume begins. Every piece of furniture must do its job — a stamp that isn't recording anything is a sticker.

**The plate.** System diagrams are exploded axonometric technical plates: 1px keyline, prior state ghosted, one flat `--annotation` on the active part, 1:1 call-out boxes, dashed leader arrows, oversized step numerals. Numbered steps are permitted here specifically because a curriculum's sequence carries information the reader needs — that is the exemption, and it does not extend to numbering ordinary page sections.

**Depth is declared once.** Border or shadow, never both. Real shadows carry an offset and a soft blur; a pasted slip casts an adhesive shadow because paper on paper actually does. Card radii stay at or below 16px, and cards are not the page's structure — a grid of identical icon-heading-text cards is the lazy container, and nested cards are always wrong.

## Motion

One authored moment per surface, not scattered effects, and never one identical entrance on every section. Every animation has a defined static end state; `prefers-reduced-motion` and the in-site motion preference land on that state.

**Named vocabulary.** These are the motions the world does in life. Nothing outside this list ships without adding it here first.

| Name | What happens | Ease | Duration |
|---|---|---|---|
| `annotate` | A marginal mark draws itself along its own path | `easeOutCirc` `cubic-bezier(0, .55, .45, 1)` | 420ms |
| `strike` | A rule crosses superseded text; the replacement settles in above it | `easeOutQuart` `cubic-bezier(.25, 1, .5, 1)` | 300ms, then 240ms |
| `stamp` | An impression lands at a slight rotation, ink unevenly dense. No bounce, no overshoot | `easeOutExpo` `cubic-bezier(.16, 1, .3, 1)` | 260ms |
| `tip-in` | A specimen slip rotates into place, adhesive shadow resolving under it | `easeOutExpo` | 480ms |
| `assemble` | Exploded parts travel their leader lines home | `easeInOutExpo` `cubic-bezier(.87, 0, .13, 1)` | scroll-scrubbed |
| `resolve` | Ghosted prior state hardens to solid | `easeOutQuart` | 360ms |

A single house curve is registered once as a GSAP `CustomEase` and shared verbatim with CSS, so every reveal on the site decelerates the same way.

**Text reveals** split by line or word, never by character, except for short display labels — character-by-character reads as precious at paragraph length. **Scroll scenes** follow a five-beat shape (hook, context, journey, climax, resolution) as one pinned, scrubbed GSAP timeline whose playhead is driven by scroll position rather than time. **Line art** draws via `stroke-dashoffset` paired with `easeOutCirc`; a linear stroke reveal reads as a progress bar rather than as something being drawn.

The division of labour is enforced by lint: Motion animates components, GSAP animates scenes, and GSAP cannot be imported outside the landing and scroll-scene directories.

## Texture

**The default is no surface texture at all.** The world is carried by structure and palette — the grid, the page furniture, the ink relationships. That is the decision, not a placeholder for a texture pass later.

Two narrow exceptions, each requiring a reason at the point of use: a real photographed paper tile at very low opacity where paper-on-paper is literally the point (behind a tipped-in specimen), applied to a pseudo-element so it never touches content or the accessibility tree; and one careful stamp-impression treatment, since uneven ink coverage is what makes a stamp read as an impression rather than a sticker.

`feTurbulence` is out. It reads as amateur, and it is the reflex reach whenever something "needs texture." Note also that the common rough- and torn-edge techniques are themselves turbulence-based, so the honest way to get an irregular edge here is a **hand-authored `clip-path` with deliberately chosen vertices** — designed imperfection rather than simulated noise. Randomness is not craft.

## The refusals

Named so they can be caught in review. Each is a category default rather than an absolute — the brief's own words could earn any of them, but reaching for one when the choice was free means a decision wasn't made.

Same-size icon-heading-text cards as page structure · nested cards · the hero-metric template · a tracked uppercase eyebrow over every section · numbered section markers outside the curriculum's own sequence · a modal for a task needing neither interruption nor protected focus · gradient text · glass and blur as decoration · coloured side-stripe borders above 1px · sparklines and progress rings standing in for content · monospace as a costume · a 1px border under a wide soft shadow · sketch-style or doodle SVG · `repeating-linear-gradient` stripes · two-axis grid overlays without a real canvas beneath them · animating an image on hover.

And the three whole-look conventions to stay clear of: warm cream ground with high-contrast serif display and a terracotta accent; near-black with one neon accent and glowing edges; broadsheet hairlines with italic display serif and small tracked mono labels. The first is the live risk for this world, and the paper token is deliberately cool to keep away from it.

## Accessibility as a design constraint

Not a later audit. Body and placeholder text at 4.5:1 or better, large text at 3:1, verified against both modes — and secondary text on the paper ground is tinted from the ink hue rather than greyed. Terminal plates, being the subject matter, must stay legible at 200% zoom. Diagrams carry real text and descriptions; they are never images of words. Session replays ship as complete transcripts a screen reader can read straight through, with playback as the enhancement. Focus is always visible and always deliberate.
