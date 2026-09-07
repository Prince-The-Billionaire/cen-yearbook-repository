"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LetsGetThatBread() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const footerNavRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isClicked, setIsClicked] = useState(false);

  // Web Audio API Synthesized Luxury Sheen Chime (Zero external audio asset needed)
  const playLuxurySheenSound = () => {
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const audioCtx = new AudioContext();

      // Dual crystal oscillators for harmonic shimmer
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";

      // Pristine high frequencies for metallic sheen (E7 & B7)
      osc1.frequency.setValueAtTime(2616.26, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(3951.07, audioCtx.currentTime);

      // Subtle gain envelope with smooth, rapid exponential decay
      gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.05,
        audioCtx.currentTime + 0.03
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.35
      );

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 0.36);
      osc2.stop(audioCtx.currentTime + 0.36);
    } catch (e) {
      // Browsers with strict autoplay policies will fail gracefully
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial element states
      gsap.set(logoRef.current, { scale: 0, opacity: 0 });
      gsap.set(titleRef.current, { y: 50, opacity: 0 });
      gsap.set(".floating-tag", { opacity: 0, scale: 0.8 });
      gsap.set(buttonRef.current, { y: 30, opacity: 0 });
      gsap.set(".footer-nav-item", { y: 20, opacity: 0 });

      // Trigger reveal timeline when section hits 70% viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Logo Pops Out
      tl.to(logoRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      })
        // 2. Headline Text Animates In
        .to(
          titleRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.3"
        )
        // 3. Floating Subtags Appear
        .to(
          ".floating-tag",
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=0.4"
        )
        // 4. Liquid Button Appears
        .to(
          buttonRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        )
        // 5. Footer Links Fade In
        .to(
          ".footer-nav-item",
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.2"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleButtonClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
    router.push("/yearbook");
  };

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen bg-black text-white px-4 sm:px-8 py-16 sm:py-24 md:py-32 flex flex-col justify-between items-center relative overflow-hidden select-none"
    >
      {/* TOP SEMICIRCLE RADIAL GRADIENT GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] sm:h-[450px] md:h-[550px] pointer-events-none bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,_rgba(255,255,255,0.35)_0%,_rgba(255,255,255,0.08)_45%,_transparent_80%)]" />

      {/* TOP DECORATIVE BAR */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 opacity-40 font-mono text-xs tracking-widest uppercase">
        <span>[CEN CLASS OF 2026]</span>
        <span>[FINAL CHAPTER]</span>
      </div>

      {/* CENTER CONTENT CONTAINER */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center my-auto z-10 relative">
        {/* LOGO IMAGE */}
        <div ref={logoRef} className="mb-4 relative group">
          <img
            src="/logo.png"
            alt="CEN Logo"
            className="w-20 sm:w-28 md:w-32 h-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.35)]"
          />
        </div>

        {/* TOP FLOATING TAG UNDER LOGO */}
        <p className="floating-tag font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-zinc-400 mb-6">
          [*ENTHUSIASTIC]
        </p>

        {/* HEADLINE WITH SIDE FLOATING TAGS */}
        <div ref={tagsRef} className="relative w-full">
          {/* LEFT FLOATING TAG (DESKTOP) */}
          <span className="floating-tag hidden lg:block absolute -left-12 top-1/2 -translate-y-1/2 font-mono text-xs tracking-widest uppercase text-zinc-400">
            [*CHARISMATIC]
          </span>

          {/* MAIN HEADLINE WITH TOP-TO-BOTTOM SILVERY BLUE "BREAD" GRADIENT */}
          <h1
            ref={titleRef}
            className="font-sans font-black tracking-tighter uppercase text-4xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.92] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          >
            LET’S GET <br />
            THAT{" "}
            <span className="italic bg-gradient-to-b from-[#E2E8F0] via-[#94A3B8] to-[#3B82F6] bg-clip-text text-transparent filter drop-shadow-[0_2px_15px_rgba(59,130,246,0.3)] font-black">
              BREAD
            </span>
          </h1>

          {/* RIGHT FLOATING TAG (DESKTOP) */}
          <span className="floating-tag hidden lg:block absolute -right-12 top-1/2 -translate-y-1/2 font-mono text-xs tracking-widest uppercase text-zinc-400">
            [*SYSTEMATIC]
          </span>
        </div>

        {/* MOBILE FLOATING TAGS ROW */}
        <div className="flex lg:hidden items-center justify-center gap-6 mt-4 mb-2 font-mono text-[10px] sm:text-xs tracking-widest uppercase text-zinc-400">
          <span className="floating-tag">[*CHARISMATIC]</span>
          <span className="floating-tag">[*SYSTEMATIC]</span>
        </div>

        {/* LIQUID BLOB CTA BUTTON WITH LUXURY AUDIO SHEEN */}
        <div ref={buttonRef} className="mt-10 sm:mt-14">
          <motion.button
            onMouseEnter={playLuxurySheenSound}
            onClick={handleButtonClick}
            animate={isClicked ? { scale: [1, 0.92, 1.05, 1] } : {}}
            transition={{ duration: 0.4 }}
            className="relative group overflow-hidden rounded-full border border-white/40 px-8 sm:px-12 py-4 sm:py-5 bg-black/40 backdrop-blur-md cursor-pointer transition-all duration-500 hover:border-white hover:shadow-[0_0_35px_rgba(255,255,255,0.35)]"
          >
            {/* LIQUID BLOB EXPANSION LAYER */}
            <span className="absolute inset-0 w-full h-full bg-white rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] origin-center -z-0 pointer-events-none" />

            {/* SECONDARY LIQUID WAVE BLOB FOR FLUIDITY */}
            <span className="absolute -inset-2 bg-slate-200 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] scale-0 group-hover:scale-125 transition-transform duration-1000 ease-out group-hover:rotate-180 -z-0 opacity-80 pointer-events-none" />

            {/* BUTTON TEXT */}
            <span className="relative z-10 font-mono text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-white group-hover:text-black transition-colors duration-300 flex items-center gap-3">
              VIEW YEARBOOK NOW
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </span>
          </motion.button>
        </div>
      </div>

      {/* FOOTER NAVIGATION LINKS */}
      <footer
        ref={footerNavRef}
        className="w-full max-w-6xl mx-auto pt-12 border-t border-white/10 z-10"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center font-mono text-xs sm:text-sm tracking-widest uppercase">
          <a
            href="#people"
            className="footer-nav-item text-zinc-400 hover:text-white transition-colors duration-300 py-2"
          >
            THE PEOPLE
          </a>
          <a
            href="#moments"
            className="footer-nav-item text-zinc-400 hover:text-white transition-colors duration-300 py-2"
          >
            THE MOMENT
          </a>
          <a
            href="#class"
            className="footer-nav-item text-zinc-400 hover:text-white transition-colors duration-300 py-2"
          >
            THE CLASS
          </a>
          <a
            href="#after-hours"
            className="footer-nav-item text-zinc-400 hover:text-white transition-colors duration-300 py-2"
          >
            AFTER HOURS
          </a>
        </div>
      </footer>
    </section>
  );
}