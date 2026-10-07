import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this yearbook shows about each graduate and how to ask for a change or removal.",
};

export default function PrivacyPage() {
  // Optional: set PRIVACY_CONTACT (for example "WhatsApp 080... or name@example.com") in the environment.
  const contact = process.env.PRIVACY_CONTACT?.trim();

  return (
    <div className="bg-zinc-50 dark:bg-[#0a0a0a]">
      <Navbar />
      <main className="min-h-screen px-4 pb-24 pt-16 font-[family-name:var(--font-ui)] sm:px-6 lg:px-8">
        <article className="mx-auto max-w-2xl">
          <h1 className="mb-8 font-display text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">Privacy</h1>

          <div className="space-y-8 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                What is shown
              </h2>
              <p>
                Each profile shows what the graduate chose to share in the class survey: name, nickname, photos,
                social media handles, and their answers (favourite song, lecturer, dream path and so on).
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Phone numbers
              </h2>
              <p>
                Phone numbers are not part of the public pages. They only appear after a classmate enters the class
                code, and they are never listed in search results. Email addresses are not published at all.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Search engines
              </h2>
              <p>
                The site asks search engines not to list any page. Anyone with a link can still open it, so please
                share links only with people you trust.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Change or remove something
              </h2>
              <p>
                If you want your profile corrected, a photo or answer taken down, or your whole profile removed,
                just ask.{" "}
                {contact ? (
                  <>
                    Contact: <strong className="text-zinc-900 dark:text-white">{contact}</strong>.
                  </>
                ) : (
                  <>Message the class representative who shared this site with you.</>
                )}
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
