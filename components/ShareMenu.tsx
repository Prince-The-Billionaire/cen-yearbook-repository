"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { PiXLogo } from "react-icons/pi";

type CopyState = "idle" | "copied" | "failed";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";

/** Copies text, falling back to a hidden textarea for browsers that block the Clipboard API. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Insecure context or in-app browser: try the older approach below.
  }
  try {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(field);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Share button for the current page. Phones open the native share sheet; other
 * devices get a small menu with Copy link, WhatsApp and X.
 */
export default function ShareMenu({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copy, setCopy] = useState<CopyState>("idle");
  const rootRef = useRef<HTMLDivElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  // The page address without any #hash or ?query.
  const pageUrl = () => window.location.origin + window.location.pathname;
  const message = `${title} | CEN Yearbook`;

  const onButtonClick = async () => {
    const canShareNatively =
      typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches;
    if (canShareNatively) {
      try {
        await navigator.share({ title: message, text: message, url: pageUrl() });
      } catch {
        // The person closed the share sheet; nothing to do.
      }
      return;
    }
    setOpen((value) => !value);
  };

  const onCopy = async () => {
    const ok = await copyText(pageUrl());
    setCopy(ok ? "copied" : "failed");
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopy("idle"), 2500);
    if (ok) setOpen(false);
  };

  const url = typeof window === "undefined" ? "" : pageUrl();
  const itemClass = `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200/70 dark:text-zinc-200 dark:hover:bg-white/10 ${FOCUS}`;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={onButtonClick}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-white/10 ${FOCUS}`}
      >
        {copy === "copied" ? (
          <Check className="h-4 w-4 text-emerald-500" aria-hidden />
        ) : (
          <Share2 className="h-4 w-4" aria-hidden />
        )}
        <span aria-live="polite">
          {copy === "copied" ? "Link copied" : copy === "failed" ? "Copy failed" : "Share"}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Share this page"
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-white/15 dark:bg-zinc-900"
        >
          <button type="button" role="menuitem" onClick={onCopy} className={itemClass}>
            <Link2 className="h-4 w-4" aria-hidden />
            Copy link
          </button>
          <a
            role="menuitem"
            href={`https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <FaWhatsapp className="h-4 w-4 text-emerald-500" aria-hidden />
            WhatsApp
          </a>
          <a
            role="menuitem"
            href={`https://x.com/intent/post?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <PiXLogo className="h-4 w-4" aria-hidden />X
          </a>
        </div>
      )}
    </div>
  );
}
