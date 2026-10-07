"use client";

import { useEffect, useRef, useState } from "react";
import MemoryImage from "@/components/MemoryImage";
import type { Album } from "@/data/albums";
import type { MemoryItem } from "@/lib/memory-media";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** How long each cover picture stays before fading to the next. */
const CHANGE_EVERY_MS = 4000;
/** Cards start a little apart so a whole row doesn't change at the same moment. */
const START_STAGGER_MS = 900;
/** The extra pictures are only fetched once the card has been on screen for this long. */
const LOAD_EXTRAS_AFTER_MS = 800;

/**
 * An album's cover pictures, filling its parent and fading from one to the next
 * (00_cover, 00_cover_2, 00_cover_3 ...). With a single picture it just shows it.
 * It pauses while the card is hovered or focused, when the card is off screen or
 * the tab is hidden, and doesn't rotate at all if the device asks to reduce
 * motion. Stickers are shown uncropped (the parent supplies the background);
 * everything else is cropped to fit.
 */
export default function AlbumCover({
  album,
  items,
  sizes,
  position = 0,
}: {
  album: Album;
  items: MemoryItem[];
  sizes: string;
  /** The card's place in its list, used to stagger the start. */
  position?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [extrasReady, setExtrasReady] = useState(false);
  const rotates = items.length > 1 && !reducedMotion;

  // Load the extra pictures only after the card has been visible for a moment.
  useEffect(() => {
    const root = rootRef.current;
    if (!rotates || !root) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      timer = window.setTimeout(() => setExtrasReady(true), LOAD_EXTRAS_AFTER_MS);
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [rotates]);

  useEffect(() => {
    const root = rootRef.current;
    if (!rotates || !extrasReady || !root) return;
    const card = root.closest("a") ?? root;
    let paused = false;
    let onScreen = true;
    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };
    card.addEventListener("mouseenter", pause);
    card.addEventListener("mouseleave", resume);
    card.addEventListener("focusin", pause);
    card.addEventListener("focusout", resume);
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    observer.observe(root);

    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        if (paused || !onScreen || document.hidden) return;
        setActive((current) => (current + 1) % items.length);
      }, CHANGE_EVERY_MS);
    }, (position % 4) * START_STAGGER_MS);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
      observer.disconnect();
      card.removeEventListener("mouseenter", pause);
      card.removeEventListener("mouseleave", resume);
      card.removeEventListener("focusin", pause);
      card.removeEventListener("focusout", resume);
    };
  }, [rotates, extrasReady, items.length, position]);

  const sticker = album.layout === "stickers";
  const imageClass = `h-full w-full transition duration-500 group-hover:scale-105 ${
    sticker ? "object-contain p-8" : "object-cover"
  }`;

  return (
    <div ref={rootRef} className="absolute inset-0">
      {items.map((item, index) => {
        if (index > 0 && !(rotates && extrasReady)) return null;
        const shown = index === active;
        return (
          <div
            key={item.id}
            aria-hidden={shown ? undefined : true}
            className={`absolute inset-0 transition-opacity duration-1000 ${shown ? "opacity-100" : "opacity-0"}`}
          >
            <MemoryImage item={item} sizes={sizes} className={imageClass} />
          </div>
        );
      })}
    </div>
  );
}
