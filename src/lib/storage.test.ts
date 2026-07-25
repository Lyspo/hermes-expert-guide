import { describe, expect, it } from 'vitest'
import { CURRENT_VERSION, initialState, migrate } from './storage'

describe('migrate', () => {
  it('accepts a well-formed current-version state', () => {
    expect(migrate(initialState)).toEqual(initialState)
  })

  it('accepts a populated state', () => {
    const state = {
      v: 1,
      track: 'architect',
      assessment: { answers: { q1: 'a', q2: 'c' }, completedAt: '2026-07-25T10:00:00.000Z' },
      progress: { completedLessons: ['01-first-contact/01-what-is-hermes'], lastVisited: 'x' },
      prefs: { motion: 'reduced' },
    }
    expect(migrate(state)).toEqual(state)
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
