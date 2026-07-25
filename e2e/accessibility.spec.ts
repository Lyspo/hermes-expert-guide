import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * An axe sweep per template, which is what `design.md` commits to.
 *
 * One page per *template* rather than per URL: the templates are what differ, and 51
 * lesson pages built from one component would give 51 copies of the same result while
 * hiding the fact that nothing else was checked.
 *
 * WCAG 2.1 AA is the stated target, so those are the tags. Violations are reported
 * with their rule and the offending selector, because "3 violations" is not something
 * anyone can act on from CI output.
 */

const TEMPLATES = [
  { name: 'landing', url: '/' },
  { name: 'guide index', url: '/hermes/' },
  { name: 'module', url: '/hermes/05-what-it-knows/' },
  { name: 'lesson', url: '/hermes/05-what-it-knows/03-memory-the-two-files/' },
  { name: 'lesson with a plate and a simulation', url: '/hermes/03-running-a-session/01-the-status-bar-and-the-context-budget/' },
  { name: 'placement', url: '/begin/' },
  { name: 'search', url: '/search/' },
  { name: 'about', url: '/about/' },
]

for (const template of TEMPLATES) {
  test(`${template.name} has no WCAG 2.1 AA violations`, async ({ page }) => {
    await page.goto(template.url)

    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const readable = violations.map((violation) => ({
      rule: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => node.target.join(' ')),
    }))

    expect(readable, JSON.stringify(readable, null, 2)).toEqual([])
  })
}

test('the page is usable at 200% zoom', async ({ page }) => {
  // Terminal content is the subject matter here, so it has to stay legible when
  // magnified — `design.md` names this specifically rather than leaving it to the
  // general reflow rule.
  await page.setViewportSize({ width: 640, height: 760 })
  await page.goto('/hermes/06-skills-and-the-loop/05-the-nudge-and-the-review-fork/')

  const overflows = await page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth > root.clientWidth + 1
  })

  expect(overflows, 'the page scrolls horizontally, which reflow forbids').toBe(false)
})
