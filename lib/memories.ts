// Server-only: reads the Memories albums from Cloudinary using the API secret.
// Do not import this file from a client component.
import { albums, getAlbumBySlug, type Album } from "@/data/albums";
import type { MemoryItem } from "@/lib/memory-media";

const PAGE_SIZE = 100;
const MAX_PAGES = 10; // up to 1000 files across all albums

// How long Next may reuse the Cloudinary response. The pages that call these
// functions set the same number in `export const revalidate` (it must be a
// literal there). Cloudinary's Admin/Search API allows 500 calls per hour, and
// every album is fetched with a single search, so 2 minutes is far below that.
const REVALIDATE_SECONDS = 120;

interface CloudinaryResource {
  public_id: string;
  asset_id?: string;
  asset_folder?: string;
  resource_type: string;
  format?: string;
  display_name?: string;
  filename?: string;
  /** Content hash: identical files share an etag even if uploaded twice. */
  etag?: string;
  bytes?: number;
  width?: number;
  height?: number;
  created_at: string;
  // Search API returns either { custom: {...} } or the flat key/value map.
  context?: { custom?: Record<string, string> } & Record<string, unknown>;
}

interface SearchResponse {
  resources?: CloudinaryResource[];
  next_cursor?: string;
}

export interface AlbumContent {
  album: Album;
  items: MemoryItem[];
  /** The album's main cover: the file named "00_cover" if there is one, otherwise its first file. */
  cover?: MemoryItem;
  /** All cover pictures in order: 00_cover, 00_cover_2, 00_cover_3 ... (just the cover if there are no extras). */
  covers: MemoryItem[];
}

/** Shown in development only, so the layout can be reviewed before Cloudinary is set up. */
const SAMPLE_ITEMS: MemoryItem[] = [
  ["course_trad.jpg", 1280, 960],
  ["course_girls.jpg", 1280, 960],
  ["course_guys.jpg", 1280, 960],
].map(([file, width, height], index) => ({
  id: `sample-${index}`,
  type: "image" as const,
  width: width as number,
  height: height as number,
  caption: "Sample photo (placeholder until Cloudinary is connected)",
  createdAt: new Date(2026, 0, 1 + index).toISOString(),
  localSrc: `/${file}`,
}));

interface Entry {
  item: MemoryItem;
  /** Original filename without Cloudinary's random 6-character suffix. */
  name: string;
  /** Identifies the file's content, used to hide duplicate uploads. */
  key: string;
}

// Cloudinary files documents like PDFs under resource_type "image"; they aren't memories.
const NON_MEDIA_FORMATS = new Set(["pdf", "psd", "ai", "eps"]);

// An album's cover pictures are named 00_cover, 00_cover_2, 00_cover_3 ... (up to _9).
// 00_cover is the main cover, used wherever a single picture is shown; the numbered
// ones take turns with it on the album cards. The name must match exactly (a trailing
// " (1)" from a re-download is tolerated), so something like "00_cover_old" is just
// a normal photo and never competes for the cover.
const COVER_NAME = /^00[ _-]?cover(?:[ _-]?([2-9]))?(?:\s*\(\d+\))?$/i;

const nameCollator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

const originalName = (resource: CloudinaryResource) =>
  (resource.display_name ?? resource.filename ?? resource.public_id.split("/").pop() ?? "")
    .replace(/_[a-z0-9]{6}$/, "");

export function toMemoryItem(resource: CloudinaryResource, cloudName: string): MemoryItem | null {
  if (resource.resource_type !== "image" && resource.resource_type !== "video") return null;
  if (!resource.width || !resource.height) return null;
  if (resource.format && NON_MEDIA_FORMATS.has(resource.format.toLowerCase())) return null;

  const context = resource.context?.custom ?? resource.context ?? {};
  const caption = [context.caption, context.alt].find(
    (value): value is string => typeof value === "string" && value.trim() !== "",
  );

  return {
    id: resource.asset_id ?? resource.public_id,
    type: resource.resource_type,
    width: resource.width,
    height: resource.height,
    caption: caption?.trim(),
    format: resource.format,
    name: originalName(resource),
    createdAt: resource.created_at,
    publicId: resource.public_id,
    cloudName,
  };
}

function toEntry(resource: CloudinaryResource, cloudName: string): Entry | null {
  const item = toMemoryItem(resource, cloudName);
  if (!item) return null;
  const name = originalName(resource);
  return { item, name, key: resource.etag ? `etag:${resource.etag}` : `${name}|${resource.bytes ?? ""}` };
}

/**
 * Drops duplicate uploads (keeping the earliest copy), then orders by original
 * filename with natural number ordering (IMG_9390 before IMG_9640). Items with
 * the same name fall back to newest upload first.
 */
export function arrangeMemories(entries: Entry[]): MemoryItem[] {
  const seen = new Set<string>();
  const unique: Entry[] = [];
  for (const entry of [...entries].sort((a, b) => a.item.createdAt.localeCompare(b.item.createdAt))) {
    if (seen.has(entry.key)) continue;
    seen.add(entry.key);
    unique.push(entry);
  }
  return unique
    .sort((a, b) => nameCollator.compare(a.name, b.name) || b.item.createdAt.localeCompare(a.item.createdAt))
    .map((entry) => entry.item);
}

/**
 * Picks the cover pictures before duplicates are removed, so a cover that is
 * also uploaded elsewhere in the album isn't lost. They come back in order
 * (00_cover, then _2, _3 ...). If several files share a name, the most recent
 * upload wins. With no cover files, the album's first file is the only cover.
 */
function pickCovers(entries: Entry[], items: MemoryItem[]): MemoryItem[] {
  const byNumber = new Map<number, MemoryItem>();
  for (const entry of [...entries].sort((a, b) => b.item.createdAt.localeCompare(a.item.createdAt))) {
    const match = entry.name.match(COVER_NAME);
    if (!match) continue;
    const number = match[1] ? Number(match[1]) : 1;
    if (!byNumber.has(number)) byNumber.set(number, entry.item);
  }
  const covers = [...byNumber.entries()].sort(([a], [b]) => a - b).map(([, item]) => item);
  return covers.length > 0 ? covers : items.slice(0, 1);
}

/** The folder a resource lives in: dynamic-folder accounts set asset_folder, fixed-folder ones prefix the public_id. */
const folderOf = (resource: CloudinaryResource) =>
  (resource.asset_folder ?? resource.public_id.split("/").slice(0, -1).join("/")).toLowerCase();

/** Fetches all albums with one search and groups the files by folder. */
async function loadAlbums(): Promise<AlbumContent[]> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    // Production hides everything; dev shows sample photos in the "after-hours" album.
    return albums.map((album) => {
      const items = process.env.NODE_ENV !== "production" && album.slug === "after-hours" ? SAMPLE_ITEMS : [];
      return { album, items, cover: items[0], covers: items.slice(0, 1) };
    });
  }

  // `asset_folder` is the folder in Cloudinary's dynamic-folder mode; the
  // public_id prefix covers accounts using fixed folders.
  const expression = albums
    .map((album) => `asset_folder="${album.folder}" OR public_id:${album.folder}/*`)
    .join(" OR ");
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const entriesByFolder = new Map<string, Entry[]>();
  let cursor: string | undefined;

  const collect = () =>
    albums.map((album) => {
      const entries = entriesByFolder.get(album.folder.toLowerCase()) ?? [];
      const items = arrangeMemories(entries);
      const covers = pickCovers(entries, items);
      return { album, items, cover: covers[0], covers };
    });

  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          expression,
          sort_by: [{ created_at: "desc" }],
          max_results: PAGE_SIZE,
          with_field: ["context"],
          ...(cursor ? { next_cursor: cursor } : {}),
        }),
        next: { revalidate: REVALIDATE_SECONDS },
      });

      if (!response.ok) throw new Error(`Cloudinary responded ${response.status}`);

      const data = (await response.json()) as SearchResponse;
      for (const resource of data.resources ?? []) {
        const entry = toEntry(resource, cloudName);
        if (!entry) continue;
        const folder = folderOf(resource);
        entriesByFolder.set(folder, [...(entriesByFolder.get(folder) ?? []), entry]);
      }

      cursor = data.next_cursor;
      if (!cursor) break;
    }
  } catch (error) {
    console.error("[memories] Could not load from Cloudinary:", error);
    return collect(); // whatever loaded before the failure (possibly empty)
  }

  return collect();
}

/** Albums that have at least one file, in the order defined in data/albums.ts. */
export async function getAlbumsWithItems(): Promise<(AlbumContent & { cover: MemoryItem })[]> {
  return (await loadAlbums()).filter(
    (content): content is AlbumContent & { cover: MemoryItem } => content.items.length > 0 && !!content.cover,
  );
}

/** One album (even if empty). Undefined for an unknown slug. */
export async function getAlbum(slug: string): Promise<AlbumContent | undefined> {
  if (!getAlbumBySlug(slug)) return undefined;
  return (await loadAlbums()).find((content) => content.album.slug === slug);
}
