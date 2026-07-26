# Decisions

A running log of the choices that shaped this project, and what each one cost. Newest last.

---

### 001 — Build a learning platform, not documentation

**Decision.** Teach Hermes Agent through a progressive, adaptive curriculum with simulated sessions, rather than mirroring the official docs.

**Why.** Nous Research's own documentation is good reference material and doesn't need a competitor. What doesn't exist is a path: the ordered, opinionated journey from "installed it, now what" to "I run a fleet of agents that improve themselves." Reference answers *what does this flag do*; a curriculum answers *what should I learn next, and why does it matter*.

**Cost.** Every lesson needs sourcing against fast-moving upstream docs. Mitigated by a `hermesVersion` field per lesson, version-provenance chips on every command, and a scheduled CI job that re-checks external links.

---

### 002 — No backend, no accounts

**Decision.** Personalization (knowledge track, progress) lives entirely in `localStorage`. The site is a static export.

**Why.** Three reasons, in order of weight. It's free and permanently maintainable — a portfolio piece that dies when a database bill lapses isn't a portfolio piece. It collects nothing, which is the honest posture for a project whose author works in AI governance. And it forces a more interesting engineering problem: adaptive content that stays fully crawlable and works without JavaScript.

**Cost.** No cross-device progress, no analytics on learning behaviour, no user-generated content. Accepted.

---

### 003 — Track adaptivity via CSS attribute, not conditional rendering

**Decision.** MDX renders every track's variant into the static HTML tagged with `tk-*` classes. An inline script sets `data-track` on `<html>` before first paint; CSS hides the variants that don't apply.

**Why.** The obvious implementation — read the track in a client component and render one branch — produces a flash of wrong content, a hydration mismatch, and a page whose indexed content depends on a default. This approach has none of those failure modes: the server sends one HTML document to everyone, search engines index the union of all tracks, no-JS visitors get the complete content with track labels intact, and switching tracks is a single attribute write with no re-render.

**Cost.** Slightly larger HTML payload (all variants ship), and authors must think in variants rather than branches. Both are cheap; the payload difference is a few kB of compressible text.

---

### 004 — content-collections as a CLI sidecar, not a Next plugin

**Decision.** Content is compiled by the `content-collections` CLI running alongside `next dev` and as a prebuild step, rather than through its Next.js config plugin. Contentlayer, its predecessor, is abandoned.

**Why.** Turbopack is the default builder in Next 16, and bundler-plugin integrations are where that friction shows up. A sidecar produces plain typed modules the bundler doesn't need to know anything about — the pipeline can't be broken by a bundler upgrade. Same reasoning drove generating Open Graph images with a standalone satori script instead of the `opengraph-image.tsx` file convention.

**Cost.** One more process in dev, one more prebuild step. Worth it for a pipeline that can't break under us.

---

### 005 — Motion for components, GSAP for scenes

**Decision.** Motion handles anything coupled to React state; GSAP handles timeline-orchestrated scroll scenes. A lint rule confines GSAP imports to the landing and scroll-scene directories.

**Why.** Both libraries are excellent at different jobs — Motion's declarative model fits component state, GSAP's timelines and ScrollTrigger fit choreographed scenes — and the real risk is shipping both to every page. The lint rule turns a discipline problem into a build error.

**Cost.** Two animation vocabularies to know. Acceptable; the boundary is legible.

---

### 006 — Simulated sessions instead of a live playground

**Decision.** Teach the feel of Hermes through scripted, scrubable replays of real sessions rather than an embedded playground calling a live model.

**Why.** A playground would demand the visitor's API key, which is both a security surface and a barrier at exactly the wrong moment. Replays are deterministic, art-directable, instant, free, and can pause to explain the moment Hermes writes a skill for itself — which live output can't be relied on to do. The trade is honesty, so every recorded session carries its provenance, and the format tracks fidelity explicitly: what's verbatim from a source versus paraphrased.

**Cost.** Not the real thing. Addressed by keeping every real command copy-pasteable inline, so the reader runs Hermes for themselves while reading.

---

### 007 — The laboratory notebook, not the messenger god

**Decision.** The visual world is a bound laboratory notebook and its protocols: paginated, dated, stamped; printed procedures corrected in the margins across successive runs; results tipped in as pasted specimen slips; nothing erased, only struck through and re-entered. System diagrams are exploded axonometric technical plates. Terminal transcripts appear as dark plates pasted into the light page.

**Why.** The obvious direction — Hermes, therefore Greek antiquity, therefore dark ground and engraved capitals — is the literal reading of a product's name, which is the least interesting thing about it. Rendered as a comp it also failed on its own terms: inscribed letters on a stoichedon grid are beautiful at hero scale and unreadable at body scale, and carved stone offers no answer to what a dense lesson page or a scrolling transcript should look like.

The notebook was chosen because it is the only candidate that carries all three of the product's hard parts at once. A protocol corrected in its own margins *is* the agent revising its own skill files. A dated record that only grows *is* its memory. Append-only convention — struck through, never erased — *is* the audit trail the governance audience needs before they will permit an autonomous system anything. The classical reading carried the least of it while looking the most like something.

**Cost.** A light, paper-grounded world is unusual for a technical site and carries a real risk of drifting into the cream-and-serif look that AI-generated interfaces converge on. Mitigated deliberately: the paper token is cool rather than warm, the body face is a Clarendon slab with an official-document lineage rather than a literary serif, and the annotation red may only appear where it means correction. The night mode is an archival negative, not a reading lamp — lamplight being precisely the rendition every model reaches for.

---

### 008 — A platform called Protocol, holding guides

**Decision.** The product is a platform, "Protocol," publishing one guide per subject. The Hermes guide is the first. Content lives at `content/guides/<guide>/<module>/<lesson>.mdx` and serves from `/hermes/…`; module grouping and ordering invariants are keyed per guide.

**Why.** The original framing was a single site about one agent. That is too narrow for where this is going — other agents are worth the same treatment, and a platform can eventually be sold where a single guide cannot. The word earns its place twice over: a protocol is the lab document this design world is built on, written down and revised in the margins and followed exactly, and it is also the term this industry already uses for how agents talk to things.

Doing it now cost a directory move and one keying change. Doing it after sixty lessons exist would have cost a migration.

**Cost.** "Protocol" is a common word, so it confers no exclusivity, and the platform's own identity has to stay quiet enough not to compete with each guide's. Commercial plumbing is deliberately absent: gating requires a backend, which would contradict the zero-cost, zero-data posture, so only the seams are in place — guides as independent units, no architecture that would need tearing out.

---

### 009 — Substrate: depth as the medium, type that rewrites itself

**Decision.** The visual world is a dark, dimensional field in which the agent's interior is actually rendered — clustered nodes and edges at real depth, drifting, displaced by the pointer — with content on a plane above it. Its signature motion is borrowed from a second candidate direction: display type that strikes its own line through and re-enters it, characters resolving in sequence. Dark only, one signal colour, no serif.

**Why.** This replaces the paper-notebook world of decision 007, which was wrong twice over. It fought the subject: a platform teaching autonomous software should not look like stationery. And its palette turned out to sit almost exactly on tasteskill's published list of banned defaults, where cream grounds with brass accents and warm near-black ink are recorded as the second-most-recurring signature of machine-generated design. Avoiding one convergence cluster is not the same as avoiding all of them, and a rule against neon does not license a retreat into paper.

The fusion is not a compromise. A skill library, a memory index and a delegation tree genuinely are graphs, so rendering them in depth is description rather than decoration — the field is what the agent *is*. And an agent that rewrites its own instructions is exactly what self-rewriting display type performs — the type is what it *does*. Nine candidate directions were built as live prototypes before this one was chosen; three were authored directly, three derived by following Impeccable's world-derivation process, three by following tasteskill's dial-driven method.

**Cost.** A committed dark world offers no light theme, because inverting a luminous field destroys the medium rather than translating it; that is stated as a choice and paid for with verified contrast against both surface planes and an honoured `prefers-contrast`. The field is canvas, so it must stay decorative and `aria-hidden`, with every structure it depicts also present as real text. And the whole token layer, page shell and component set were rebuilt — roughly a day, which is the price of having discovered the mistake at forty-three pages rather than four hundred.

**What the previous world contributed.** One idea survived intact and is now the centrepiece: revision made visible, superseded content kept on the page beside its replacement and its reason, rendered as real `<del>` and `<ins>`. It was the best thing about the abandoned direction and it was never paper-specific.

---

### 010 — The site is the thing it teaches: an operator's OS, with progress as capability

**Decision.** The platform is built as an operator's console rather than as a document with a canvas behind it. Four surfaces: a boot sequence at `/` that performs the agent's loop as a scroll narrative; a desktop at `/map` where the field is finally real — a WebGL graph of the agent's interior that the reader's own mastery lights up; a workspace at `/hermes/…` where a lesson pane sits beside a live, typeable, deterministic Hermes terminal; and a profile at `/~`. A mastery system runs across all four, and every one of its surfaces is a real Hermes artefact rather than a game element borrowed from elsewhere.

Decision 009 is superseded. What survives from it is named at the end.

**Why.** Three things forced this, and only the third is about taste.

*The brief changed.* 009 was derived for a reader who reads. The product now has to do two more jobs: land inside forty seconds on a hiring audience in the Swiss AI market, and earn a return visit tomorrow. 009's register — recorded in `design.md` as "cold, precise, dimensional… never playful, never cosy" — is a direct instruction not to do the second. A gamified layer bolted onto that world would read as exactly what it was: a bolt-on.

*The strongest asset was being spent as a demo.* A deterministic, faithful, typeable terminal — the real numbered approval menu, the 300-second countdown that fails closed and is documented nowhere, the shipped `contemlating` typo — is the single hardest artefact in this project for a neighbouring guide to copy, and the fastest possible proof to an engineer that the research was real. Under 009 it was one embedded component on some lessons. Here it is the chrome, and the pure timeline core in `src/lib/sim/timeline.ts` is what makes that affordable rather than reckless.

*The world had never actually arrived.* 009's field is masked out of the middle 46% × 52% of the viewport (`globals.css`), because content sits on a plane with no surface of its own and an unmasked field made prose illegible. The medium ended up as periphery. An OS has panes with real surfaces, which is precisely what lets the field be dense and alive without ever fighting a paragraph. The direction did not fail; it was structurally unable to land in a single-column document, and that was knowable earlier than it was known.

**Why an OS and not the other candidates.** `research/design/03-direction-derivation.md` names four ruts to stay clear of: the Greek-god-and-gold literal reading, the friendly light-mode docs site, cream-with-brass, and near-black-with-one-neon-accent-and-glow. An operator's console is on none of them. It carries one rut of its own, and that document already found it when it weighed Teletext: **retro terminal costume**. The defence is that this is a contemporary console, not a CRT — no scanlines, no phosphor bloom, no ASCII borders standing in for structure — and that the existing monospace rule holds without exception. Mono sets real output, real commands, real versions. It never dresses a label.

It also answers the product's own success sentence better than any alternative. The reader is supposed to leave able to build their own agent OS. A site that is one is a demonstration of the destination rather than a description of it.

**The mastery system, and why it does not embarrass the governance reader.** Nothing in it is invented vocabulary:

- The unit of mastery is a **skill file written into the reader's own `~/skills/` tree**. Fifty-one lessons, fifty-one capabilities, in the namespaced layout the real binary uses.
- The level is **the agent's version number**, climbing v0.1.0 toward v0.19.0 along Hermes's actual twenty-two-release ladder. The progression teaches the release history as a side effect.
- The streak is **uptime**, in the status bar's verified format — which has no cost field, because the captured binary does not have one.
- A mastery check is **the approval prompt**, answered as the operator with the countdown running. It is a comprehension gate that is simultaneously a lesson in the mechanic it gates.
- Completion produces a **generated `SOUL.md` and capability manifest**, downloadable, shareable through URL-encoded state.

A newcomer still gets unlocks, a streak and a celebration. An engineer or a risk officer is never winked at. That is the whole design constraint on this layer, and any future addition to it has to pass the same test: if it is not a real artefact of the software, it does not ship.

**Cost, stated honestly.**

- **The 130 kB lesson budget is dead.** It was already missed at 190.5 kB against a framework floor, and this direction adds a WebGL field, a terminal pane and a persistence layer. The number will be re-set from measurement by `pnpm budgets` after the workspace exists, never by choosing a number that the build happens to meet.
- **A second rebuild of the shell.** The token layer largely survives; the page shell, navigation and landing do not. This is the second world this project has paid for, and the reason is recorded above so it is not mistaken for indecision.
- **A new dependency.** OGL rather than three.js for the field — roughly 10 kB gzip against roughly 150 kB. If OGL cannot carry the graph at the density required, the field degrades to the existing 2D canvas rather than the budget degrading to three.js.
- **The no-JavaScript commitment gets harder and is not relaxed.** Lesson prose stays server-rendered and complete. The terminal pane, the field and the entire mastery layer are enhancements that a reader without JavaScript never misses, because nothing load-bearing lives in them. This is the constraint that keeps the whole build defensible to the audience it is meant to impress, so it is the one that must not be quietly traded away when it becomes inconvenient.
- **Antiquity is dropped entirely.** Not geometry, not inscription, not the messenger. The identity is the console. This removes the last dependence on an accident of the product's name, and with it the residual risk of evoking the luxury house.

**What 009 contributed, kept intact.** The palette family and its one-signal discipline. The self-rewriting type gesture, still the site's signature and still performing the thesis. Depth declared by luminance rather than by shadow. And, inherited through 009 from 007, revision made visible as real `<del>` and `<ins>` — now three worlds old and still the best idea any of them produced.
