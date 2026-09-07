"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Great_Vibes } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const cursive = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface TimelineItem {
  id: string;
  title: string;
  year: string;
  image: string;
  rotation: number;
}

const timelineData: TimelineItem[] = [
  {
    id: "001",
    title: "WE ARRIVED",
    year: "2021",
    image: "/course_trad.jpg",
    rotation: -8,
  },
  {
    id: "002",
    title: "WE FOUND OUR RYTHMN",
    year: "2022",
    image: "/course_girls.jpg",
    rotation: 6,
  },
  {
    id: "003",
    title: "THINGS GOT REAL",
    year: "2023",
    image: "/course_guys.jpg",
    rotation: -12,
  },
  {
    id: "004",
    title: "WE BUILT THINGS",
    year: "2024",
    image: "/course_trad.jpg",
    rotation: 14,
  },
  {
    id: "005",
    title: "WE DEFENDED THEM",
    year: "2025",
    image: "/course_girls.jpg",
    rotation: -5,
  },
  {
    id: "006",
    title: "WE LEFT",
    year: "2026",
    image: "/course_guys.jpg",
    rotation: 10,
  },
];

export default function TheYearsWeRemember() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeModalItem, setActiveModalItem] = useState<TimelineItem | null>(null);

  // ScrollReveal animation on scroll down
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".header-anim", { opacity: 0, y: 30 });
      gsap.set(".timeline-row", { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(".header-anim", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      }).to(
        ".timeline-row",
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
        },
        "-=0.4"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="w-full min-h-screen bg-slate-50 text-slate-950 px-4 sm:px-8 py-20 sm:py-28 md:py-36 flex flex-col items-center justify-center relative overflow-hidden border-t border-slate-200 select-none"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* HEADER SECTION */}
        <header className="flex flex-col items-center text-center mb-16 sm:mb-24">
          <h1 className="header-anim font-sans font-black tracking-tighter text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] leading-none uppercase text-slate-950">
            THE YEARS
          </h1>

          <div className="header-anim flex items-center justify-center gap-2 sm:gap-6 mt-1 sm:mt-2">
            <span className="font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-none uppercase italic bg-gradient-to-b from-slate-950 via-slate-700 to-slate-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
              WE
            </span>

            <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase border border-slate-300 bg-white/80 backdrop-blur px-2 sm:px-3 py-1 rounded-md text-slate-600 shadow-sm">
              [MENU]
            </span>

            <span
              className={`${cursive.className} text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-normal leading-none text-slate-950 capitalize ml-1 -mt-2 sm:-mt-4`}
            >
              Remember
            </span>
          </div>
        </header>

        {/* TIMELINE LIST */}
        <div className="w-full flex flex-col border-t border-slate-300">
          {timelineData.map((item, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setActiveModalItem(item)}
                className={`timeline-row group relative w-full border-b border-slate-300 py-6 sm:py-8 md:py-10 px-2 sm:px-4 flex items-center justify-between cursor-pointer transition-colors duration-300 ${
                  isHovered ? "bg-slate-100/70" : "bg-transparent"
                }`}
              >
                {/* LEFT INDEX */}
                <span
                  className={`font-mono text-xs sm:text-sm tracking-widest transition-colors duration-300 ${
                    isHovered ? "text-indigo-600 font-semibold" : "text-slate-400"
                  }`}
                >
                  [{item.id}]
                </span>

                {/* CENTER TITLE */}
                <h2
                  className={`font-sans font-black tracking-tight text-2xl sm:text-5xl md:text-6xl lg:text-7xl uppercase text-center transition-all duration-300 ${
                    isHovered
                      ? "text-indigo-600 scale-[1.01] translate-x-1"
                      : "text-slate-950"
                  }`}
                >
                  {item.title}
                </h2>

                {/* RIGHT YEAR */}
                <span
                  className={`font-mono text-xs sm:text-sm tracking-widest transition-colors duration-300 ${
                    isHovered ? "text-indigo-600 font-semibold" : "text-slate-400"
                  }`}
                >
                  [{item.year}]
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FLOATING CURSOR PHOTO PREVIEW */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: timelineData[hoveredIndex].rotation,
              x: mousePos.x - 110,
              y: mousePos.y - 130,
            }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 22,
              mass: 0.5,
            }}
            className="pointer-events-none absolute top-0 left-0 z-30 w-44 h-56 sm:w-56 sm:h-72 rounded-lg overflow-hidden shadow-2xl border-4 border-white bg-slate-900"
          >
            <img
              src={timelineData[hoveredIndex].image}
              alt={timelineData[hoveredIndex].title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLICK FULLSCREEN IMAGE MODAL */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalItem(null)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-200 p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-mono text-xs text-indigo-600 font-bold block">
                    [{activeModalItem.id}] — {activeModalItem.year}
                  </span>
                  <h3 className="font-sans font-black text-xl sm:text-3xl text-slate-950 uppercase">
                    {activeModalItem.title}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveModalItem(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="w-full h-72 sm:h-96 rounded-lg overflow-hidden bg-slate-100">
                <img
                  src={activeModalItem.image}
                  alt={activeModalItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}