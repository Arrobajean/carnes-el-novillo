"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** false en servidor y durante la hidratación, true después: evita desajustes con datos de localStorage. */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
