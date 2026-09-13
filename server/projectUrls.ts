import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';

loadEnv({ path: resolve(process.cwd(), '.env') });

export const PROJECT_KEYS = ['door-soft', 'goodpapa'] as const;

export type ProjectRedirectKey = (typeof PROJECT_KEYS)[number];

function readUrl(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

/**
 * External project destinations — loaded only from environment variables.
 * Never import these values into the Vite client bundle.
 */
export function getProjectUrl(project: string): string | undefined {
  if (!PROJECT_KEYS.includes(project as ProjectRedirectKey)) {
    return undefined;
  }

  const urls: Record<ProjectRedirectKey, string | undefined> = {
    'door-soft': readUrl('PROJECT_DOOR_SOFT'),
    goodpapa: readUrl('PROJECT_GOODPAPA'),
  };

  return urls[project as ProjectRedirectKey];
}

export function isProjectRedirectKey(value: unknown): value is ProjectRedirectKey {
  return typeof value === 'string' && PROJECT_KEYS.includes(value as ProjectRedirectKey);
}
