import { useSyncExternalStore } from "react";

/**
 * Hydration-safe "is client" flag without setState in effects.
 * Server snapshot: false, client snapshot: true.
 */
export function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

