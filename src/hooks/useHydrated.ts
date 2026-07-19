import { useSyncExternalStore } from 'react';

function subscribe(): () => void {
  return () => undefined;
}

function getClientSnapshot(): boolean {
  return true;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Returns true after hydration on the client — useful for deferring
 * heavy visual effects that should not block initial render.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
