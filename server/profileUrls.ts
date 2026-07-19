import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';

loadEnv({ path: resolve(process.cwd(), '.env') });

export const PROFILE_KEYS = ['github', 'hh', 'telegram'] as const;

export type ProfileKey = (typeof PROFILE_KEYS)[number];

function readUrl(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

/**
 * Profile destinations — loaded only from environment variables.
 * Never import these values into the Vite client bundle.
 */
export function getProfileUrl(profile: string): string | undefined {
  if (!PROFILE_KEYS.includes(profile as ProfileKey)) {
    return undefined;
  }

  const urls: Record<ProfileKey, string | undefined> = {
    github: readUrl('PROFILE_GITHUB'),
    hh: readUrl('PROFILE_HH'),
    telegram: readUrl('PROFILE_TELEGRAM'),
  };

  return urls[profile as ProfileKey];
}

export function isProfileKey(value: unknown): value is ProfileKey {
  return typeof value === 'string' && PROFILE_KEYS.includes(value as ProfileKey);
}
