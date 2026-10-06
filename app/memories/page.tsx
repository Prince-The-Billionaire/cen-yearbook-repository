import type { Metadata } from "next";
import Link from "next/link";
import AlbumCover from "@/components/AlbumCover";
import Navbar from "@/components/Navbar";
import { getAlbumsWithItems } from "@/lib/memories";

// Re-read the Cloudinary albums at most every 2 minutes (keep in sync with lib/memories.ts).
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Memories",
  description: "Photo and video albums from around the Computer Engineering department.",
};

export default async function MemoriesPage() {
  const albums = await getAlbumsWithItems();

  return (
    <div className="bg-zinc-50 dark:bg-[#0a0a0a]">
      <Navbar />
      <main className="min-h-screen px-4 pb-24 pt-16 font-[family-name:var(--font-ui)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-12 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
              Computer Engineering
            </p>
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-white">
                Memories
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              Photos and clips from around the department, grouped by album.
            </p>
          </header>

          {albums.length === 0 ? (
            <p className="py-24 text-center text-zinc-500" role="status">
              No albums have been added yet. Check back soon.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {albums.map(({ album, items }) => (
                <li key={album.slug}>
                  <Link
                    href={`/memories/${album.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-400 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-none dark:hover:border-white/30"
                  >
                    <div
                      className={`relative aspect-[4/5] w-full overflow-hidden ${
                        album.layout === "stickers" ? "checker" : "bg-zinc-200 dark:bg-zinc-800"
                      }`}
                    >
                      <AlbumCover
                        album={album}
                        item={items[0]}
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-base font-semibold text-zinc-900 dark:text-white">{album.title}</h2>
                      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
