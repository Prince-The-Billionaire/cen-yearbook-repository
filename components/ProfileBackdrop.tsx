"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const WIDTH = 800; // blurred anyway, so small files are plenty
const CHANGE_EVERY_MS = 12000;
const FADE_SECONDS = 3;

/** Small, cached version of a Cloudinary photo; local photos are used as they are. */
function small(src: string) {
  return src.includes("res.cloudinary.com") && src.includes("/image/upload/")
    ? src.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${WIDTH}/`)
    : src;
}

/**
 * A blurred, greyed-out photo behind the whole profile page. With several photos it fades
 * slowly from one to the next (and stays still if the device asks for reduced motion).
 */
export default function ProfileBackdrop({ images }: { images: string[] }) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (reducedMotion || count < 2) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % count), CHANGE_EVERY_MS);
    return () => clearInterval(timer);
  }, [reducedMotion, count]);

  if (count === 0) return null;
  const src = small(images[index % count]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 scale-110 opacity-55 blur-xl grayscale dark:opacity-65">
        <AnimatePresence initial={false}>
          <motion.img
            key={src}
            src={src}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1, transition: { duration: FADE_SECONDS } }}
            transition={{ duration: FADE_SECONDS }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-50 dark:to-[#0a0a0a]" />
    </div>
  );
}
