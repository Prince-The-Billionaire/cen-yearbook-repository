// Server-only: reads the Memories list from Cloudinary using the API secret.
// Do not import this file from a client component.
import type { MemoryItem } from "@/lib/memory-media";

const PAGE_SIZE = 100;
const MAX_PAGES = 5; // up to 500 items

interface CloudinaryResource {
  public_id: string;
  asset_id?: string;
  resource_type: string;
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

export function toMemoryItem(resource: CloudinaryResource, cloudName: string): MemoryItem | null {
  if (resource.resource_type !== "image" && resource.resource_type !== "video") return null;
  if (!resource.width || !resource.height) return null;

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
 * Newest-first list of everything in the `memories` folder or tagged `memories`
 * (rename with CLOUDINARY_MEMORIES_FOLDER). Returns [] if Cloudinary isn't
 * configured or fails, so the rest of the site keeps working.
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
  const items: MemoryItem[] = [];
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
        next: { revalidate: 600 },
      });

      if (!response.ok) throw new Error(`Cloudinary responded ${response.status}`);

      const data = (await response.json()) as SearchResponse;
      for (const resource of data.resources ?? []) {
        const item = toMemoryItem(resource, cloudName);
        if (item) items.push(item);
      }

      cursor = data.next_cursor;
      if (!cursor) break;
    }
  } catch (error) {
    console.error("[memories] Could not load from Cloudinary:", error);
    return items; // whatever loaded before the failure (possibly empty)
  }

  return items;
}
