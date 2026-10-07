// Server-only access to the student data. This module imports
// data/studentsData.ts, which contains phone numbers, so it must never be
// imported from a client component (the build fails if it is). Client
// components get PublicStudent objects as props instead, and pure helpers from
// lib/student-utils.ts.
import "server-only";
import { students, type StudentData } from "@/data/studentsData";
import { hasValue, slugify, type PublicStudent } from "@/lib/student-utils";

const usablePhone = (student: StudentData) =>
  hasValue(student.phoneDisplay) &&
  hasValue(student.phoneLink) &&
  student.phoneLink.replace(/\D/g, "").length >= 7; // ignore stubs like "+234"

function toPublic(student: StudentData): PublicStudent {
  // Strip the phone fields so they can't reach the page or the client bundle.
  const { phoneDisplay, phoneLink, ...rest } = student;
  void phoneDisplay;
  void phoneLink;
  return { ...rest, slug: slugify(student.name), hasPhone: usablePhone(student) };
}

export const allStudents: PublicStudent[] = Object.values(students)
  .map(toPublic)
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

export function getStudentBySlug(rawSlug: string): PublicStudent | undefined {
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

/** The phone number for a profile, or null. Callers must check class access first. */
export function getPhone(slug: string): { display: string; link: string } | null {
  const student = Object.values(students).find((candidate) => slugify(candidate.name) === slug);
  if (!student || !usablePhone(student)) return null;
  return { display: student.phoneDisplay, link: student.phoneLink };
}
