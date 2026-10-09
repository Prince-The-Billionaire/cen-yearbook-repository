import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProfileBackdrop from "@/components/ProfileBackdrop";
import { getPeopleBackdrop } from "@/lib/backdrop-images";
import Yearbook from "@/components/Yearbook";
import { getProfilePhotos, withPhotos } from "@/lib/profile-photos";
import { allStudents } from "@/lib/students";

export const metadata: Metadata = {
  title: "Yearbook",
  description: "Browse every graduate of the Computer Engineering Class of 2026.",
};

// Re-read the Cloudinary photos at most every 2 minutes.
export const revalidate = 120;

export default async function YearbookPage() {
  const photos = await getProfilePhotos();
  const students = allStudents.map((student) => withPhotos(student, photos));
  const images = await getPeopleBackdrop();

  return (
    <div className="relative bg-zinc-50 dark:bg-[#0a0a0a]">
      <ProfileBackdrop images={images} />
      <Navbar />
      <Yearbook students={students} />
    </div>
  );
}
