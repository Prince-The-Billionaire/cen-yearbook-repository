// Server-only: finds students' photos in the Cloudinary "profiles" folder.
//
// Naming convention (the file's display name in Cloudinary, without extension):
//   amos-ibala       the main photo (the slug is the end of the profile URL)
//   amos-ibala_2     gallery photo 2, then _3, _4 ...
//
// Without Cloudinary credentials (or if Cloudinary is unreachable) this returns
// nothing and the site keeps using the photos listed in data/studentsData.ts.
import "server-only";
import { slugify } from "@/lib/student-utils";

const FOLDER = "profiles";
const PAGE_SIZE = 100;
const MAX_PAGES = 5; // up to 500 photos
const REVALIDATE_SECONDS = 120; // keep in sync with the pages' `revalidate`

export interface ProfilePhotos {
  main?: string;
  gallery: string[];
  /** Every photo by its number: 1 is the main photo, 2 is `<slug>_2`, and so on. */
  byIndex: Record<number, string>;
}

interface Resource {
  public_id: string;
  resource_type: string;
  format?: string;
  version?: number;
  display_name?: string;
  created_at: string;
}

const NON_PHOTO_FORMATS = new Set(["pdf", "psd", "ai", "eps"]);

/**
 * "amos-ibala_2" -> { slug: "amos-ibala", index: 2 }; "amos-ibala" -> index 1 (main photo).
 * Cloudinary sometimes adds a random 6-character code to a file's name
 * ("amos-ibala_2_yvdoiy"); it is ignored.
 */
export function parsePhotoName(raw: string): { slug: string; index: number } | null {
  const withoutCode = raw.trim().replace(/_[a-z0-9]{6}$/i, "");
  const match = withoutCode.match(/^(.+?)(?:[_\s]+(\d{1,2}))?$/);
  if (!match) return null;
  const slug = slugify(match[1]);
  if (!slug) return null;
  const index = match[2] ? Number(match[2]) : 1;
  return { slug, index: index >= 1 ? index : 1 };
}

/** Everything in the profiles folder, grouped per student slug. */
export async function getProfilePhotos(): Promise<Map<string, ProfilePhotos>> {
  const result = new Map<string, ProfilePhotos>();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return result;

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const resources: Resource[] = [];
  let cursor: string | undefined;

  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          expression: `asset_folder="${FOLDER}" AND resource_type:image`,
          sort_by: [{ created_at: "desc" }],
          max_results: PAGE_SIZE,
          ...(cursor ? { next_cursor: cursor } : {}),
        }),
        next: { revalidate: REVALIDATE_SECONDS },
      });
      if (!response.ok) throw new Error(`Cloudinary responded ${response.status}`);
      const data = (await response.json()) as { resources?: Resource[]; next_cursor?: string };
      resources.push(...(data.resources ?? []));
      cursor = data.next_cursor;
      if (!cursor) break;
    }
  } catch (error) {
    console.error("[profile-photos] Could not load from Cloudinary:", error);
    // While the live site refreshes a page in the background, throwing makes Next
    // keep serving the last good page (with photos) instead of replacing it with
    // one without. A deployment must still succeed if Cloudinary is briefly down,
    // so during the build we fall back to whatever local photos exist.
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") throw error;
    return result;
  }

  // Newest first, so if a name was uploaded twice the latest copy wins.
  const slots = new Map<string, Map<number, string>>();
  for (const resource of resources) {
    if (resource.resource_type !== "image" || NON_PHOTO_FORMATS.has((resource.format ?? "").toLowerCase())) continue;
    const parsed = parsePhotoName(resource.display_name ?? resource.public_id);
    if (!parsed) continue;
    const byIndex = slots.get(parsed.slug) ?? new Map<number, string>();
    if (!byIndex.has(parsed.index)) {
      const version = resource.version ? `v${resource.version}/` : "";
      byIndex.set(parsed.index, `https://res.cloudinary.com/${cloudName}/image/upload/${version}${resource.public_id}`);
    }
    slots.set(parsed.slug, byIndex);
  }

  for (const [slug, byIndex] of slots) {
    const gallery = [...byIndex.entries()]
      .filter(([index]) => index >= 2)
      .sort(([a], [b]) => a - b)
      .map(([, url]) => url);
    result.set(slug, { main: byIndex.get(1), gallery, byIndex: Object.fromEntries(byIndex) });
  }
  return result;
}

/** Swaps in Cloudinary photos where they exist, keeping the local ones as a fallback. */
export function withPhotos<T extends { slug: string; profilePic: string; orbitImages: string[] }>(
  student: T,
  photos: Map<string, ProfilePhotos>,
): T {
  const found = photos.get(student.slug);
  if (!found) return student;
  return {
    ...student,
    profilePic: found.main ?? student.profilePic,
    orbitImages: found.gallery.length > 0 ? found.gallery : student.orbitImages,
  };
}
