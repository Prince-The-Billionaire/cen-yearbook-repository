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
      className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-black/70 px-4 py-2 text-white backdrop-blur-xl md:px-8"
    >
      <Link href="/" aria-label="CEN Yearbook home" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt=""
          width={56}
          height={56}
          className="h-11 w-11 object-contain transition-transform duration-300 hover:scale-105 md:h-14 md:w-14"
        />
        <span className="bg-gradient-to-b from-slate-100 via-gray-400 to-zinc-600 bg-clip-text font-display text-lg font-bold uppercase tracking-widest text-transparent md:text-2xl">
          Comp Engr
        </span>
      </Link>

      <ul className="flex items-center gap-1 font-[family-name:var(--font-ui)] text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="rounded-full px-4 py-2 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
