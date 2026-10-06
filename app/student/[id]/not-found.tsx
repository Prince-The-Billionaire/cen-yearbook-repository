import Link from "next/link";

export default function StudentNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#0a0a0a] px-6 text-center font-[family-name:var(--font-ui)] text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">404</p>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Profile not found</h1>
      <p className="max-w-md text-zinc-400">
        We couldn&rsquo;t find that graduate. The link may be mistyped, or the profile hasn&rsquo;t been added yet.
      </p>
      <Link
        href="/yearbook"
        className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
      >
        Back to the yearbook
      </Link>
    </main>
  );
}
