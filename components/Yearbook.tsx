"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import Avatar from "@/components/Avatar";
import { allStudents, cleanHandle, hasValue, type Student } from "@/lib/students";

type Range = "all" | "a-i" | "j-z";

const RANGES: { id: Range; label: string }[] = [
  { id: "all", label: "All" },
  { id: "a-i", label: "A – I" },
  { id: "j-z", label: "J – Z" },
];

const GROUPS = [
  { id: "a-i" as const, label: "A – I" },
  { id: "j-z" as const, label: "J – Z" },
];

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";

/** Which alphabet group a name belongs to. Names are already sorted A to Z. */
const groupOf = (student: Student): "a-i" | "j-z" => {
  const first = student.name.trim().charAt(0).toUpperCase();
  return first <= "I" ? "a-i" : "j-z";
};

function StudentCard({ student }: { student: Student }) {
  return (
    <Link
      href={`/student/${student.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-400 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-none dark:hover:border-white/30 dark:hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
    >
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-zinc-800">
        <Avatar
          name={student.name}
          src={student.profilePic}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Fixed-height text slots keep every card the same size. */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h2 className="line-clamp-2 h-11 text-base font-semibold leading-snug text-zinc-900 dark:text-white">
          {student.name}
        </h2>
        <p className="h-5 truncate text-sm text-zinc-500 dark:text-zinc-400">
          {hasValue(student.nickname) ? `“${student.nickname}”` : " "}
        </p>
        <p className="mt-1 flex h-4 items-center gap-1.5 text-xs text-zinc-500 transition-colors group-hover:text-zinc-800 dark:group-hover:text-zinc-300">
          {hasValue(student.igHandle) && (
            <>
              <FaInstagram aria-hidden />
              <span className="truncate">{cleanHandle(student.igHandle)}</span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}

export default function Yearbook() {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<Range>("all");

  const counts = useMemo(
    () => ({
      all: allStudents.length,
      "a-i": allStudents.filter((student) => groupOf(student) === "a-i").length,
      "j-z": allStudents.filter((student) => groupOf(student) === "j-z").length,
    }),
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allStudents.filter(
      (student) =>
        (range === "all" || groupOf(student) === range) &&
        (!q || student.name.toLowerCase().includes(q) || student.nickname.toLowerCase().includes(q)),
    );
  }, [query, range]);

  // "All" shows two labelled sections; a single range shows just that one.
  const sections = GROUPS.map((group) => ({
    ...group,
    students: results.filter((student) => groupOf(student) === group.id),
  })).filter((section) => section.students.length > 0);

  return (
    <main className="min-h-screen bg-zinc-50 px-4 pb-24 pt-16 font-[family-name:var(--font-ui)] sm:px-6 lg:px-8 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
            Computer Engineering
          </p>
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-white">
              Class of 2026
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            Pick a graduate to view their profile.
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

          <div className="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by first letter of name">
            {RANGES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setRange(option.id)}
                aria-pressed={range === option.id}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${FOCUS} ${
                  range === option.id
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                    : "border border-zinc-300 text-zinc-600 hover:bg-zinc-200/60 dark:border-white/20 dark:text-zinc-300 dark:hover:bg-white/10"
                }`}
              >
                {option.label} <span className="opacity-60">{counts[option.id]}</span>
              </button>
            ))}
          </div>
        </header>

        {results.length === 0 ? (
          <p className="py-20 text-center text-zinc-500" role="status">
            No one matches &ldquo;{query}&rdquo;. Try a different spelling.
          </p>
        ) : (
          <div className="flex flex-col gap-14">
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={`group-${section.id}`}>
                {range === "all" && (
                  <h2
                    id={`group-${section.id}`}
                    className="mb-6 flex items-center gap-4 font-display text-3xl font-bold text-zinc-900 dark:text-white"
                  >
                    {section.label}
                    <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" aria-hidden />
                    <span className="font-[family-name:var(--font-ui)] text-sm font-medium text-zinc-500">
                      {section.students.length}
                    </span>
                  </h2>
                )}
                <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {section.students.map((student) => (
                    <li key={student.slug}>
                      <StudentCard student={student} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
