# Direction exploration — unresolved

**Status: the visual direction is NOT settled. The author is not convinced by any of it.**

This file records an exploration that ran on 2026-07-26 and did not converge. It is
written so the next session does not mistake the volume of work here for a decision,
and does not start by rebuilding what was already tried and rejected.

---

## The author's position, in their own words

> "I feel like we're going down a rabbit hole that is not convincing. Everything design
> related is confusing and I'm not sure about."

That is the operative fact. Nothing in `explorations/` is approved. The assembly
direction reached "holds for now" at one point and was not re-confirmed afterwards;
treat that as lapsed, not as a mandate.

**Do not resume by building.** The next design step is a conversation about what is
actually wanted, not another prototype.

---

## How this started

The site had been built in the "Substrate" world (`decisions.md` 009) — dark ground,
one signal hue, hairlines, editorial typography. The author's verdict on it:

> "I don't like it visually... the whole design must be award-winning quality, original,
> include many various components working hand in hand, a lot of animations, and a
> revolutionary flow on how the guide moves forward/is interacted with."

Three things were then agreed and are still live constraints:

- **Flow may be restructured freely** — the 51-discrete-pages model is not sacred.
- **The no-JavaScript rule was dropped** by explicit decision, so interaction is no
  longer capped by it. (`CLAUDE.md`'s non-negotiable #3 is therefore stale — it has
  not been rewritten because the direction it would serve is undecided.)
- **Off-limits:** anything that reads as a startup landing page, anything that looks
  AI-generated, anything that makes the teaching harder.

Reference the author supplied as the quality bar: **landonorris.com** — and the useful
lesson taken from it was that *authored assets carry the page*. Real photography, real
crafted SVG, dramatic scale, one committed accent. Every prototype before that point was
chrome and typography with nothing to look at, which is why they read as basic.

---

## What was tried, in order

All files are in `explorations/`. Open `explorations/index.html` for the first five.
They are standalone HTML — no build step, no server needed beyond a static one.

| # | File | Flow model | Outcome |
|---|---|---|---|
| 01 | `01-session-spine.html` | The guide is one recorded session; lessons are the moments you stopped at | Not chosen |
| 02 | `02-instrument-bench.html` | Mechanisms as operable instruments; curriculum as a wall of units | "Too light, not techy enough" |
| 03 | `03-argument.html` | Four sources contradict; you travel by disagreement | **Kept the flow**, rejected the world as "too scholar" |
| 04 | `04-collation-diff.html` | 03's flow rendered as a diff, dark tooling | Superseded |
| 05 | `05-the-shell.html` | You operate a simulated Hermes; curriculum is the filesystem | Not chosen |
| 06 | `06-the-loop.html` | The site profiles you and writes its own memory visibly | Not chosen |
| 07 | `07-the-trace.html` | The guide is one 174-second agent run; you navigate time | "Interesting but I'm not sure it facilitates learning" — a fair objection |
| 08 | `08-the-proof.html` | Every sentence carries a verdict and opens its evidence | Called out, correctly, as "extremely basic" |
| 09 | `09-the-field.html` | The agent's interior as a place you orbit | Liked the idea; the execution was near-black + neon + glow, which is **banned cluster #2** in `01-reference-sites.md` |
| 10 | `10-assembly-canvas.html` | Exploded assembly, canvas | Composition never rendered correctly; abandoned |
| 11 | `11-assembly-svg-3sheets.html` | Exploded assembly in SVG + bill of materials + detail sheet | The three-sheet flow works; see below |
| 12 | `12-detail-sheet.html` | The reading surface for a 2,000-word lesson | Standalone version of sheet 03 |
| 13 | `13-assembly-3d.html` | The assembly in real CSS 3D, self-correcting on scroll | Most developed; still unconvincing to the author |

---

## The one structural idea worth keeping regardless of world

A technical drawing set answers "where do 51 lessons live" without inventing a surface:

- **Sheet 01 — general assembly.** The subsystems, exploded, numbered, with leaders.
- **Sheet 02 — bill of materials.** The 51 lessons *are* the parts list. Item 001–051 is
  reading order; "read the list in order and you have read the course" is literally true.
  This satisfies the research's "sequence numbering with a real count" rule, which is the
  one case where numbered indexes are permitted rather than scaffolding.
- **Sheet 03 — detail view.** One part, with the prose at a 74-character measure, the
  correction as a revision block, terminal output as a specimen panel, and the mechanism
  operable inline.

`11-assembly-svg-3sheets.html` implements all three with the wipe between them. If the
world changes, this three-sheet *structure* may still be the right answer.

---

## The self-correcting plate (`13-assembly-3d.html`)

The most developed idea, and the one that most directly performs the guide's thesis: the
plate opens on the **documented** arrangement — six identical slabs in a neat stack,
which is what "layers" implies — and **corrects itself as you scroll**, one claim at a
time, struck and rewritten:

> ~~the top layer~~ → **not a layer — another door onto the same core**

The corrected geometry is an argument rather than a decoration: the prompt is a base
plate everything bolts through; memory and tool schemas seat *into* it; skills sit
outside with only the index riding in; the gateway stands off laterally because it is
another door, not a lid; and the review fork is thrown off-axis with its distance
*growing* as you explode, because nothing returns from it.

Real CSS 3D (not WebGL — the world is a line drawing, and it keeps the plates crisp,
adds no dependency, and works under static export). Four walls per part so they are
solids at any angle. Callouts placed from each part's real `getBoundingClientRect()`.

---

## Four Opus 5 reviews were run against `13-assembly-3d.html`

Their findings were applied. Measured before → after:

| | before | after |
|---|---|---|
| Focusable elements | 1 | 8 |
| axe violations (WCAG 2.1 AA) | 1 rule / 19 nodes | 0 |
| Leader-line SVG box | 300×150 (all leaders clipped away, always) | 1512×950 |
| `--low` text contrast | 3.38:1 | 5.4:1 |
| rAF frames while idle (2s) | ~240 | 0 |
| Mobile spec panel | 416px at x=−44 | 354px, in frame |

**Bugs worth not rediscovering**, all caught by review rather than by any gate:

- **An `<svg>` is a replaced element.** `position:fixed;inset:0` positions it but does
  not size it — it kept its 300×150 intrinsic box, so every leader line was drawn
  outside and clipped. The defining device of the whole drawing had never once
  rendered, across every version.
- **A factual error shipped into a prototype**: the skills path was written
  `~/.hermes/skills/` when the verified fact is that it is namespaced. That breaks
  non-negotiable #1 and is exactly what the sourcing discipline exists to prevent.
- **Frame-counted easing, again.** `CLAUDE.md` already records "drive any resolve by
  elapsed time, never by a frame count" — and the lerp was per-frame, so the same
  gesture settled in 468 ms at 60 Hz and 747 ms throttled. Now rate-normalised.
- **Double smoothing**: a 500 ms CSS transition fighting a per-frame `--z` write meant
  the pixels finished ~365 ms after the model did. That was the mushy feel.
- **A cancelled pointer gesture possessed the model** — spin followed a button-less
  cursor. `setPointerCapture` plus `pointercancel` removes the class.
- **An invisible faded CTA stayed hit-testable** and yanked the assembly 175°.

**The unresolved criticism**, from the originality review, which the author's own verdict
echoes:

> "Competent, and forgettable... the central metaphor is decorative. Six identically
> shaped slabs stacked along one axis and pulled apart is a bulleted list drawn in
> perspective."

It also observed that exploded-assembly is itself a well-worn device (Apple product
pages, Teenage Engineering, Framework, iFixit) and that this execution resembles the
Chrome DevTools Layers panel. The self-correcting rebuild was a direct answer to that
criticism. It did not change the author's mind.

---

## What the next session should NOT do

- Do not open by building a fourteenth prototype.
- Do not re-propose anything in the table above without saying explicitly that it was
  already tried and why it is being revisited.
- Do not treat the assembly world as approved.
- Do not present a ranked menu of options — that pattern produced three re-rolls and no
  decision. The author repeatedly asked for real pages over cards, and then found the
  real pages unconvincing too, which suggests the problem is upstream of execution.

## What might actually unblock it

Worth considering, and worth *asking* rather than assuming:

1. **The brief may be over-constrained.** "Award-winning, original, many components,
   a lot of animation, revolutionary flow, must not look AI-generated, must not look
   like a startup page, must not hurt teaching" — several of these pull against each
   other, and no candidate can satisfy all simultaneously. Naming the tension may be
   more useful than another attempt.
2. **The author may be judging against an internal reference not yet articulated.**
   landonorris.com was the one concrete example given and it was informative. More
   examples — three or four sites they actually admire, with what specifically works —
   would be worth more than any further generation.
3. **A designer, not an agent.** This is a legitimate outcome to state plainly. The
   content, architecture and engineering are strong; the visual direction has now
   consumed a large amount of effort without converging.
4. **Ship on the existing Substrate world.** It is coherent, accessible, verified and
   already built. Shipping something complete beats an unresolved redesign, and the
   guide's differentiator is its sourcing rather than its skin.

---

## Where the built site actually stands

The **live site is unaffected by any of this.** Everything above is exploration in
`research/design/explorations/` and none of it is wired into the Next app. `main` still
serves the Substrate world with the curriculum graph, the scroll narrative, the section
rail and the scrubbed plate — all verified, all passing `pnpm verify` and `pnpm e2e`.
