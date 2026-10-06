import Link from "next/link";
import { Play } from "lucide-react";
import MemoryImage from "@/components/MemoryImage";
import { getMemories } from "@/lib/memories";

const PREVIEW_COUNT = 6;

/** Home-page teaser for the Memories gallery (photos and videos). Renders nothing if empty. */
export default async function MemoriesPreview() {
  const memories = await getMemories();
  const preview = memories.slice(0, PREVIEW_COUNT);
  if (preview.length === 0) return null;

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
              OTHER{" "}
              <span className="bg-gradient-to-b from-slate-950 via-slate-700 to-slate-400 bg-clip-text font-black italic text-transparent filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
                MOMENTS
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-slate-600 sm:text-sm">
            Random photos and clips from around the department that didn&rsquo;t fit anywhere else.
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {preview.map((item) => (
            <li key={item.id}>
              <Link
                href="/memories"
                aria-label={item.type === "video" ? "Watch video in memories" : "View photo in memories"}
                className="group relative block aspect-[4/5] overflow-hidden rounded-sm bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
              >
                <MemoryImage
                  item={item}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {item.type === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
                      <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden />
                    </span>
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex justify-center sm:mt-20">
          <Link
            href="/memories"
            className="rounded-full border border-slate-950 px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-slate-950 transition-colors hover:bg-slate-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
          >
            View all memories &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
