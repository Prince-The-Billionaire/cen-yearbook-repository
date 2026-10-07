import Link from "next/link";
import AlbumCover from "@/components/AlbumCover";
import { getAlbumsWithItems } from "@/lib/memories";

/** Home-page teaser for Memories: one tile per album that has files. Renders nothing if there are none. */
export default async function MemoriesPreview() {
  const albums = await getAlbumsWithItems();
  if (albums.length === 0) return null;

  return (
    <section
      id="memories"
      className="relative w-full overflow-hidden border-t border-slate-200 bg-slate-50 px-4 py-20 text-slate-950 sm:px-8 sm:py-28 md:py-36"
    >
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-12 flex flex-col justify-between gap-6 sm:mb-16 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-slate-500 sm:text-sm">
              [MEMORIES]
            </p>
            <h2 className="font-sans text-5xl font-black uppercase leading-none tracking-tighter text-slate-950 sm:text-7xl md:text-8xl">
              THE{" "}
              <span className="bg-gradient-to-b from-slate-950 via-slate-700 to-slate-400 bg-clip-text font-black italic text-transparent filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
                ALBUMS
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-slate-600 sm:text-sm">
            Photos and clips from program events, grouped by album.
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {albums.map(({ album, items }) => (
            <li key={album.slug}>
              <Link
                href={`/memories/${album.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-sm bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
              >
                <AlbumCover
                  album={album}
                  item={items[0]}
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-12 text-white">
                  <span className="block font-mono text-xs font-bold uppercase tracking-widest sm:text-sm">
                    {album.title}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-white/70">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex justify-center sm:mt-20">
          <Link
            href="/memories"
            className="rounded-full border border-slate-950 px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-slate-950 transition-colors hover:bg-slate-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
          >
            View all albums &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
