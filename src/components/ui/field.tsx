'use client'

import { useEffect, useRef } from 'react'

/**
 * The substrate: the agent's interior rendered in depth.
 *
 * Clustered nodes with edges to near neighbours, drifting slowly, displaced by
 * the pointer at a different rate than the content plane. This is the medium the
 * whole design sits in rather than a background texture.
 *
 * It is decorative by definition — `aria-hidden`, `pointer-events: none`, and
 * every structure it suggests also exists as real text on the page. Nothing here
 * is load-bearing information.
 *
 * Deliberately canvas rather than DOM: a few hundred moving points is the case
 * canvas exists for, and it keeps the accessibility tree clean. Deliberately not
 * WebGL: at this node count the GPU pipeline costs more than it returns, and this
 * has to stay off the critical path.
 */
export function Field({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let ratio = 1
    let frame = 0
    let time = 0

    // Pointer target and its damped follower, so motion eases rather than snaps.
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    // Sized from the viewport, never from the canvas's own box. Measuring an
    // element in order to set the attributes that can affect its box is how you
    // get a buffer that doubles on every observation.
    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, window.innerWidth)
      height = Math.max(1, window.innerHeight)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    resize()

    // Five clusters, because the agent's interior has distinct regions — skills,
    // memory, sessions, tools, workers — rather than one undifferentiated cloud.
    const count = Math.round(
      Math.min(190, Math.max(70, (width * height) / 11000)) * density,
    )

    const nodes = Array.from({ length: count }, (_, index) => {
      const cluster = index % 5
      const angle = (cluster / 5) * Math.PI * 2 + 0.4
      const spread = 0.16 + Math.random() * 0.3
      return {
        x: Math.cos(angle) * spread + (Math.random() - 0.5) * 0.14,
        y: Math.sin(angle) * spread * 0.72 + (Math.random() - 0.5) * 0.14,
        z: Math.random() * 2 - 1,
        // A few nodes are larger: the skills that get invoked constantly.
        size: Math.random() < 0.08 ? 2.3 : 1,
        phase: Math.random() * Math.PI * 2,
      }
    })

    const onPointer = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2
      targetY = (event.clientY / window.innerHeight - 0.5) * 2
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)

      currentX += (targetX - currentX) * 0.045
      currentY += (targetY - currentY) * 0.045

      const scale = Math.max(width, height)
      const centreX = width / 2
      const centreY = height / 2

      const points = nodes.map((node) => {
        const z = node.z + Math.sin(time * 0.32 + node.phase) * 0.07
        const perspective = 1 / (1.95 + z)
        return {
          x: centreX + (node.x + currentX * 0.085) * scale * perspective * 2.2,
          y: centreY + (node.y + currentY * 0.06) * scale * perspective * 2.2,
          alpha: (perspective - 0.33) * 2.05,
          radius: node.size * perspective * 1.85,
        }
      })

      // Edges first so nodes sit on top of them.
      const reach = scale * 0.085
      context.lineWidth = 0.7
      for (let i = 0; i < points.length; i++) {
        const a = points[i]!
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j]!
          const distance = Math.hypot(a.x - b.x, a.y - b.y)
          if (distance >= reach) continue
          const alpha = (1 - distance / reach) * 0.17 * Math.min(a.alpha, b.alpha)
          if (alpha <= 0.004) continue
          context.strokeStyle = `rgba(141,163,172,${alpha.toFixed(3)})`
          context.beginPath()
          context.moveTo(a.x, a.y)
          context.lineTo(b.x, b.y)
          context.stroke()
        }
      }

      for (const point of points) {
        if (point.alpha <= 0.02) continue
        context.fillStyle = `rgba(228,239,243,${Math.min(0.9, point.alpha).toFixed(3)})`
        context.beginPath()
        context.arc(point.x, point.y, Math.max(0.4, point.radius), 0, Math.PI * 2)
        context.fill()
      }
    }

    const loop = () => {
      time += 0.0055
      draw()
      frame = requestAnimationFrame(loop)
    }

    // The resting state is a single drawn frame — complete, legible, and what a
    // reader who has asked for reduced motion actually gets.
    draw()

    if (!still) {
      window.addEventListener('pointermove', onPointer, { passive: true })
      frame = requestAnimationFrame(loop)
    }

    const onResize = () => {
      resize()
      draw()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', onResize)
    }
  }, [density])

  return <canvas ref={ref} className="field" aria-hidden="true" />
}
