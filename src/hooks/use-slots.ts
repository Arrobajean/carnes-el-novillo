"use client";

import { useEffect, useState } from "react";
import { fetchSlots } from "@/lib/api";
import { isIsoDate } from "@/lib/dates";
import type { SlotStatus } from "@/lib/types";

export type SlotsState =
  | { status: "idle"; slots: SlotStatus[]; error: null }
  | { status: "loading"; slots: SlotStatus[]; error: null }
  | { status: "ready"; slots: SlotStatus[]; error: null }
  | { status: "error"; slots: SlotStatus[]; error: string };

const IDLE: SlotsState = { status: "idle", slots: [], error: null };

/** Franjas del día elegido. Cancela la petición anterior si el usuario cambia de día. */
export function useSlots(date: string): SlotsState {
  const [state, setState] = useState<{ key: string; value: SlotsState }>({ key: "", value: IDLE });

  useEffect(() => {
    if (!isIsoDate(date)) return;
    const controller = new AbortController();
    let active = true;
    fetchSlots(date, controller.signal)
      .then((response) => {
        if (active) setState({ key: date, value: { status: "ready", slots: response.slots, error: null } });
      })
      .catch((error: unknown) => {
        if (!active || (error instanceof DOMException && error.name === "AbortError")) return;
        const message = error instanceof Error ? error.message : "No se pudieron cargar las franjas.";
        setState({ key: date, value: { status: "error", slots: [], error: message } });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [date]);

  if (!isIsoDate(date)) return IDLE;
  return state.key === date ? state.value : { status: "loading", slots: [], error: null };
}
