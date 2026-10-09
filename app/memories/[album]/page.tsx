import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
import MemoriesGallery from "@/components/MemoriesGallery";
import ShareMenu from "@/components/ShareMenu";
import Navbar from "@/components/Navbar";
import ProfileBackdrop from "@/components/ProfileBackdrop";
import { getAlbumBackdrop } from "@/lib/backdrop-images";
import { albums, getAlbumBySlug } from "@/data/albums";
import { getAlbum } from "@/lib/memories";

// Re-read the Cloudinary albums at most every 2 minutes (keep in sync with lib/memories.ts).
export const revalidate = 120;

export function generateStaticParams() {
  return albums.map((album) => ({ album: album.slug }));
}

export async function generateMetadata({ params }: PageProps<"/memories/[album]">): Promise<Metadata> {
  const { album: slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) return { title: "Album not found" };
  return { title: album.title, description: album.description };
}

export default async function AlbumPage({ params }: PageProps<"/memories/[album]">) {
  const { album: slug } = await params;
  const content = await getAlbum(slug);
  if (!content) notFound();

  const { album, items } = content;
  const images = getAlbumBackdrop(items, album.layout);

  return (
    <div className="relative bg-zinc-50 dark:bg-[#0a0a0a]">
      <ProfileBackdrop images={images} />
      <Navbar />
      <main className="relative z-10 min-h-screen px-4 pb-24 pt-12 font-[family-name:var(--font-ui)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href="/memories"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-900/10 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-zinc-300 dark:hover:bg-white/15 dark:hover:text-white"
            >
              <ArrowLeftIcon className="h-4 w-4" aria-hidden />
              All albums
            </Link>
            <ShareMenu title={`${album.title} album`} />
          </div>

          <header className="mb-12 text-center">
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-white">
                {album.title}
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">{album.description}</p>
          </header>

          <MemoriesGallery items={items} layout={album.layout} downloadable={album.downloadable} />
        </div>
      </main>
    </div>
  );
}
