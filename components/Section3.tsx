"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Person {
  id: string;
  name: string;
  image: string;
}

const peopleData: Person[] = [
  { id: "1", name: "ADEYEMO DAVID", image: "/course_guys.jpg" },
  { id: "2", name: "CHINWE IBE", image: "/course_girls.jpg" },
  { id: "3", name: "DANIEL PRINCE", image: "/course_trad.jpg" },
  { id: "4", name: "EMMANUEL OKON", image: "/course_guys.jpg" },
  { id: "5", name: "SARAH ADAMS", image: "/course_girls.jpg" },
  { id: "6", name: "VICTOR AMADI", image: "/course_trad.jpg" },
];

// Triplicated array for seamless infinite marquee loop
const marqueeList = [...peopleData, ...peopleData, ...peopleData];

export default function ThePeople() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="w-full min-h-screen bg-white text-slate-950 px-4 sm:px-8 py-20 sm:py-28 md:py-36 flex flex-col justify-between relative overflow-hidden border-t border-slate-200 select-none">
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-between flex-1">
        {/* HEADER SECTION */}
        <header className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16 sm:mb-28 md:mb-36">
          {/* SUBTEXT */}
          <div className="lg:col-span-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-md">
            <p>
              Before the gesture, there is a sound. Before the form, an echo.
              Indigo gathers these invisible traces and transforms them into
              jewelry: five tales exploring matter, time and intimacy.
            </p>
          </div>

          {/* TITLE & VIEW ALL */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <h2 className="font-sans font-black tracking-tighter uppercase text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-none text-slate-950">
              THE{" "}
              <span className="italic bg-gradient-to-b from-slate-950 via-slate-700 to-slate-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.12)] font-black">
                PEOPLE
              </span>
            </h2>

            <span className="font-mono text-xs tracking-widest uppercase text-slate-500 hover:text-slate-950 transition-colors cursor-pointer self-start sm:self-auto">
              [VIEW ALL]
            </span>
          </div>
        </header>

        {/* CAROUSEL SECTION */}
        <div className="w-full overflow-hidden pt-12 pb-6 relative">
          <div
            className="flex items-end gap-6 sm:gap-8 md:gap-10 w-max animate-marquee"
            style={{
              animationPlayState: hoveredId !== null ? "paused" : "running",
            }}
          >
            {marqueeList.map((person, index) => {
              const uniqueKey = `${person.id}-${index}`;
              const isCurrentHovered = hoveredId === uniqueKey;
              const isAnyHovered = hoveredId !== null;

              return (
                <div
                  key={uniqueKey}
                  onMouseEnter={() => setHoveredId(uniqueKey)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="flex flex-col items-center group cursor-pointer w-[200px] sm:w-[260px] md:w-[320px] shrink-0"
                >
                  {/* CARD IMAGE CONTAINER */}
                  <motion.div
                    animate={{
                      y: isCurrentHovered ? -24 : 0,
                      scale: isCurrentHovered ? 1.03 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className={`w-full aspect-[4/5] overflow-hidden bg-slate-100 mb-4 rounded-sm relative transition-all duration-300 ${
                      isCurrentHovered
                        ? "grayscale-0 opacity-100 shadow-2xl z-20 ring-1 ring-slate-900/10"
                        : isAnyHovered
                        ? "grayscale opacity-30 z-0"
                        : "grayscale-0 opacity-100 z-10"
                    }`}
                  >
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* NAME TAG */}
                  <span
                    className={`font-mono text-[11px] sm:text-xs tracking-widest uppercase transition-colors duration-300 ${
                      isCurrentHovered
                        ? "text-slate-950 font-bold"
                        : isAnyHovered
                        ? "text-slate-300"
                        : "text-slate-800"
                    }`}
                  >
                    {person.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* INFINITE MARQUEE KEYFRAMES */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </section>
  );
}