import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import Avatar from "@/components/Avatar";
import Navbar from "@/components/Navbar";
import { roleViews } from "@/lib/leaders";
import { getProfilePhotos } from "@/lib/profile-photos";

export const metadata: Metadata = {
  title: "Leaders & Roles",
  description: "The course reps, AEIES executives and campus leaders of the Computer Engineering Class of 2026.",
};

// Re-read the Cloudinary photos at most every 2 minutes.
export const revalidate = 120;

const PILL =
  "flex items-center gap-3 rounded-full border border-zinc-200 py-1.5 pl-1.5 pr-4 dark:border-white/15";

export default async function LeadersPage() {
  const photos = await getProfilePhotos();
  // The roles under their group headings, in the order they are written in data/leaders.ts.
  const groups = [...new Set(roleViews.map((role) => role.group))].map((name) => ({
    name,
    roles: roleViews.filter((role) => role.group === name),
  }));

  return (
    <div className="bg-zinc-50 dark:bg-[#0a0a0a]">
      <Navbar />
      <main className="min-h-screen px-4 pb-24 pt-16 font-[family-name:var(--font-ui)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">Computer Engineering</p>
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-white">
                Leaders &amp; Roles
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              The people who led the class, the association and the campus.
            </p>
          </header>

          {groups.map((group) => (
            <section key={group.name} className="mb-14" aria-labelledby={`group-${group.name}`}>
              <h2
                id={`group-${group.name}`}
                className="mb-6 flex items-center gap-4 font-display text-3xl font-bold text-zinc-900 dark:text-white"
              >
                {group.name}
                <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" aria-hidden />
                <span className="font-[family-name:var(--font-ui)] text-sm font-medium text-zinc-500">{group.roles.length}</span>
              </h2>
              <ul className="grid gap-5 md:grid-cols-2">
                {group.roles.map((role) => (
                  <li
                    key={role.id}
                    className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-none"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white">
                        <BadgeCheck className="h-6 w-6" aria-hidden />
                      </span>
                      <div>
                        <h3 className="font-display text-2xl font-bold leading-snug text-zinc-900 dark:text-white">
                          {role.title}
                        </h3>
                        {role.note && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{role.note}</p>}
                      </div>
                    </div>

                    <div className="mt-5">
                      {role.holder.slug ? (
                        <Link
                          href={`/student/${role.holder.slug}`}
                          className={`${PILL} w-fit transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:hover:bg-white/10`}
                        >
                          <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-800">
                            <Avatar
                              name={role.holder.name}
                              src={photos.get(role.holder.slug)?.main ?? role.holder.profilePic}
                              sizes="36px"
                              initialsClassName="text-sm"
                            />
                          </span>
                          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{role.holder.name}</span>
                        </Link>
                      ) : (
                        <p className={`${PILL} w-fit`}>
                          <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-800">
                            <Avatar name={role.holder.name} src="" sizes="36px" initialsClassName="text-sm" />
                          </span>
                          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{role.holder.name}</span>
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-zinc-500 dark:text-zinc-400">
            Looking for the fun awards instead? See the{" "}
            <Link href="/highlights" className="font-medium underline underline-offset-4">
              Highlights
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
