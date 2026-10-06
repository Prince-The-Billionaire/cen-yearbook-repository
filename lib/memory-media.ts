// Types and URL helpers for the Memories section. Safe to import from client
// components: nothing in here reads secrets.

export interface MemoryItem {
  id: string;
  type: "image" | "video";
  width: number;
  height: number;
  caption?: string;
  createdAt: string;
  /** Cloudinary public id, e.g. "memories/farewell-lunch". Absent for local sample items. */
  publicId?: string;
  cloudName?: string;
  /** Path under /public for sample items shown before Cloudinary is configured. */
  localSrc?: string;
}

const base = (item: MemoryItem, kind: "image" | "video", transform: string) =>
  `https://res.cloudinary.com/${item.cloudName}/${kind}/upload/${transform}/${encodeURI(item.publicId ?? "")}`;

/** Resized, auto-format/quality image URL served straight from Cloudinary's CDN. */
export function memoryImageUrl(item: MemoryItem, width: number, quality: number | "auto" = "auto") {
  if (item.localSrc) return item.localSrc;
  return base(item, "image", `f_auto,q_${quality},c_limit,w_${width}`);
}

/** Still frame used as the thumbnail for a video. */
export function memoryPosterUrl(item: MemoryItem, width: number) {
  if (item.localSrc) return item.localSrc;
  return `${base(item, "video", `so_0,f_jpg,q_auto,c_limit,w_${width}`)}.jpg`;
}

/** Playable video URL (Cloudinary picks MP4/WebM per browser and compresses it). */
export function memoryVideoUrl(item: MemoryItem) {
  if (item.localSrc) return item.localSrc;
  return base(item, "video", "f_auto,q_auto");
}

export const memoryLabel = (item: MemoryItem) => item.caption || "Class memory";
