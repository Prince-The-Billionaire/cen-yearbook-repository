import MemoryImage from "@/components/MemoryImage";
import type { Album } from "@/data/albums";
import type { MemoryItem } from "@/lib/memory-media";

/**
 * The first file of an album, filling its parent. Stickers are shown uncropped
 * (the parent supplies the background); everything else is cropped to fit.
 */
export default function AlbumCover({
  album,
  item,
  sizes,
}: {
  album: Album;
  item: MemoryItem;
  sizes: string;
}) {
  const sticker = album.layout === "stickers";
  return (
    <MemoryImage
      item={item}
      sizes={sizes}
      className={`h-full w-full transition duration-500 group-hover:scale-105 ${
        sticker ? "object-contain p-8" : "object-cover"
      }`}
    />
  );
}
