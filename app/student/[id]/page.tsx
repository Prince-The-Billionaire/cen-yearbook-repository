import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StudentProfile from "@/components/StudentProfile";
import { hasValue } from "@/lib/student-utils";
import { getAwardTitlesFor } from "@/lib/highlights";
import { allStudents, getAdjacentStudents, getStudentBySlug } from "@/lib/students";

export function generateStaticParams() {
  return allStudents.map((student) => ({ id: student.slug }));
}

export async function generateMetadata({ params }: PageProps<"/student/[id]">): Promise<Metadata> {
  const { id } = await params;
  const student = getStudentBySlug(id);
  if (!student) return { title: "Profile not found" };

  const description = hasValue(student.quote)
    ? `“${student.quote}” — ${student.name}, Computer Engineering Class of 2026.`
    : `${student.name}, Computer Engineering Class of 2026.`;

  return {
    title: student.name,
    description,
    openGraph: {
      title: student.name,
      description,
      images: hasValue(student.profilePic) ? [student.profilePic] : undefined,
    },
  };
}

export default async function StudentPage({ params }: PageProps<"/student/[id]">) {
  const { id } = await params;
  const student = getStudentBySlug(id);
  if (!student) notFound();

  const { previous, next } = getAdjacentStudents(student.slug);

  return (
    <StudentProfile
      student={student}
      awards={getAwardTitlesFor(student.slug)}
      previous={previous && { slug: previous.slug, name: previous.name }}
      next={next && { slug: next.slug, name: next.name }}
    />
  );
}
