import type { Metadata } from "next";
import MemoriesGallery from "@/components/MemoriesGallery";
import Navbar from "@/components/Navbar";
import { getMemories } from "@/lib/memories";

// Re-read the Cloudinary list at most every 10 minutes.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Memories",
  description: "Photos and clips from around the Computer Engineering department.",
};

export default async function MemoriesPage() {
  const items = await getMemories();

  return (
    <div className="bg-zinc-50 dark:bg-[#0a0a0a]">
      <Navbar />
      <main className="min-h-screen px-4 pb-24 pt-16 font-[family-name:var(--font-ui)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-12 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
              Computer Engineering
            </p>
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-white">
                Memories
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              Random photos and clips from around the department.
            </p>
          </header>

          <MemoriesGallery items={items} />
        </div>
      </main>
    </div>
  );
}
