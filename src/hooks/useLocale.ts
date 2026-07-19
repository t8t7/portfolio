import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Helpers for reading structured locale values (arrays/objects)
 * without hardcoding copy in components.
 *
 * Always returns safe structures so language switches never blank the UI.
 */
export function useLocale() {
  const { t, i18n } = useTranslation();

  const tList = useCallback(
    (key: string): string[] => {
      const value = t(key, { returnObjects: true });

      if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === 'string');
      }

      if (typeof value === 'string' && value !== key) {
        return [value];
      }

      return [];
    },
    [t],
  );

  const tObject = useCallback(
    <T,>(key: string): T => {
      const value = t(key, { returnObjects: true });

      // Guard against i18next returning the key string when a resource is missing.
      if (typeof value === 'string') {
        return [] as T;
      }

      return value as T;
    },
    [t],
  );

  const tArray = useCallback(
    <T,>(key: string): T[] => {
      const value = t(key, { returnObjects: true });

      if (Array.isArray(value)) {
        return value as T[];
      }

      // Some i18n setups may expose arrays as objects with numeric keys.
      if (isPlainObject(value)) {
        return Object.keys(value)
          .sort((a, b) => Number(a) - Number(b))
          .map((entryKey) => value[entryKey] as T)
          .filter((item) => item !== undefined && item !== null);
      }

      return [];
    },
    [t],
  );

  return { t, i18n, tList, tObject, tArray };
}
