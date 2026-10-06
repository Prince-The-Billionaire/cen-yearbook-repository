"use client";

import Image from "next/image";
import { memoryImageUrl, memoryLabel, memoryPosterUrl, type MemoryItem } from "@/lib/memory-media";

interface MemoryImageProps {
  item: MemoryItem;
  sizes: string;
  className?: string;
  priority?: boolean;
}

/**
 * Photo (or video poster) for a memory. Cloudinary items are resized and
 * compressed by Cloudinary itself, so Vercel's image optimiser isn't used.
 */
export default function MemoryImage({ item, sizes, className = "", priority }: MemoryImageProps) {
  const isVideo = item.type === "video";

  return (
    <Image
      src={item.localSrc ?? item.publicId ?? ""}
      alt={memoryLabel(item)}
      width={item.width}
      height={item.height}
      sizes={sizes}
      priority={priority}
      loader={
        item.localSrc
          ? undefined
          : ({ width }) => (isVideo ? memoryPosterUrl(item, width) : memoryImageUrl(item, width))
      }
      className={className}
    />
  );
}
