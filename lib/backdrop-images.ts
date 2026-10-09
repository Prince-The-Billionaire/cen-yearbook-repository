// Server-only: pictures for the blurred, greyed-out page backgrounds (components/ProfileBackdrop.tsx).
import "server-only";
import { getAlbumsWithItems } from "@/lib/memories";
import { memoryImageUrl } from "@/lib/memory-media";
import { getProfilePhotos } from "@/lib/profile-photos";

const COUNT = 6;
const WIDTH = 800; // blurred anyway, so small files are plenty

function pick<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, COUNT);
}

/** A few random students' main photos (for the Yearbook, Leaders, Highlights and Numbers pages). */
export async function getPeopleBackdrop(): Promise<string[]> {
  const photos = await getProfilePhotos();
  return pick([...photos.values()].flatMap((entry) => (entry.main ? [entry.main] : [])));
}

/** A few album cover pictures (for the Memories page); never the transparent stickers. */
export async function getMemoriesBackdrop(): Promise<string[]> {
  const albums = (await getAlbumsWithItems()).filter(({ album }) => album.layout !== "stickers");
  return pick(
    albums.flatMap(({ covers }) =>
      covers.filter((cover) => cover.type === "image").map((cover) => memoryImageUrl(cover, WIDTH)),
    ),
  );
}
