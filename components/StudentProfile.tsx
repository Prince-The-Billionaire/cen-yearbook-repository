"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Phone,
  Share2,
  X,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { PiXLogo } from "react-icons/pi";
import Avatar from "@/components/Avatar";
import { cleanHandle, hasValue, type Student } from "@/lib/students";
import { useTheme } from "@/lib/theme";

interface NeighbourLink {
  slug: string;
  name: string;
}

interface StudentProfileProps {
  student: Student;
  previous?: NeighbourLink;
  next?: NeighbourLink;
}

const CARD =
  "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-none";
const LABEL = "mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400";
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";

/** Remote images (e.g. GIPHY) can come from any host, so skip the optimizer for them. */
const isRemote = (src: string) => /^https?:\/\//.test(src);

function Section({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`${CARD} ${className}`}
    >
      <h2 className={LABEL}>{label}</h2>
      {children}
    </motion.section>
  );
}

export default function StudentProfile({ student, previous, next }: StudentProfileProps) {
  const isDark = useTheme() === "dark";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  const gallery = student.orbitImages.filter(hasValue);
  const eras = student.bestEraArray.filter(hasValue);
  const igHandle = hasValue(student.igHandle) ? cleanHandle(student.igHandle) : null;
  const xHandle = hasValue(student.xHandle) ? cleanHandle(student.xHandle) : null;
  const hasPhone = hasValue(student.phoneDisplay) && hasValue(student.phoneLink);
  const hasSong = hasValue(student.spotifyTrackId) || hasValue(student.audioUrl);
  const hasSocials = igHandle || xHandle || hasPhone;
  const hasEmbeds = student.igPosts.some(hasValue) || hasValue(student.xTweetId);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const stepLightbox = useCallback(
    (direction: 1 | -1) =>
      setLightboxIndex((index) =>
        index === null ? index : (index + direction + gallery.length) % gallery.length,
      ),
    [gallery.length],
  );

  // Keyboard controls + scroll lock while the lightbox is open.
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") stepLightbox(1);
      if (event.key === "ArrowLeft") stepLightbox(-1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex, closeLightbox, stepLightbox]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: student.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2000);
    } catch {
      // User dismissed the share sheet or clipboard access was denied; nothing to recover.
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="min-h-screen bg-zinc-50 font-[family-name:var(--font-ui)] text-zinc-900 transition-colors duration-300 dark:bg-[#0a0a0a] dark:text-zinc-100"
      >
        {/* TOP BAR */}
        <header className="sticky top-0 z-40 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0a]/80">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <Link
              href="/yearbook"
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white ${FOCUS}`}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Yearbook
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={share}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-white/10 ${FOCUS}`}
              >
                {shareState === "copied" ? (
                  <Check className="h-4 w-4 text-emerald-500" aria-hidden />
                ) : (
                  <Share2 className="h-4 w-4" aria-hidden />
                )}
                <span aria-live="polite">{shareState === "copied" ? "Link copied" : "Share"}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
          {/* HERO */}
          <section className="grid items-center gap-8 py-10 md:grid-cols-[minmax(0,360px)_1fr] md:gap-14 md:py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-200 shadow-2xl dark:border-white/10 dark:bg-zinc-800 md:max-w-none"
            >
              <Avatar
                name={student.name}
                src={student.profilePic}
                sizes="(min-width: 768px) 360px, 90vw"
                priority
                initialsClassName="text-7xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-center md:text-left"
            >
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:border-white/15 dark:text-zinc-400">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                Computer Engineering &middot; Class of 2026
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {student.name}
              </h1>
              {hasValue(student.nickname) && (
                <p className="mt-3 text-xl text-zinc-500 dark:text-zinc-400">
                  &ldquo;{student.nickname}&rdquo;
                </p>
              )}

              {eras.length > 0 && (
                <ul className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start" aria-label="Best era">
                  {eras.map((era) => (
                    <li
                      key={era}
                      className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300"
                    >
                      {era}
                    </li>
                  ))}
                </ul>
              )}

              {hasSocials && (
                <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                  {hasPhone && (
                    <a
                      href={`tel:${student.phoneLink}`}
                      className={`flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200 ${FOCUS}`}
                    >
                      <Phone className="h-4 w-4" aria-hidden />
                      {student.phoneDisplay}
                    </a>
                  )}
                  {igHandle && (
                    <a
                      href={`https://instagram.com/${igHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-zinc-200/60 dark:border-white/20 dark:hover:bg-white/10 ${FOCUS}`}
                    >
                      <FaInstagram className="h-4 w-4" aria-hidden />
                      {igHandle}
                    </a>
                  )}
                  {xHandle && (
                    <a
                      href={`https://x.com/${xHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-zinc-200/60 dark:border-white/20 dark:hover:bg-white/10 ${FOCUS}`}
                    >
                      <PiXLogo className="h-4 w-4" aria-hidden />
                      {xHandle}
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </section>

          {/* QUOTE */}
          {hasValue(student.quote) && (
            <motion.blockquote
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl py-10 text-center font-display text-2xl italic leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-4xl"
            >
              <span aria-hidden className="mr-1 text-indigo-500">&ldquo;</span>
              {student.quote}
              <span aria-hidden className="ml-1 text-indigo-500">&rdquo;</span>
            </motion.blockquote>
          )}

          {/* DETAIL CARDS */}
          <div className="grid items-start gap-5 md:grid-cols-2">
            {hasSong && (
              <Section label="On repeat" className="md:col-span-2">
                {hasValue(student.spotifyTrackId) && (
                  <iframe
                    title={`${student.name}'s favourite song on Spotify`}
                    src={`https://open.spotify.com/embed/track/${student.spotifyTrackId}?utm_source=generator`}
                    width="100%"
                    height="152"
                    loading="lazy"
                    className="rounded-2xl border-0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  />
                )}
                {hasValue(student.audioUrl) && (
                  <audio controls preload="none" src={student.audioUrl} className="mt-4 w-full" />
                )}
              </Section>
            )}

            {hasValue(student.slang) && (
              <Section label="My slang">
                <div className="flex items-center justify-between gap-4">
                  <p className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-3xl font-black leading-tight text-transparent sm:text-4xl">
                    {student.slang}
                  </p>
                  {hasValue(student.slangImg) && (
                    <div className="relative h-20 w-20 shrink-0 rotate-6 overflow-hidden rounded-2xl">
                      <Image
                        src={student.slangImg}
                        alt=""
                        fill
                        sizes="80px"
                        unoptimized={isRemote(student.slangImg)}
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </Section>
            )}

            {hasValue(student.dreamPath) && (
              <Section label="Dream path">
                <div className="flex items-center gap-4">
                  {hasValue(student.dreamPathIcon) && (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900">
                      <Image
                        src={student.dreamPathIcon}
                        alt=""
                        fill
                        sizes="56px"
                        unoptimized={isRemote(student.dreamPathIcon)}
                        className="object-cover object-top"
                      />
                    </div>
                  )}
                  <p className="text-xl font-semibold leading-snug sm:text-2xl">{student.dreamPath}</p>
                </div>
              </Section>
            )}

            {hasValue(student.favLecturerName) && (
              <Section label="Favourite lecturer">
                <div className="flex items-center gap-4">
                  {hasValue(student.favLecturerImg) && (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={student.favLecturerImg}
                        alt=""
                        fill
                        sizes="64px"
                        unoptimized={isRemote(student.favLecturerImg)}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-xl font-semibold sm:text-2xl">{student.favLecturerName}</p>
                </div>
              </Section>
            )}

            {hasValue(student.leastFavCourse) && (
              <Section label="Least favourite course">
                <p className="text-3xl font-black tracking-tight text-rose-500 sm:text-4xl">
                  {student.leastFavCourse}
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">We all have one.</p>
              </Section>
            )}

            {hasValue(student.favFoodImg) && (
              <Section label="Favourite CU food">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={student.favFoodImg}
                    alt={`${student.name}'s favourite food on campus`}
                    fill
                    sizes="(min-width: 768px) 440px, 90vw"
                    unoptimized={isRemote(student.favFoodImg)}
                    className="object-cover"
                  />
                </div>
              </Section>
            )}

            {hasValue(student.passionGif) && (
              <Section label="Core passion">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={student.passionGif}
                    alt={`${student.name}'s core passion`}
                    fill
                    sizes="(min-width: 768px) 440px, 90vw"
                    unoptimized={isRemote(student.passionGif)}
                    className="object-cover"
                  />
                </div>
              </Section>
            )}
          </div>

          {/* GALLERY */}
          {gallery.length > 0 && (
            <section className="mt-16" aria-labelledby="gallery-heading">
              <h2 id="gallery-heading" className={LABEL}>
                Gallery
              </h2>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {gallery.map((src, index) => (
                  <li key={src}>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`Open photo ${index + 1} of ${gallery.length}`}
                      className={`group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800 ${FOCUS}`}
                    >
                      <Image
                        src={src}
                        alt={`${student.name}, photo ${index + 1}`}
                        fill
                        sizes="(min-width: 640px) 33vw, 50vw"
                        unoptimized={isRemote(src)}
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* SOCIAL EMBEDS */}
          {hasEmbeds && (
            <section className="mt-16">
              <h2 className={LABEL}>From the timeline</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {student.igPosts.filter(hasValue).map((post) => (
                  <iframe
                    key={post}
                    title={`${student.name}'s Instagram post`}
                    src={post}
                    loading="lazy"
                    scrolling="no"
                    className="h-[480px] w-full rounded-3xl border border-zinc-200 bg-white dark:border-white/10"
                  />
                ))}
                {hasValue(student.xTweetId) && (
                  <iframe
                    key={`${student.xTweetId}-${isDark}`}
                    title={`${student.name}'s post on X`}
                    src={`https://platform.twitter.com/embed/Tweet.html?id=${student.xTweetId}&theme=${isDark ? "dark" : "light"}`}
                    loading="lazy"
                    className="h-[480px] w-full rounded-3xl border border-zinc-200 dark:border-white/10"
                  />
                )}
              </div>
            </section>
          )}

          {/* FAREWELL */}
          {hasValue(student.finalquote) && (
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="py-24 text-center"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
                Parting words
              </p>
              <p className="mx-auto max-w-4xl bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-400 bg-clip-text font-display text-4xl font-bold italic leading-tight text-transparent dark:from-white dark:via-zinc-300 dark:to-zinc-500 sm:text-6xl">
                {student.finalquote}
              </p>
            </motion.section>
          )}

          {/* PREV / NEXT */}
          <nav
            aria-label="More graduates"
            className="mt-10 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-8 dark:border-white/10"
          >
            {previous ? (
              <Link
                href={`/student/${previous.slug}`}
                className={`group flex flex-col rounded-2xl p-4 transition-colors hover:bg-zinc-200/60 dark:hover:bg-white/5 ${FOCUS}`}
              >
                <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-zinc-500">
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" aria-hidden />
                  Previous
                </span>
                <span className="mt-1 truncate font-semibold">{previous.name}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/student/${next.slug}`}
                className={`group flex flex-col items-end rounded-2xl p-4 text-right transition-colors hover:bg-zinc-200/60 dark:hover:bg-white/5 ${FOCUS}`}
              >
                <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-zinc-500">
                  Next
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
                <span className="mt-1 max-w-full truncate font-semibold">{next.name}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </main>

        {/* LIGHTBOX */}
        <AnimatePresence>
          {lightboxIndex !== null && gallery[lightboxIndex] && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Photo viewer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            >
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close photo viewer"
                autoFocus
                className="absolute right-4 top-4 rounded-full bg-white/15 p-3 text-white transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-white"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      stepLightbox(-1);
                    }}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <ChevronLeft className="h-6 w-6" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      stepLightbox(1);
                    }}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <ChevronRight className="h-6 w-6" aria-hidden />
                  </button>
                </>
              )}

              <div
                className="relative h-[85vh] w-full max-w-4xl"
                onClick={(event) => event.stopPropagation()}
              >
                <Image
                  src={gallery[lightboxIndex]}
                  alt={`${student.name}, photo ${lightboxIndex + 1} of ${gallery.length}`}
                  fill
                  sizes="(min-width: 1024px) 896px, 100vw"
                  unoptimized={isRemote(gallery[lightboxIndex])}
                  className="rounded-2xl object-contain"
                />
              </div>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70" aria-hidden>
                {lightboxIndex + 1} / {gallery.length}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
