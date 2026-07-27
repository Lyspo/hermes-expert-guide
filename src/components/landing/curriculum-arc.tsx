import Link from 'next/link'
import { curriculumGraph } from '@/lib/curriculum-graph'
import type { CurriculumModule } from '@/lib/content'

/**
 * The ten modules, placed where they actually sit in the material.
 *
 * `design.md` asks for sequence to be spatial — *"a view of the structure rather than a
 * table of contents drawn to look like one"* — and until now the landing page's module
 * list was precisely the thing that sentence refuses: number, title, count, ten times,
 * in a 52rem column with half the viewport empty beside it.
 *
 * What makes it a view of the structure is that the horizontal position is real. Each
 * lesson is marked at its **prerequisite depth**, the longest chain of prerequisites
 * ending at it, computed by `graph.ts` from the lessons' own frontmatter — the same
 * number the curriculum map and the lesson masthead are drawn from. So this is not a
 * picture of the module list; it is the module list seen from the side.
 *
 * It answers a question a table of contents cannot: **where can I get in.** Module 9
 * has a lesson at depth 4 and module 8 does not start until depth 8, which is the
 * difference between a module you can reach for early and one that assumes eight
 * lessons of chain behind it. Reading order and prerequisite order are not the same
 * thing, and the gap between them is worth showing rather than describing.
 *
 * Deliberately module-level. `/hermes/` draws the lesson graph and lists every lesson
 * with its prose; that is the browsing surface. Repeating it here would make the
 * landing a worse copy of it, and this project has already learned once what happens
 * when two surfaces draw the same structure.
 *
 * Server-rendered, no canvas, no client JavaScript. The marks are `aria-hidden` and
 * carry nothing of their own: every module is a real link, and the depth each mark
 * encodes is also printed as text at the end of its row.
 */

interface Span {
  /** Prerequisite depth of every lesson in the module, shallowest first. */
  depths: number[]
  min: number
  max: number
}

/** Depths per module, from the same graph `/hermes/` is drawn from. */
export function spans(): Map<number, Span> {
  const byModule = new Map<number, number[]>()
  for (const node of curriculumGraph.nodes) {
    const list = byModule.get(node.moduleNumber) ?? []
    list.push(node.depth)
    byModule.set(node.moduleNumber, list)
  }

  const result = new Map<number, Span>()
  for (const [moduleNumber, depths] of byModule) {
    const sorted = [...depths].sort((a, b) => a - b)
    result.set(moduleNumber, {
      depths: sorted,
      min: sorted[0] ?? 0,
      max: sorted[sorted.length - 1] ?? 0,
    })
  }
  return result
}

/**
 * One lesson, as a mark on the depth axis.
 *
 * `left` is interpolated over `100% - 2px` rather than over `100%`, so depth 0 sits
 * flush at the start of the track and the deepest lesson sits flush at its end. With a
 * plain percentage the last mark hangs half outside the track and the axis quietly
 * stops meaning what its labels say.
 *
 * The fill is translucent on purpose. Lessons that share a depth land on the same spot,
 * and translucent marks accumulate there — so a module with three lessons at depth 5
 * is brighter at 5 than one with a single lesson. That is luminance coming out of
 * density, which is the first rule the arrival surface set, rather than a value picked
 * to look right.
 */
function Mark({ depth, maxDepth }: { depth: number; maxDepth: number }) {
  return (
    <span
      className="absolute top-0 h-full w-[2px]"
      style={{
        left: `calc(${maxDepth === 0 ? 0 : depth / maxDepth} * (100% - 2px))`,
        backgroundColor: 'color-mix(in srgb, var(--color-ice) 46%, transparent)',
      }}
    />
  )
}

/**
 * The module's reach: a hairline from its shallowest lesson to its deepest.
 *
 * Interpolated over the same `100% - 2px` the marks are, so the ends of the line land
 * on the middle of the first and last mark instead of a mark-width away from them.
 */
function Reach({ span, maxDepth }: { span: Span; maxDepth: number }) {
  const scale = maxDepth === 0 ? 0 : 1 / maxDepth
  return (
    <span
      className="absolute top-1/2 h-px bg-ice-faint"
      style={{
        left: `calc(${span.min * scale} * (100% - 2px))`,
        width: `calc(${(span.max - span.min) * scale} * (100% - 2px) + 2px)`,
      }}
    />
  )
}

export function CurriculumArc({ modules }: { modules: readonly CurriculumModule[] }) {
  const byModule = spans()
  const { maxDepth } = curriculumGraph

  return (
    <div>
      {/*
        One legend for ten rows, which is a different thing from a caption on every
        device. It is here because "depth" is a real term this site uses on the map and
        in the lesson margin, and because an axis whose units are unstated is decoration.
      */}
      <p className="max-w-[62ch] text-[0.9rem] leading-[1.75] text-ice-dim">
        Each mark is a lesson, placed at its prerequisite depth — the longest chain of
        lessons that has to come first. Reading order and prerequisite order are not the
        same thing, and where they differ is where you can get in early.
      </p>

      <ol data-modules className="mt-[calc(var(--step)*1.5)]">
        {modules.map((entry) => {
          const span = byModule.get(entry.number)
          return (
            <li
              key={entry.url}
              /* Every cell is placed explicitly rather than left to auto-flow. Auto
                 placement put the full-width track on row two and then pushed the
                 lesson count onto a third row of its own, orphaned under the left
                 edge — the track is the only cell that spans, and a spanning cell
                 makes everything after it wrap. */
              className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-baseline gap-x-[calc(var(--step)*0.6)] gap-y-[calc(var(--step)*0.35)] border-t border-ice-faint py-[calc(var(--step)*0.6)] lg:grid-cols-[auto_minmax(0,18rem)_minmax(0,1fr)_3rem_3rem] lg:gap-x-[calc(var(--step)*1)]"
            >
              <span className="shrink-0 font-mono text-[0.7rem] text-ice-dim">
                {String(entry.number).padStart(2, '0')}
              </span>
              <Link href={entry.url}>{entry.title}</Link>

              {/* The axis. Below `lg` it takes the full row under the title rather than
                  being squeezed into a column too narrow for twelve positions to be
                  distinguishable — a scale you cannot read positions off is not a
                  scale, and the depth range beside it says the same thing in words. */}
              <div
                aria-hidden="true"
                className="relative col-span-4 col-start-1 row-start-2 h-[0.85rem] lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:h-[1.05rem]"
              >
                {/* The rule spans the module's own reach, not the whole axis. Drawn
                    full width — which is what a shared scale wants to be — every row
                    looks like it covers 0 to 11 and the ticks read as marks on a bar
                    rather than as positions. Here the line *is* the span and the ticks
                    are the lessons in it, so the staircase down the page is the
                    curriculum getting deeper and nothing has to say so. */}
                {span && <Reach span={span} maxDepth={maxDepth} />}
                {span?.depths.map((depth, index) => (
                  <Mark key={`${depth}-${index}`} depth={depth} maxDepth={maxDepth} />
                ))}
              </div>

              {/* Right-aligned in fixed columns rather than sized to their contents:
                  `0–1` and `5–10` are different widths, and auto columns let every
                  row's numbers start somewhere slightly different down a stack of ten.

                  Shown at every width, which it was not at first. Hiding it below `lg`
                  left the depth range nowhere at all on a phone — the marks that
                  encode it are `aria-hidden`, so `display: none` here does not degrade
                  the fact, it deletes it. */}
              <span className="col-start-3 row-start-1 text-right font-mono text-[0.7rem] tabular-nums text-ice-dim lg:col-start-4">
                {span ? (span.min === span.max ? span.min : `${span.min}–${span.max}`) : '—'}
              </span>
              <span className="col-start-4 row-start-1 shrink-0 text-right font-mono text-[0.7rem] tabular-nums text-ice-dim lg:col-start-5">
                {entry.lessons.length}
              </span>
            </li>
          )
        })}
      </ol>

      {/* The axis is labelled once, under the whole stack, because it is one axis
          shared by ten rows rather than ten axes that happen to match — and the two
          trailing columns are named here rather than beside every row, for the same
          reason. Two unlabelled mono numbers at the end of a row are a guess. */}
      <p
        aria-hidden="true"
        className="mt-[calc(var(--step)*0.5)] hidden font-mono text-[0.65rem] text-ice-dim lg:grid lg:grid-cols-[auto_minmax(0,18rem)_minmax(0,1fr)_3rem_3rem] lg:gap-x-[calc(var(--step)*1)]"
      >
        <span className="invisible">00</span>
        <span />
        <span className="flex justify-between">
          <span>depth 0</span>
          <span>{maxDepth}</span>
        </span>
        <span className="text-right">reach</span>
        <span className="text-right">lessons</span>
      </p>
    </div>
  )
}
