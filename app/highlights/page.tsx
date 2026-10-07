import type { Metadata } from "next";
import Link from "next/link";
import { Trophy } from "lucide-react";
import Avatar from "@/components/Avatar";
import Navbar from "@/components/Navbar";
import { awardViews } from "@/lib/highlights";
import { getProfilePhotos } from "@/lib/profile-photos";

export const metadata: Metadata = {
  title: "Highlights",
  description: "Most likely to... the fun awards for the Computer Engineering Class of 2026.",
};

// Re-read the Cloudinary photos at most every 2 minutes.
export const revalidate = 120;

export default async function HighlightsPage() {
  const photos = await getProfilePhotos();

  return (
    <div className="bg-zinc-50 dark:bg-[#0a0a0a]">
      <Navbar />
      <main className="min-h-screen px-4 pb-24 pt-16 font-[family-name:var(--font-ui)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">Computer Engineering</p>
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-white">
                Highlights
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              Most likely to&hellip; The class awards, announced here as they are decided.
            </p>
          </header>

          <ul className="grid gap-5 md:grid-cols-2">
            {awardViews.map((award) => (
              <li
                key={award.id}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-none"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                    <Trophy className="h-6 w-6" aria-hidden />
                  </span>
                  <h2 className="font-display text-2xl font-bold leading-snug text-zinc-900 dark:text-white">
                    {award.title}
                  </h2>
                </div>

                {award.winners.length === 0 && (
                  <p className="mt-5 inline-block rounded-full border border-dashed border-zinc-300 px-4 py-2 text-sm text-zinc-500 dark:border-white/20 dark:text-zinc-400">
                    Winner to be announced
                  </p>
                )}

                <ul className="mt-5 flex flex-wrap gap-3">
                  {award.winners.map((winner) => (
                    <li key={winner.slug}>
                      <Link
                        href={`/student/${winner.slug}`}
                        className="group flex items-center gap-3 rounded-full border border-zinc-200 py-1.5 pl-1.5 pr-4 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-white/15 dark:hover:bg-white/10"
                      >
                        <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-800">
                          <Avatar name={winner.name} src={photos.get(winner.slug)?.main ?? winner.profilePic} sizes="36px" initialsClassName="text-sm" />
                        </span>
                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{winner.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {award.reason && (
                  <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{award.reason}</p>
                )}
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-zinc-500 dark:text-zinc-400">
            Want to see the numbers behind the class? Check{" "}
            <Link href="/stats" className="font-medium underline underline-offset-4">
              Class by the Numbers
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
