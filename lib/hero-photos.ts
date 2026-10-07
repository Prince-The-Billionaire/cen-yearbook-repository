// Server-only: the pool of pictures that rotate around "WE ARE CEN" on the home page.
//
// Every student who has a main photo in Cloudinary is in the pool (people without a
// photo are skipped). The hero shows eight of them at a time and swaps them for others
// every few seconds (see components/Hero.tsx).
import "server-only";
import { allStudents } from "@/lib/students";
import { getProfilePhotos } from "@/lib/profile-photos";

export interface HeroPhoto {
  src: string;
  /** Where clicking the picture goes: the person's profile. */
  href: string;
  alt: string;
}

/** The hero always has exactly this many spots. */
export const HERO_PHOTO_COUNT = 8;

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
 * Every student with a main profile photo, in random order (a different order each time
 * the page refreshes). Returns [] if Cloudinary has nothing, and the hero then falls
 * back to its built-in pictures.
 */
export async function getHeroPhotos(): Promise<HeroPhoto[]> {
  const photos = await getProfilePhotos();
  const pool: HeroPhoto[] = [];
  for (const student of allStudents) {
    const main = photos.get(student.slug)?.main;
    if (!main) continue;
    pool.push({
      src: main.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${WIDTH}/`),
      href: `/student/${student.slug}`,
      alt: `A photo of ${student.name}`,
    });
  }
  return shuffle(pool);
}
