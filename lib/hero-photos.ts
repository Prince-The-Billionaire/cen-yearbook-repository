// Server-only: random photos from the Memories albums for the home page hero.
import "server-only";
import { getAlbumsWithItems } from "@/lib/memories";
import { memoryImageUrl } from "@/lib/memory-media";

/** How many photos the hero scatters (matches the slots in components/Hero.tsx). */
export const HERO_PHOTO_COUNT = 8;

export interface HeroPhoto {
  src: string;
  /** The album the photo comes from; clicking the photo opens it. */
  href: string;
  alt: string;
}

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * A fresh random mix of photos (not videos or stickers), taken in turn from
 * different albums so they don't all come from one event. The home page is
 * rebuilt every couple of minutes, so the mix changes over time. Returns fewer
 * than `count` (or none) if there aren't enough photos; the hero then falls back
 * to its built-in pictures.
 */
export async function getHeroPhotos(count = HERO_PHOTO_COUNT): Promise<HeroPhoto[]> {
  const albums = await getAlbumsWithItems();
  const pools = shuffle(
    albums
      .filter(({ album }) => album.layout !== "stickers")
      .map(({ album, items }) => ({ album, photos: shuffle(items.filter((item) => item.type === "image")) }))
      .filter((pool) => pool.photos.length > 0),
  );

  const picks: HeroPhoto[] = [];
  for (let round = 0; picks.length < count && pools.some((pool) => pool.photos.length > round); round++) {
    for (const pool of pools) {
      const item = pool.photos[round];
      if (!item || picks.length >= count) continue;
      picks.push({
        src: memoryImageUrl(item, 560),
        href: `/memories/${pool.album.slug}`,
        alt: `A photo from the ${pool.album.title} album`,
      });
    }
  }
  return picks;
}
