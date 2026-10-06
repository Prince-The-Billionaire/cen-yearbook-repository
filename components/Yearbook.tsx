"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import Avatar from "@/components/Avatar";
import { allStudents, cleanHandle, hasValue } from "@/lib/students";

export default function Yearbook() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allStudents;
    return allStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(q) ||
        student.nickname.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-zinc-50 px-4 pb-24 pt-16 font-[family-name:var(--font-ui)] sm:px-6 lg:px-8 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
            Computer Engineering
          </p>
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text dark:from-white text-transparent">
              Class of 2026
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            Pick a face to read their story.
          </p>

          <div className="relative mx-auto mt-8 max-w-md">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or nickname"
              aria-label="Search students"
              className="w-full rounded-full border border-zinc-300 bg-white py-3 pl-12 pr-11 text-zinc-900 placeholder:text-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/40 dark:focus:bg-white/10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </header>

        {results.length === 0 ? (
          <p className="py-20 text-center text-zinc-500" role="status">
            No one matches &ldquo;{query}&rdquo;. Try a different spelling.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {results.map((student) => (
              <li key={student.slug}>
                <Link
                  href={`/student/${student.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-400 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-none dark:hover:border-white/30 dark:hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-800">
                    <Avatar
                      name={student.name}
                      src={student.profilePic}
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="p-4">
                    <h2 className="line-clamp-2 text-base font-semibold leading-snug text-zinc-900 dark:text-white">
                      {student.name}
                    </h2>
                    {hasValue(student.nickname) && (
                      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">&ldquo;{student.nickname}&rdquo;</p>
                    )}
                    {hasValue(student.igHandle) && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500 transition-colors group-hover:text-zinc-800 dark:group-hover:text-zinc-300">
                        <FaInstagram aria-hidden />
                        <span className="truncate">{cleanHandle(student.igHandle)}</span>
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
