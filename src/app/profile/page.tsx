import type { Metadata } from 'next'
import Link from 'next/link'
import { Profile } from '@/components/personalization/profile'
import { Page } from '@/components/ui/page'
import { lessons } from '@/lib/content'
import { RELEASES } from '@/lib/mastery'

/**
 * `/profile/` rather than `decisions.md` 010's `/~`.
 *
 * The tilde was the diegetic choice and it is a foot-gun: a directory literally named
 * `~` in a repository is one careless `rm -rf ~` away from deleting someone's home
 * directory, and it confuses half the shell tooling that touches this project. The
 * route name is the one place where being clever is not worth it.
 */
export const metadata: Metadata = {
  title: 'Your agent',
  description:
    'What you have mastered, rendered as the agent you have built: its version on the real release ladder, its uptime, and its skill library.',
  // Stored state only, so there is nothing here for a crawler and nothing it should
  // rank. The page is real, and it is personal to one browser.
  robots: { index: false, follow: true },
}

export default function ProfilePage() {
  const total = lessons.length

  return (
    <Page>
      <article>
        <h1 className="font-display text-[2.375rem] leading-[1.05] tracking-[-0.02em]">
          Your agent
        </h1>
        <p className="mt-[calc(var(--step)*0.75)] max-w-[62ch] text-[1.125rem] leading-[1.5] text-ice-dim">
          Everything below is computed from what you have actually mastered, and it lives
          only in this browser. There is no account, no server, and nothing to sign in to.
        </p>

        <hr className="mt-[var(--step)] mb-[calc(var(--step)*1.5)] border-ice-faint" />

        <Profile total={total} />

        <section className="mt-[calc(var(--step)*2)] border-t border-ice-faint pt-[calc(var(--step)*1)]">
          <h2 className="font-mono text-[0.7rem] tracking-[0.08em] text-ice-dim uppercase">
            How the ladder works
          </h2>
          <p className="mt-[calc(var(--step)*0.5)] max-w-[62ch] text-[0.95rem] leading-[1.7] text-ice-dim">
            Your agent&rsquo;s version climbs Hermes&rsquo;s real release history — all{' '}
            {RELEASES.length} tagged releases from {RELEASES[0]!.version} on{' '}
            {RELEASES[0]!.date} to {RELEASES[RELEASES.length - 1]!.version} on{' '}
            {RELEASES[RELEASES.length - 1]!.date}, patch releases included. Reaching
            v0.13.0 tells you something true while it rewards you: that is where the
            multi-agent Kanban board actually arrived, not v0.6.0, which was Profiles and
            is the version most write-ups get wrong.
          </p>
          <p className="mt-[calc(var(--step)*0.5)] max-w-[62ch] text-[0.95rem] leading-[1.7] text-ice-dim">
            Mastery is not the same as reading. Marking a lesson read is your own note to
            yourself and you can change it freely; mastering one means answering its check
            or driving its console objective, and that is what moves the ladder.{' '}
            <Link href="/hermes/" className="text-ice underline">
              The curriculum
            </Link>{' '}
            is where both happen.
          </p>
        </section>
      </article>
    </Page>
  )
}
