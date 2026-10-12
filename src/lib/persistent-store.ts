// Almacén reactivo respaldado por localStorage, listo para useSyncExternalStore.
// Sin React: la lectura, la validación y la notificación se prueban por separado.

export interface PersistentStore<T> {
  subscribe(listener: () => void): () => void;
  getSnapshot(): T;
  /** Valor estable para el render en servidor y la hidratación. */
  getServerSnapshot(): T;
  set(next: T): void;
  update(change: (previous: T) => T): void;
}

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

interface PersistentStoreOptions<T> {
  key: string;
  empty: T;
  /** Valida el JSON leído. Devuelve null si no es utilizable (se parte de `empty`). */
  parse: (raw: unknown) => T | null;
  storage?: () => StorageLike | null;
}

function browserStorage(): StorageLike | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    // Acceso bloqueado (modo privado estricto, cookies desactivadas).
    return null;
  }
}

export function createPersistentStore<T>({ key, empty, parse, storage = browserStorage }: PersistentStoreOptions<T>): PersistentStore<T> {
  const listeners = new Set<() => void>();
  let state: T = empty;
  let loaded = false;

  function read(): T {
    try {
      const raw = storage()?.getItem(key);
      if (!raw) return empty;
      return parse(JSON.parse(raw)) ?? empty;
    } catch {
      return empty;
    }
  }

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function onStorage(event: StorageEvent) {
    if (event.key !== key) return;
    state = read();
    notify();
  }

  function subscribe(listener: () => void) {
    if (listeners.size === 0 && typeof window !== "undefined") window.addEventListener("storage", onStorage);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && typeof window !== "undefined") window.removeEventListener("storage", onStorage);
    };
  }

  function getSnapshot() {
    if (!loaded) {
      loaded = true;
      state = read();
    }
    return state;
  }

  function set(next: T) {
    loaded = true;
    state = next;
    try {
      storage()?.setItem(key, JSON.stringify(next));
    } catch {
      // Cuota agotada o almacenamiento bloqueado: el estado sigue vivo en memoria.
    }
    notify();
  }

  return {
    subscribe,
    getSnapshot,
    getServerSnapshot: () => empty,
    set,
    update: (change) => set(change(getSnapshot())),
  };
}
