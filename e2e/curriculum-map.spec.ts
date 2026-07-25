import { expect, test } from '@playwright/test'

/**
 * The map's pointer interaction, driven through the pointer.
 *
 * This exists because the interaction shipped broken and every other check passed.
 * Hit-testing used a 26px proximity threshold against nodes two or three pixels
 * across, spread over a box a thousand wide, so sweeping the pointer over the graph
 * found a lesson roughly one time in five. The page looked like a decorative field
 * of dots that ignored you.
 *
 * Nothing caught it. The unit tests cover the graph, not the canvas. The axe sweep
 * passed, because an aria-hidden canvas has no accessibility surface to violate. The
 * no-js pass passed, because it asserts the index is complete without scripting. And
 * the hand-checks all drove the highlight by hovering the lesson *links*, which set
 * the state directly and never execute the hit-test at all.
 *
 * So this moves a real mouse across the real canvas and insists the map answers every
 * time. The property is not "a hit is possible" — it is that while the pointer is over
 * the map, some lesson is always the nearest one and is always shown.
 */
test.describe('the curriculum map answers the pointer', () => {
  test('every point over the canvas selects a lesson', async ({ page }) => {
    await page.goto('/hermes/')

    const canvas = page.locator('[data-curriculum-map] canvas')
    await expect(canvas).toBeVisible()

    // The map is taller than the fold, so scroll it in and read the box afterwards:
    // `mouse.move` takes viewport coordinates, and a point below the fold is simply
    // not somewhere a pointer can be. Getting this wrong makes the component look
    // broken when it is the test that is aiming off-screen.
    await canvas.scrollIntoViewIfNeeded()
    const box = (await canvas.boundingBox())!
    const viewport = page.viewportSize()!

    // A sweep across the box, deliberately including places no node sits.
    const spots: Array<[number, number]> = [
      [0.5, 0.5],
      [0.2, 0.3],
      [0.8, 0.7],
      [0.35, 0.75],
      [0.65, 0.25],
      [0.5, 0.9],
      [0.1, 0.5],
    ]

    const readout = page.locator('[data-curriculum-map] [data-readout]')
    let probed = 0
    for (const [fx, fy] of spots) {
      const x = box.x + box.width * fx
      const y = box.y + box.height * fy
      if (y < 0 || y > viewport.height || x < 0 || x > viewport.width) continue

      await page.mouse.move(x, y)
      await expect(readout, `no lesson selected at ${fx},${fy} of the canvas`).toBeVisible()
      expect((await readout.innerText()).trim().length).toBeGreaterThan(0)
      probed++
    }

    // Guards the guard: a viewport that happened to exclude every spot would make
    // this test pass while asserting nothing.
    expect(probed).toBeGreaterThanOrEqual(4)
  })

  test('the readout names a real lesson and its prerequisite count', async ({ page }) => {
    await page.goto('/hermes/')

    // Through a link, which is also the keyboard path: focusing an entry in the index
    // must drive the same reveal as pointing at its node.
    await page.getByRole('link', { name: 'What actually fires, and what it is allowed to do' }).hover()

    const readout = page.locator('[data-curriculum-map] [data-readout]')
    await expect(readout).toContainText('What actually fires')
    await expect(readout).toContainText('Skills and the improvement loop')
    // Eleven levels deep in the graph; the count is what makes the reveal worth having.
    await expect(readout).toContainText('lessons before it')
  })

  test('leaving the map clears the selection', async ({ page }) => {
    await page.goto('/hermes/')

    const canvas = page.locator('[data-curriculum-map] canvas')
    await canvas.scrollIntoViewIfNeeded()
    const box = (await canvas.boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await expect(page.locator('[data-curriculum-map] [data-readout]')).toBeVisible()

    await page.mouse.move(box.x + box.width / 2, box.y - 200)
    await expect(page.locator('[data-curriculum-map] [data-readout]')).toBeHidden()
  })
})
