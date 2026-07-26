# Direction calibration — the author reacted to real sites

**Status: this is the input `05-direction-exploration.md` said was missing.** That file's
best suggestion for unblocking the design question was:

> "The author may be judging against an internal reference not yet articulated.
> landonorris.com was the one concrete example given and it was informative. More
> examples — three or four sites they actually admire, with what specifically works —
> would be worth more than any further generation."

On 2026-07-26 that happened. Ten sites were put in front of the author, each one visited
and screenshotted rather than described from a listicle, and each got a specific
reaction. This file records them, because reactions to real work are the most valuable
design input this project has and they must not be lost the way the prototypes nearly
were.

---

## The reactions, verbatim in substance

**Ranked as aesthetic direction:**

| | Site | The author's reaction |
|---|---|---|
| 1= | **activetheory.net** | "What did I even just watch. Incredible design and animations, the effects and 3d are breathtaking." |
| 1= | **igloo.inc** | "Favorite design and creative technology, totally shocked." |
| 3 | **lusion.co** | "Nice 3d effects, could be used once or twice." |
| 4 | **landonorris.com** | "Components and effects are through the roof, totally fan of the variety of animations and integrations. **Not my favorite colors.**" |
| 5 | **basement.studio** | "Very nice flows and effects, could be used once, quite original. The rest of the website is basic." |
| 6 | **bruno-simon.com** | "Impressive technology, not sure how it could fit on our platform." |
| 7 | **press.stripe.com** | "Interesting effects, quite monotone and repetitive." |
| 8 | **by-kin.com** | "Interesting but not really my style." |

**Named as *functional* rather than aesthetic** — features to implement, not looks to copy:

- **linear.app** — "fantastic features that can/should be implemented in the courses."
- **ciechanow.ski** — "great 3d and visualizations, could also be used sporadically."

That distinction is the author's own and it is worth preserving: two of the ten were
filed under what the guide should *do*, not how it should look.

---

## The correction that unblocks this

An earlier note in this session told the author that Active Theory sits in banned cluster
#2. **That was wrong, and the error mattered**, because it labelled their favourite site
as forbidden by their own rules.

`01-reference-sites.md` §"Active Theory (studio site)" had already evaluated it and
approved it, in these words: an ASCII/glyph-density circle, *"dim teal-on-black, no color
gradient, no box-glow… monospace used as literal procedural/generative rendering, not as
a technical-sounding costume."* It is filed there as an example of techniques that
**survive** the slop list.

The banned-cluster label belongs to **prototype `09-the-field.html`**, where this
project's own execution of that idea was near-black + neon + CSS glow. `05` records the
author liked the *idea* and the execution was rejected.

**So the rule was never the blocker.** The distinction the ruleset actually draws:

| Banned | Sanctioned |
|---|---|
| `box-shadow` glow, gradient chrome, neon accents applied as decoration | Luminance that comes out of real geometry, real lighting, or real procedural density |
| A dark surface with effects painted on it | A dark surface with something actually rendered in it |

Active Theory and Igloo are both on the right-hand side. Prototype 09 was on the left.
Thirteen prototypes did not converge partly because that line was being drawn in the
wrong place — the look was refused when only the shortcut should have been.

---

## What this says the direction is

Cold, dark, and genuinely rendered. Specifically, and each point traceable to a reaction
above rather than to taste:

1. **Real 3D with real lighting, not effects on a flat surface.** Igloo (#1) and Lusion
   (#3) both win on this; Stripe Press was marked down as "monotone and repetitive"
   precisely because its 3D is a repeated static object rather than a place.
2. **Wireframe or glyph structure drawn over rendered form.** Igloo's constellation lines
   over terrain; Active Theory's glyph-density disc. Both are structure made of real
   marks. This is also, exactly, what a curriculum graph over a rendered field would be.
3. **Variety of components and integrations.** Lando Norris was praised for "the variety
   of animations and integrations" while its palette was rejected — so the lesson from it
   is the component range, not the light ground.
4. **A signature moment, used once.** Basement and Lusion were both marked "could be used
   once or twice." Those are set pieces, not a system.
5. **The palette is already right.** `--void` is a cool near-black with a green-blue bias
   and `--ice` is a cool white; Active Theory's dim-teal-on-black is a near neighbour.
   Nothing in the token table needs to change for this direction.

**And what it is not.** by-kin's editorial restraint was rejected outright, and Stripe
Press's repetition was called out. That is a direct verdict on the current Substrate
build, which is closer to by-kin than to anything in the top three.

---

## Where the functional half goes

Linear and Ciechanowski were filed separately by the author, and the separation should
hold in the build:

- **Linear** — density, keyboard-first navigation, real product surfaces shown rather
  than described, and the discipline that keeps a dark page readable at length. It is
  also the only site in the whole set that carries a real reading load, which is the
  constraint every one of the others gets to ignore.
- **Ciechanowski** — operable figures *inside* the prose. Every diagram is a thing you
  drive rather than look at. The guide already has six static plates and a scrubbing
  engine; this is the bar they should be raised to, sporadically rather than everywhere.

---

## The constraint that still binds

Four of the five top-ranked sites carry almost no text. Igloo, Active Theory, Lusion and
Basement are experiences you pass through in ninety seconds; this guide is fifty-one
lessons someone studies. Whatever is taken from them has to survive being placed next to
two thousand words of prose.

That tension is real and it is not a reason to refuse the direction — it is the thing the
first build has to prove. Test it on one surface before committing the whole system to it.
