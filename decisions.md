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
