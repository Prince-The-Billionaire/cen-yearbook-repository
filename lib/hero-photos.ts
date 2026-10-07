// Server-only: the pictures scattered around "WE ARE CEN" on the home page.
//
// They are the album covers (each album's 00_cover, or its first file), one per
// album except Stickers, plus one fixed picture of Inim Bright as the 8th.
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

// The 8th picture: Inim Bright's third photo (the file named inim-bright-kudos_3).
const FIXED_EIGHTH = { slug: "inim-bright-kudos", name: "Inim Bright Kudos", photoNumber: 3 };
const FIXED_POSITION = 7; // zero-based: the 8th slot

const WIDTH = 560; // the biggest slot is about 224px wide, so this stays sharp on retina screens

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * One picture per album (never Stickers), shuffled between the slots each time
 * the page refreshes, with Inim Bright's photo fixed in the 8th slot. An album
 * added later gets its own extra slot. Returns [] if Cloudinary has nothing yet,
 * and the hero then falls back to its built-in pictures.
 */
export async function getHeroPhotos(): Promise<HeroPhoto[]> {
  const albums = await getAlbumsWithItems();
  const covers: HeroPhoto[] = shuffle(
    albums
      .filter(({ album }) => album.layout !== "stickers")
      .map(({ album, cover }) => ({
        src: cover.type === "video" ? memoryPosterUrl(cover, WIDTH) : memoryImageUrl(cover, WIDTH),
        href: `/memories/${album.slug}`,
        alt: `Cover of the ${album.title} album`,
      })),
  );
  if (covers.length === 0) return [];

  const profile = (await getProfilePhotos()).get(FIXED_EIGHTH.slug);
  const url = profile?.byIndex[FIXED_EIGHTH.photoNumber];
  if (!url) return covers; // photo not uploaded: just the covers

  const fixed: HeroPhoto = {
    src: url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${WIDTH}/`),
    href: `/student/${FIXED_EIGHTH.slug}`,
    alt: `A photo of ${FIXED_EIGHTH.name}`,
  };

  const position = Math.min(FIXED_POSITION, covers.length);
  return [...covers.slice(0, position), fixed, ...covers.slice(position)];
}
