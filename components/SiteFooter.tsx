import Link from "next/link";

// Where each footer link goes. "The Class" is the Classroom album, "After Hours" is the
// After Hours album (see data/albums.ts).
const links = [
  { href: "/yearbook", label: "The People" },
  { href: "/memories", label: "The Moment" },
  { href: "/memories/classroom", label: "The Class" },
  { href: "/memories/after-hours", label: "After Hours" },
];

/** Site-wide footer, rendered once in the root layout so every page has it. */
export default function SiteFooter() {
  return (
    <footer className="keep-colors mt-auto w-full border-t border-zinc-200 bg-zinc-50 px-4 pb-24 pt-12 font-mono text-xs uppercase tracking-widest text-zinc-500 dark:border-white/10 dark:bg-black dark:text-zinc-400 sm:px-8 sm:text-sm">
      <nav aria-label="Footer" className="mx-auto w-full max-w-6xl">
        <ul className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block py-2 transition-colors duration-300 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-10 text-center text-[11px] tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
        Computer Engineering &middot; Class of 2026 &middot;{" "}
        <Link
          href="/privacy"
          className="underline-offset-4 transition-colors hover:text-zinc-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:hover:text-white"
        >
          Privacy
        </Link>
      </p>
    </footer>
  );
}
