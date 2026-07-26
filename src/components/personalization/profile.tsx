'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { getServerSnapshot, getSnapshot, subscribe } from '@/lib/guide-store'
import { RELEASES, isLive, isoDay, rankFor, skillTree } from '@/lib/mastery'

/**
 * The profile: your agent, as the guide has built it.
 *
 * Everything here is computed from what the reader actually earned, and nothing is
 * softened. If the streak is broken it says broken; if nothing has been mastered the
 * agent is at v0.2.0, which is a real release rather than a polite zero. The single
 * rule from `decisions.md` 010 holds throughout — every surface is a true thing about
 * Hermes, so a governance reader looking over a shoulder sees a version ladder and a
 * skill tree, not a scoreboard.
 */

export function Profile({ total }: { total: number }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const { mastered, streak } = snapshot.state.mastery
  const today = isoDay(new Date())

  const rank = rankFor(mastered.length, total)
  const tree = skillTree(mastered)
  const live = isLive(streak, today)

  if (!snapshot.hydrated) {
    // Reserved height rather than a spinner: this page is entirely stored state, so a
    // spinner would be the whole page flashing.
    return <div className="h-[32rem]" aria-hidden="true" />
  }

  return (
    <div className="space-y-[calc(var(--step)*2)]">
      <section>
        {/* Not "Your agent": the page's h1 already says that, and two headings with the
            same name is a genuine navigation problem for anyone moving by heading. */}
        <h2 className="font-mono text-[0.7rem] tracking-[0.08em] text-ice-dim uppercase">
          Version
        </h2>
        <p className="font-display mt-[calc(var(--step)*0.5)] text-[2.6rem] leading-[1] tracking-[-0.02em]">
          {rank.release.version}
        </p>
        <p className="mt-[calc(var(--step)*0.3)] font-mono text-[0.8rem] text-ice-dim">
          {rank.release.name ? `${rank.release.name} · ` : ''}
          {rank.release.date}
        </p>

        <p className="mt-[calc(var(--step)*0.75)] max-w-[62ch] text-[0.95rem] leading-[1.7] text-ice-dim">
          {rank.next ? (
            <>
              {mastered.length} of {total} lessons mastered.{' '}
              <span className="text-ice">
                {rank.toNext} more {rank.toNext === 1 ? 'reaches' : 'reach'} {rank.next.version}
              </span>
              {rank.next.name ? `, ${rank.next.name}` : ''}.
            </>
          ) : (
            <>
              All {total} lessons mastered — the release this whole guide is verified
              against. There is nothing above this rung.
            </>
          )}
        </p>

        {/* The ladder itself, because the progression is also the release history and
            reading it is worth as much as climbing it. */}
        <ol className="mt-[calc(var(--step)*1)] flex flex-wrap gap-x-1 gap-y-1" aria-label="Release ladder">
          {RELEASES.map((release, index) => (
            <li
              key={release.version}
              title={`${release.version} · ${release.date}${release.name ? ` · ${release.name}` : ''}`}
              // Unreached rungs are `--ice-dim`, not `--ice-faint`. The rungs are
              // meaningful graphics rather than decoration — you cannot read the ladder
              // without seeing how long it is — so WCAG 1.4.11 wants 3:1 against the
              // ground, and `--ice-faint` is 2.85:1. Axe does not catch this because it
              // does not evaluate custom graphics; the rule still applies.
              className={`h-1.5 w-8 ${index <= rank.step ? 'bg-ice' : 'bg-ice-dim'}`}
            >
              <span className="sr-only">
                {release.version}
                {index <= rank.step ? ' reached' : ' not yet reached'}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-ice-faint pt-[calc(var(--step)*1)]">
        <h2 className="font-mono text-[0.7rem] tracking-[0.08em] text-ice-dim uppercase">
          Uptime
        </h2>
        <p className="mt-[calc(var(--step)*0.5)] text-[0.95rem] leading-[1.7]">
          {streak.days === 0 ? (
            <span className="text-ice-dim">No days recorded yet.</span>
          ) : live ? (
            <>
              <span className="text-ice">{streak.days} consecutive {streak.days === 1 ? 'day' : 'days'}</span>
              <span className="text-ice-dim">
                {streak.longest > streak.days ? ` · longest ${streak.longest}` : ''}
              </span>
            </>
          ) : (
            // A stored streak is a record of what happened, never a claim about now.
            <span className="text-ice-dim">
              Last run {streak.lastDay}. The {streak.days}-day run has ended; longest was{' '}
              {streak.longest}.
            </span>
          )}
        </p>
      </section>

      <section className="border-t border-ice-faint pt-[calc(var(--step)*1)]">
        <h2 className="font-mono text-[0.7rem] tracking-[0.08em] text-ice-dim uppercase">
          Skill library
        </h2>
        {tree.length === 0 ? (
          <p className="mt-[calc(var(--step)*0.5)] max-w-[62ch] text-[0.95rem] leading-[1.7] text-ice-dim">
            Empty. A lesson is mastered by answering its check or by driving its console
            objective, and each one writes a skill here — in the namespaced layout the
            real binary uses.{' '}
            <Link href="/hermes/" className="text-ice underline">
              Start the curriculum
            </Link>
            .
          </p>
        ) : (
          <pre className="mt-[calc(var(--step)*0.5)] overflow-x-auto font-mono text-[0.78rem] leading-[1.7] text-ice-dim">
            {'~/.hermes/skills/\n'}
            {tree.map((group, groupIndex) => {
              const lastGroup = groupIndex === tree.length - 1
              return (
                `${lastGroup ? '└──' : '├──'} ${group.namespace}/\n` +
                group.skills
                  .map((skill, index) => {
                    const lastSkill = index === group.skills.length - 1
                    const stem = lastGroup ? '    ' : '│   '
                    return `${stem}${lastSkill ? '└──' : '├──'} ${skill.name}/`
                  })
                  .join('\n') +
                '\n'
              )
            })}
          </pre>
        )}
      </section>
    </div>
  )
}
