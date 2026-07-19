import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { socialProfileApiPlugin } from './server/vite-plugin-api';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react(), tailwindcss(), socialProfileApiPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },
    server: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy':
          'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
      },
      fs: {
        strict: true,
        deny: [
          '.env',
          '.env.*',
          '**/.git/**',
          '**/server/logs/**',
          '**/node_modules/.cache/**',
          '**/package.json',
          '**/package-lock.json',
          '**/.gitignore',
          '**/tsconfig*.json',
          '**/*.map',
        ],
      },
    },
    preview: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy':
          'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
      },
    },
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      sourcemap: false,
      minify: 'esbuild',
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          manualChunks: {
            motion: ['framer-motion'],
            react: ['react', 'react-dom'],
          },
        },
      },
    },
  };
});
