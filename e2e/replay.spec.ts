import { expect, test } from '@playwright/test'

/**
 * The replay player, exercised through the paths it was not built through.
 *
 * Two properties are guarded here, and neither is visible to any other gate.
 *
 * The first is geometry. The transcript is a fixed-size window on purpose: a replay
 * carrying a full delivered message runs to roughly four times its own height, and
 * an element that grew with its content would push the rest of the lesson down the
 * page on almost every frame. The build, the types and the link check are all
 * perfectly happy with that; only measuring catches it.
 *
 * The second is the scroll pin. It follows playback, and it must let go the moment
 * the reader scrolls back to re-read something — which is the one interaction the
 * feature was not developed through, and therefore the one worth asserting.
 */

const CRON = '/hermes/07-unattended/01-scheduled-work/'

test.describe('the replay player', () => {
  test('holds its height while it plays, so the lesson does not move', async ({ page }) => {
    await page.goto(CRON)

    const figure = page.locator('figure', { has: page.locator('[role="group"]') }).first()
    await figure.scrollIntoViewIfNeeded()

    // The paragraph after the figure is the witness: if the player grows, this moves.
    const after = figure.locator('xpath=following::h2[1]')
    const boxBefore = await figure.boundingBox()
    const witnessBefore = await after.boundingBox()

    await figure.getByRole('button', { name: /^play$/i }).click()
    await page.waitForTimeout(1200)

    const boxMid = await figure.boundingBox()
    const witnessMid = await after.boundingBox()

    expect(boxMid?.height).toBe(boxBefore?.height)
    expect(witnessMid?.y).toBe(witnessBefore?.y)

    // Then the far end, where the content is at its tallest and an unbounded list
    // would have pushed the rest of the lesson a thousand pixels down the page.
    await figure.locator('[role="group"]').focus()
    await page.keyboard.press('End')
    await page.waitForTimeout(300)

    const boxEnd = await figure.boundingBox()
    const witnessEnd = await after.boundingBox()

    expect(boxEnd?.height).toBe(boxBefore?.height)
    expect(witnessEnd?.y).toBe(witnessBefore?.y)

    // And the content genuinely overflows, or the assertions above prove nothing.
    const overflow = await figure
      .locator('ol')
      .first()
      .evaluate((el) => el.scrollHeight / el.clientHeight)
    expect(overflow).toBeGreaterThan(2)
  })

  test('follows playback to the newest event', async ({ page }) => {
    await page.goto(CRON)

    const group = page.locator('[role="group"]').first()
    await group.scrollIntoViewIfNeeded()
    await group.focus()
    await page.keyboard.press('End')
    await page.waitForTimeout(300)

    const list = group.locator('ol').first()
    const atBottom = await list.evaluate(
      (el) => el.scrollHeight - el.scrollTop - el.clientHeight < 24,
    )
    expect(atBottom).toBe(true)
  })

  test('lets go when the reader scrolls back', async ({ page }) => {
    await page.goto(CRON)

    const group = page.locator('[role="group"]').first()
    await group.scrollIntoViewIfNeeded()
    await group.focus()
    await page.keyboard.press('End')
    await page.waitForTimeout(300)

    // The reader goes back to re-read the top of the replay.
    const list = group.locator('ol').first()
    await list.evaluate((el) => {
      el.scrollTop = 0
    })
    await page.waitForTimeout(150)

    // Time moves again. The window must stay where the reader put it.
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(300)

    const scrollTop = await list.evaluate((el) => el.scrollTop)
    expect(scrollTop).toBeLessThan(100)
  })
})
