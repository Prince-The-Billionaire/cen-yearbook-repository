"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaTwitter, FaPhoneAlt, FaFilePdf, FaQuoteLeft, FaQuoteRight, FaMoon, FaSun } from "react-icons/fa";
import { useParams } from "next/navigation";

export default function StudentProfile() {
  // -- DYNAMIC ROUTING & THEME --
  const params = useParams();
  const rawName = params?.name as string;
  const studentName = rawName ? decodeURIComponent(rawName) : "Alexis Osell";
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // -- AUTOPLAY SONG (First Section) --
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => console.log("Autoplay blocked until interaction."));
    }
  }, []);

  if (!mounted) return null;

  // Orbit Images (Will not disappear now)
  const orbitImages = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80"
  ];

  const igPosts = [
    "https://www.instagram.com/p/DGCi76oNbPA/embed",
    "https://www.instagram.com/p/DGCi76oNbPA/embed" // Replaced with 2nd actual post link if available
  ];

  const levels = ["100 Lvl", "200 Lvl", "300 Lvl", "400 Lvl"];

  return (
    <div className={`relative w-full min-h-screen transition-colors duration-500 overflow-x-hidden font-sans ${isDarkMode ? 'bg-[#0f0f0f] text-gray-100' : 'bg-[#fdfdfd] text-gray-900'}`}>
      
      {/* =========================================
          NAVBAR & DARK MODE TOGGLE
      ========================================= */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-4 flex justify-between items-center bg-opacity-50 backdrop-blur-md pointer-events-auto">
        <div className="text-xl font-bold tracking-widest">navbar/</div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className={`p-3 rounded-full shadow-lg transition-colors ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
        >
          {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
        </button>
      </nav>

      {/* =========================================
          1. HERO SECTION (Standard Flow - No Fading)
      ========================================= */}
      <div className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden">
        
        {/* The Circular Array */}
        <div className="absolute inset-0 m-auto w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none">
          {orbitImages.map((src, index) => {
            const angle = (index / orbitImages.length) * 360;
            return (
              <div key={index} style={{ transform: `rotate(${angle}deg)` }} className="absolute inset-0 flex justify-center items-start">
                <motion.img
                  src={src}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-xl border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}
                  style={{ transform: `rotate(-${angle}deg) translateY(-30px)` }}
                  animate={{ y: [-30, -45, -30] }}
                  transition={{ duration: 4, repeat: Infinity, delay: index * 0.2, ease: "easeInOut" }}
                />
              </div>
            );
          })}
        </div>

        {/* Central Profile Picture */}
        <div className={`relative w-56 h-56 md:w-80 md:h-80 rounded-[2rem] overflow-hidden shadow-2xl flex-shrink-0 border-4 z-50 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}>
          <img 
            src="https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&q=80" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-8 text-center relative z-50">
          <h1 className={`text-5xl md:text-7xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{studentName}</h1>
          <p className="text-2xl text-gray-500 italic mt-2">"The Architect"</p>
        </div>
      </div>

      {/* =========================================
          2. MAIN CONTENT (Left on Mobile, Center on Desktop)
      ========================================= */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pb-32 px-6 flex flex-col items-start md:items-center text-left md:text-center gap-20">
        
        {/* SONG / SPOTIFY (Now Before Everything Else) */}
        <div className="w-full flex flex-col items-start md:items-center gap-4 pt-10">
           <h3 className={`text-sm md:text-base font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>On Repeat</h3>
           <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" preload="auto" loop />
           <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg">
             <iframe src="https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT?utm_source=generator" width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
           </motion.div>
        </div>

        {/* PHONE NUMBER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
          className={`px-8 py-5 rounded-full shadow-md border flex items-center gap-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
        >
          <FaPhoneAlt className="text-green-500 text-2xl" />
          <a href="tel:+2348012345678" className={`text-2xl font-black tracking-wider ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>0801 234 5678</a>
        </motion.div>

        {/* INSTAGRAM & FEATURED POSTS */}
        <div className="w-full flex flex-col items-start md:items-center gap-8">
          <div className="flex items-center gap-3">
             <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/instagram/default.svg" className="w-8 h-8" alt="IG" />
             <a href="https://instagram.com/alexis" className="text-2xl font-bold hover:underline">@alexis_builds</a>
          </div>
          <div className="w-full flex flex-col md:flex-row justify-start md:justify-center gap-6">
            {igPosts.map((post, i) => (
               <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`w-full max-w-sm rounded-[2rem] shadow-xl overflow-hidden border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                 <iframe src={post} width="100%" height="480" frameBorder="0" scrolling="no" className="w-full"></iframe>
               </motion.div>
            ))}
          </div>
        </div>

        {/* X (TWITTER) & UNIQUE TWEET */}
        <div className="w-full flex flex-col items-start md:items-center gap-8">
          <div className="flex items-center gap-3">
             <FaTwitter className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-black'}`} />
             <a href="https://twitter.com/alexisosell" className="text-2xl font-bold hover:underline">@alexisosell</a>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className={`w-full max-w-md rounded-2xl shadow-md border-2 p-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <blockquote className="twitter-tweet" data-theme={isDarkMode ? "dark" : "light"}>
              <a href="https://twitter.com/alexisosell/status/2096718115371454498"></a>
            </blockquote>
          </motion.div>
        </div>

        {/* FAVORITE CU FOOD */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-6 md:gap-12">
           <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Fav CU Food</h3>
           <motion.img 
             initial={{ scale: 0.8, rotate: -5 }} whileInView={{ scale: 1, rotate: 2 }}
             src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80" 
             className={`w-48 h-48 md:w-64 md:h-64 object-cover rounded-[2rem] shadow-xl border-4 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}
             alt="CU Food"
           />
        </div>

        {/* DESCRIBE YOURSELF (Quotes) */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="relative max-w-3xl w-full py-12 flex flex-col items-start md:items-center">
          <FaQuoteLeft className={`absolute top-0 md:-left-6 left-0 text-4xl ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`} />
          <p className={`text-3xl md:text-4xl italic font-serif leading-relaxed px-8 md:px-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Building the future, one elegant line of code at a time. Aesthetics and logic combined.
          </p>
          <FaQuoteRight className={`absolute bottom-0 md:-right-6 right-0 text-4xl ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`} />
        </motion.div>

        {/* SLANG */}
        <div className="w-full flex flex-col items-start md:items-center gap-6">
           <h3 className={`text-sm md:text-base font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>My Slang</h3>
           <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
             <h2 className="text-6xl md:text-[6rem] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
               WAGWAN
             </h2>
             <img src="https://images.unsplash.com/photo-1527269534026-c86f4009eace?w=150&q=80" className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover shadow-lg rotate-12" alt="Slang vibe" />
           </div>
        </div>

        {/* FAVORITE LEVEL (Slot Machine Effect) */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-6 md:gap-12 py-10">
           <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Best Era</h3>
           <div className="h-16 md:h-24 overflow-hidden relative flex items-start">
             <motion.div 
                initial={{ y: "0%" }} 
                whileInView={{ y: "-75%" }} 
                viewport={{ margin: "-100px" }}
                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }} // smooth slot machine decel
                className="flex flex-col"
             >
                {levels.map((lvl) => (
                  <div key={lvl} className={`h-16 md:h-24 flex items-center text-6xl md:text-[5rem] font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {lvl}
                  </div>
                ))}
             </motion.div>
           </div>
        </div>

        {/* WORST SUBJECT */}
        <div className="w-full flex flex-col items-start md:items-center gap-4">
           <h3 className={`text-sm md:text-base font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Least Fav Course</h3>
           <div className="flex items-center gap-6">
             <div className={`shadow-md rounded-2xl p-5 flex items-center justify-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
               <FaFilePdf className="text-4xl md:text-5xl text-red-500" />
             </div>
             <p className={`text-4xl md:text-5xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>EIE 311</p>
           </div>
        </div>

        {/* FAVORITE LECTURER */}
        <div className="w-full flex flex-col items-start md:items-center gap-4">
           <h3 className={`text-sm md:text-base font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Fav Lecturer</h3>
           <div className={`flex items-center gap-6 p-4 md:p-6 rounded-[2rem] border shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
             <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-inner" alt="Lecturer" />
             <p className={`text-2xl md:text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Dr. Samuel Okafor</p>
           </div>
        </div>

        {/* DREAM PATH (Horizontal Timeline Animation) */}
        <div className="w-full flex flex-col items-start md:items-center gap-10 py-10 overflow-hidden">
           <h3 className={`text-sm md:text-base font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Dream Path</h3>
           
           <div className="relative w-full max-w-2xl flex items-center justify-start md:justify-center gap-4 md:gap-8 min-h-[100px]">
              {/* Animating Line */}
              <motion.div 
                initial={{ width: 0 }} 
                whileInView={{ width: "100%" }} 
                transition={{ duration: 1.5, ease: "easeInOut" }}
                viewport={{ once: false, amount: 0.8 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 md:h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 z-0 rounded-full" 
              />
              
              {/* Popping Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", bounce: 0.6 }}
                className={`relative z-10 p-5 rounded-full shadow-2xl border-4 border-indigo-500 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
              >
                <img src="https://cdn-icons-png.flaticon.com/512/2888/2888998.png" className="w-10 h-10 md:w-14 md:h-14 object-contain" alt="Path" />
              </motion.div>
              
              {/* Fading Text */}
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className={`relative z-10 text-2xl md:text-5xl font-black bg-opacity-90 px-6 py-3 rounded-2xl shadow-sm backdrop-blur-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              >
                Senior Network Engineer
              </motion.p>
           </div>
        </div>

        {/* CORE PASSION (GIF) */}
        <div className="w-full flex flex-col items-start md:items-center gap-8 py-10">
           <h3 className={`text-sm md:text-base font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Core Passion</h3>
           <motion.img 
             initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.4 }}
             src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjN1ajkxYjk5MjlucG82YmtoMndvZ3VxZTMwM3h6bGJpNW1jcjRhbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/JpG2A9P3dPHXaTYrwu/giphy.gif" 
             className={`w-72 h-72 md:w-96 md:h-96 rounded-[2.5rem] object-cover shadow-2xl border-4 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}
             alt="Passion GIF"
           />
        </div>

        {/* FAREWELL WORDS (Gold Gradient) & SIGN BOOK */}
        <div className="w-full py-20 flex flex-col items-start md:items-center gap-12">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
             className="text-[4rem] md:text-[8rem] font-black italic tracking-tighter text-left md:text-center leading-none bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-600 drop-shadow-sm"
           >
             STAY GOLDEN.
           </motion.h2>

           <motion.button 
             animate={{ scale: [1, 1.05, 1] }} 
             transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
             className={`px-12 py-5 rounded-full font-black tracking-widest uppercase text-sm border-4 shadow-xl ${isDarkMode ? 'bg-white text-black border-gray-700' : 'bg-black text-white border-gray-200'}`}
           >
             Sign The Book
           </motion.button>
        </div>

      </div>
    </div>
  );
}