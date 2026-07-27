import { expect, test } from '@playwright/test'

/**
 * The third non-negotiable, asserted rather than asserted about.
 *
 * "Nothing breaks without JavaScript" is easy to believe and easy to lose: one
 * component moved behind a `useEffect`, one list gated on hydration, and the claim
 * quietly stops being true while every other gate stays green. This project runs with
 * scripting disabled, so what it sees is what a crawler, a text browser, and a reader
 * on a failed bundle see.
 *
 * These check *content completeness*, not that the page renders at all. A page that
 * renders its shell and none of its substance is the failure worth catching.
 */

test('the landing page carries its whole argument', async ({ page }) => {
  await page.goto('/')

  // The hero is the argument: a claim struck, and its replacement.
  await expect(page.locator('h1 del')).toHaveText(/three-layer memory system/)
  await expect(page.locator('h1 ins')).toHaveText(/two capped files/)

  // The corrections are the product. All four, with their links. Addressed by a
  // stable hook rather than by tag: this section has already been rebuilt twice —
  // scroll narrative, then evidence ledger — and what is being guaranteed is four
  // superseded claims with four replacements present with no script, not the shape of
  // the element that happens to hold them today.
  await expect(page.locator('[data-corrections] li del')).toHaveCount(4)
  await expect(page.locator('[data-corrections] li ins')).toHaveCount(4)
  // Four corrections, four links out to the lessons that source them. Addressed by
  // the container rather than by link text: the text is now each lesson's real title,
  // which is the point — four identical link labels were one of the repetitions that
  // made this page read as a template.
  await expect(page.locator('[data-corrections] li a')).toHaveCount(4)

  // And each one's receipt, which is the half that makes the claim checkable. A
  // correction whose evidence is painted on by a script is a correction a crawler,
  // a text browser and a reader on a failed bundle have to take on trust — which is
  // the one thing this guide asks nobody to do.
  await expect(page.locator('[data-corrections] li figure')).toHaveCount(4)
  await expect(page.locator('[data-corrections] figcaption')).toHaveCount(4)
  // The strongest of the four, spelled out: the documentation's bar prints a cost
  // field and not one captured bar has it.
  const status = page.locator('[data-corrections] li').first()
  await expect(status.locator('.transcript')).toContainText('$0.06')
  await expect(status.locator('.transcript')).toContainText('21.1K/1M')

  // Real computed numbers, not placeholders.
  await expect(page.getByText(/core lessons/).first()).toBeVisible()

  // Every module reachable without a script.
  await expect(page.locator('[data-modules] li a')).toHaveCount(10)
})

test('a lesson renders its prose, its transcripts and its plate', async ({ page }) => {
  await page.goto('/hermes/05-what-it-knows/03-memory-the-two-files/')

  await expect(page.locator('h1')).toHaveText(/Memory is two files and an index/)

  // Prose from the body, not just the frontmatter — and specifically a paragraph,
  // because the plate's own <desc> alternative states the same figures and is not
  // visible by design.
  await expect(
    page.locator('article p').filter({ hasText: '2,200 characters' }).first(),
  ).toBeVisible()

  // The plate is SVG with real text, so it survives with no script and no image load.
  // Addressed by its own title rather than by `svg[role="img"]`: a lesson now carries
  // two figures with that role, and a selector that matches both would either fail on
  // strict mode or silently start asserting about whichever came first.
  const plate = page.locator('svg[role="img"]').filter({ has: page.locator('title') })
  await expect(plate).toBeVisible()
  await expect(plate.locator('title')).toHaveText(/Memory: two files and an index/)

  // The masthead is precomputed SVG, so the lesson's place in the curriculum is drawn
  // with no bundle at all. Its ground rules and depth numbers are the whole figure —
  // if the geometry ever moved to the client this is what would go blank.
  const masthead = page.getByRole('img', { name: /stand behind this one/ })
  await expect(masthead).toBeVisible()
  await expect(masthead.locator('circle')).not.toHaveCount(0)

  // The correction gesture resolves to finished text, never to a scramble.
  await expect(page.locator('ins').first()).toHaveText(/two capped markdown files/)
})

test('every track variant is present and labelled with no track set', async ({ page }) => {
  await page.goto('/hermes/05-what-it-knows/03-memory-the-two-files/')

  // This is the reason track adaptivity is CSS rather than conditional rendering:
  // with no track chosen, a reader sees all three variants, each labelled.
  const callouts = page.locator('.tk-block')
  expect(await callouts.count()).toBeGreaterThan(2)

  await expect(page.getByText('For newcomer readers', { exact: false }).first()).toBeVisible()
  await expect(page.getByText('For operator readers', { exact: false }).first()).toBeVisible()
  await expect(page.getByText('For architect readers', { exact: false }).first()).toBeVisible()
})

test('search degrades to a complete route through the curriculum', async ({ page }) => {
  await page.goto('/search/')

  // The input is inert without a script, so the page must carry a real alternative.
  await expect(page.locator('ol li a')).toHaveCount(10)
})

test('a replay carries its whole transcript with no script', async ({ page }) => {
  await page.goto('/hermes/07-unattended/01-scheduled-work/')

  // The player reveals events over time, so with no script it shows the first frame
  // and stops. The guarantee is that the complete transcript sits beside it in a
  // <details> — which opens with no script at all, because that is what the element
  // does — carrying the last event, which playback would otherwise gate behind ten
  // seconds of a clock that is never going to run.
  await page.getByRole('group').getByText('Full transcript').click()

  await expect(page.getByText('Cronjob Response: Morning feeds')).toBeVisible()
  await expect(
    page.getByText('Note: The agent cannot see this message, and therefore cannot respond to it.'),
  ).toBeVisible()

  // Provenance ships with it. A replay that hid whether its strings were quoted or
  // reconstructed would be the one dishonest thing on the site.
  await expect(page.getByText(/Verbatim strings · v0\.19\.0/)).toBeVisible()
})

test('the disclaimer is on the page, not painted on by a script', async ({ page }) => {
  await page.goto('/hermes/06-skills-and-the-loop/05-the-nudge-and-the-review-fork/')
  await expect(page.getByText(/Unofficial community project/)).toBeVisible()
})
