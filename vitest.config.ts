import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Mirrors the tsconfig path. Without it a test that reaches the real curriculum
      // cannot resolve it, and the tempting fix — asserting against a hand-written
      // fixture instead — tests the fixture rather than the content.
      'content-collections': fileURLToPath(
        new URL('./.content-collections/generated', import.meta.url)
      ),
      // Same reasoning for the replay registry: the test that resolves every embedded
      // <Simulation id> has to read the real one.
      '@content': fileURLToPath(new URL('./content', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
