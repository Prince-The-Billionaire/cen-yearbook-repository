import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Yearbook from "@/components/Yearbook";

export const metadata: Metadata = {
  title: "Yearbook",
  description: "Browse every graduate of the Computer Engineering Class of 2026.",
};

export default function YearbookPage() {
  return (
    <div className="bg-black">
      <Navbar />
      <Yearbook />
    </div>
  );
}
