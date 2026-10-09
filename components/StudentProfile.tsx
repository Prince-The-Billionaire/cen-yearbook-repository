"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  BadgeCheck,
  GraduationCap,
  Music,
  X,
  Trophy,
} from "lucide-react";
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { PiGlobe, PiXLogo } from "react-icons/pi";
import Avatar from "@/components/Avatar";
import ShareMenu from "@/components/ShareMenu";
import { imageProps } from "@/lib/cloudinary-image";
import { cleanHandle, formatLevel, hasValue, linkedinLink, portfolioLink, type PublicStudent } from "@/lib/student-utils";
import PhoneReveal from "@/components/PhoneReveal";
import ProfileBackdrop from "@/components/ProfileBackdrop";
import { useTheme } from "@/lib/theme";

interface NeighbourLink {
  slug: string;
  name: string;
}

interface StudentProfileProps {
  /** Titles of the highlight awards this student won. */
  awards?: string[];
  /** Leadership roles this student holds or has held. */
  roles?: string[];
  student: PublicStudent;
  previous?: NeighbourLink;
  next?: NeighbourLink;
}

const CARD =
  "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-none";
const LABEL = "mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400";
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";

/** Small round/rounded image that quietly disappears if its URL is broken. */
function Thumb({ src, className, sizes }: { src: string; className: string; sizes: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className={`relative shrink-0 overflow-hidden ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        {...imageProps(src)}
        onError={() => setFailed(true)}
        className="object-cover object-top"
      />
    </div>
  );
}

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

export default function StudentProfile({ student, previous, next, awards = [], roles = [] }: StudentProfileProps) {
  const isDark = useTheme() === "dark";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const gallery = student.orbitImages.filter(hasValue);
  // Behind the page: their own photos, or the main photo if they have no gallery yet.
  const backdropImages = gallery.length > 0 ? gallery : [student.profilePic].filter(hasValue);
  const eras = [...new Set(student.bestEraArray.filter(hasValue).map(formatLevel))];
  const igHandle = hasValue(student.igHandle) ? cleanHandle(student.igHandle) : null;
  const xHandle = hasValue(student.xHandle) ? cleanHandle(student.xHandle) : null;
  const hasPhone = student.hasPhone;
  const linkedin = linkedinLink(student.linkedin);
  const portfolio = portfolioLink(student.portfolio);
  const favSongs = (student.favSongs ?? []).filter(hasValue);
  const hasSong = hasValue(student.spotifyTrackId) || hasValue(student.audioUrl) || favSongs.length > 0;
  const hasSocials = igHandle || xHandle || linkedin || portfolio || hasPhone;
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

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="relative min-h-screen bg-zinc-50 font-[family-name:var(--font-ui)] text-zinc-900 transition-colors duration-300 dark:bg-[#0a0a0a] dark:text-zinc-100"
      >
        <ProfileBackdrop images={backdropImages} />

        {/* TOP BAR */}
        <header className="relative z-10">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <Link
              href="/yearbook"
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-900/10 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/15 dark:hover:text-white ${FOCUS}`}
            >
              <ArrowLeftIcon className="h-4 w-4" aria-hidden />
              Yearbook
            </Link>

            <div className="flex items-center gap-2">
              <ShareMenu title={student.name} />
            </div>
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-5xl px-4 pb-24 sm:px-6">
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

              {roles.length > 0 && (
                <ul className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start" aria-label="Leadership roles">
                  {roles.map((title) => (
                    <li key={title}>
                      <Link
                        href="/leaders"
                        className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/20 dark:bg-amber-400/15 dark:text-amber-300 ${FOCUS}`}
                      >
                        <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {awards.length > 0 && (
                <ul className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start" aria-label="Highlight awards">
                  {awards.map((title) => (
                    <li key={title}>
                      <Link
                        href="/highlights"
                        className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/20 dark:bg-amber-400/15 dark:text-amber-300 ${FOCUS}`}
                      >
                        <Trophy className="h-3.5 w-3.5" aria-hidden />
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {hasSocials && (
                <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                  {hasPhone && <PhoneReveal slug={student.slug} />}
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
                  {linkedin && (
                    <a
                      href={linkedin.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-zinc-200/60 dark:border-white/20 dark:hover:bg-white/10 ${FOCUS}`}
                    >
                      <FaLinkedinIn className="h-4 w-4" aria-hidden />
                      <span className="max-w-[12rem] truncate">{linkedin.label}</span>
                    </a>
                  )}
                  {portfolio && (
                    <a
                      href={portfolio.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-zinc-200/60 dark:border-white/20 dark:hover:bg-white/10 ${FOCUS}`}
                    >
                      <PiGlobe className="h-4 w-4" aria-hidden />
                      <span className="max-w-[12rem] truncate">{portfolio.label}</span>
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
              <Section label="Favourite song" className="md:col-span-2">
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
                {!hasValue(student.spotifyTrackId) && hasValue(student.audioUrl) && (
                  <audio controls preload="none" src={student.audioUrl} className="w-full" />
                )}
                {favSongs.length > 0 && (
                  <ul className={`flex flex-col gap-2 ${hasValue(student.spotifyTrackId) ? "mt-4" : ""}`}>
                    {favSongs.map((song) => (
                      <li key={song} className="flex items-center gap-3 text-lg font-medium">
                        <Music className="h-4 w-4 shrink-0 text-indigo-500" aria-hidden />
                        {song}
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            )}

            {hasValue(student.finalquote) && (
              <Section label="Graduation song" className={eras.length > 0 ? "" : "md:col-span-2"}>
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white">
                    <Music className="h-6 w-6" aria-hidden />
                  </span>
                  <p className="font-display text-2xl font-bold leading-snug sm:text-3xl">{student.finalquote}</p>
                </div>
              </Section>
            )}

            {eras.length > 0 && (
              <Section label={eras.length > 1 ? "Best eras" : "Best era"}>
                <ul className="flex flex-wrap gap-2">
                  {eras.map((era) => (
                    <li
                      key={era}
                      className="rounded-full bg-indigo-500/10 px-4 py-2 text-lg font-semibold text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300"
                    >
                      {era}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {hasValue(student.threeWords) && (
              <Section label="In three words">
                <p className="font-display text-2xl font-bold leading-snug sm:text-3xl">{student.threeWords}</p>
              </Section>
            )}

            {hasValue(student.rememberedFor) && (
              <Section label="Remember me for">
                <p className="text-xl font-semibold leading-snug sm:text-2xl">{student.rememberedFor}</p>
              </Section>
            )}

            {hasValue(student.slang) && (
              <Section label="My slang">
                <div className="flex items-center justify-between gap-4">
                  <p className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-3xl font-black leading-tight text-transparent sm:text-4xl">
                    {student.slang}
                  </p>
                  {hasValue(student.slangImg) && (
                    <Thumb src={student.slangImg} sizes="80px" className="h-20 w-20 rotate-6 rounded-2xl" />
                  )}
                </div>
              </Section>
            )}

            {hasValue(student.dreamPath) && (
              <Section label="Dream path">
                <div className="flex items-center gap-4">
                  {hasValue(student.dreamPathIcon) && (
                    <Thumb src={student.dreamPathIcon} sizes="56px" className="h-14 w-14 rounded-full ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900" />
                  )}
                  <p className="text-xl font-semibold leading-snug sm:text-2xl">{student.dreamPath}</p>
                </div>
              </Section>
            )}

            {hasValue(student.favLecturerName) && (
              <Section label="Favourite lecturer">
                <div className="flex items-center gap-4">
                  {hasValue(student.favLecturerImg) && (
                    <Thumb src={student.favLecturerImg} sizes="64px" className="h-16 w-16 rounded-full" />
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

            {(hasValue(student.favFood) || hasValue(student.favFoodImg)) && (
              <Section label="Favourite CU food">
                {hasValue(student.favFood) && (
                  <p className="text-xl font-semibold leading-snug sm:text-2xl">{student.favFood}</p>
                )}
                {hasValue(student.favFoodImg) && (
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${hasValue(student.favFood) ? "mt-4" : ""}`}>
                    <Image
                      src={student.favFoodImg}
                      alt={`${student.name}'s favourite food on campus`}
                      fill
                      sizes="(min-width: 768px) 440px, 90vw"
                      {...imageProps(student.favFoodImg)}
                      className="object-cover"
                    />
                  </div>
                )}
              </Section>
            )}

            {(hasValue(student.passion) || hasValue(student.passionGif)) && (
              <Section label={hasValue(student.passion) ? "Passionate about" : "Core passion"}>
                {hasValue(student.passion) && (
                  <p className="text-xl font-semibold leading-snug sm:text-2xl">{student.passion}</p>
                )}
                {hasValue(student.passionGif) && (
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${hasValue(student.passion) ? "mt-4" : ""}`}>
                    <Image
                      src={student.passionGif}
                      alt={`${student.name}'s core passion`}
                      fill
                      sizes="(min-width: 768px) 440px, 90vw"
                      {...imageProps(student.passionGif)}
                      className="object-cover"
                    />
                  </div>
                )}
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
                        {...imageProps(src)}
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
                  <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" aria-hidden />
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
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
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
                    <ChevronLeftIcon className="h-6 w-6" aria-hidden />
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
                    <ChevronRightIcon className="h-6 w-6" aria-hidden />
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
                  {...imageProps(gallery[lightboxIndex])}
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
