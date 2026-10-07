// Pure helpers and types for student data. Safe to import from client
// components: nothing here touches data/studentsData.ts at runtime, so phone
// numbers never end up in browser bundles.
import type { StudentData } from "@/data/studentsData";

// Values people typed in as "no answer" in the survey.
const PLACEHOLDERS = new Set(["", "nil", "n/a", "na", "none", "-"]);

export const hasValue = (value?: string | null): value is string =>
  !!value && !PLACEHOLDERS.has(value.trim().toLowerCase());

export const cleanHandle = (handle: string) => handle.trim().replace(/^@/, "");

/** Normalises survey answers like "300Lvl" or full-width "２００ Lvl" to "300 Level". */
export const formatLevel = (raw: string) => {
  const match = raw.normalize("NFKC").match(/([1-5])\s?00/);
  return match ? `${match[1]}00 Level` : raw.trim();
};

/** Turns a website address (with or without https://) into a link; null if it is empty or not a web address. */
export function portfolioLink(value?: string | null): { href: string; label: string } | null {
  const text = value?.trim();
  if (!text) return null;
  const href = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(href);
    if (!url.hostname.includes(".")) return null;
    return { href: url.href, label: url.hostname.replace(/^www\./i, "") };
  } catch {
    return null;
  }
}

/** Turns whatever someone typed for LinkedIn (URL, profile slug or just a name) into a link. */
export function linkedinLink(value?: string | null): { href: string; label: string } | null {
  if (!hasValue(value)) return null;
  const text = value.trim();
  if (/^(https?:\/\/)?(www\.)?linkedin\.com\//i.test(text)) {
    const href = /^https?:\/\//i.test(text) ? text : `https://${text}`;
    return { href, label: text.replace(/\/+$/, "").split("/").pop() || text };
  }
  if (/\s/.test(text)) {
    // A name with spaces can't be a profile slug, so search for it instead.
    return { href: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(text)}`, label: text };
  }
  return { href: `https://www.linkedin.com/in/${encodeURIComponent(text)}`, label: text };
}

export const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

/**
 * A student as sent to the browser: everything except the phone number, which
 * is only released by /api/phone/<slug> to people who enter the class code.
 */
export type PublicStudent = Omit<StudentData, "phoneDisplay" | "phoneLink"> & {
  slug: string;
  /** Whether a usable phone number exists (the number itself is not included). */
  hasPhone: boolean;
};
