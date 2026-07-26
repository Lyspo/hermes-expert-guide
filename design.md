# Design system

The visual authority for this project. Durable rules only — anything provisional is marked as such and settled by the first build.

Rewritten 2026-07-26 against `decisions.md` 010 and the shell that was actually built. The status block that stood here while three sections were stale is gone, because they are no longer stale.

The nine candidate directions and how they were derived are recorded in [`research/design/03-direction-derivation.md`](research/design/03-direction-derivation.md); reference material in `research/design/01-reference-sites.md`, type and motion research in `02-type-motion-motifs.md`, the Dribbble pass in `04-dribbble-pass.md`.

---

## The world

**An operator's console for the thing it teaches, with type that rewrites itself.**

The platform is shaped like the software it is about. A lesson is read beside a working Hermes terminal, not above a screenshot of one; the curriculum is a graph you look into at `/map`, not a table of contents drawn to look like one; and what a reader has mastered is an agent with a version, a skill library and an uptime, not a percentage. The reader's stated destination is their own agent OS, so the guide being one is a demonstration of the destination rather than a description of it.

Its signature motion is unchanged and still the one thing the site owns: **display type that strikes its own line out and re-enters it**. That gesture is the product's thesis performed rather than described — an agent that rewrites its own instructions.

| The product's mechanism | How this world carries it |
|---|---|
| An agent that revises its own procedures | Display type struck through and re-entered in place |
| A skill library, a memory index, a delegation tree | Genuine graphs, rendered in depth and navigable — `/map` |
| A tool you operate rather than read about | A real, typeable console beside every lesson |
| A curriculum with a real sequence | Descending goes *into* the structure, not down a list |
| Competence that accumulates | A version on the software's own release ladder, and skill files |
| An audit trail that cannot be quietly rewritten | Superseded content stays on the plane beside its replacement |

**Register, and the one clause that changed.** Cold, precise, dimensional. Instrument-grade rather than consumer-grade — the confidence of software that assumes a competent operator. If a surface starts to feel like a marketing page for a startup, it has failed.

009 added "never playful, never cosy" and that clause is **withdrawn**, because it was an instruction not to build the layer this platform now has. The replacement is narrower and enforceable: **a mastery surface may only be built from a real artefact of Hermes.** The level is the agent's version on the actual release ladder; the unit of progress is a skill file at the namespaced path the binary uses; the streak is uptime; the comprehension gate is the software's own numbered approval prompt. Nothing here is a mechanic borrowed from a learning app and recoloured — no XP, no badges, no confetti, no progress ring standing in for content. A newcomer still gets unlocks and a streak; a governance reader is never winked at. Any future addition passes the same test or does not ship.

**What was rejected and why it matters.** Two worlds were abandoned before this one, and both lessons are load-bearing.

A paper-notebook world (007) fought the subject and, worse, landed almost exactly on tasteskill's published list of banned defaults — cream ground, brass accent, warm near-black ink, recorded there as the second-most-recurring signature of machine-generated design. The lesson kept: avoiding one convergence cluster is not the same as avoiding all of them, and a rule against neon does not license a retreat into paper.

Substrate (009) was not wrong so much as structurally unable to land. Its field had to be masked out of the middle half of the viewport to keep prose legible, because content sat on a plane with no surface of its own — so the medium survived only as periphery. The lesson kept: **a world that needs to be suppressed to make the content readable is a world in the wrong container.** Panes with real surfaces are what let the field be dense; it now has a page where it can be the content, and it is switched off entirely where it would compete.

The console's own rut, named so it can be avoided: **retro terminal costume.** `research/design/03` already found it when it weighed Teletext. This is a contemporary console — no scanlines, no phosphor bloom, no ASCII borders standing in for structure — and the monospace rule below holds without exception.

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

**Panes, and the plane they sit on.** 009 said "planes, not boxes" and assumed one reading column; the console has two. The rule that survives is about *surfaces*, not about column count: an element gets a surface of its own only when it is a different kind of thing from the prose — a transcript, a console, a dialog. Everything else sits directly on the plane with hairlines between it and its neighbours. Cards are still not page structure.

**The workspace.** Below `xl`, one column: the lesson, then the console beneath it at a fixed height. At `xl` and above, two — and the lesson keeps its 44rem measure rather than stretching, because a ninety-character line is worse than a short one. The console takes the remainder, sticky and full height, and carries the lesson's provenance in its own header: what a frame was verified against belongs on the instrument showing the frame, not in a margin.

**Depth planes, still three.** The field behind, content on the plane, and a nearest layer for the few things that must float. An element earns the nearest layer by needing to persist across scroll, not by being important.

**A modal leaves the tree.** `.plane` sets `z-index: 1` and therefore creates a stacking context, so a dialog rendered inside the header is trapped in it however high its own `z-index` goes — the palette shipped see-through once for exactly this reason. Overlays portal to `document.body`.

**One field at a time.** The ambient field is turned off wherever a page renders a field of its own. Two of them drifting at different rates read as noise and make it genuinely unclear which points carry meaning.

**The transcript plane.** Terminal output sits on `--deep` — a nearer, flatter surface than the field, with a hairline edge rather than a shadow. Code is the one content type that is genuinely dark in life, so it needs no special pleading here; it simply sits closer. Its content never wraps: a terminal is a character grid, and a wrapped line breaks every box frame and padded column in it. Frames wider than their pane scroll sideways, and anything scrollable is focusable.

**Hairlines only.** Rules and edges are `--ice-faint` at 1px. No borders above 1px, no side stripes, no card grids as page structure, and no nested containers.

**Sequence is spatial.** Module and lesson order maps to depth and position in the field, so `/map` is a view of the structure rather than a table of contents drawn to look like one. Module one is nearest; module ten is furthest in.

**Selection is a lift, never a drop.** A highlighted row brightens toward `--ice`; it does not darken toward `--deep`. Depth is declared by luminance everywhere here, so a selected item that recedes is backwards. Not the signal colour either: a selection is not a change.

## The refusals

Each is a category default rather than an absolute — the brief's own words could earn any of them, but reaching for one when the choice was free means a decision was not made.

Same-size icon-heading-text cards as page structure · nested cards · the hero-metric template · an uppercase eyebrow above every section (at most one per three sections) · section-number eyebrows and `01 / 4` pagination · version labels in the hero · the split-header pattern of big headline beside small explainer · three consecutive image-and-text zigzag sections · gradient text · glass and blur as decoration · coloured side-stripe borders above 1px · sparklines and progress rings standing in for content · monospace as costume · outer glows · pure black · `feTurbulence` grain · hand-rolled sketchy SVG · div-built fake screenshots · a hero that overflows its viewport or whose CTA wraps to two lines · placeholder-as-label · custom cursors.

And the whole-look conventions to stay clear of: warm cream with a serif display and a terracotta or brass accent; near-black with one neon accent and glowing edges; broadsheet hairlines with an italic display serif and tracked mono labels; a purple-to-blue gradient hero. The first is the one this project already walked into once. Add to the list: CRT costume — scanlines, phosphor bloom, and ASCII borders standing in for structure. This is a console, not a nostalgia piece.

And on the mastery layer specifically: no XP, no badges, no confetti, no levels named after gemstones, no leaderboard. Every surface there is a real artefact of the software or it does not exist. See "The world".

## Accessibility as a design constraint

A build gate, and now genuinely one: `pnpm e2e` runs an axe sweep at WCAG 2.1 AA across eleven templates plus the command palette *while open*, because a dialog is only ever audited if something opens it first.

Contrast verified against both `--void` and `--deep`. `--ice-faint` is **2.85:1** on `--void`: it is a hairline colour, and text is never set in it — nor is it used for a graphic that carries meaning, since 1.4.11 wants 3:1 and axe does not check custom graphics. `prefers-reduced-motion` lands every animation on a resting state that is the finished article. `prefers-contrast: more` is honoured.

Canvases are decorative and carry `aria-hidden`, so nothing in one is load-bearing — every structure the field depicts exists as real text, and `/map`'s no-JS test counts all 51 lesson links to prove it rather than assert it. Session replays and the console ship as complete transcripts a screen reader can read straight through, with interactivity as the enhancement. Any scrollable region is focusable; on a site made largely of terminal frames wider than a phone, that rule comes up constantly. Focus is always visible against a dark ground, which means a light ring, not a subtle one. Terminal content stays legible at 200% zoom.
