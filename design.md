# Design system

The visual authority for this project. Durable rules only — anything provisional is marked as such and settled by the first build.

> **Status, 2026-07-26: partially superseded by `decisions.md` 010.** The world moved from a single-column document over a masked field to an operator's console with real panes, and a mastery layer was added. Until this file is rewritten against the first build of that shell, three sections below are known to be stale and must not be cited as current: **The world** (its register line, "never playful, never cosy", is explicitly reversed for the mastery surfaces), **Structure** (planes-not-boxes assumed one reading column; the OS has panes with surfaces), and the performance budget referenced from `CLAUDE.md`. Everything else — the palette and its one-signal discipline, the type stack, the motion vocabulary, the refusals, and the accessibility constraints — stands unchanged and still binds. The rewrite waits for the build because that is what the paragraph above says should happen.

The nine candidate directions and how they were derived are recorded in [`research/design/03-direction-derivation.md`](research/design/03-direction-derivation.md); reference material in `research/design/01-reference-sites.md`, type and motion research in `02-type-motion-motifs.md`, the Dribbble pass in `04-dribbble-pass.md`.

---

## The world

**Substrate — depth as the medium, with type that rewrites itself.**

A dark, dimensional field in which the agent's interior is actually rendered: skills, memory, sessions and workers as points and edges at real depth, drifting slowly, responding to the pointer. Content sits on a plane above it. Moving through the curriculum means moving through the structure rather than scrolling past pictures of it.

Its signature motion is borrowed deliberately from a second direction: **display type that strikes its own line out and re-enters it**, characters resolving in sequence. That gesture is the product's thesis performed rather than described — an agent that rewrites its own instructions — and it is the one motion the site owns.

Two candidate worlds, fused: the field is what the agent *is*, and the type is what it *does*.

| The product's mechanism | How this world carries it |
|---|---|
| An agent that revises its own procedures | Display type struck through and re-entered in place |
| A skill library, a memory index, a delegation tree | Genuine graphs, rendered in depth and navigable |
| Layers that depend on layers | Depth planes: what sits behind is what you are standing on |
| A curriculum with a real sequence | Descending goes *into* the structure, not down a list |
| An audit trail that cannot be quietly rewritten | Superseded content stays on the plane beside its replacement |

**Register.** Cold, precise, dimensional. Instrument-grade rather than consumer-grade — the confidence of software that assumes a competent operator. Never playful, never cosy. If a surface starts to feel like a marketing page for a startup, it has failed.

**What was rejected and why it matters.** An earlier round committed to a paper-notebook world. It was abandoned for two reasons, and the second one is the instructive one. It fought the subject — a learning platform about autonomous software should not look like stationery. And its palette (cream ground around `#E8E6DE`, brass accent near `#8A7A4E`, warm near-black ink) turned out to sit almost exactly on tasteskill's named list of banned defaults, where that combination is recorded as the second-most-recurring signature of machine-generated design. The lesson kept: avoiding one convergence cluster is not the same as avoiding all of them, and a rule against neon does not license a retreat into paper.

## Colour

**Strategy: drenched dark with one signal.** The ground is not a backdrop, it is the medium — depth is built from luminance and scale, never from borders or drop shadows. Exactly one hue exists besides the neutrals, and it means one thing.

| Token | Value | Role — the only thing it may mean |
|---|---|---|
| `--void` | `#070A0C` | The field. Cool near-black with a green-blue bias, never pure black |
| `--deep` | `#0C1114` | A nearer plane: panels, transcript surfaces, the assessment |
| `--raise` | `#141B1F` | The nearest plane, for the few elements that must sit above content |
| `--ice` | `#E4EFF3` | Primary text. Cool white, never pure white |
| `--ice-dim` | `#8DA3AC` | Secondary text, labels, captions |
| `--ice-faint` | `#4A5C65` | Hairlines, inactive nodes, disabled states |
| `--signal` | `#C4566E` | **Change.** A revised line, a written skill, an active node, an error. Nothing decorative, ever |

Under 80% saturation on the signal, deliberately. Prohibited outright: gradients as surface, any outer glow or zero-offset halo, glassmorphism, gradient text, pure `#000`, purple or blue-violet accents, neon cyan, acid green, and vermilion-on-black — the last four being the specific families both rulebooks flag.

**Depth instead of elevation.** No card shadows. A thing is nearer because it is lighter, larger, and less transparent, and because the field behind it parallaxes at a different rate. Declare depth once per element.

## Light and dark

**Dark only, as a commitment rather than an omission.** The world is a luminous field; inverting it does not produce a light theme, it destroys the medium. Both design rulesets permit a deliberate single-theme world, and this is one.

Two obligations follow. Contrast is verified rather than assumed — body text at 4.5:1 or better against `--void` *and* against `--deep`, since transcript panels sit on their own plane. And `prefers-contrast: more` raises `--ice-dim` toward `--ice` and drops the field's opacity, because a reader who needs contrast should not have to give up the page to get it.

## Type

Every face openly licensed. The previous stack — a glyphic display serif with a slab-serif body — belonged to the abandoned paper world and is gone. Serif is deliberately absent: this is software, and "creative brief therefore serif" is the single most-tested tell in the stricter ruleset.

| Role | Face | Why this one |
|---|---|---|
| Display | **Familjen Grotesk** (OFL) | A Swedish grotesque with genuine character in its `a`, `g` and `k` — tight, confident, and not one of the four faces every technical site currently reaches for. Carries the kinetic rewrite at scale without looking like a logotype |
| Body and UI | **Archivo** (OFL, Omnibus-Type) | A workhorse grotesque built for documents and small sizes, with a real width axis. Legible at length on a dark ground, which is the whole job |
| Code, data, measurement | **Geist Mono** (OFL) | Unambiguous `0`/`O` and `1`/`l`/`I`, which matters because a misread character in a lesson is a comprehension failure. Its home is the transcript plane |

**The monospace rule stands.** Mono sets real code, real terminal output, real versions, durations and counts. It is never a costume applied to labels for a technical feeling.

Mechanics: tracking floor `-0.04em`, with `-0.02em` to `-0.03em` reading better on display sizes. Display caps at `6rem`. Body measure 65–75 characters. More space above a heading than below it. Italic descenders get `leading-[1.1]` minimum and reserve below, since the display face will be set tight.

## Motion

The named vocabulary. Nothing outside this list ships without being added here. Every entry has a defined resting state, and that resting state is what `prefers-reduced-motion` and a throttled or blocked script both land on — a lesson learned the hard way when a status board built as a reveal rendered permanently blank in an environment whose animation clock was frozen.

| Name | What happens | Ease | Duration |
|---|---|---|---|
| `rewrite` | A line strikes itself through; the replacement resolves character by character above it | `cubic-bezier(.16, 1, .3, 1)` | 300ms strike, then ~1.2s resolve |
| `drift` | The field moves continuously and slowly. Never idle, never fast | linear | perpetual |
| `parallax` | Pointer and scroll displace planes at different rates | damped follow, ~0.045 | continuous |
| `resolve` | Content arrives from depth: scale and opacity only, never position | `cubic-bezier(.16, 1, .3, 1)` | 480ms |
| `settle` | Micro-interaction feedback, with a small tactile press on `:active` | `cubic-bezier(.25, 1, .5, 1)` | 240ms |

**Rules.** Transform and opacity only — never `top`, `left`, `width`, or `height`. No `window.addEventListener('scroll')`; scroll comes from `useScroll`, `ScrollTrigger`, `IntersectionObserver`, or a CSS scroll timeline. No `requestAnimationFrame` loop touches React state. Text resolves by line or word except for short display moments, where character-by-character is the point. The division of labour is lint-enforced: Motion animates components, GSAP animates scroll scenes and cannot be imported elsewhere.

## Structure

**Planes, not boxes.** Three depths: the field behind, content on the plane, and a small nearest layer for navigation and the few controls that must float. An element earns the nearest plane by needing to persist across scroll, not by being important.

**The transcript plane.** Terminal output sits on `--deep` — a nearer, flatter surface than the field, with a hairline edge rather than a shadow. Code is the one content type that is genuinely dark in life, so it needs no special pleading here; it simply sits closer.

**Hairlines only.** Rules and edges are `--ice-faint` at 1px. No borders above 1px, no side stripes, no card grids as page structure, and no nested containers.

**Sequence is spatial.** Module and lesson order maps to depth and position in the field, so the curriculum map is a view of the structure rather than a table of contents drawn to look like one.

## The refusals

Each is a category default rather than an absolute — the brief's own words could earn any of them, but reaching for one when the choice was free means a decision was not made.

Same-size icon-heading-text cards as page structure · nested cards · the hero-metric template · an uppercase eyebrow above every section (at most one per three sections) · section-number eyebrows and `01 / 4` pagination · version labels in the hero · the split-header pattern of big headline beside small explainer · three consecutive image-and-text zigzag sections · gradient text · glass and blur as decoration · coloured side-stripe borders above 1px · sparklines and progress rings standing in for content · monospace as costume · outer glows · pure black · `feTurbulence` grain · hand-rolled sketchy SVG · div-built fake screenshots · a hero that overflows its viewport or whose CTA wraps to two lines · placeholder-as-label · custom cursors.

And the whole-look conventions to stay clear of: warm cream with a serif display and a terracotta or brass accent; near-black with one neon accent and glowing edges; broadsheet hairlines with an italic display serif and tracked mono labels; a purple-to-blue gradient hero. The first is the one this project already walked into once.

## Accessibility as a design constraint

A build gate, not an audit. Contrast verified against both `--void` and `--deep`. `prefers-reduced-motion` stops the field and the rewrite at their resting states, both of which are complete and legible. `prefers-contrast: more` is honoured. The field is decorative and carries `aria-hidden`, so nothing in it is load-bearing information — every structure it depicts also exists as real text. Session replays ship as complete transcripts a screen reader can read straight through, with playback as the enhancement. Focus is always visible against a dark ground, which means a light ring, not a subtle one. Terminal content stays legible at 200% zoom.
