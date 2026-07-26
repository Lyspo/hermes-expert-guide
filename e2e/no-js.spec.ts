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

  // The corrections are the product. All four, with their links.
  const corrections = page.locator('section ul li del')
  await expect(corrections).toHaveCount(4)
  await expect(page.getByRole('link', { name: /the lesson that carries the source/ })).toHaveCount(4)

  // Real computed numbers, not placeholders.
  await expect(page.getByText(/core lessons/).first()).toBeVisible()

  // Every module reachable without a script.
  await expect(page.locator('ol li a')).toHaveCount(10)
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
  const plate = page.locator('svg[role="img"]')
  await expect(plate).toBeVisible()
  await expect(plate.locator('title')).toHaveText(/Memory: two files and an index/)

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

test('the disclaimer is on the page, not painted on by a script', async ({ page }) => {
  await page.goto('/hermes/06-skills-and-the-loop/05-the-nudge-and-the-review-fork/')
  await expect(page.getByText(/Unofficial community project/)).toBeVisible()
})

test('the map is complete as text, with no canvas involved', async ({ page }) => {
  await page.goto('/map/')

  // Every module and every lesson is a real link, because the field is decorative and
  // `design.md` requires that everything it depicts also exist as text. Without
  // JavaScript there is no canvas at all, so this list *is* the map.
  await expect(page.getByRole('heading', { name: 'The map' })).toBeVisible()
  // `.first()` because a lesson legitimately appears more than once here: in its
  // module's list, and again in every prerequisite row that names it.
  await expect(
    page.getByRole('link', { name: 'The gate, and the four ways past it' }).first()
  ).toBeVisible()

  // The prerequisites — the edges that make this a graph rather than a list — are
  // stated, not only drawn.
  await expect(page.getByText('assumes').first()).toBeVisible()

  // Every one of the 51 lessons is reachable from here. Counted rather than sampled,
  // because "the list is there" and "the list is complete" are different claims.
  const lessonLinks = await page.locator('a[href^="/hermes/"]').evaluateAll((links) => {
    const urls = links
      .map((link) => link.getAttribute('href') ?? '')
      .filter((href) => /^\/hermes\/[^/]+\/[^/]+\/$/.test(href))
    return new Set(urls).size
  })
  expect(lessonLinks).toBe(51)
})

test('the boot sequence is the whole argument, with no scene running', async ({ page }) => {
  await page.goto('/')

  // Six frames, all present. The GSAP scene brightens captions and lifts frames a few
  // pixels; it never reveals anything, so with scripting off the sequence is simply
  // finished rather than empty.
  const steps = page.locator('[data-boot-step]')
  await expect(steps).toHaveCount(6)

  // The frame that carries the thesis: the review firing unprompted, in the software's
  // own words rather than the documentation's.
  await expect(page.getByText("💾 Self-improvement review: Skill 'github-repo-discovery' created.")).toBeVisible()
  await expect(page.locator('body')).not.toContainText("Skill 'foo' patched")

  // And the payload — pitfalls that are the agent's own earlier failures.
  await expect(page.getByText('GitHub rate-limits anonymous API calls')).toBeVisible()
})
