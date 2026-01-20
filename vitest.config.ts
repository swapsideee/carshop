import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',

      include: [
        'src/**/*.{js,jsx,ts,tsx}',
        'app/**/*.{js,jsx,ts,tsx}',
        'pages/**/*.{js,jsx,ts,tsx}',
      ],

      exclude: [
        '**/node_modules/**',
        '**/.next/**',
        '**/dist/**',
        '**/coverage/**',
        '**/*.d.ts',
        '**/*.config.*',
        'next-env.d.ts',
        'public/**',
      ],
    },
  },
});
