"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WhoWeAre() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pre-set hidden states
      gsap.set(".sec2-tag", { opacity: 0, y: 20 });
      gsap.set(".sec2-title-1", { opacity: 0, y: 45 });
      gsap.set(".sec2-title-2", { opacity: 0, y: 45 });
      gsap.set(".sec2-col", { opacity: 0, y: 35 });

      // Smooth scroll-driven timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(".sec2-tag", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      })
        .to(
          ".sec2-title-1",
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .to(
          ".sec2-title-2",
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
          },
          "-=0.45"
        )
        .to(
          ".sec2-col",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen bg-slate-50 text-slate-950 px-6 py-20 sm:py-32 md:py-40 flex flex-col justify-center items-center relative border-t border-slate-200 overflow-hidden"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* EDITORIAL SECTION TAG */}
        <p className="sec2-tag font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-slate-500 mb-6 sm:mb-10">
          [WHO WE ARE]
        </p>

        {/* MAIN HEADLINE */}
        <h2 className="w-full font-sans font-black tracking-tight leading-[0.92] uppercase text-4xl sm:text-6xl md:text-8xl lg:text-[7.2rem] mb-12 sm:mb-20">
          <span className="sec2-title-1 block text-slate-950">Systematic</span>
          <span className="sec2-title-2 block text-slate-950 mt-1 sm:mt-2">
            Charismatic{" "}
            <span className="italic bg-gradient-to-b from-slate-950 via-slate-700 to-slate-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
              & Enthusiastic
            </span>
          </span>
        </h2>

        {/* 3-COLUMN RESPONSIVE LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 text-left text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed tracking-wide font-normal">
          <div className="sec2-col">
            <p>
              Before the gesture, there is a sound. Before the form, an echo.
              Indigo gathers these invisible traces and transforms them into
              jewelry: five tales exploring matter, time and intimacy.
            </p>
          </div>
          <div className="sec2-col">
            <p>
              Before the gesture, there is a sound. Before the form, an echo.
              Indigo gathers these invisible traces and transforms them into
              jewelry: five tales exploring matter, time and intimacy.
            </p>
          </div>
          <div className="sec2-col">
            <p>
              Before the gesture, there is a sound. Before the form, an echo.
              Indigo gathers these invisible traces and transforms them into
              jewelry: five tales exploring matter, time and intimacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}