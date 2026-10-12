import { describe, expect, it } from "vitest";
import { createPersistentStore, type StorageLike } from "./persistent-store";

function memoryStorage(initial?: string): StorageLike & { data: Map<string, string> } {
  const data = new Map<string, string>();
  if (initial !== undefined) data.set("k", initial);
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
  };
}

const parseNumber = (raw: unknown) => (typeof raw === "number" ? raw : null);

describe("almacén persistente", () => {
  it("parte del valor vacío si lo guardado no es válido", () => {
    const store = createPersistentStore({ key: "k", empty: 0, parse: parseNumber, storage: () => memoryStorage('"x"') });
    expect(store.getSnapshot()).toBe(0);
  });

  it("lee lo guardado y persiste cada cambio", () => {
    const storage = memoryStorage("5");
    const store = createPersistentStore({ key: "k", empty: 0, parse: parseNumber, storage: () => storage });
    expect(store.getSnapshot()).toBe(5);
    store.update((value) => value + 1);
    expect(store.getSnapshot()).toBe(6);
    expect(storage.data.get("k")).toBe("6");
  });

  it("sigue funcionando sin almacenamiento disponible", () => {
    const store = createPersistentStore({ key: "k", empty: 1, parse: parseNumber, storage: () => null });
    store.set(2);
    expect(store.getSnapshot()).toBe(2);
  });

  it("notifica a los suscriptores", () => {
    const store = createPersistentStore({ key: "k", empty: 0, parse: parseNumber, storage: () => null });
    let calls = 0;
    const unsubscribe = store.subscribe(() => {
      calls += 1;
    });
    store.set(3);
    unsubscribe();
    store.set(4);
    expect(calls).toBe(1);
  });
});
