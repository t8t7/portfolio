import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const alias = {
  '@': fileURLToPath(new URL('./src', import.meta.url)),
};

const sharedConfig = {
  plugins: [react()],
  resolve: { alias },
};

export default defineConfig({
  ...sharedConfig,
  test: {
    passWithNoTests: false,
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}', 'server/**/*.ts', 'shared/**/*.ts'],
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/*.d.ts',
        '**/index.ts',
        'server/index.ts',
        'server/vite-plugin-api.ts',
      ],
    },
    projects: [
      {
        ...sharedConfig,
        test: {
          name: 'frontend',
          environment: 'jsdom',
          include: ['tests/frontend/**/*.{test,spec}.{ts,tsx}'],
          setupFiles: ['./tests/setup/vitest.setup.ts'],
        },
      },
      {
        ...sharedConfig,
        test: {
          name: 'backend',
          environment: 'node',
          include: [
            'tests/backend/**/*.{test,spec}.{ts,tsx}',
            'tests/shared/**/*.{test,spec}.{ts,tsx}',
          ],
          setupFiles: ['./tests/setup/vitest.setup.node.ts'],
        },
      },
    ],
  },
});
