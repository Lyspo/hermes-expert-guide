import js from '@eslint/js'
import tseslint from 'typescript-eslint'
// eslint-config-next already bundles jsx-a11y; adding the plugin again here
// throws "Cannot redefine plugin".
import next from 'eslint-config-next'

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'out/**',
      '.content-collections/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'coverage/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...next,

  {
    rules: {
      // Type-only imports are already mandatory via tsconfig's
      // verbatimModuleSyntax, so the equivalent lint rule (which would require
      // type-aware linting) is redundant here.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Architectural boundaries, enforced rather than merely documented.
  //
  // GSAP is for timeline-orchestrated scroll scenes only. Confining its imports
  // keeps ~45 kB out of every content page's bundle — the split described in
  // CLAUDE.md stops being a discipline problem and becomes a build error.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/components/landing/**',
      'src/components/viz/scroll/**',
      'src/lib/motion/scroll.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'gsap',
              message:
                'GSAP belongs to scroll scenes only (src/components/landing, src/components/viz/scroll). Use Motion via motion/react for component animation.',
            },
            {
              name: '@gsap/react',
              message:
                'GSAP belongs to scroll scenes only (src/components/landing, src/components/viz/scroll).',
            },
          ],
          patterns: [
            {
              group: ['gsap/*'],
              message:
                'GSAP belongs to scroll scenes only (src/components/landing, src/components/viz/scroll).',
            },
          ],
        },
      ],
    },
  },

  // All localStorage access goes through src/lib/storage.ts, which owns schema
  // versioning, Zod validation, migrations, and the try/catch that Safari's
  // private mode requires.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/lib/storage.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'localStorage',
          message: 'Use the typed helpers in src/lib/storage.ts instead.',
        },
        {
          object: 'window',
          property: 'localStorage',
          message: 'Use the typed helpers in src/lib/storage.ts instead.',
        },
      ],
    },
  },

  // Build-time scripts run in Node and legitimately reach for the filesystem
  // and console.
  {
    files: ['scripts/**/*.{ts,tsx,mjs}', '*.config.{ts,mjs}', 'content-collections.ts'],
    rules: { 'no-console': 'off' },
  },
)
