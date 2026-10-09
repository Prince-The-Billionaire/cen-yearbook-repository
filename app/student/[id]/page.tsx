import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StudentProfile from "@/components/StudentProfile";
import { shareImageUrl } from "@/lib/cloudinary-image";
import { hasValue } from "@/lib/student-utils";
import { getProfilePhotos, withPhotos } from "@/lib/profile-photos";
import { getAwardTitlesFor } from "@/lib/highlights";
import { getRoleTitlesFor } from "@/lib/leaders";
import { allStudents, getAdjacentStudents, getStudentBySlug } from "@/lib/students";

// Re-read the Cloudinary photos at most every 2 minutes.
export const revalidate = 120;

export function generateStaticParams() {
  return allStudents.map((student) => ({ id: student.slug }));
}

export async function generateMetadata({ params }: PageProps<"/student/[id]">): Promise<Metadata> {
  const { id } = await params;
  const base = getStudentBySlug(id);
  if (!base) return { title: "Profile not found" };
  const student = withPhotos(base, await getProfilePhotos());

  const description = hasValue(student.quote)
    ? `“${student.quote}” — ${student.name}, Computer Engineering Class of 2026.`
    : `${student.name}, Computer Engineering Class of 2026.`;

  return {
    title: student.name,
    description,
    openGraph: {
      title: student.name,
      description,
      images: hasValue(student.profilePic) ? [shareImageUrl(student.profilePic)] : undefined,
    },
  };
}

export default async function StudentPage({ params }: PageProps<"/student/[id]">) {
  const { id } = await params;
  const base = getStudentBySlug(id);
  if (!base) notFound();
  const student = withPhotos(base, await getProfilePhotos());

  const { previous, next } = getAdjacentStudents(student.slug);

  return (
    <StudentProfile
      student={student}
      awards={getAwardTitlesFor(student.slug)}
      roles={getRoleTitlesFor(student.slug)}
      previous={previous && { slug: previous.slug, name: previous.name }}
      next={next && { slug: next.slug, name: next.name }}
    />
  );
}
