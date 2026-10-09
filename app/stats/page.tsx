import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProfileBackdrop from "@/components/ProfileBackdrop";
import { getPeopleBackdrop } from "@/lib/backdrop-images";
import StatCard from "@/components/StatCard";
import { getClassStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Class by the Numbers",
  description: "Slang, lecturers, courses and dream paths of the Computer Engineering Class of 2026, counted from the survey.",
};

// Re-read the Cloudinary photos (page background) at most every 2 minutes.
export const revalidate = 120;

export default async function StatsPage() {
  const { total, facts, groups } = getClassStats();
  const images = await getPeopleBackdrop();

  return (
    <div className="relative bg-zinc-50 dark:bg-[#0a0a0a]">
      <ProfileBackdrop images={images} />
      <Navbar />
      <main className="relative z-10 min-h-screen px-4 pb-24 pt-16 font-[family-name:var(--font-ui)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">Computer Engineering</p>
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-white">
                Class by the Numbers
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              Counted from the survey answers. Tap a bar to see who gave that answer.
            </p>
          </header>

          <dl className="mb-12 grid grid-cols-3 gap-3 text-center sm:gap-6">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-none"
              >
                <dd className="font-display text-4xl font-bold text-zinc-900 sm:text-5xl dark:text-white">{fact.value}</dd>
                <dt className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">
                  {fact.label}
                </dt>
              </div>
            ))}
          </dl>

          <div className="grid gap-5 md:grid-cols-2">
            {groups.map((group) => (
              <StatCard key={group.id} group={group} total={total} />
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-zinc-500 dark:text-zinc-400">
            These numbers only cover the {total} profiles on the site so far, and not everyone answered every
            question. Similar answers are grouped (for example &ldquo;Omo&rdquo; and &ldquo;Omoo&rdquo;). See who
            won the fun awards on the{" "}
            <Link href="/highlights" className="font-medium underline underline-offset-4">
              highlights page
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
