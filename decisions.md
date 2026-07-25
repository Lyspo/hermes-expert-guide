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
