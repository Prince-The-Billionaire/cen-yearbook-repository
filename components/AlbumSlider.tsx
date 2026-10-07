"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@/components/icons";

/** How long each album stays before the slider moves on. */
const ADVANCE_EVERY_MS = 4500;
/** After you swipe, scroll or click an arrow, autoplay waits this long before resuming. */
const RESUME_AFTER_MS = 8000;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Whether the visitor asked their device to reduce motion (false while rendering on the server). */
function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/**
 * Horizontal scroll-snap slider that moves on by itself. Swipe on touch, use the
 * arrows, or Tab through the tiles. It pauses while the pointer or keyboard focus
 * is on it, right after you interact, when the tab is hidden or the slider is off
 * screen, and has a pause button. Children must be <li> elements.
 */
export default function AlbumSlider({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ atStart: true, atEnd: false });
  const reducedMotion = useReducedMotion();
  // null = follow the device setting (autoplay unless it asks to reduce motion); the pause button overrides it.
  const [manual, setManual] = useState<boolean | null>(null);
  const playing = manual ?? !reducedMotion;

  const hovering = useRef(false); // pointer or keyboard focus is on the slider
  const visible = useRef(true); // slider is on screen
  const holdUntil = useRef(0); // timestamp: the visitor just interacted, so wait

  const updateEdges = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    setEdge({
      atStart: list.scrollLeft <= 4,
      atEnd: list.scrollLeft + list.clientWidth >= list.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    updateEdges();
    list.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      list.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const behavior = useCallback(
    (): ScrollBehavior => (window.matchMedia(REDUCED_MOTION).matches ? "auto" : "smooth"),
    [],
  );

  const slide = useCallback(
    (direction: 1 | -1) => {
      const list = listRef.current;
      if (!list) return;
      const tile = list.querySelector("li");
      // One tile plus the gap between tiles.
      const distance = tile ? tile.getBoundingClientRect().width + 16 : list.clientWidth * 0.8;
      list.scrollBy({ left: direction * distance, behavior: behavior() });
    },
    [behavior],
  );

  const holdAutoplay = useCallback(() => {
    holdUntil.current = Date.now() + RESUME_AFTER_MS;
  }, []);

  // Only advance while the slider is actually on screen.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      const list = listRef.current;
      if (!list || document.hidden || hovering.current || !visible.current || Date.now() < holdUntil.current) return;
      const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 4;
      if (atEnd) list.scrollTo({ left: 0, behavior: behavior() }); // loop back to the first album
      else slide(1);
    }, ADVANCE_EVERY_MS);
    return () => window.clearInterval(timer);
  }, [playing, slide, behavior]);

  const arrow =
    "absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white/95 text-slate-950 shadow-lg transition hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 disabled:pointer-events-none disabled:opacity-0";

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
      onFocus={() => (hovering.current = true)}
      onBlur={() => (hovering.current = false)}
      onPointerDown={holdAutoplay}
      onWheel={holdAutoplay}
      onTouchStart={holdAutoplay}
    >
      <ul
        ref={listRef}
        aria-label="Photo albums"
        className="-mx-4 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-pl-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>

      <button
        type="button"
        onClick={() => {
          holdAutoplay();
          slide(-1);
        }}
        disabled={edge.atStart}
        aria-label="Previous albums"
        className={`${arrow} left-1 sm:left-3`}
      >
        <ChevronLeftIcon className="h-6 w-6" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => {
          holdAutoplay();
          slide(1);
        }}
        disabled={edge.atEnd}
        aria-label="Next albums"
        className={`${arrow} right-1 sm:right-3`}
      >
        <ChevronRightIcon className="h-6 w-6" aria-hidden />
      </button>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setManual(!playing)}
          aria-pressed={!playing}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-slate-500 transition-colors hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
        >
          {playing ? <PauseIcon className="h-4 w-4" aria-hidden /> : <PlayIcon className="h-4 w-4" aria-hidden />}
          {playing ? "Pause slider" : "Play slider"}
        </button>
      </div>
    </div>
  );
}
