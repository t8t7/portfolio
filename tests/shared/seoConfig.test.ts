import { describe, expect, it } from 'vitest';
import {
  getLanguageFromPath,
  getLocalizedPath,
  getSeoRoute,
  normalizePathname,
} from '../../src/seo/config';

describe('SEO language routes', () => {
  it('preserves the canonical trailing slash on the English homepage', () => {
    expect(normalizePathname('/en')).toBe('/en/');
    expect(normalizePathname('/en/')).toBe('/en/');
    expect(getLanguageFromPath('/en/')).toBe('en');
    expect(getSeoRoute('/en/')?.id).toBe('home');
  });

  it('maps equivalent Russian and English routes without duplicates', () => {
    expect(getLocalizedPath('/', 'en')).toBe('/en/');
    expect(getLocalizedPath('/en/', 'ru')).toBe('/');
    expect(getLocalizedPath('/projects/sandbox', 'en')).toBe(
      '/en/projects/sandbox',
    );
    expect(getLocalizedPath('/en/projects/ispring-testing', 'ru')).toBe(
      '/projects/ispring-testing',
    );
    expect(getLocalizedPath('/engineer-designer', 'en')).toBe(
      '/en/engineer-designer',
    );
    expect(getLocalizedPath('/en/python-backend-developer', 'ru')).toBe(
      '/python-backend-developer',
    );
  });
});
