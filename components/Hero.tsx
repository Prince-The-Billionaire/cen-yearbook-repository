"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { AudioWaveform, VolumeX, ArrowDown, X, Menu } from "lucide-react";

const photosData = [
  {
    id: 1,
    src: "/course_trad.jpg",
    alt: "Photo 1",
    rotZ: -72,
    rotX: -18,
    rotY: 14,
    size: "w-20 h-20 sm:w-32 sm:h-32 md:w-44 md:h-44",
    top: "2%",
    left: "42%",
  },
  {
    id: 2,
    src: "/course_girls.jpg",
    alt: "Photo 2",
    rotZ: 34,
    rotX: 22,
    rotY: -16,
    size: "w-24 h-24 sm:w-36 sm:h-36 md:w-52 md:h-52",
    top: "5%",
    left: "75%",
  },
  {
    id: 3,
    src: "/course_guys.jpg",
    alt: "Photo 3",
    rotZ: -55,
    rotX: -12,
    rotY: 22,
    size: "w-18 h-18 sm:w-28 sm:h-28 md:w-40 md:h-40",
    top: "42%",
    left: "80%",
  },
  {
    id: 4,
    src: "/course_trad.jpg",
    alt: "Photo 4",
    rotZ: 68,
    rotX: 18,
    rotY: -12,
    size: "w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56",
    top: "72%",
    left: "72%",
  },
  {
    id: 5,
    src: "/course_girls.jpg",
    alt: "Photo 5",
    rotZ: -25,
    rotX: -14,
    rotY: 15,
    size: "w-22 h-22 sm:w-34 sm:h-34 md:w-48 md:h-48",
    top: "78%",
    left: "40%",
  },
  {
    id: 6,
    src: "/course_guys.jpg",
    alt: "Photo 6",
    rotZ: 82,
    rotX: 20,
    rotY: -20,
    size: "w-20 h-20 sm:w-30 sm:h-30 md:w-42 md:h-42",
    top: "70%",
    left: "8%",
  },
  {
    id: 7,
    src: "/course_trad.jpg",
    alt: "Photo 7",
    rotZ: -40,
    rotX: -22,
    rotY: 18,
    size: "w-26 h-26 sm:w-38 sm:h-38 md:w-50 md:h-50",
    top: "35%",
    left: "2%",
  },
  {
    id: 8,
    src: "/course_girls.jpg",
    alt: "Photo 8",
    rotZ: 50,
    rotX: 16,
    rotY: -14,
    size: "w-22 h-22 sm:w-32 sm:h-32 md:w-44 md:h-44",
    top: "6%",
    left: "10%",
  },
];

export default function Hero() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredPhotoId, setHoveredPhotoId] = useState<number | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const router = useRouter();

  const heroRef = useRef<HTMLDivElement>(null);
  const loaderTextRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound generator with Web Audio API (Chime & Drop Synthesizers)
  const playSoundEffect = (type: "drop" | "complete") => {
    if (!isSoundOn) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === "complete") {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc2.type = "sine";
        osc1.frequency.setValueAtTime(523.25, now);
        osc2.frequency.setValueAtTime(783.99, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.2);
        osc2.stop(now + 1.2);
      } else if (type === "drop") {
        const sub = ctx.createOscillator();
        const chime = ctx.createOscillator();
        const subGain = ctx.createGain();
        const chimeGain = ctx.createGain();

        sub.type = "sine";
        sub.frequency.setValueAtTime(120, now);
        sub.frequency.exponentialRampToValueAtTime(40, now + 0.3);
        subGain.gain.setValueAtTime(0.15, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        chime.type = "sine";
        chime.frequency.setValueAtTime(1046.5, now);
        chimeGain.gain.setValueAtTime(0.03, now);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

        sub.connect(subGain);
        chime.connect(chimeGain);
        subGain.connect(ctx.destination);
        chimeGain.connect(ctx.destination);

        sub.start(now);
        chime.start(now);
        sub.stop(now + 0.3);
        chime.stop(now + 0.2);
      }
    } catch (e) {
      console.warn("Audio Context error", e);
    }
  };

  // Lock scroll while loading
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoaded]);

  // Loader sequence: Top bar loader + Bottom-center percentage counter
  useEffect(() => {
    const loaderTl = gsap.timeline();

    loaderTl
      .to(loaderTextRef.current, {
        opacity: 0,
        duration: 0.15,
        repeat: 3,
        yoyo: true,
      })
      .to(loaderTextRef.current, { opacity: 1, duration: 0.1 })
      .to(
        {},
        {
          duration: 1.2,
          onUpdate: function () {
            const progress = Math.floor(this.progress() * 100);
            setLoadingProgress(progress);
          },
          onComplete: () => {
            playSoundEffect("complete");
            setIsLoaded(true);
          },
        }
      );

    return () => {
      loaderTl.kill();
    };
  }, []);

  // Hero section animation: Fixed "WE ARE CEN" visibility and layout sequence
  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      gsap.set(".sub-tag", { opacity: 0, y: 15 });
      gsap.set([".word-we", ".word-are", ".word-cen"], {
        opacity: 0,
        y: 40,
        scale: 0.9,
      });

      gsap.set(".scatter-photo", {
        opacity: 0,
        scale: () => gsap.utils.random(4, 6),
        z: () => gsap.utils.random(800, 1200),
        rotateX: () => gsap.utils.random(-180, 180),
        rotateY: () => gsap.utils.random(-180, 180),
        rotateZ: () => gsap.utils.random(-360, 360),
      });

      const mainTl = gsap.timeline({ delay: 0.1 });

      mainTl.to(".sub-tag", {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });

      // Sequential reveal of words
      mainTl.to(".word-we", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "back.out(1.5)",
      });
      mainTl.to(".word-are", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "back.out(1.5)",
      });
      mainTl.to(".word-cen", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "back.out(1.5)",
      });

      // Photo drop sequence
      mainTl.to(
        ".scatter-photo",
        {
          scale: 1,
          z: 0,
          rotateX: (i) => photosData[i].rotX,
          rotateY: (i) => photosData[i].rotY,
          rotateZ: (i) => photosData[i].rotZ,
          opacity: 1,
          duration: 0.65,
          stagger: {
            each: 0.18,
            onStart: function () {
              playSoundEffect("drop");
            },
          },
          ease: "power3.out",
        },
        "+=0.1"
      );
    }, heroRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <div className="bg-black text-white min-h-screen font-sans relative overflow-x-hidden selection:bg-white selection:text-black">
      {/* 1. INITIAL LOADER SCREEN */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="fixed inset-0 z-50 bg-black flex flex-col justify-between items-center select-none"
          >
            {/* TOP PROGRESS BAR */}
            <div className="w-full h-1.5 bg-zinc-900 absolute top-0 left-0">
              <div
                className="h-full bg-white transition-all duration-75 ease-out shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            {/* SPACER */}
            <div />

            {/* BOTTOM CENTER NUMBER COUNTER */}
            <div className="pb-16 text-center">
              <div
                ref={loaderTextRef}
                className="text-6xl sm:text-8xl md:text-9xl font-black font-mono tracking-tighter text-white"
              >
                {loadingProgress}%
              </div>
              <p className="font-mono text-xs tracking-widest text-zinc-500 uppercase mt-2">
                LOADING EXPERIENCE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN HERO VIEWPORT */}
      {isLoaded && (
        <div
          ref={heroRef}
          className="relative w-full min-h-screen flex flex-col justify-between p-4 sm:p-8 perspective-[1000px] overflow-hidden"
        >
          {/* HEADER BAR */}
          <header className="relative z-30 flex items-center justify-between w-full">
            <span className="font-mono text-xs tracking-widest uppercase text-zinc-400">
              [CEN CLASS OF 2026]
            </span>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 font-mono text-xs tracking-widest uppercase"
            >
              <Menu className="w-5 h-5" />
              <span className="hidden sm:inline">MENU</span>
            </button>
          </header>

          {/* MAIN TITLE BLOCK WITH GRADIENT FIX */}
          <main className="relative z-20 my-auto py-28 sm:py-0 text-center flex flex-col items-center justify-center pointer-events-none">
            <p className="sub-tag text-xs sm:text-sm font-mono tracking-[0.3em] text-white/70 mb-4 uppercase">
              [WE BECAME A FAMILY]
            </p>

            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-none uppercase">
              <span className="word-we inline-block">
                <span className="bg-gradient-to-b from-white via-slate-200 to-zinc-500 bg-clip-text text-transparent filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]">
                  WE
                </span>
              </span>{" "}
              <br className="sm:hidden" />
              <span className="word-are inline-block mx-2 sm:mx-0">
                <span className="bg-gradient-to-b from-white via-slate-200 to-zinc-500 bg-clip-text text-transparent filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]">
                  ARE
                </span>
              </span>{" "}
              <br />
              <span className="word-cen inline-block">
                <span className="bg-gradient-to-b from-white via-slate-200 to-zinc-500 bg-clip-text text-transparent filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]">
                  CEN
                </span>
              </span>
            </h1>
          </main>

          {/* RADIAL 3D PHOTOS */}
          <div className="absolute inset-0 pointer-events-none z-10 [transform-style:preserve-3d]">
            {photosData.map((photo) => {
              const isCurrentHovered = hoveredPhotoId === photo.id;
              const isAnyHovered = hoveredPhotoId !== null;

              return (
                <motion.div
                  key={photo.id}
                  onClick={() => router.push(`/yearbook#photo-${photo.id}`)}
                  onMouseEnter={() => setHoveredPhotoId(photo.id)}
                  onMouseLeave={() => setHoveredPhotoId(null)}
                  animate={
                    isAnyHovered
                      ? { scale: isCurrentHovered ? 1.25 : 0.85 }
                      : { y: [0, -8, 0] }
                  }
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: photo.id * 0.15,
                  }}
                  style={{
                    top: photo.top,
                    left: photo.left,
                  }}
                  className={`scatter-photo absolute pointer-events-auto cursor-pointer transition-all duration-300 ease-out shadow-2xl rounded-md overflow-hidden [transform-style:preserve-3d] origin-center ${
                    isCurrentHovered
                      ? "z-40 grayscale-0 ring-4 ring-white/50 shadow-[0_0_50px_rgba(255,255,255,0.5)]"
                      : isAnyHovered
                      ? "grayscale opacity-20 z-0"
                      : "grayscale-0 opacity-95 z-10"
                  }`}
                >
                  <div className={`${photo.size} bg-black overflow-hidden`}>
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* FOOTER BAR WITH LUCIDE ICONS */}
          <footer className="relative z-30 flex items-center justify-between w-full text-xs font-mono uppercase tracking-widest pt-6">
            <button
              onClick={() => {
                const newSoundState = !isSoundOn;
                setIsSoundOn(newSoundState);
                if (newSoundState) playSoundEffect("complete");
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              {isSoundOn ? (
                <AudioWaveform className="w-4 h-4 text-emerald-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-red-400" />
              )}
              <span>SOUND {isSoundOn ? "ON" : "OFF"}</span>
            </button>

            <div className="flex items-center gap-2 opacity-80 font-mono text-xs">
              <span>SCROLL TO REMEMBER</span>
              <ArrowDown className="w-4 h-4 animate-bounce text-white" />
            </div>
          </footer>

          {/* HAMBURGER MENU DRAWER */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end"
                onClick={() => setIsMenuOpen(false)}
              >
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full sm:w-96 bg-zinc-950 h-full border-l border-white/10 p-8 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-widest text-zinc-400">
                      NAVIGATION
                    </span>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  <nav className="flex flex-col gap-6 text-2xl font-bold font-serif">
                    <a
                      href="/yearbook"
                      className="hover:translate-x-2 transition-transform hover:text-zinc-300"
                    >
                      Yearbook
                    </a>
                    <a
                      href="#olympics"
                      className="hover:translate-x-2 transition-transform hover:text-zinc-300"
                    >
                      Olympics & Events
                    </a>
                    <a
                      href="#moments"
                      className="hover:translate-x-2 transition-transform hover:text-zinc-300"
                    >
                      Random Moments
                    </a>
                    <a
                      href="#people"
                      className="hover:translate-x-2 transition-transform hover:text-zinc-300"
                    >
                      People Directory
                    </a>
                  </nav>

                  <p className="text-xs font-mono opacity-40 uppercase">
                    Computer Engineering Class of 2026
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}