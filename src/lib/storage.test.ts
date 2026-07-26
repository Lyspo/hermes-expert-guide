import { describe, expect, it } from 'vitest'
import { CURRENT_VERSION, initialState, migrate } from './storage'

describe('migrate', () => {
  it('accepts a well-formed current-version state', () => {
    expect(migrate(initialState)).toEqual(initialState)
  })

  it('accepts a populated state', () => {
    const state = {
      v: 2,
      track: 'architect',
      assessment: { answers: { q1: 'a', q2: 'c' }, completedAt: '2026-07-25T10:00:00.000Z' },
      progress: { completedLessons: ['01-first-contact/01-what-is-hermes'], lastVisited: 'x' },
      mastery: {
        mastered: ['hermes/01-first-contact/01-what-hermes-is'],
        streak: { lastDay: '2026-07-26', days: 4, longest: 9 },
      },
      prefs: { motion: 'reduced' },
    }
    expect(migrate(state)).toEqual(state)
  })

  describe('the 1 → 2 migration', () => {
    const v1 = {
      v: 1,
      track: 'operator',
      assessment: { answers: { q1: 'b' }, completedAt: '2026-07-01T09:00:00.000Z' },
      progress: { completedLessons: ['a', 'b', 'c'], lastVisited: 'c' },
      prefs: { motion: 'system' },
    }

    it('carries a returning reader forward rather than resetting them', () => {
      const migrated = migrate(v1)
      expect(migrated).not.toBeNull()
      expect(migrated!.v).toBe(2)
      expect(migrated!.track).toBe('operator')
      expect(migrated!.assessment.completedAt).toBe('2026-07-01T09:00:00.000Z')
      expect(migrated!.progress.completedLessons).toEqual(['a', 'b', 'c'])
    })

    /**
     * The tempting migration seeds `mastered` from `completedLessons`, and it would be
     * wrong. Mastery is earned; reading is self-reported. Granting it retroactively
     * would hand someone a v0.19.0 agent for having ticked boxes, which makes the
     * ladder a reading counter and the whole layer hollow.
     */
    it('does not grant mastery for lessons that were only marked read', () => {
      const migrated = migrate(v1)
      expect(migrated!.mastery.mastered).toEqual([])
      expect(migrated!.mastery.streak).toEqual({ lastDay: null, days: 0, longest: 0 })
    })
  })

  it('rejects a v2 state whose mastery block is malformed', () => {
    const base = {
      v: 2,
      track: null,
      assessment: { answers: {}, completedAt: null },
      progress: { completedLessons: [], lastVisited: null },
      prefs: {},
    }
    expect(migrate({ ...base })).toBeNull()
    expect(migrate({ ...base, mastery: { mastered: 'nope', streak: {} } })).toBeNull()
    expect(migrate({ ...base, mastery: { mastered: [], streak: { days: 1 } } })).toBeNull()
    expect(
      migrate({ ...base, mastery: { mastered: [1], streak: { lastDay: null, days: 0, longest: 0 } } })
    ).toBeNull()
  })

  it.each([
    ['null', null],
    ['a string', 'newcomer'],
    ['a number', 7],
    ['an array', []],
  ])('rejects %s', (_label, value) => {
    expect(migrate(value)).toBeNull()
  })

  it('rejects an unknown track rather than silently accepting it', () => {
    expect(migrate({ ...initialState, track: 'wizard' })).toBeNull()
  })

  it('rejects a state missing a required section', () => {
    const { progress: _progress, ...rest } = initialState
    expect(migrate(rest)).toBeNull()
  })

  it('rejects a future version it has no way to understand', () => {
    expect(migrate({ ...initialState, v: CURRENT_VERSION + 5 })).toBeNull()
  })

  it('rejects an older version with no migration path registered', () => {
    // Guards the invariant: bumping CURRENT_VERSION without adding the matching
    // migration must fail loudly here rather than corrupt readers' state.
    expect(migrate({ v: 0, track: null })).toBeNull()
  })

  it('treats an absent motion preference as valid', () => {
    const result = migrate(initialState)
    expect(result?.prefs.motion).toBeUndefined()
  })
})
