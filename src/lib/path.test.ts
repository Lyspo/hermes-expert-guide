import { describe, expect, it } from 'vitest'
import { posixPath } from './path'

/**
 * These exist because the build worked on macOS and failed on every file on
 * Windows. The bug was unreachable from this machine, so the guard has to be a
 * test rather than a run.
 */
describe('posixPath', () => {
  it('leaves a forward-slashed path alone', () => {
    expect(posixPath('hermes/01-first-contact/01-what-hermes-is')).toBe(
      'hermes/01-first-contact/01-what-hermes-is',
    )
  })

  it('converts Windows separators — the case that broke the build', () => {
    expect(posixPath('hermes\\01-first-contact\\01-what-hermes-is')).toBe(
      'hermes/01-first-contact/01-what-hermes-is',
    )
  })

  it('handles a mixed path, which is what Node produces after a join on Windows', () => {
    expect(posixPath('hermes\\01-first-contact/01-what-hermes-is')).toBe(
      'hermes/01-first-contact/01-what-hermes-is',
    )
  })

  it('produces the same id from either platform, which is the actual requirement', () => {
    // Lesson ids must be platform-independent: prerequisites are authored with
    // forward slashes and matched against these strings.
    const mac = posixPath('hermes/06-skills-and-the-loop/05-the-nudge-and-the-review-fork')
    const win = posixPath('hermes\\06-skills-and-the-loop\\05-the-nudge-and-the-review-fork')
    expect(win).toBe(mac)
  })

  it('splits into the three segments the transform expects, on both platforms', () => {
    for (const raw of [
      'hermes/01-first-contact/01-what-hermes-is',
      'hermes\\01-first-contact\\01-what-hermes-is',
    ]) {
      expect(posixPath(raw).split('/')).toEqual([
        'hermes',
        '01-first-contact',
        '01-what-hermes-is',
      ])
    }
  })

  it('leaves a flat path untouched, for the glossary and cheatsheet collections', () => {
    expect(posixPath('prompt-caching')).toBe('prompt-caching')
  })

  it('does not collapse or trim anything else', () => {
    expect(posixPath('')).toBe('')
    expect(posixPath('a')).toBe('a')
  })
})
