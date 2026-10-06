import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/yearbook", label: "Yearbook" },
];

export default function Navbar() {
  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-50 flex w-full items-center justify-between border-b keep-colors border-zinc-200 bg-white/80 px-4 py-2 text-zinc-900 backdrop-blur-xl dark:border-white/10 dark:bg-black/70 dark:text-white md:px-8"
    >
      <Link href="/" aria-label="CEN Yearbook home" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt=""
          width={56}
          height={56}
          className="h-11 w-11 object-contain transition-transform duration-300 hover:scale-105 md:h-14 md:w-14"
        />
        <span className="bg-gradient-to-b from-zinc-900 via-zinc-600 to-zinc-500 dark:from-slate-100 dark:via-gray-400 dark:to-zinc-600 bg-clip-text font-display text-lg font-bold uppercase tracking-widest text-transparent md:text-2xl">
          Comp Engr
        </span>
      </Link>

      <ul className="flex items-center gap-1 font-[family-name:var(--font-ui)] text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="rounded-full px-4 py-2 text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
