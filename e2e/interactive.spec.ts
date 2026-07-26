import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * The two interactive surfaces, driven the way a reader drives them.
 *
 * Unit tests prove the console's engine and the palette's matcher are correct. They
 * cannot prove that pressing ⌘K opens anything, that the approval menu answers to an
 * arrow key, or that a dialog is reachable by a keyboard at all — and a dialog is the
 * single most common place for an otherwise-accessible site to fail, because axe only
 * ever sees it if something opens it first.
 *
 * A lesson page rather than the landing page, because that is where both live.
 */

const LESSON = '/hermes/04-tools-and-isolation/04-approvals-in-depth/'

/**
 * Waits for the palette's keydown listener to exist before pressing anything.
 *
 * The listener is registered after hydration, so a press before that lands nowhere —
 * which is true for a real reader as much as for this test. The `kbd` hint is rendered
 * only once hydrated, so waiting for it is a genuine readiness signal rather than a
 * sleep, and it doubles as proof that the shortcut is actually advertised.
 */
async function paletteReady(page: import('@playwright/test').Page) {
  await expect(page.getByRole('link', { name: /Search/ }).locator('kbd')).toBeVisible()
}

test.describe('the command palette', () => {
  test('opens on the shortcut, filters, and navigates', async ({ page }) => {
    await page.goto(LESSON)
    await paletteReady(page)

    await page.keyboard.press('ControlOrMeta+k')
    const dialog = page.getByRole('dialog', { name: 'Jump to' })
    await expect(dialog).toBeVisible()

    // The input takes focus on open, so a reader can type immediately rather than
    // having to find the field first.
    await expect(dialog.getByRole('combobox')).toBeFocused()

    await page.keyboard.type('glossary')
    // Whatever matched, the count line reports it rather than leaving the reader to
    // guess whether the index loaded.
    await expect(dialog.getByRole('status')).toContainText(/of \d+|Nothing matched/)

    await dialog.getByRole('combobox').fill('memory')
    const first = dialog.getByRole('option').first()
    await expect(first).toBeVisible()

    await page.keyboard.press('Enter')
    await expect(dialog).toBeHidden()
    await expect(page).not.toHaveURL(new RegExp(`${LESSON}$`))
  })

  test('closes on Escape and gives focus back where it came from', async ({ page }) => {
    await page.goto(LESSON)

    await paletteReady(page)

    const trigger = page.getByRole('link', { name: /Search/ })
    await page.keyboard.press('ControlOrMeta+k')
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
    // Dropping focus to the top of the document strands a keyboard reader in the
    // header every single time they dismiss the palette.
    await expect(trigger).toBeFocused()
  })

  test('has no WCAG 2.1 AA violations while open', async ({ page }) => {
    await page.goto(LESSON)
    await paletteReady(page)
    await page.keyboard.press('ControlOrMeta+k')
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('combobox').fill('skill')
    await expect(page.getByRole('option').first()).toBeVisible()

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
})

test.describe('mastery', () => {
  const CHECKED = '/hermes/04-tools-and-isolation/03-execution-backends-and-isolation/'
  const OBJECTIVE = '/hermes/01-first-contact/04-versions-and-what-goes-stale/'

  test('a correct answer writes a skill that survives a navigation', async ({ page }) => {
    await page.goto(CHECKED)

    const gate = page.getByRole('listbox', { name: 'Answer' })
    await expect(gate).toBeVisible()

    // Click the option by name rather than clicking the listbox and typing. Clicking a
    // listbox lands on whichever option is under its centre point and commits it, which
    // is a real behaviour and a terrible way to write a test.
    await page.getByRole('option', { name: /It is skipped entirely/ }).click()

    await expect(page.getByRole('status')).toContainText('Mastered')
    // The explanation is shown, and it carries its citation.
    await expect(page.getByRole('status')).toContainText('[02] §7')

    // The whole point of a mastery layer is that it accumulates. Storage is the only
    // thing carrying it, so crossing a page boundary is the real test.
    await page.goto('/profile/')
    await expect(page.getByRole('heading', { level: 1, name: 'Your agent' })).toBeVisible()
    await expect(page.getByText('execution-backends-and-isolation')).toBeVisible()
    await expect(page.getByText('tools-and-isolation/')).toBeVisible()
    await expect(page.getByText('1 of 51 lessons mastered', { exact: false })).toBeVisible()
  })

  test('a wrong answer explains itself and grants nothing', async ({ page }) => {
    await page.goto(CHECKED)

    await page.getByRole('option', { name: /now evaluated against the container/ }).click()

    await expect(page.getByRole('status')).toContainText('Not this time')
    // The correction is the point, so it appears either way.
    await expect(page.getByRole('status')).toContainText('skip the dangerous-command check')

    await page.goto('/profile/')
    await expect(page.getByText('0 of 51 lessons mastered', { exact: false })).toBeVisible()
    await expect(page.getByText('Empty.', { exact: false })).toBeVisible()
  })

  test('a console objective is stated up front and ticks when it is actually done', async ({
    page,
  }) => {
    await page.goto(OBJECTIVE)

    // Stated before it is satisfied. A reader who does not know what is being asked has
    // been given a puzzle rather than a lesson.
    await expect(page.getByText('Confirm against the software that')).toBeVisible()

    const input = page.getByRole('textbox', { name: 'Console input' })
    await input.fill('hermes daemon start')
    await input.press('Enter')
    // Half done: the predicate wants the real command surface checked too.
    await page.goto('/profile/')
    await expect(page.getByText('0 of 51 lessons mastered', { exact: false })).toBeVisible()

    await page.goto(OBJECTIVE)
    await page.getByRole('textbox', { name: 'Console input' }).fill('hermes daemon start')
    await page.getByRole('textbox', { name: 'Console input' }).press('Enter')
    await page.getByRole('textbox', { name: 'Console input' }).fill('hermes --help')
    await page.getByRole('textbox', { name: 'Console input' }).press('Enter')

    await page.goto('/profile/')
    await expect(page.getByText('1 of 51 lessons mastered', { exact: false })).toBeVisible()
    await expect(page.getByText('versions-and-what-goes-stale')).toBeVisible()
  })

  test('the profile has no WCAG 2.1 AA violations', async ({ page }) => {
    await page.goto('/profile/')
    await expect(page.getByRole('heading', { level: 1, name: 'Your agent' })).toBeVisible()

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
})

test.describe('the console', () => {
  test('boots on a verbatim frame and carries its provenance', async ({ page }) => {
    await page.goto(LESSON)

    const log = page.getByRole('log', { name: 'Hermes console output' })
    await expect(log).toContainText('Hermes Agent v0.19.0 (2026.7.20) · upstream 760112ad')
    // The citation is rendered, not just held in the data. That is the product claim.
    await expect(log).toContainText('[08] §1')
  })

  test('gates a destructive command under manual mode, and answers to the keyboard', async ({
    page,
  }) => {
    await page.goto(LESSON)
    const input = page.getByRole('textbox', { name: 'Console input' })

    await input.fill('hermes')
    await input.press('Enter')
    await input.fill(':approvals manual')
    await input.press('Enter')
    await input.fill('recursively delete /tmp/hermes-scratch')
    await input.press('Enter')

    const log = page.getByRole('log', { name: 'Hermes console output' })
    await expect(log).toContainText('Dangerous Command')
    await expect(log).toContainText('3. Add to permanent allowlist')
    // The letter-key form the documentation publishes appears nowhere on a real
    // v0.19.0 CLI, and must appear nowhere here either.
    await expect(log).not.toContainText('[o]nce')

    // ↑/↓ moves the marker; Enter commits. This is the interaction `04/04` is about.
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')

    await expect(log).toContainText('⚠ Approval: rm -rf /tmp/hermes-scratch → denied')
    await expect(log).toContainText('do NOT attempt the same outcome via a different command')
    // [09] §14: the prompt is consumed once answered and is not in the final frame.
    await expect(log).not.toContainText('Dangerous Command')
  })

  test('refuses to invent output it has no capture of', async ({ page }) => {
    await page.goto(LESSON)
    const input = page.getByRole('textbox', { name: 'Console input' })

    await input.fill('hermes kanban')
    await input.press('Enter')

    const log = page.getByRole('log', { name: 'Hermes console output' })
    await expect(log).toContainText('was never captured')
    await expect(log).toContainText('This console only prints output with a source behind it')
  })
})
