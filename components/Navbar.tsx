"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/yearbook", label: "Yearbook" },
  { href: "/memories", label: "Memories" },
  { href: "/highlights", label: "Highlights" },
  { href: "/stats", label: "By the Numbers" },
];

/** Floating pill-shaped "island" nav: logo, title and a hamburger that opens the page links. */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Close on Escape or when clicking/tapping anywhere outside the island.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      className="keep-colors sticky top-3 z-50 mx-auto mt-3 w-[calc(100%-0.5rem)] max-w-xl"
    >
      <div className="flex items-center justify-between rounded-full border border-zinc-200 bg-white/80 py-4 pl-4 pr-4 text-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-white/15 dark:bg-zinc-900/70 dark:text-white dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
        <Link
          href="/"
          aria-label="CEN Yearbook home"
          className="flex min-w-0 items-center gap-2.5 rounded-full pr-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <Image
            src="/logo.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 rounded-full bg-black object-contain p-1 transition-transform duration-300 hover:scale-105"
          />
          <span className="truncate bg-gradient-to-b from-zinc-900 via-zinc-600 to-zinc-500 bg-clip-text font-display text-base font-bold uppercase tracking-widest text-transparent dark:bg-none dark:text-white">
            Computer Engineering
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="shrink-0 rounded-full p-2 text-zinc-700 transition hover:bg-zinc-200/70 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-zinc-200 dark:hover:bg-white/10"
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </div>

      {open && (
        <ul
          id="site-menu"
          className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-3xl border border-zinc-200 bg-white/90 p-2 font-[family-name:var(--font-ui)] shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-xl dark:border-white/15 dark:bg-zinc-900/90 dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
        >
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-2xl px-5 py-3 text-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                    active
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                      : "text-zinc-700 hover:bg-zinc-200/70 dark:text-zinc-200 dark:hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/privacy"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-2xl px-5 py-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-zinc-400 dark:hover:text-white"
            >
              Privacy
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
