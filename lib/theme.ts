"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

export const THEME_KEY = "cen-theme";

/**
 * Runs in <head> before first paint so the saved theme never flashes.
 * Keep in sync with readTheme()/setTheme() below.
 */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_KEY}");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

const listeners = new Set<() => void>();

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage can be blocked (private mode); the theme still applies for this visit.
  }
  listeners.forEach((listener) => listener());
}

/** Current site-wide theme. Renders "dark" on the server and during hydration. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => "dark");
}
