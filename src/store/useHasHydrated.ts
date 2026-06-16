"use client";

import { useSyncExternalStore } from "react";
import { useRootsStore } from "./useRootsStore";

function subscribe(callback: () => void): () => void {
  if (useRootsStore.persist.hasHydrated()) {
    // Already hydrated — notify immediately then no-op unsubscribe
    callback();
    return () => {};
  }
  return useRootsStore.persist.onFinishHydration(callback);
}

const getSnapshot = () => useRootsStore.persist.hasHydrated();
const getServerSnapshot = () => false;

export function useHasHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
