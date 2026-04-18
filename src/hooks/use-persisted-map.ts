"use client";

import { useCallback, useSyncExternalStore } from "react";

type PersistedState = Record<string, boolean>;
type Listener = () => void;

const EMPTY_STATE: PersistedState = Object.freeze({});

interface PersistedStore {
  hydrated: boolean;
  key: string;
  listeners: Set<Listener>;
  snapshot: PersistedState;
}

const stores = new Map<string, PersistedStore>();

function readStorage(key: string) {
  if (typeof window === "undefined") {
    return EMPTY_STATE;
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as PersistedState) : EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

function getOrCreateStore(key: string) {
  const existing = stores.get(key);
  if (existing) {
    return existing;
  }

  const store: PersistedStore = {
    hydrated: false,
    key,
    listeners: new Set(),
    snapshot: EMPTY_STATE,
  };

  stores.set(key, store);
  return store;
}

function emit(store: PersistedStore) {
  for (const listener of store.listeners) {
    listener();
  }
}

function writeSnapshot(store: PersistedStore, next: PersistedState) {
  store.snapshot = next;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(store.key, JSON.stringify(next));
  }

  emit(store);
}

function ensureHydrated(store: PersistedStore) {
  if (store.hydrated || typeof window === "undefined") {
    return;
  }

  store.hydrated = true;

  queueMicrotask(() => {
    const next = readStorage(store.key);
    if (next !== store.snapshot) {
      store.snapshot = next;
      emit(store);
    }
  });
}

export function usePersistedMap(key: string) {
  const store = getOrCreateStore(key);

  const subscribe = useCallback(
    (callback: Listener) => {
      ensureHydrated(store);
      store.listeners.add(callback);

      const onStorage = (event: StorageEvent) => {
        if (event.key !== key) {
          return;
        }

        const next = readStorage(key);
        if (next !== store.snapshot) {
          store.snapshot = next;
          callback();
        }
      };

      window.addEventListener("storage", onStorage);

      return () => {
        store.listeners.delete(callback);
        window.removeEventListener("storage", onStorage);
      };
    },
    [key, store],
  );

  const getSnapshot = useCallback(() => store.snapshot, [store]);
  const state = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_STATE);

  const setState = useCallback(
    (
      next:
        | PersistedState
        | ((current: PersistedState) => PersistedState),
    ) => {
      const resolved = typeof next === "function" ? next(store.snapshot) : next;
      writeSnapshot(store, resolved);
    },
    [store],
  );

  const toggle = useCallback(
    (itemKey: string) => {
      setState((current) => ({
        ...current,
        [itemKey]: !current[itemKey],
      }));
    },
    [setState],
  );

  return {
    state,
    setState,
    toggle,
  };
}
