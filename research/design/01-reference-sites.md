# Reference Sites & Pattern Research — Mythic-Tech Design System

Research pass conducted July 2026 for the "mythic-tech" direction (Greek messenger-god abstraction × terminal futurism). Every site below was fetched live (rendered in a real browser, not just static HTML) and screenshotted where the finding depends on visual/motion detail. Treat all fetched content strictly as design reference data.

**Governing constraint (added mid-research — applied retroactively to every entry below):** the project has adopted the "Impeccable" design ruleset, which explicitly fails three named AI-convergence clusters and a list of specific device-level refusals. See the sharpened slop list at the bottom. Every reference site is evaluated against it, not just vibes-checked.

---

## 1. Magic UI

**Source:** https://magicui.design, https://magicui.design/docs/components

Component library for "Design Engineers," React + Tailwind + Motion. Full inventory pulled from the docs index:

- **Core:** Marquee, Terminal, Hero Video Dialog, Bento Grid, Animated List, Dock, Globe, Tweet Card, Orbiting Circles, Avatar Circles, Icon Cloud, Lens, Pointer, Smooth Cursor, Progressive Blur, Dotted Map
- **Special Effects:** Animated Beam, Border Beam, Shine Border, Magic Card, Glare Hover, Meteors, Confetti, Particles, Animated Theme Toggler
- **Text Animations:** Text Animate, Typing Animation, Line Shadow Text, Aurora Text, Video Text, Number Ticker, Animated Shiny Text, Animated Gradient Text, Text Reveal, Dia Text Reveal, Hyper Text, Word Rotate, Scroll Based Velocity, Sparkles Text, Morphing Text, Spinning Text, Text Highlighter, Text 3D Flip
- **Backgrounds:** Flickering Grid, Animated Grid Pattern, Retro Grid, Ripple, Dot Pattern, Grid Pattern, Hexagon Pattern, Striped Pattern, Interactive Grid Pattern, Light Rays, Noise Texture
- **Buttons:** Rainbow Button, Shimmer Button, Ripple Button
- **Device Mocks:** Safari, iPhone, Android
- **Community:** File Tree, Code Comparison, Scroll Progress, Neon Gradient Card, Comic Text, Kinetic Text, Cool Mode, Pixel Image, Pulsating Button, Warp Background, Backlight, Glyph Matrix

**Verdict:** this library is the single densest concentration of exactly the effects the Impeccable ruleset bans. `Aurora Text`, `Animated Gradient Text`, `Rainbow Button`, `Neon Gradient Card` = gradient text/gradient chrome, banned outright. `Border Beam`, `Shine Border`, `Glare Hover`, `Meteors`, `Particles`, `Sparkles Text`, `Backlight` = decorative glow-on-hover, the "near-black + neon accent + glowing edges" cluster in component form. `Retro Grid`, `Grid Pattern`, `Dot Pattern`, `Interactive Grid Pattern`, `Hexagon Pattern`, `Striped Pattern` = the banned two-axis grid overlay / repeating-stripe backgrounds with nothing real underneath. `Noise Texture` = feTurbulence grain as decoration. `Safari/iPhone/Android` device mocks = generic SaaS-marketing cliché, wrong register entirely for mythic-tech.

**Two components are worth keeping in the toolkit, used narrowly:** `Terminal` (a real bordered terminal-window component — legitimate if it renders actual CLI output/copy commands, not decoration) and `File Tree` (legitimate if showing a real file structure). `Typing Animation` / `Hyper Text` / decryption-style reveals should be treated as an already-overused "hacker" cliché — flag, don't default to it.

---

## 2. 21st.dev

**Source:** https://21st.dev, https://21st.dev/s/terminal, https://21st.dev/s/ascii-art

Community registry of copy-paste React/Tailwind components ("npm for design engineers," 700+ contributors, 10,000+ components). The general marketplace skews hard into generic-AI-SaaS: liquid/metal shader hero effects, glassmorphism cards, gradient backgrounds, AI-chat bento layouts — this is the aesthetic the client wants to avoid, not emulate. But two categories are directly useful as *implementation* reference (steal the technique, not the marketplace's taste):

**Terminal category (18 components), named entries worth looking up directly on the site:**
`Bash Tool` (by Serafim, appears 3x — different takes), `Kinetic Log Stream`, `Data Stream`, `8-bit Demo Shell`, `Matrix code rain`, `Faulty Terminal`, `Terminal Control Section Animated`, `Sandbox` (Hayden Bleasel), `Script Copy Button` (Dillion Verma — the "$ npx install..." copy-to-clipboard pattern), `Code Editor`, `Phosphor`, `Schematic`, `CyberpunkTerminalHero`, `TerminalBentoGrid`.

**ASCII Art category, named entries:**
`Hero ASCII` (1.1k saves — clearly the most-reached-for pattern in this space right now), `3D ASCII Model Viewer`, `Midjourney ASCII Swirl`, `ASCII Pyramid`, `CPU Architecture` (315 saves), `Delicate Ascii Dots`, `Heximage`, `HyperText with Decryption`, `Text Scramble`.

**Reading these two lists together:** ASCII/glyph-density rendering (a shape built from monospace characters whose weight/density encodes an image or a value) is a live, current pattern — not retro kitsch — and it is the one place where "monospace as costume" becomes "monospace as actual measurement," which is exactly what the ruleset wants. `Phosphor` and `Schematic` (names alone) suggest CRT-phosphor and blueprint/schematic treatments worth inspecting directly for the mythic-tech terminal layer. `Text Scramble` / decryption-reveal is the one to use sparingly — it's trending toward cliché through overuse across the AI-SaaS wave.

---

## 3. recent.design (godly.website redirects here — same product, new domain/brand)

**Source:** https://recent.design (godly.website 301-redirects to `recent.design/?ref=godly`)

Godly rebranded to "Recent" at some point before mid-2026; the old domain now forwards. Current homepage tagline: "The best design inspiration on the Internet," categories include Web / Interface / Branding / Typography / Motion / Editorial / Illustration / 3D / Print / Packaging. Pulled the live "currently featured" list and inspected several entries directly:

### Astrodither — Robert Borghesi LAB
**URL:** https://astrodither.robertborghesi.is/
Page title itself is a mission statement: *"[SIGNAL. LOST. BEAUTY. FOUND. DIGITAL. CHAOS.]"*. Pure black viewport, a bracket-delimited monospace CTA `[:: CLICK TO ENTER + ENABLE AUDIO ::]` in a boxed terminal-style prompt (not a button — a command). On entry, a cursor-reactive WebGL point-cloud renders as a dithered halftone: a mix of solid squares, hollow squares (□), plus-signs (+), and filled circles, in pale gray with pink/lavender accent cells scattered through the field, softly self-illuminating (the glow comes from the rendered particles themselves, not a CSS box-shadow — this is the load-bearing distinction that keeps it off the banned "near-black + neon + glow" list). The cursor perturbs the field's density/color in real time. This is the strongest single terminal-futurism reference found in this pass.

### Interfere
**URL:** https://interfere.com/
Dark SaaS product page (production-monitoring tool). Hero: large sans display headline "Ship software that never **breaks**" where "breaks" switches to an italic script/handwritten face mid-sentence — a legible way to break monotony without a gradient. Below the fold, a real embedded product screenshot: dark dashboard chrome, monospace code diff (`auth/reset.ts`) with genuine syntax highlighting, avatar stack, priority/assignee metadata rows. Caution: there is a soft ambient purple/pink glow wash behind the hero text — this is borderline against the "near-black + neon accent + glowing edges" cluster and should not be copied as-is; the code-block monospace use, by contrast, is earned (real diff, real file path).

### Podium
**URL:** https://podium.global/
Loading sequence only (heavy video site, didn't fully resolve): a vertical black/white split-screen wipe reveal, a bold serif percentage counter top-right (`5%` → `20%`...) and a single small black dot centered in the white pane as the only other mark on screen. No color, no gradient, no glow — a purely typographic/geometric preloader. Worth stealing as a loading-state pattern regardless of what's behind it.

### Harry Atkins
**URL:** https://harryjatkins.com/
The best "composition over effects" find in this pass. Two monumental glyphs ("H" and "A" — his initials, oversized, no logo mark) anchor the layout; three columns of small labels function as real navigation and real system state, rendered as literal boolean toggles: `Text mode (N)`, `Dark mode (N)`, `Monochrome (N)` — clicking them changes state. A readout in the far corner shows live viewport pixel dimensions (`0x0` idle → `1280x720` on interaction) plus `macOS`, genuinely reflecting the visitor's own window, not decoration. Below, a project index reads like a ledger, not a card grid: title, category, and a real sequential index number per project (`26`, `25`, `24`, `23` — counting down a real, finite list, which is exactly the kind of numbering the ruleset allows since the sequence carries information). Thumbnails are flat solid-color rectangles, no gradient, no shadow, no rounded-corner glow.

### Gregor Collienne
**URL:** https://gregorcollienne.com/
Light-mode photography portfolio — palette doesn't transfer, but the composition does: an oversized bold condensed grotesk wordmark is layered directly over a masonry grid of full-bleed authored photography (no cards, no captions-as-chrome, images at irregular sizes/rotations). The lesson to steal is "huge type directly over real authored imagery, integrated rather than boxed," not the light palette.

### Meech213
**URL:** https://www.meech213.com/
Light fashion-magazine portfolio, thin serif category labels ("FASHION," "BEAUTY," "BRANDS," "ARTIST") scattered as a loose word-cloud with small tilted image tiles pinned over them. Doesn't fit mythic-tech's dark register; noted only because it's currently featured — skip for direct reference.

### Cathy Dolle
**URL:** https://www.cathydolle.com/
Interactive designer portfolio, also independently surfaced in Awwwards' "editorial portfolio" search (cross-referenced hit — see Section 7). Light background, minimal centered dot as the only content mark pre-interaction, small tracked uppercase mono nav (`ABOUT`, `SHOP`, `PLAYGROUND`, `CONTACT`) — likely WebGL-driven content that didn't fully render in this pass; worth a manual second look for the studio's motion work specifically.

---

## 4. motionsites.co — unreachable / likely wrong premise

**Source attempted:** https://www.motionsites.co and https://motionsites.co — both fail to resolve (DNS `ENOTFOUND`, confirmed via two independent fetch paths).

Searched for the current/correct URL. What actually exists under similar names is **not a curated showcase gallery** — it's an AI prompt/template product: "MotionSites — a premium library of hero-section prompts and animated templates" for use with AI site-builders (surfaced at `moge.ai/product/motionsites`; adjacent unrelated products at `motionsite.ai` and `motionsites.net`, a web design agency). None of these are inspiration galleries in the sense the brief implies.

**Closest legitimate substitutes for "sites with described motion patterns," found via search, not independently audited in this pass:** `movin.design` (motion-design inspiration gallery) and `landing.love` (2,100+ cataloged animated landing pages). Recommend the client re-confirm what they meant by "motionsites" — it may be a mishearing of one of these, or of Awwwards' own motion-tagged collection.

---

## 5. "skriiibl"

**Searched exhaustively, not found.** Tried: `skriiibl`, `skriiibl.com/.io/.co/.xyz`, `skriiibl studio/agency/design`, `skriiibl` + Instagram/Behance/X/Twitter, and close phonetic variants (`skriibl`, `scriibl`, `skrbl`, `skreebl`, `skreeble`, `scr33ble`). No design-inspiration source under any of these spellings has a discoverable web presence — results only return the unrelated drawing game "skribbl.io" and an art-merch shop "skriiiblz.com." This is very likely a mishearing or private/verbal-only nickname (a Discord, a Slack, a personal Are.na channel, or a designer's own handle) rather than a public gallery. **Recommend asking the client directly for the exact spelling or a link** — worth resolving before the design system references it as a source.

---

## 6. Celebrated design engineers / dark-editorial web designers (X/Twitter, 2025–2026)

| Name | Known for | Public work |
|---|---|---|
| **Rauno Freiberg** (@raunofreiberg) | Staff design engineer at Vercel; "trying to paint with code" — interaction/motion craft, design-engineering essays | rauno.me; Vercel's design-engineering output |
| **Emil Kowalski** (@emilkowalski) | Design engineer at Linear; built Sonner (toast lib) and Vaul (drawer lib); recently turned his animation-principles writing into a reusable "design engineering" skill for coding agents | emilkowal.ski |
| **Paco Coursey** (@pacocoursey) | Design engineer at Linear, formerly built Vercel's design system, marketing site, and dashboard | paco.me |
| **Jhey Tompkins** | Vercel design-engineering team; CSS/animation demos that circulate widely as craft references | — (Vercel team) |
| **Henry Heffernan** | Vercel design-engineering team | — (Vercel team) |
| **Robert Borghesi** | Independent — author of the "LAB" experiments including Astrodither (Section 3); dithered/WebGL, terminal-prompt-as-CTA aesthetic | robertborghesi.is |
| **Harry Atkins** | Independent developer; ledger-style portfolio with literal boolean UI state (Section 3) | harryjatkins.com |
| **Cathy Dolle** | Interactive designer, cross-referenced on both Recent and Awwwards' editorial-portfolio search | cathydolle.com |

Note: this list leans toward the "design engineer" wing (product-craft, componentized, often light-mode) rather than the cinematic-agency wing. For the darker/cinematic register the client is after, the studios in Section 7 (Active Theory, Cuberto, Resn, Locomotive) are the stronger reference than any single X handle — that end of the craft is mostly studio-branded, not personal-brand.

---

## 7. Awwwards — Sites of the Day / Month, dark & editorial-adjacent

**Source:** https://www.awwwards.com/websites/sites_of_the_day/, https://www.awwwards.com/inspiration_search/editorial%20portfolio/

### The Renaissance Edition (Shopify Editions, Winter '26)
**URL:** https://www.shopify.com/editions/winter2026 — Awwwards Site of the Month, February 2026.
The single best antiquity-adjacent reference found. Opening scene: pure black viewport, a thin off-white rectangle drawn in true one-point-perspective construction lines radiating from a central vanishing point — a direct visual quote of Renaissance/Da Vinci proportional-study diagrams (Vitruvian-style) — with the wordmark **"The Ren*ai*ssance Edition"** set inside it (bold sans, with "ai" rendered in italic to encode the AI-product pun typographically instead of with an icon). This is the ruleset's "earned" grid overlay: the geometric construction isn't decoration, it *is* the content's thesis (Renaissance proportion systems), which is exactly the bar the coordinator set for permitting grid/blueprint overlays. Scrolling triggers a full-black transition frame (like a shutter or eclipse wipe) into a full-bleed, generatively-painted fresco scene — cypress trees, classical Italian sky, painted clouds — with a giant serif/sans display word ("Sidekick") overlaid directly on the painting, sticky nav persisting through the transition. Cream/charcoal color pairing elsewhere on the site — flag this specific pairing as adjacent to the banned "warm cream + high-contrast serif + terracotta accent" cluster if reused verbatim; the black-viewport opening scene is the part worth stealing, not the cream interior pages.

### Active Theory (studio site)
**URL:** https://activetheory.net — the studio behind multiple Awwwards SOTD wins (`Active Theory V6`, `V4`, etc.), known for real-time/WebGL/multiplayer web experiences.
Concrete, reusable device: the preloader is an **ASCII/glyph-density circle** — a solid disc built entirely out of monospace `/` slash-characters and digits, dim teal-on-black, no color gradient, no box-glow. As the page loads, a live numeric counter (`/30` → `/75` → ...) sits centered inside the glyph-disc, and the density/brightness of individual characters shifts as if the ASCII mass itself is "loading." This is a strong, on-brief "techniques that survive the slop list" example: monospace used as literal procedural/generative rendering, not as a technical-sounding costume.

### Cuberto (studio site)
**URL:** https://cuberto.com — established Awwwards-winning digital product agency, cited repeatedly for SOTD wins.
Their current homepage is a useful **counter-example**: light background, oversized rounded-sans (not serif) headline, a single dark video panel with a border-radius well above 16px sitting under a soft shadow — structurally close to the "ghost card" the ruleset explicitly bans. Their own marketing homepage has drifted toward generic-modern-agency; their individual *project* case studies (not audited in this pass) are the better place to look for the cinematic 3D craft they're actually known for.

### Resn, Locomotive
**URLs:** resn.co.nz, locomotive.ca — both recur as Awwwards SOTD-winning studios named specifically for "cinematic motion with disciplined structure" (Resn) and "meaningful, results-driven digital experience design" (Locomotive). Named here from search corroboration but not independently screenshotted in this pass — flag for a follow-up visual audit before citing specific techniques from them.

### LaNegrita, FLOT NOIR, Studio Freight, Merci Michel, Lama Lama, Dragonfly Redux, NORMAL IS BORING
Current (July 2026) rotating SOTD entries pulled directly from the live Awwwards SOTD feed. Names only — not opened in this pass. `FLOT NOIR` ("black flow," French) is worth a look first given the name alone signals a dark palette; the rest are unverified leads, listed so the design team can triage quickly rather than re-crawl the feed.

---

## Patterns to steal

1. **Terminal-prompt-as-CTA, not button-as-CTA.** Astrodither's `[:: CLICK TO ENTER + ENABLE AUDIO ::]` — a bracketed monospace command replaces a rounded button. Read as an instruction, not a UI affordance.
2. **ASCII/glyph-density rendering for loaders and hero art.** Active Theory's teal glyph-disc preloader and 21st.dev's `Hero ASCII` (1.1k saves) / `3D ASCII Model Viewer` / `CPU Architecture` confirm this is a live, current pattern, not retro kitsch — monospace characters used as an actual rendering medium (density = brightness/mass), which is the one context where heavy monospace use is *earned* rather than costume.
3. **Cursor-reactive particle/dither fields where the glow is physically rendered, not CSS.** Astrodither's WebGL point-cloud self-illuminates because it's an actual shader output. This is how you get a "glowing" dark scene without tripping the banned "near-black + neon + glowing edges" cluster — the glow must come from a rendered object, not a box-shadow.
4. **Literal, functional monospace state — not decorative.** Harry Atkins' `Dark mode (N)` boolean toggles and live `1280x720` viewport readout are monospace doing real work (state, measurement) rather than performing "technical" as an aesthetic.
5. **Index-as-ledger instead of card grid.** Harry Atkins' project list (title / category / real sequential count) reads as a numbered inventory where the numbers mean something (how many projects, in order) — this is the one case where 01/02/03-style numbering is allowed by the new ruleset.
6. **Typographic-only preloaders.** Podium's black/white split wipe + serif percentage counter + single dot — no color, no gradient, and still a strong "moment."
7. **Earned geometric/blueprint overlays.** The Renaissance Edition's one-point-perspective construction lines work because they *are* the content's subject (proportion systems), not ambient texture. Any grid/blueprint overlay in the mythic-tech system should be justified the same way — tie it to a real diagram, map, or measurement the content is actually about.
8. **Full-black transition frames between scroll-triggered scenes**, used as a scene-change device (like a shutter or eclipse) rather than a simple crossfade — gives motion a sense of ceremony/threshold-crossing, which fits the "messenger between worlds" brief better than a standard fade.
9. **One accent word switching type style mid-sentence** (Interfere's italic-script "breaks") as a lower-risk alternative to gradient text for adding emphasis.
10. **Huge type layered directly over full-bleed authored imagery/illustration**, no card boundary (Gregor Collienne) — composition-level distinctiveness instead of effect-level.

## Patterns to avoid (slop list)

**The three banned AI-convergence clusters (any interface landing in one of these fails):**
1. Warm cream ground + high-contrast serif display + terracotta/signal-red accent.
2. Near-black + one neon accent + glowing edges.
3. Broadsheet-editorial hairlines + italic display serif + small tracked mono labels.

**Specific device-level refusals, and where this research saw them:**
- **Same-size icon+heading+text cards, nested cards** — the default of most 21st.dev "Features" (191) and "Cards" (1,780) categories; avoid entirely for this system.
- **Hero-metric template** (big number, small label, stats, accent) — 21st.dev's "Stats & KPIs" category is built entirely around this; don't use it.
- **Tracked uppercase eyebrow over every section** — fine as a single named kicker, unchosen grammar if repeated per-section.
- **Numbered section markers (01/02/03)** unless the count is real (see Harry Atkins above for the allowed version).
- **Gradient text; glass/blur as decoration** — Magic UI's `Aurora Text`, `Animated Gradient Text`, `Rainbow Button`, `Neon Gradient Card`; 21st.dev's shader/liquid-metal hero effects and glass-morphism cards are the majority aesthetic of that marketplace — avoid the marketplace's own taste even while borrowing its terminal/ASCII component logic.
- **Colored border >1px on cards/list items/callouts.**
- **Sparklines, progress rings, soft-shadowed rounded rectangles standing in for content.**
- **Monospace as a costume for "technical"** rather than for code/data/measurement — flagged specifically against Magic UI's `Typing Animation`/`Hyper Text` and 21st.dev's `Text Scramble`/`HyperText with Decryption` when used decoratively rather than on real content.
- **Zero-offset colored glow "shadows."** Interfere's ambient purple/pink hero wash is a borderline real-world instance of this — don't reuse verbatim.
- **feTurbulence grain, sketch-doodle SVG, repeating-linear-gradient stripes, ungrounded two-axis grid overlays** — Magic UI's `Noise Texture`, `Retro Grid`, `Dot Pattern`, `Striped Pattern`, `Grid Pattern`, `Interactive Grid Pattern` are exactly this, with nothing real underneath. (The Renaissance Edition's perspective-line overlay is the counter-example of how to earn one.)
- **1px border under a wide soft shadow ("ghost card"); radii above 16px** — Cuberto's current homepage video panel is a live instance of the ghost-card silhouette; treat it as what to avoid, not what to study.
- **Generic device mocks (Safari/iPhone/Android frames), particle/confetti/sparkle effects, playful bounce-button micro-interactions** — wrong register for mythic-tech entirely; these appear throughout Magic UI's "Community" and "Special Effects" categories.

## Techniques that survive the slop list

Concrete devices observed in this research that are genuinely distinctive **and** clear of every refusal above:

1. **Physically-rendered glow instead of CSS glow.** A WebGL/canvas particle or dither field that self-illuminates because it's actually being shaded (Astrodither) reads as "alive" without being a decorative box-shadow — the ruleset bans the shortcut, not the visual outcome.
2. **ASCII/glyph-density as a rendering medium**, not a font choice. Building a shape, a loader, or a portrait out of monospace character mass (Active Theory's preloader; 21st.dev's `Hero ASCII`, `3D ASCII Model Viewer`, `CPU Architecture`) is monospace doing measurement/rendering work — the one context the ruleset explicitly carves out from "monospace as costume."
3. **State exposed as literal syntax.** Rendering real toggles as `( N )` / `( Y )` booleans, or a live viewport-dimension readout, instead of a styled switch component (Harry Atkins) — this is UI chrome that is actually true, which is different from UI chrome that looks technical.
4. **Sequence numbering with a real count.** A project index that counts down a finite, real list (26, 25, 24, 23...) rather than an arbitrary 01/02/03 scaffold.
5. **Diagram-as-subject.** A geometric/perspective construction overlay that is literally what the content is about (Renaissance proportion systems, in the Shopify case) rather than ambient texture behind unrelated copy — this is the test to apply before allowing any grid, blueprint, or line-construction background in the mythic-tech system: does it map to something real (a myth's geography, a constellation, a measurement), or is it wallpaper?
6. **Full-black threshold transitions between scroll scenes**, functioning as a scene-change device with narrative weight (crossing a boundary) rather than a generic crossfade.
7. **Typography-only loading sequences** (percentage counter + one geometric mark, no color) as a lower-risk, higher-craft alternative to spinner/progress-ring loaders.
8. **A single word switching type style mid-headline** (weight, italic, or face) to carry emphasis or a pun, instead of a color/gradient shift.

---

## Sources consulted

- https://magicui.design, https://magicui.design/docs/components
- https://21st.dev, https://21st.dev/s/terminal, https://21st.dev/s/ascii-art
- https://recent.design (godly.website redirects here), https://astrodither.robertborghesi.is/, https://interfere.com/, https://podium.global/, https://harryjatkins.com/, https://gregorcollienne.com/, https://www.meech213.com/, https://www.cathydolle.com/
- https://www.motionsites.co (unreachable — see Section 4)
- "skriiibl" (unresolved — see Section 5)
- https://x.com/raunofreiberg, https://x.com/emilkowalski, https://paco.me, https://rauno.me, https://emilkowal.ski
- https://www.awwwards.com/websites/sites_of_the_day/, https://www.awwwards.com/inspiration_search/editorial%20portfolio/, https://www.shopify.com/editions/winter2026, https://activetheory.net, https://cuberto.com

---
---

# PASS 2 — The Bound Laboratory Notebook (world changed, appended without deleting Pass 1)

**Why this pass exists:** the locked world changed after Pass 1 shipped. Terminal futurism, Greek antiquity, marble, and dark-mode-with-accent are now explicitly OUT (Astrodither, the Shopify Renaissance Edition, and Active Theory's ASCII loader from Pass 1 no longer fit the brief, though they remain good craft references for some *other* project). The new locked world: **the bound laboratory notebook and its protocols** — dense pale cellulose-paper ground with a blue-grey quadrille grid, printed protocols hand-corrected in the margins across successive runs, nothing erased (only struck through and re-entered above), pasted specimen slips at slight rotations, exploded axonometric technical plates (1px keyline, ghosted prior assembly, one flat signal red on the active part, 1:1 call-out boxes, oversized step numerals, dashed leader arrows), and terminal transcripts appearing only as dark plates pasted into the light page — never a global dark-mode toggle.

This pass hunts for genuine implementations of that vocabulary: archive/document design, exploded-diagram technical illustration, marginalia-as-interface, and the strike-through-and-re-enter revision device.

## 8. Archive, catalogue & technical-document design

### Gwern.net
**Source:** https://gwern.net, https://gwern.net/design, https://gwern.net/sidenote
Currently dark-monochrome themed (has a light/dark/auto toggle in the top-right gear menu), but the structure is what matters, not the palette. Wide two-column layout: left rail is a live, auto-generated table of contents with decimal outline numbers (1, 1.1, 1.1.1...) that are real document coordinates, not decoration; body copy sits in a bordered content well with drop caps and true smallcaps. Its own design manifesto (`/design`) names the four governing principles as "aesthetically-pleasing minimalism, accessibility/progressive-enhancement, speed, and a 'semantic zoom' approach" — a hierarchical structure where most information is collapsed/hidden and the reader drills down only as deep as they want, surfaced through hover/tap "popup" annotations of every link. This "semantic zoom" idea — successive layers of annotation revealed on demand rather than flattened into one scroll — is a strong structural cousin of a lab notebook's marginal correction history.

**gwern.net/sidenote specifically** is a literature review of who implements sidenotes well in production, and is itself the single best index for this brief. Named, verifiable implementers pulled directly from its own table of contents: **Tufte-CSS**, **sidenotes.js** (gwern's own, JS-driven reflow — see below), **Ink & Switch**, **Robert Nystrom** (author of *Crafting Interpreters*, uses sidenotes throughout the online book), **Matthew Butterick** (practicaltypography.com — typographer's own site, heavy sidenote use), **Koos Looijesteijn**, **Harvard Law Review**, **Yale Law Journal**, **Knight [First Amendment] Institute**, a *New York* [magazine/Times] implementation, and **The India Forum**. This list alone is a ready-made crawl list for the design team.

**gwern.net/sidenote's own technical argument** (useful for the product spec, not just the mood board): plain Tufte-CSS sidenotes are static and right-margin-only, so they waste the left margin, can overlap each other, get pushed far from their reference point, or break on narrow viewports/smartphones entirely. Gwern's `sidenotes.js` instead dynamically repositions notes into whichever margin has room, reflows on window resize, and partially collapses very long notes. **This is the concrete answer to the coordinator's question about narrow viewports**: the honest options are (a) hide the margin content behind a toggle (Tufte-CSS's approach) or (b) drop it inline, indented, at the point of reference (sidenotes.js's narrow-viewport fallback) — both are legitimate, and the choice should be made deliberately rather than left to default CSS behavior.

### The Public Domain Review
**Source:** https://publicdomainreview.org/, article inspected: https://publicdomainreview.org/essay/parodies-of-pedantry/
The best "real archival artefact integrated into a live editorial layout without looking like a scrapbook" reference found in this pass. Warm off-white/cream ground (not dark), a small-caps tracked eyebrow ("ESSAYS") over a thin 1px hairline rule, a centered classic serif headline set in quotation marks, italic serif deck/subtitle, small-caps byline line. The body text is a single, moderate-width justified serif column — no sidebar clutter. Genuine period artefacts (in the inspected essay: a 1538 title-page woodcut, a period author portrait engraving) are dropped in at full column width, presented completely plainly — no drop shadow, no rotation, no "pinned" skeuomorphism — followed immediately by a small centered *italic* caption in a smaller size: `Title page engraving from Francesco Belo's "Il pedante" (1538) — Source`, where "Source" is a real hyperlink to the holding institution. **The caption-with-attribution-link, not visual scrapbook treatment, is what makes a scanned artefact read as authentic rather than decorative** — worth adopting as a hard rule: every pasted specimen slip in the new system should carry a real, linked provenance line, not just a rotation and a drop shadow.

### Tufte CSS (reference implementation)
**Source:** https://edwardtufte.github.io/tufte-css/
The canonical static implementation gwern's own analysis is responding to: sidenotes and margin notes live permanently in the right margin at a smaller point size than body text, use a `sn-`/`mn-` class-prefix convention, and margin notes (unlike sidenotes) carry no number — only footnote-style notes that are cross-referenced from the body get a running numeral. This distinction (numbered sidenote = tied to a specific claim in the body; unnumbered margin note = ambient commentary) is a useful two-tier system for a notebook interface that needs both "protocol correction tied to a specific line" and "general marginalia."

### Named but not independently re-verified this pass (flagged for the design team's own follow-up, not guessed at)
William Blake Archive (blakearchive.org, redesigned 2016 — image-based edition pairing high-res facsimiles with editorial/bibliographic commentary), Rossetti Archive (rossettiarchive.org, TEI-encoded, one of the founding digital-scholarly-edition projects), David Rumsey Historical Map Collection (davidrumsey.com — 200,000+ scanned maps via a custom LUNA-based viewer with georeferencing tools). All three are real, citable digital-humanities archive projects with reputations for serious interface design, but this pass did not get a rendered screenshot of any of them — treat the descriptions above as search-corroborated leads, not verified technique reports.

## 9. Technical illustration & exploded-diagram references

**Direct finding: there is no strong "someone is drawing real axonometric technical plates natively in browser SVG, at scale, as a design-showcase practice" exemplar.** This was searched from several angles (patent-drawing showcases, aviation/maintenance-manual digitizations, interactive parts catalogues) and the field mostly resolves to either (a) static tutorial content on *how* to build exploded diagrams in Illustrator/SketchUp for print, or (b) iFixit's teardown format, which is photographic rather than drawn. **This is a genuine research gap, not a gap in this search** — report it to the coordinator as-is: the "exploded axonometric SVG plate" is under-explored territory on the web right now, which means the design system can be genuinely distinctive here rather than assembling a pastiche of existing implementations. Treat print-world conventions (below) as the source material to translate, not a web reference to copy.

### iFixit (the working convention to translate)
**Source:** https://www.ifixit.com/Teardown, inspected in detail: https://www.ifixit.com/Teardown/PlayStation+5+Teardown/138280
Structure, observed directly: each numbered **Step** is a large sans-serif numeral at the left margin of its own block, paired with a short title. To its right: a photo (not a drawing) with small circular numbered badges pinned directly onto the point of interest — no leader line in the web version, the badge sits flush on the part itself. A secondary thumbnail strip of 2–4 additional angles sits alongside the primary photo. Body copy is a plain bulleted list to the right of the image, mixing procedural bullets with a distinct icon-marked "caution" bullet (a warning triangle glyph, not colored red as a whole line — just the icon). A persistent right-rail "Tools/Parts you need" module lists real purchasable tools with photos, price, and an add-to-cart action — i.e., the parts list is functionally real, not set-dressing. **The number-badge-pinned-directly-on-the-photographed-object device is the one most directly portable to the notebook world's call-out boxes**, even though iFixit's own execution is photographic rather than drawn.

### Exploded axonometric diagram, general print/technical-illustration convention (from craft literature, not a specific web implementation)
Standard construction, confirmed across multiple technical-illustration sources: viewpoint is from above and diagonally offset (true axonometric, not one-point perspective); parts are displaced along a single shared axis (usually vertical) while preserving relative scale and rotation, so the "explosion" reads as one coherent disassembly rather than scattered pieces; **material/surface distinction is carried by hatching density and line weight, not color** — this is directly relevant to the locked palette's "1px keyline, ghosted prior assembly, one flat signal red on the active part" instruction, since hatching-for-material and a single spot color for the active part is exactly how print technical manuals have always solved this problem, decades before it was a screen convention.

## 10. Marginalia and annotation as an interface pattern

Consolidating findings from Sections 8/9 plus targeted research:

- **gwern.net / sidenotes.js** — best-in-class, dynamic reflow into whichever margin has room, partial collapse of long notes, graceful narrow-viewport fallback (see Section 8 for full technical detail). This is the pattern to actually build from, not just look at.
- **Tufte-CSS** — static right-margin-only baseline; simpler to implement, worse on narrow viewports (content is hidden behind a manual toggle below a breakpoint), but the numbered-sidenote-vs-unnumbered-margin-note distinction is worth keeping regardless of which reflow strategy is chosen.
- **Genius vs. Hypothesis, compared directly** (source: independent UX write-up, not the products' own marketing): Hypothesis keeps its annotation sidebar visible by default, which is "hard to implement without getting in the way of the page design." Genius hides the annotation layer until invoked (click a highlighted passage, layer opens; explicit close control), which reads as the more respectful, less intrusive default. **For a notebook interface where the margin correction *is* the content** (not an optional layer over someone else's text), Hypothesis's always-visible model is actually the better precedent — the annotation is not an intrusion here, it's the point.
- **Variorum/critical-edition digital projects** (William Blake Archive, Rossetti Archive — see Section 8) are the academic tradition sidenotes are descended from: a "variorum reading" is literally a footnote showing the extent of editorial emendation against a base text, which is close to a direct textual analogue of "protocol corrected by hand across successive runs."
- **Narrow-viewport handling, the actual open question the coordinator asked about** — there are only two honest answers in circulation: collapse-and-toggle (Tufte-CSS) or reflow-inline-at-point-of-reference (sidenotes.js). A third, not seen in the wild but consistent with the locked world's own logic: since revisions in this world are pasted-in specimen slips and hand corrections rather than typeset marginalia, a narrow viewport could stack the correction *below* its protocol line as a visually distinct "pasted-in" block (rotated a degree or two, per the world's own vocabulary) rather than hiding it — turning the constraint into the same device the desktop layout already uses, instead of a compromise.

## 11. The strike-through-and-re-enter device

This is the hardest of the five asks to source well — direct findings:

- **Wikipedia diff view** (en.wikipedia.org, any article's "View history" → compare revisions) is the most-seen implementation of "old and new both stay visible" on the entire web: removed text is struck through in a highlighted color, added text is highlighted in a second color, both inline in running prose. Done well for its narrow purpose (auditing exactly what changed between two revisions) but it's forensic, not editorial — nobody is meant to *read* a Wikipedia diff as prose, only to audit it.
- **GitHub pull-request diffs** are the same pattern in code: red struck-through line above, green added line below, both visible. Same caveat — built for audit, not for narrative reading, and it's fundamentally a code convention, not a prose one.
- **Manubot** (scholarly-publishing/manuscript tool, surfaced via search, not independently screenshotted this pass) reportedly uses Markdown strikethrough directly in published scholarly text to cross out an erroneous sentence in place, specifically so the correction's *history* stays legible to readers rather than silently vanishing — this is the closest match found to the coordinator's brief of "the agent revises its own procedures and the history stays legible." Flagged as a lead worth the design team verifying directly rather than a confirmed visual reference.
- **keepachangelog.com** documents the *convention* of a changelog (Added/Changed/Deprecated/Removed sections, semantic versioning) but its own site only shows the practice as a raw Markdown code block, not a rendered example of struck-through superseded text — useful for the taxonomy of "what a good changelog entry says," not for how struck-through revision should look on a page.
- **Direct gap, worth reporting plainly:** no strong example of the strike-through-and-re-enter device used *editorially* (in prose, for a general reader, as a deliberate storytelling device rather than a forensic code/wiki-audit tool) turned up anywhere in this search. The closest analogues are all either code-review tooling or wiki-audit tooling — both built for engineers/editors checking each other's work, not for a reader following a narrative of revision. **This means the device is genuinely undersourced on the web and the product would be building somewhat new territory here** — which cuts two ways: it's a real opportunity for distinctiveness (nobody else owns this pattern for a general reader), and it's a real execution risk (there's no proven layout to lean on, so it needs its own usability pass rather than a "steal this" reference).

## 12. Same galleries, re-hunted for the new world

- **recent.design** (godly.website) — re-checked the live current feed. Nothing currently featured reads as archival/paper/document-metaphor; the feed is dominated by dark-SaaS, photography-portfolio, and agency sites (see Pass 1, Section 3, for the entries themselves — Astrodither, Interfere, Podium, Harry Atkins were all sourced from this same feed and are now off-brief per the coordinator's note, though Harry Atkins' *ledger-as-index* composition lesson — real sequential counts, functional state exposed as literal text — still transfers structurally to a lab-notebook world even though its visual register doesn't).
- **Awwwards** — re-ran the editorial-portfolio inspiration search and the general SOTD feed with an eye for paper/scientific/archival framing; nothing in the current rotation matched (see Pass 1, Section 7, for what was found there — the Renaissance Edition and Active Theory are now explicitly off-brief). No dedicated "archive" or "scientific" tag exists in Awwwards' own taxonomy to filter by, which is itself a small confirming data point that this aesthetic is genuinely underrepresented in the award-showcase ecosystem the client is otherwise drawing from.
- **movin.design / landing.love** (the motionsites.co substitutes identified in Pass 1) — not re-crawled this pass; flagging that a targeted look for "document reveal," "page turn," or "paste-in" motion patterns on these two would be the logical next step if the coordinator wants Pass 3 to cover motion specifically for this world.
- **motionsites.co** — still does not resolve (re-confirmed no change since Pass 1).
- **"skriiibl"** — not re-attempted this pass, per the coordinator's explicit instruction to leave this one for the client rather than have this pass guess further.

## Pass 2 — Patterns to steal

1. **Provenance-linked captions on every pasted/scanned artefact** (Public Domain Review) — a small italic caption with a real hyperlink to the holding source is what separates an authentic archival object from scrapbook decoration. Apply this as a hard rule to every "tipped-in specimen slip."
2. **Numbered sidenote vs. unnumbered margin note as two distinct registers** (Tufte-CSS) — use the numbered form when a note is tied to one specific claim/line (a protocol correction), the unnumbered form for ambient commentary.
3. **Dynamic margin reflow with a graceful narrow-viewport fallback, not a hidden toggle by default** (gwern.net's sidenotes.js) — the annotation is core content in this world, not an optional footnote; treat it accordingly in the responsive strategy (see Section 10's proposed "correction pasted below its line, rotated, on narrow viewports" approach).
4. **Number-badge pinned directly on the object, no leader line needed when the badge sits flush on the part** (iFixit) — simpler and more legible than a dashed leader arrow when the call-out point is unambiguous; save leader lines for when the label genuinely can't sit on the part itself.
5. **Hatching density and line weight to distinguish material/surface, one flat spot color reserved for the single active part** (exploded-diagram convention) — this is the print-world technique the locked palette's "1px keyline, ghosted prior assembly, one flat signal red" instruction is already describing; it has decades of proven legibility behind it.
6. **Decimal outline numbering as a real document coordinate system** (gwern.net's 1/1.1/1.1.1 TOC) — numbers that address a specific location in a real hierarchy, not decorative section counters.
7. **Two-tier annotation visibility precedent** (Genius vs. Hypothesis) — for this world specifically, default the correction/annotation layer to visible (Hypothesis's model), since the marginalia is the point, not an intrusion on someone else's text.

## Pass 2 — Patterns to avoid (in addition to the Pass 1 slop list, which still applies in full)

- **Skeuomorphic "pinned paper" clichés** — drop shadows under every scanned image, rotation applied uniformly to every artefact regardless of whether it's meant to read as "recently tipped in" vs. "part of the original protocol," corkboard/cork-texture backgrounds, washi-tape corner decorations. The locked world calls for *slight* rotation on specimen slips specifically — not a blanket scrapbook treatment on every image.
- **Forensic diff/audit UI borrowed wholesale for editorial revision** — a raw Wikipedia-style colored diff or a GitHub-style red/green line pair reads as "engineering tool," not "notebook in a reader's hands." If the strike-through device is used, it needs its own typographic treatment (ink-color strikethrough, hand-correction feel) rather than the code-review chrome (gutter icons, line numbers, monospace diff font) that both Wikipedia and GitHub default to.
- **Generic "vintage paper" texture-pack treatment** — 2026 design-trend searches surfaced a wave of "distressed paper, heavy creases, vintage yellowing" as a streetwear/indie-brand cliché; the locked world's "dense pale cellulose paper with a blue-grey quadrille grid" is a precise, functional material, not a nostalgia filter. Avoid generic paper-texture JPEG overlays entirely.
- **Grid-as-wallpaper, again** — the same refusal from Pass 1 applies with extra force here: the quadrille grid must function as a *real alignment system* (things snap to it, measurements reference it) or it is exactly the ungrounded decorative grid Pass 1 already flagged as slop, just in a lighter palette.

## Pass 2 — Two open items for the coordinator, recorded rather than resolved

- **motionsites.co** does not resolve (DNS failure), confirmed again this pass with no change. See Pass 1, Section 4 for the substitute galleries found (movin.design, landing.love).
- **"skriiibl"** remains unlocatable after 8+ search variants across both passes (exact string, phonetic near-misses, platform-scoped searches on Instagram/Behance/X/Pinterest/Are.na). Not re-attempted this pass per instruction — recommend resolving directly with the client.

## Pass 2 — Sources consulted

- https://gwern.net, https://gwern.net/design, https://gwern.net/sidenote
- https://publicdomainreview.org/, https://publicdomainreview.org/essay/parodies-of-pedantry/
- https://edwardtufte.github.io/tufte-css/
- https://www.ifixit.com/Teardown, https://www.ifixit.com/Teardown/PlayStation+5+Teardown/138280
- https://www.inkandswitch.com/ (currently showing a special interactive anniversary piece, not its standard essay layout — treat as unverified this pass), https://www.inkandswitch.com/local-first/
- https://keepachangelog.com/en/1.1.0/
- William Blake Archive (blakearchive.org), Rossetti Archive (rossettiarchive.org), David Rumsey Historical Map Collection (davidrumsey.com) — search-corroborated, not independently screenshotted this pass
- https://recent.design (re-checked), https://www.awwwards.com/inspiration_search/editorial%20portfolio/ (re-checked)
- https://www.motionsites.co (still unreachable)
