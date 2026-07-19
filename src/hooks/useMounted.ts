"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/** True after client hydration — avoids theme-toggle flash/mismatch. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
