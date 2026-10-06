// Server-only: reads the Memories list from Cloudinary using the API secret.
// Do not import this file from a client component.
import type { MemoryItem } from "@/lib/memory-media";

const PAGE_SIZE = 100;
const MAX_PAGES = 5; // up to 500 items

// How long Next may reuse the Cloudinary response. The pages that call
// getMemories() set the same number in `export const revalidate` (it must be a
// literal there). Cloudinary's Admin/Search API allows 500 calls per hour, and
// 2 minutes uses well under a third of that.
const REVALIDATE_SECONDS = 120;

interface CloudinaryResource {
  public_id: string;
  asset_id?: string;
  resource_type: string;
  width?: number;
  height?: number;
  created_at: string;
  format?: string;
  display_name?: string;
  filename?: string;
  /** Content hash: identical files share an etag even if uploaded twice. */
  etag?: string;
  bytes?: number;
  // Search API returns either { custom: {...} } or the flat key/value map.
  context?: { custom?: Record<string, string> } & Record<string, unknown>;
}

interface SearchResponse {
  resources?: CloudinaryResource[];
  next_cursor?: string;
}

/** Shown in development only, so the layout can be reviewed before Cloudinary is set up. */
const SAMPLE_ITEMS: MemoryItem[] = [
  ["course_group1.png", 1280, 960],
  ["prince_group_1.png", 1086, 1448],
  ["course_trad.jpg", 1280, 960],
  ["shalom_3.jpg", 960, 1280],
  ["course_girls.jpg", 1280, 960],
  ["gerald_2.jpg", 1920, 2560],
  ["course_guys.jpg", 1280, 960],
  ["bright_3.jpg", 960, 1280],
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

const nameCollator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

const originalName = (resource: CloudinaryResource) =>
  (resource.display_name ?? resource.filename ?? resource.public_id.split("/").pop() ?? "")
    .replace(/_[a-z0-9]{6}$/, "");

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
    createdAt: resource.created_at,
    publicId: resource.public_id,
    cloudName,
  };
}

/**
 * Everything in the `memories` folder or tagged `memories` (rename with
 * CLOUDINARY_MEMORIES_FOLDER), de-duplicated and sorted by filename. Returns []
 * if Cloudinary isn't configured or fails, so the rest of the site keeps working.
 */
export async function getMemories(): Promise<MemoryItem[]> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return process.env.NODE_ENV === "production" ? [] : SAMPLE_ITEMS;
  }

  const name = process.env.CLOUDINARY_MEMORIES_FOLDER || "memories";
  // `asset_folder` is the folder in Cloudinary's dynamic-folder mode; the
  // public_id prefix covers accounts using fixed folders and subfolders.
  const expression = `asset_folder="${name}" OR public_id:${name}/* OR tags="${name}"`;
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const entries: Entry[] = [];
  let cursor: string | undefined;

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
        if (entry) entries.push(entry);
      }

      cursor = data.next_cursor;
      if (!cursor) break;
    }
  } catch (error) {
    console.error("[memories] Could not load from Cloudinary:", error);
    return arrangeMemories(entries); // whatever loaded before the failure (possibly empty)
  }

  return arrangeMemories(entries);
}
