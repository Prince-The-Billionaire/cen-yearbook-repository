import { students, type StudentData } from "@/data/studentsData";

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

export interface Student extends StudentData {
  slug: string;
}

export const allStudents: Student[] = Object.values(students)
  .map((student) => ({ ...student, slug: slugify(student.name) }))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

export function getStudentBySlug(rawSlug: string): Student | undefined {
  let decoded = rawSlug;
  try {
    decoded = decodeURIComponent(rawSlug);
  } catch {
    // Malformed escape sequence: fall through and match on the raw value.
  }
  // slugify() is idempotent, so this accepts both new slugs and the old
  // `/student/Full%20Name` links.
  const slug = slugify(decoded);
  return allStudents.find((student) => student.slug === slug);
}

export function getAdjacentStudents(slug: string) {
  const index = allStudents.findIndex((student) => student.slug === slug);
  return {
    previous: index > 0 ? allStudents[index - 1] : undefined,
    next: index >= 0 && index < allStudents.length - 1 ? allStudents[index + 1] : undefined,
  };
}
