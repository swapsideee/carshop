import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'node_modules/**',
    'coverage/**',
    'next-env.d.ts',
    '*.tsbuildinfo',
  ]),

  ...nextVitals,

  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: Object.fromEntries(nextTs.flatMap((c) => Object.entries(c.rules ?? {}))),
    languageOptions: nextTs.find((c) => c.languageOptions)?.languageOptions,
    plugins: nextTs.find((c) => c.plugins)?.plugins,
  },

  prettier,

  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'sort-imports': 'off',
    },
  },
]);
