import { describe, expect, it } from 'vitest'
import { QUESTIONS, scoreAssessment } from './tracks'

/** Picks the choice with the largest weight toward a given track, per question. */
function leaning(track: 'newcomer' | 'operator' | 'architect'): Record<string, string> {
  const answers: Record<string, string> = {}
  for (const question of QUESTIONS) {
    const best = [...question.choices].sort(
      (a, b) => (b.weight[track] ?? 0) - (a.weight[track] ?? 0),
    )[0]
    if (best) answers[question.id] = best.id
  }
  return answers
}

describe('scoreAssessment', () => {
  it('places a reader who leans consistently on that track', () => {
    expect(scoreAssessment(leaning('newcomer'))).toBe('newcomer')
    expect(scoreAssessment(leaning('operator'))).toBe('operator')
    expect(scoreAssessment(leaning('architect'))).toBe('architect')
  })

  it('defaults to newcomer with no answers, rather than throwing', () => {
    expect(scoreAssessment({})).toBe('newcomer')
  })

  it('ignores answers whose question or choice no longer exists', () => {
    expect(scoreAssessment({ 'question-that-was-removed': 'gone' })).toBe('newcomer')
    const first = QUESTIONS[0]!
    expect(scoreAssessment({ [first.id]: 'choice-that-was-removed' })).toBe('newcomer')
  })

  it('breaks ties toward the less specialised track', () => {
    // The "curious" answer weights all three equally, so nothing displaces the
    // first in tie-break order. Being over-explained to is the cheaper mistake.
    expect(scoreAssessment({ why: 'curious' })).toBe('newcomer')
  })

  it('is unaffected by the order answers were given in', () => {
    const answers = leaning('architect')
    const reversed = Object.fromEntries(Object.entries(answers).reverse())
    expect(scoreAssessment(reversed)).toBe(scoreAssessment(answers))
  })

  it('gives every question at least one choice per track to reach', () => {
    // Guards the questions themselves: a question no track can score on is dead
    // weight in the flow.
    for (const question of QUESTIONS) {
      const reachable = new Set(
        question.choices.flatMap((choice) => Object.keys(choice.weight)),
      )
      expect([...reachable].sort()).toEqual(['architect', 'newcomer', 'operator'])
    }
  })
})
