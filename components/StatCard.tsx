"use client";

import { useState } from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import type { StatGroup } from "@/lib/stats";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";

/** One question from the survey as animated bars. Tap a bar to see who gave that answer. */
export default function StatCard({ group, total }: { group: StatGroup; total: number }) {
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const max = Math.max(1, ...group.buckets.map((bucket) => bucket.count));

  return (
    <MotionConfig reducedMotion="user">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-none">
        <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">{group.title}</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{group.subtitle}</p>

        {group.buckets.length === 0 ? (
          <p className="mt-6 text-sm text-zinc-500">Not enough answers to show yet.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {group.buckets.map((bucket) => {
              const open = openLabel === bucket.label;
              return (
                <li key={bucket.label}>
                  <button
                    type="button"
                    onClick={() => setOpenLabel(open ? null : bucket.label)}
                    aria-expanded={open}
                    className={`block w-full rounded-lg text-left ${FOCUS}`}
                  >
                    <span className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-medium text-zinc-800 dark:text-zinc-100">{bucket.label}</span>
                      <span className="shrink-0 font-semibold tabular-nums text-zinc-500 dark:text-zinc-400">
                        {bucket.count}
                      </span>
                    </span>
                    <span className="block h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                      <motion.span
                        className="block h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(bucket.count / max) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </span>
                  </button>

                  {open && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {bucket.people.map((person) => (
                        <li key={person.slug}>
                          <Link
                            href={`/student/${person.slug}`}
                            className={`block rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-white/20 dark:text-zinc-200 dark:hover:bg-white/10 ${FOCUS}`}
                          >
                            {person.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
          {group.answered} of {total} answered
          {group.others > 0 ? ` · ${group.others} ${group.others === 1 ? "answer" : "answers"} given by only one person` : ""}
        </p>
      </section>
    </MotionConfig>
  );
}
