import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { createElement, type PropsWithChildren } from 'react';
import { afterEach, vi } from 'vitest';

const MOTION_PROP_KEYS = new Set([
  'initial',
  'animate',
  'exit',
  'variants',
  'whileInView',
  'whileHover',
  'whileTap',
  'viewport',
  'transition',
  'layout',
  'layoutId',
]);

vi.mock('framer-motion', () => {
  const createMotionTag = (tag: string) => {
    return ({ children, ...props }: PropsWithChildren<Record<string, unknown>>) => {
      const safeProps: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(props)) {
        if (!MOTION_PROP_KEYS.has(key)) safeProps[key] = value;
      }
      return createElement(tag, safeProps, children);
    };
  };

  const motion = new Proxy(
    {},
    {
      get: (_target, key: string) => createMotionTag(key),
    },
  );

  return {
    AnimatePresence: ({ children }: PropsWithChildren) => children,
    motion,
    useReducedMotion: () => true,
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.localStorage.clear();
  window.sessionStorage.clear();
});
