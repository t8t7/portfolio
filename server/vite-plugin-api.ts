import type { Plugin } from 'vite';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
import { createApp } from './app';

loadEnv({ path: resolve(process.cwd(), '.env') });

/**
 * Mounts the Express API (contact + redirects) into Vite's dev server.
 */
export function socialProfileApiPlugin(): Plugin {
  const api = createApp();

  return {
    name: 'portfolio-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (!url.startsWith('/api/')) {
          next();
          return;
        }

        // Connect IncomingMessage is compatible at runtime with Express Request handlers.
        api(req as never, res as never, next);
      });
    },
  };
}
