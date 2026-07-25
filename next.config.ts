import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export. Everything downstream follows from this: no middleware, no
  // ISR, no server actions, no route handlers, and no image optimization.
  output: 'export',

  // Directory-style URLs so the exported tree serves correctly from any static
  // host without rewrite rules. Set on day one — changing it later breaks links.
  trailingSlash: true,

  // Required under `output: 'export'`. Source images are pre-sized by
  // scripts/prepare-media.ts instead.
  images: { unoptimized: true },

  // Next 16 no longer runs ESLint during `next build`; linting is its own step
  // in `pnpm verify` and in CI.
  typedRoutes: true,
}

export default nextConfig
