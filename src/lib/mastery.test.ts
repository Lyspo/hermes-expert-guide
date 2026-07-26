import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  RELEASES,
  advanceStreak,
  emptyStreak,
  isLive,
  isoDay,
  rankFor,
  skillFor,
  skillTree,
} from './mastery'

describe('the release ladder is the real one', () => {
  const corpus = readFileSync(
    fileURLToPath(new URL('../../research/03-ecosystem.md', import.meta.url)),
    'utf8'
  )

  it('has all 22 tagged releases', () => {
    // `[03]` states the count in its own words; if the table ever disagrees with the
    // ladder, this is where it surfaces.
    expect(RELEASES).toHaveLength(22)
    expect(corpus).toContain('All 22 tagged releases')
  })

  it('every version and date appears in the corpus', () => {
    for (const release of RELEASES) {
      expect(corpus, `${release.version} missing`).toContain(`| ${release.version} |`)
      expect(corpus, `${release.date} missing`).toContain(release.date)
    }
  })

  it('keeps the patch releases rather than tidying them away', () => {
    const versions = RELEASES.map((release) => release.version)
    expect(versions).toContain('v0.15.1')
    expect(versions).toContain('v0.18.1')
    expect(versions).toContain('v0.18.2')
  })

  it('runs oldest to newest', () => {
    const dates = RELEASES.map((release) => release.date)
    expect([...dates].sort()).toEqual(dates)
  })

  it('names v0.6.0 as the multi-instance release, not the orchestration one', () => {
    // The correction the whole guide leads with: v0.6.0 was Profiles.
    const v6 = RELEASES.find((release) => release.version === 'v0.6.0')
    expect(v6?.name).toBe('the multi-instance release')
  })
})

describe('rankFor', () => {
  const TOTAL = 51

  it('starts every agent at the earliest real release', () => {
    const rank = rankFor(0, TOTAL)
    expect(rank.release.version).toBe('v0.2.0')
    expect(rank.next?.version).toBe('v0.3.0')
  })

  it('tops out at the release the guide is verified against', () => {
    const rank = rankFor(TOTAL, TOTAL)
    expect(rank.release.version).toBe('v0.19.0')
    expect(rank.next).toBeNull()
    expect(rank.toNext).toBe(0)
  })

  it('never leaves the ladder, whatever it is handed', () => {
    for (const mastered of [-5, 0, 1, 25, 50, 51, 99]) {
      const rank = rankFor(mastered, TOTAL)
      expect(rank.step).toBeGreaterThanOrEqual(0)
      expect(rank.step).toBeLessThan(RELEASES.length)
    }
  })

  it('advances monotonically', () => {
    let previous = -1
    for (let mastered = 0; mastered <= TOTAL; mastered++) {
      const { step } = rankFor(mastered, TOTAL)
      expect(step).toBeGreaterThanOrEqual(previous)
      previous = step
    }
  })

  /** The number shown to a reader has to be the number that actually advances them. */
  it('reports a toNext that really does reach the next release', () => {
    for (let mastered = 0; mastered < TOTAL; mastered++) {
      const rank = rankFor(mastered, TOTAL)
      if (!rank.next) continue
      expect(rank.toNext).toBeGreaterThan(0)
      const after = rankFor(mastered + rank.toNext, TOTAL)
      expect(after.step, `from ${mastered}, +${rank.toNext} should advance`).toBeGreaterThan(
        rank.step
      )
    }
  })

  it('survives a zero total without dividing by it', () => {
    expect(() => rankFor(0, 0)).not.toThrow()
    expect(rankFor(0, 0).release.version).toBe('v0.2.0')
  })
})

describe('skills', () => {
  it('uses the namespaced path the capture recorded, not the documented one', () => {
    const skill = skillFor('hermes/06-skills-and-the-loop/05-the-nudge-and-the-review-fork')
    expect(skill.namespace).toBe('skills-and-the-loop')
    expect(skill.name).toBe('the-nudge-and-the-review-fork')
    // [09] §13. [02] §2 gives the un-namespaced form and is wrong.
    expect(skill.path).toBe(
      '~/.hermes/skills/skills-and-the-loop/the-nudge-and-the-review-fork/'
    )
  })

  it('drops the ordering prefixes, which are metadata rather than names', () => {
    expect(skillFor('hermes/01-first-contact/02-the-agent-loop').name).toBe('the-agent-loop')
  })

  it('groups by namespace, in order', () => {
    const tree = skillTree([
      'hermes/06-skills-and-the-loop/05-b',
      'hermes/01-first-contact/02-a',
      'hermes/06-skills-and-the-loop/01-a',
    ])
    expect(tree.map((group) => group.namespace)).toEqual(['first-contact', 'skills-and-the-loop'])
    expect(tree[1]!.skills.map((skill) => skill.name)).toEqual(['a', 'b'])
  })

  it('does not fall over on a malformed id', () => {
    expect(() => skillFor('nonsense')).not.toThrow()
    expect(() => skillFor('')).not.toThrow()
  })
})

describe('uptime', () => {
  it('starts at one day', () => {
    expect(advanceStreak(emptyStreak, '2026-07-26')).toEqual({
      lastDay: '2026-07-26',
      days: 1,
      longest: 1,
    })
  })

  it('extends on a consecutive day and records the longest', () => {
    let streak = advanceStreak(emptyStreak, '2026-07-24')
    streak = advanceStreak(streak, '2026-07-25')
    streak = advanceStreak(streak, '2026-07-26')
    expect(streak).toEqual({ lastDay: '2026-07-26', days: 3, longest: 3 })
  })

  it('is a no-op on the same day', () => {
    const once = advanceStreak(emptyStreak, '2026-07-26')
    expect(advanceStreak(once, '2026-07-26')).toEqual(once)
  })

  it('resets after a gap but keeps the record', () => {
    let streak = advanceStreak(emptyStreak, '2026-07-20')
    streak = advanceStreak(streak, '2026-07-21')
    streak = advanceStreak(streak, '2026-07-26')
    expect(streak).toEqual({ lastDay: '2026-07-26', days: 1, longest: 2 })
  })

  it('ignores a clock that went backwards rather than punishing it', () => {
    const streak = advanceStreak(emptyStreak, '2026-07-26')
    expect(advanceStreak(streak, '2026-07-01')).toEqual(streak)
  })

  it('crosses a month and a year boundary', () => {
    let streak = advanceStreak(emptyStreak, '2026-12-31')
    streak = advanceStreak(streak, '2027-01-01')
    expect(streak.days).toBe(2)
  })

  it('survives a corrupt stored date', () => {
    const bad = { lastDay: 'not-a-date', days: 9, longest: 9 }
    expect(advanceStreak(bad, '2026-07-26')).toEqual(bad)
    expect(isLive(bad, '2026-07-26')).toBe(false)
  })

  describe('isLive', () => {
    it('counts today and yesterday as live, and anything older as broken', () => {
      const streak = { lastDay: '2026-07-25', days: 3, longest: 3 }
      expect(isLive(streak, '2026-07-25')).toBe(true)
      expect(isLive(streak, '2026-07-26')).toBe(true)
      expect(isLive(streak, '2026-07-27')).toBe(false)
      expect(isLive(emptyStreak, '2026-07-26')).toBe(false)
    })
  })
})

describe('isoDay', () => {
  it('uses the reader’s own timezone, not UTC', () => {
    // A reader an hour ahead of UTC at 00:30 is on the next day, and their streak
    // should agree with their calendar rather than with Greenwich.
    const local = new Date(2026, 6, 26, 0, 30)
    expect(isoDay(local)).toBe('2026-07-26')
  })

  it('pads single digits', () => {
    expect(isoDay(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})
