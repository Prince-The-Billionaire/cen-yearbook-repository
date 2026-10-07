import Link from "next/link";
import { Trophy } from "lucide-react";
import { awardViews } from "@/lib/highlights";
import { getClassStats } from "@/lib/stats";

const BUTTON =
  "rounded-full border border-slate-950 px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-slate-950 transition-colors hover:bg-slate-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950";

/** Home-page teaser for Class by the Numbers and the Highlights awards. */
export default function ClassTeasers() {
  const { groups } = getClassStats();
  const top = (id: string) => groups.find((group) => group.id === id)?.buckets[0];

  const tiles = [
    { bucket: top("slang"), caption: (label: string) => `say “${label}”, the most-used slang` },
    { bucket: top("lecturers"), caption: (label: string) => `picked ${label} as a favourite lecturer` },
    { bucket: top("courses"), caption: (label: string) => `named ${label} as their least favourite course` },
  ].flatMap(({ bucket, caption }) => (bucket ? [{ count: bucket.count, text: caption(bucket.label) }] : []));

  const featured = awardViews.slice(0, 3);

  return (
    <section
      id="highlights"
      className="relative w-full overflow-hidden border-t border-slate-200 bg-white px-4 py-20 text-slate-950 sm:px-8 sm:py-28 md:py-36"
    >
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-12 sm:mb-16">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-slate-500 sm:text-sm">[THE CLASS]</p>
          <h2 className="font-sans text-5xl font-black uppercase leading-none tracking-tighter text-slate-950 sm:text-7xl md:text-8xl">
            IN{" "}
            <span className="bg-gradient-to-b from-slate-950 via-slate-700 to-slate-400 bg-clip-text font-black italic text-transparent filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
              NUMBERS
            </span>
          </h2>
        </header>

        {tiles.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-3">
            {tiles.map((tile) => (
              <li key={tile.text} className="rounded-sm border border-slate-200 bg-slate-50 p-6">
                <p className="font-sans text-6xl font-black tracking-tighter text-slate-950">{tile.count}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{tile.text}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex justify-center">
          <Link href="/stats" className={BUTTON}>
            See all the numbers &rarr;
          </Link>
        </div>

        {featured.length > 0 && (
          <>
            <p className="mb-6 mt-20 font-mono text-xs uppercase tracking-[0.3em] text-slate-500 sm:text-sm">
              [MOST LIKELY TO&hellip;]
            </p>
            <ul className="grid gap-4 sm:grid-cols-3">
              {featured.map((award) => (
                <li key={award.id} className="rounded-sm border border-slate-200 p-6">
                  <Trophy className="mb-4 h-6 w-6 text-amber-500" aria-hidden />
                  <h3 className="font-sans text-xl font-black uppercase leading-tight tracking-tight">{award.title}</h3>
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-slate-500">
                    {award.winners.length > 0
                      ? award.winners.map((winner) => winner.name.split(" ")[0]).join(" & ")
                      : "Winner to be announced"}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex justify-center">
              <Link href="/highlights" className={BUTTON}>
                See all highlights &rarr;
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
