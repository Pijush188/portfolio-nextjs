"use client";

import { useSyncExternalStore } from "react";

function useMediaQuery(query: string, serverValue: boolean) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)", false);
export const useFinePointer = () => useMediaQuery("(hover:hover) and (pointer:fine)", true);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
