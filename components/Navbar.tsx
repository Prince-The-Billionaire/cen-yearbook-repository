import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/yearbook", label: "Yearbook" },
];

/** Floating pill-shaped "island" nav that stays centred at the top while scrolling. */
export default function Navbar() {
  return (
    <nav
      aria-label="Main"
      className="keep-colors sticky top-3 z-50 mx-auto mt-3 flex w-[calc(100%-1.5rem)] max-w-xl items-center justify-between rounded-full border border-zinc-200 bg-white/80 py-1.5 pl-2 pr-2 text-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-white/15 dark:bg-zinc-900/70 dark:text-white dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
    >
      <Link
        href="/"
        aria-label="CEN Yearbook home"
        className="flex items-center gap-2.5 rounded-full pr-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        <Image
          src="/logo.png"
          alt=""
          width={40}
          height={40}
          className="h-9 w-9 rounded-full bg-black object-contain p-1 transition-transform duration-300 hover:scale-105"
        />
        <span className="bg-gradient-to-b from-zinc-900 via-zinc-600 to-zinc-500 bg-clip-text font-display text-base font-bold uppercase tracking-widest text-transparent dark:from-slate-100 dark:via-gray-400 dark:to-zinc-500">
          Comp Engr
        </span>
      </Link>

      <ul className="flex items-center gap-0.5 font-[family-name:var(--font-ui)] text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="rounded-full px-4 py-2 text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
