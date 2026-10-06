"use client";

import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "@/lib/theme";

/** Floating light/dark switch, rendered once in the root layout so every page has it. */
export default function ThemeToggle() {
  const theme = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="keep-colors fixed bottom-4 right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-zinc-300 bg-white/90 text-zinc-800 shadow-lg backdrop-blur transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-white/20 dark:bg-zinc-900/90 dark:text-zinc-100"
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </button>
  );
}
