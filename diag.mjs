import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
const errors = []
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))

await page.goto('https://hermes-expert-guide.vercel.app/hermes/', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)

const canvas = page.locator('[data-curriculum-map] canvas')
console.log('canvas count:', await canvas.count())
const box = await canvas.boundingBox()
console.log('canvas box:', box && JSON.stringify(box))

// Does it actually paint anything?
const painted = await page.evaluate(() => {
  const c = document.querySelector('[data-curriculum-map] canvas')
  if (!c) return 'no canvas'
  const ctx = c.getContext('2d')
  const d = ctx.getImageData(0, 0, c.width, c.height).data
  let nonzero = 0
  for (let i = 3; i < d.length; i += 4) if (d[i] > 8) nonzero++
  return { w: c.width, h: c.height, litPixels: nonzero }
})
console.log('painted:', JSON.stringify(painted))

// Hover the CANVAS itself at a few points, see if a readout appears.
let hits = 0
for (const [fx, fy] of [[0.5,0.5],[0.35,0.45],[0.65,0.55],[0.5,0.35],[0.42,0.6]]) {
  await page.mouse.move(box.x + box.width*fx, box.y + box.height*fy)
  await page.waitForTimeout(350)
  const n = await page.locator('[data-curriculum-map] .border-signal').count()
  if (n > 0) hits++
}
console.log('canvas-hover readouts hit:', hits, '/5')
console.log('console errors:', errors.length ? errors.slice(0,5) : 'none')
await browser.close()
