"use client";

import { useState, type FormEvent } from "react";
import { Lock, Phone } from "lucide-react";

type Status = "idle" | "loading" | "asking" | "revealed" | "unavailable" | "error";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";
const PILL = `flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200 ${FOCUS}`;

/**
 * Phone numbers are not in the page. This asks the server for one, which only
 * answers if the visitor has entered the class code (and remembers that for 30 days).
 */
export default function PhoneReveal({ slug }: { slug: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [phone, setPhone] = useState<{ display: string; link: string } | null>(null);
  const [code, setCode] = useState("");
  const [wrongCode, setWrongCode] = useState(false);

  const load = async () => {
    setStatus("loading");
    try {
      const response = await fetch(`/api/phone/${encodeURIComponent(slug)}`, { cache: "no-store" });
      if (response.ok) {
        setPhone(await response.json());
        setStatus("revealed");
      } else if (response.status === 401) {
        setStatus("asking");
      } else if (response.status === 503) {
        setStatus("unavailable");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const unlock = async (event: FormEvent) => {
    event.preventDefault();
    if (!code.trim()) return;
    setStatus("loading");
    setWrongCode(false);
    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (response.ok) {
        setCode("");
        await load();
      } else if (response.status === 401) {
        setWrongCode(true);
        setStatus("asking");
      } else if (response.status === 503) {
        setStatus("unavailable");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "revealed" && phone) {
    return (
      <a href={`tel:${phone.link}`} className={PILL}>
        <Phone className="h-4 w-4" aria-hidden />
        {phone.display}
      </a>
    );
  }

  if (status === "unavailable") {
    return (
      <p className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm text-zinc-500 dark:border-white/20 dark:text-zinc-400">
        Phone numbers aren&rsquo;t available right now.
      </p>
    );
  }

  if (status === "asking" || (status === "loading" && code)) {
    return (
      <form onSubmit={unlock} className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
        <label className="sr-only" htmlFor={`class-code-${slug}`}>
          Class code
        </label>
        <input
          id={`class-code-${slug}`}
          type="password"
          autoComplete="off"
          autoFocus
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Class code"
          className="w-40 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none dark:border-white/20 dark:bg-white/5 dark:text-white"
        />
        <button type="submit" disabled={status === "loading"} className={`${PILL} disabled:opacity-60`}>
          <Lock className="h-4 w-4" aria-hidden />
          Unlock
        </button>
        <p className="w-full text-center text-xs text-zinc-500 md:text-left dark:text-zinc-400" role="status">
          {wrongCode ? "That code isn't right. " : ""}Ask a classmate or the class rep for the code.
        </p>
      </form>
    );
  }

  return (
    <button type="button" onClick={load} disabled={status === "loading"} className={`${PILL} disabled:opacity-60`}>
      <Phone className="h-4 w-4" aria-hidden />
      {status === "error" ? "Try again" : status === "loading" ? "Checking..." : "Show phone number"}
    </button>
  );
}
