// Server-only: the pictures scattered around "WE ARE CEN" on the home page.
//
// Always eight: the album covers (each album's 00_cover, or its first file; never
// Stickers) with Inim Bright's photo fixed as the 8th.
import "server-only";
import { getAlbumsWithItems } from "@/lib/memories";
import { memoryImageUrl, memoryPosterUrl } from "@/lib/memory-media";
import { getProfilePhotos } from "@/lib/profile-photos";

export interface HeroPhoto {
  src: string;
  /** Where clicking the picture goes: the album, or the person's profile. */
  href: string;
  alt: string;
}

/** The hero always shows exactly this many pictures. */
export const HERO_PHOTO_COUNT = 8;

// The 8th picture: Inim Bright's third photo (the file named inim-bright-kudos_3).
const FIXED_EIGHTH = { slug: "inim-bright-kudos", name: "Inim Bright Kudos", photoNumber: 3 };

const WIDTH = 560; // the biggest slot is under 200px wide, so this stays sharp on retina screens

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Exactly eight pictures (fewer only if Cloudinary has too few photos):
 * - up to seven album covers, shuffled between the slots each time the page
 *   refreshes. If there are more than seven albums, a different seven are shown
 *   each time; if fewer, the gap is topped up with random photos from the albums.
 * - Inim Bright's photo, always in the 8th slot.
 * Returns [] if Cloudinary has nothing yet, and the hero then falls back to its
 * built-in pictures.
 */
export async function getHeroPhotos(): Promise<HeroPhoto[]> {
  const albums = (await getAlbumsWithItems()).filter(({ album }) => album.layout !== "stickers");

  const covers = shuffle(
    albums.map(({ album, cover }) => ({
      id: cover.id,
      photo: {
        src: cover.type === "video" ? memoryPosterUrl(cover, WIDTH) : memoryImageUrl(cover, WIDTH),
        href: `/memories/${album.slug}`,
        alt: `Cover of the ${album.title} album`,
      } satisfies HeroPhoto,
    })),
  );
  if (covers.length === 0) return [];

  const profile = (await getProfilePhotos()).get(FIXED_EIGHTH.slug);
  const fixedUrl = profile?.byIndex[FIXED_EIGHTH.photoNumber];
  const fixed: HeroPhoto | null = fixedUrl
    ? {
        src: fixedUrl.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${WIDTH}/`),
        href: `/student/${FIXED_EIGHTH.slug}`,
        alt: `A photo of ${FIXED_EIGHTH.name}`,
      }
    : null;

  const wanted = fixed ? HERO_PHOTO_COUNT - 1 : HERO_PHOTO_COUNT;
  const picks = covers.slice(0, wanted).map((cover) => cover.photo);

  if (picks.length < wanted) {
    // Fewer albums than slots: top up with random photos (not videos) from the albums.
    const coverIds = new Set(covers.map((cover) => cover.id));
    const extras = shuffle(
      albums.flatMap(({ album, items }) =>
        items
          .filter((item) => item.type === "image" && !coverIds.has(item.id))
          .map((item) => ({
            src: memoryImageUrl(item, WIDTH),
            href: `/memories/${album.slug}`,
            alt: `A photo from the ${album.title} album`,
          })),
      ),
    );
    picks.push(...extras.slice(0, wanted - picks.length));
  }

  return fixed ? [...picks, fixed] : picks;
}
