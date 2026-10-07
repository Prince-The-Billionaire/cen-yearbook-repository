"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

/**
 * Horizontal scroll-snap slider. Swipe on touch, use the arrows, or Tab through
 * the tiles. Children must be <li> elements.
 */
export default function AlbumSlider({ children }: { children: ReactNode }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ atStart: true, atEnd: false });

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

  const slide = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const tile = list.querySelector("li");
    // One tile plus the gap between tiles.
    const distance = tile ? tile.getBoundingClientRect().width + 16 : list.clientWidth * 0.8;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({ left: direction * distance, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const arrow =
    "absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white/95 text-slate-950 shadow-lg transition hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 disabled:pointer-events-none disabled:opacity-0";

  return (
    <div className="relative">
      <ul
        ref={listRef}
        aria-label="Photo albums"
        className="-mx-4 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-pl-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>

      <button
        type="button"
        onClick={() => slide(-1)}
        disabled={edge.atStart}
        aria-label="Previous albums"
        className={`${arrow} left-1 sm:left-3`}
      >
        <ChevronLeftIcon className="h-6 w-6" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => slide(1)}
        disabled={edge.atEnd}
        aria-label="Next albums"
        className={`${arrow} right-1 sm:right-3`}
      >
        <ChevronRightIcon className="h-6 w-6" aria-hidden />
      </button>
    </div>
  );
}
