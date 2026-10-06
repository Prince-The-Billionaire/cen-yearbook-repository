"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import MemoryImage from "@/components/MemoryImage";
import {
  memoryImageUrl,
  memoryLabel,
  memoryVideoUrl,
  type MemoryItem,
} from "@/lib/memory-media";

const BATCH = 24;

type Filter = "all" | "image" | "video";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";

export default function MemoriesGallery({ items }: { items: MemoryItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(BATCH);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const photoCount = items.filter((item) => item.type === "image").length;
  const videoCount = items.length - photoCount;

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.type === filter)),
    [items, filter],
  );
  const shown = filtered.slice(0, visible);

  const chooseFilter = (next: Filter) => {
    setFilter(next);
    setVisible(BATCH);
  };

  const close = useCallback(() => setOpenIndex(null), []);
  // Lightbox steps through everything currently loaded, not just the first batch.
  const step = useCallback(
    (direction: 1 | -1) =>
      setOpenIndex((index) =>
        index === null ? index : (index + direction + shown.length) % shown.length,
      ),
    [shown.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex, close, step]);

  if (items.length === 0) {
    return (
      <p className="py-24 text-center text-zinc-500" role="status">
        No memories have been added yet. Check back soon.
      </p>
    );
  }

  const current = openIndex !== null ? shown[openIndex] : undefined;
  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: items.length },
    { id: "image", label: "Photos", count: photoCount },
    { id: "video", label: "Videos", count: videoCount },
  ];
  // Filters only help when there is a mix of photos and videos.
  const showFilters = photoCount > 0 && videoCount > 0;

  return (
    <MotionConfig reducedMotion="user">
      {showFilters && (
        <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter memories">
          {filters.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => chooseFilter(option.id)}
              aria-pressed={filter === option.id}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${FOCUS} ${
                filter === option.id
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                  : "border border-zinc-300 text-zinc-600 hover:bg-zinc-200/60 dark:border-white/20 dark:text-zinc-300 dark:hover:bg-white/10"
              }`}
            >
              {option.label} <span className="opacity-60">{option.count}</span>
            </button>
          ))}
        </div>
      )}

      <ul className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        {shown.map((item, index) => (
          <li key={item.id} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Open ${item.type === "video" ? "video" : "photo"}: ${memoryLabel(item)}`}
              style={{ aspectRatio: `${item.width} / ${item.height}` }}
              className={`group relative block w-full overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800 ${FOCUS}`}
            >
              <MemoryImage
                item={item}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                priority={index < 4}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              {item.type === "video" && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
                    <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden />
                  </span>
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-center gap-3">
        <p className="text-sm text-zinc-500" role="status">
          Showing {shown.length} of {filtered.length}
        </p>
        {shown.length < filtered.length && (
          <button
            type="button"
            onClick={() => setVisible((count) => count + BATCH)}
            className={`rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200 ${FOCUS}`}
          >
            Load more
          </button>
        )}
      </div>

      <AnimatePresence>
        {current && openIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Memory viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close viewer"
              autoFocus
              className="absolute right-4 top-4 z-10 rounded-full bg-white/15 p-3 text-white transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-white"
            >
              <X className="h-6 w-6" aria-hidden />
            </button>

            {shown.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous"
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next"
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden />
                </button>
              </>
            )}

            <div
              className="relative flex h-[80vh] w-full max-w-5xl items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              {current.type === "video" ? (
                <video
                  key={current.id}
                  src={memoryVideoUrl(current)}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-full max-w-full rounded-xl"
                />
              ) : (
                <Image
                  key={current.id}
                  src={current.localSrc ?? current.publicId ?? ""}
                  alt={memoryLabel(current)}
                  fill
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  loader={
                    current.localSrc ? undefined : ({ width }) => memoryImageUrl(current, width)
                  }
                  className="rounded-xl object-contain"
                />
              )}
            </div>

            <div className="mt-3 max-w-2xl text-center text-white/80" aria-live="polite">
              {current.caption && !current.localSrc && <p className="text-base">{current.caption}</p>}
              <p className="mt-1 text-sm text-white/50">
                {openIndex + 1} / {shown.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
