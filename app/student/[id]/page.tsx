"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTwitter, FaPhoneAlt, FaFilePdf, FaQuoteLeft, FaQuoteRight, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PiXLogo } from "react-icons/pi";
import { students } from "@/data/studentsData"; // Adjust this import path as needed

export default function StudentProfile() {
  const params = useParams();
  
  // Extract the URL parameter (e.g., from /yearbook/alexis-osell)
  const slug = params?.id as string; 
  const decodedSlug = slug ? decodeURIComponent(slug).trim().toLowerCase() : ""; 
  const matchedKey = Object.keys(students).find(
        (key) => key.toLowerCase() === decodedSlug
    );

  const student = matchedKey ? students[matchedKey] : null;
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Fallback if the URL parameter doesn't match any student in our data file
  if (!student) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 text-gray-900 flex-col gap-4">
        <h1 className="text-4xl font-bold">Profile Not Found</h1>
        <Link href="/yearbook" className="text-blue-500 hover:underline">
          Return to Yearbook
        </Link>
      </div>
    );
  }

  return (
    <div className={`relative w-full min-h-screen transition-colors duration-500 overflow-x-hidden font-sans ${isDarkMode ? 'bg-[#0f0f0f] text-gray-100' : 'bg-[#fdfdfd] text-gray-900'}`}>
      
      {/* =========================================
          IMAGE MODAL (OVERLAY)
      ========================================= */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              className="absolute top-6 right-6 text-white bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors z-[1000]"
            >
              <FaTimes className="text-2xl" />
            </button>
            <motion.img 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", bounce: 0.4 }}
              src={selectedImage} 
              alt="Expanded view" 
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR & DARK MODE TOGGLE */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-4 flex justify-between items-center bg-opacity-50 backdrop-blur-md pointer-events-auto">
        <div className="flex items-center gap-2 cursor-pointer">
          <Link href="/yearbook">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-12 h-12 md:w-16 md:h-16 object-contain hover:scale-105 transition-transform duration-300" 
            />
          </Link>
        </div>

        <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase bg-gradient-to-b from-slate-100 via-gray-400 to-zinc-600 bg-clip-text text-transparent cursor-pointer">
          Comp Engr
        </h1>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className={`p-3 rounded-full shadow-lg transition-colors ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
        >
          {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
        </button>
      </nav>

      {/* 1. HERO SECTION */}
      <div className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden">
        
        {/* The Circular Array (Pulsing & Clickable) */}
        <div className="absolute inset-0 m-auto w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none">
          {student.orbitImages.map((src, index) => {
            const angle = (index / student.orbitImages.length) * 360;
            return (
              <div key={index} style={{ transform: `rotate(${angle}deg)` }} className="absolute inset-0 flex justify-center items-start pointer-events-none">
                <div 
                  className="pointer-events-auto"
                  style={{ transform: `rotate(-${angle}deg) translateY(-30px)` }}
                >
                  <motion.img
                    src={src}
                    onClick={() => setSelectedImage(src)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-xl border-2 cursor-pointer hover:scale-125 transition-transform ${isDarkMode ? 'border-gray-800' : 'border-white'}`}
                    animate={{ 
                      y: [-10, -25, -10], 
                      scale: [1, 1.08, 1],
                      boxShadow: isDarkMode 
                        ? ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 15px rgba(255,255,255,0.2)", "0px 0px 0px rgba(255,255,255,0)"]
                        : ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 15px rgba(0,0,0,0.15)", "0px 0px 0px rgba(0,0,0,0)"]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Central Profile Picture */}
        <div className={`relative w-56 h-56 md:w-80 md:h-80 rounded-[2rem] overflow-hidden shadow-2xl flex-shrink-0 border-4 z-50 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}>
          <img 
            src={student.profilePic} 
            alt="Profile" 
            className="w-full h-full object-cover object-top scale-150 object-center transition-transform duration-500 hover:scale-125"
          />
        </div>

        <div className="mt-12 text-center relative z-50">
          <h1 className={`text-5xl md:text-7xl mt-12 font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {student.name}
          </h1>
          <p className="text-2xl text-gray-500 italic mt-2">"{student.nickname}"</p>
        </div>
      </div>

      {/* =========================================
          SPILLED PHOTOS BACKGROUND (Desktop Only - Fixed/Sticky)
      ========================================= */}
      <div className="hidden xl:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {student.orbitImages.map((src, i) => {
          // Calculate scattered positions down the viewport
          const isLeft = i % 2 === 0;
          // Space them evenly within 100vh using modulo so they don't overflow bottom
          const topPosition = `${10 + ((i % 6) * 12)}%`; 
          const rotation = isLeft ? -15 - (i * 2) : 15 + (i * 2);

          return (
            <motion.img
              key={`spill-${i}`}
              src={src}
              className={`absolute w-36 h-48 object-cover rounded-xl shadow-2xl opacity-80 border-4 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}
              style={{
                top: topPosition,
                left: isLeft ? `${3 + (i % 3)}%` : 'auto',
                right: !isLeft ? `${3 + (i % 3)}%` : 'auto',
                transform: `rotate(${rotation}deg)`,
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          );
        })}
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pb-32 px-6 flex flex-col items-start md:items-center text-left md:text-center gap-20">
        
        {/* SONG / SPOTIFY */}
        <div className="w-full flex flex-col items-start md:items-center gap-4 pt-10">
           <h3 className={`text-sm md:text-base font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>On Repeat</h3>
           <audio ref={audioRef} src={student.audioUrl} preload="auto" loop />
           <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg bg-transparent">
             <iframe src={`https://open.spotify.com/embed/track/${student.spotifyTrackId}?utm_source=generator`} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
           </motion.div>
        </div>

        {/* PHONE NUMBER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
          className={`px-8 py-5 rounded-full shadow-md border flex items-center gap-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
        >
          <FaPhoneAlt className="text-green-500 text-2xl" />
          <a href={`tel:${student.phoneLink}`} className={`text-2xl font-black tracking-wider ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {student.phoneDisplay}
          </a>
        </motion.div>

        {/* INSTAGRAM & FEATURED POSTS */}
        <div className="w-full flex flex-col items-start md:items-center gap-8">
          <div className="flex items-center gap-3">
             <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/instagram/default.svg" className="w-8 h-8" alt="IG" />
             <a href={`https://instagram.com/${student.igHandle}`} className="text-2xl font-bold hover:underline">@{student.igHandle}</a>
          </div>
          <div className="w-full flex flex-col md:flex-row justify-start md:justify-center gap-6">
            {student.igPosts.map((post, i) => (
               <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`w-full max-w-sm rounded-[2rem] shadow-xl overflow-hidden border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                 <iframe src={post} width="100%" height="480" frameBorder="0" scrolling="no" className="w-full bg-white"></iframe>
               </motion.div>
            ))}
          </div>
        </div>

        {/* X (TWITTER) & UNIQUE TWEET - FIXED IFRAME */}
        <div className="w-full flex flex-col items-start md:items-center gap-8">
          <div className="flex items-center gap-3">
             <PiXLogo className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-black'}`} />
             <a href={`https://x.com/${student.xHandle}`} className="text-2xl font-bold hover:underline">@{student.xHandle}</a>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className={`w-full max-w-md rounded-2xl shadow-md border-2 p-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <iframe
            src={`https://platform.twitter.com/embed/Tweet.html?id=${student.xTweetId}&theme=${isDarkMode ? 'dark' : 'light'}`}
            className="w-full max-w-[550px] h-[350px] border-0 mx-auto block rounded-xl overflow-hidden"
            title="X Post Embed"
            scrolling="yes"
            frameBorder="0"
            allowFullScreen={true}
            />
          </motion.div>
        </div>

        {/* FAVORITE FOOD */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-6 md:gap-12">
           <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Fav CU Food</h3>
           <motion.img 
             initial={{ scale: 0.8, rotate: -5 }} whileInView={{ scale: 1, rotate: 2 }}
             src={student.favFoodImg} 
             className={`w-48 h-48 md:w-64 md:h-64 object-cover rounded-[2rem] shadow-xl border-4 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}
             alt="CU Food"
           />
        </div>

        {/* DESCRIBE YOURSELF (Quotes) */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="relative max-w-3xl w-full py-12 flex flex-col items-start md:items-center">
          <FaQuoteLeft className={`absolute top-0 md:-left-6 left-0 text-4xl ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`} />
          <p className={`text-3xl md:text-4xl italic font-serif leading-relaxed px-8 md:px-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {student.quote}
          </p>
          <FaQuoteRight className={`absolute bottom-0 md:-right-6 right-0 text-4xl ${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`} />
        </motion.div>

        {/* SLANG */}
        <div className="w-full flex flex-col items-start md:items-center gap-6">
           <h3 className={`text-sm md:text-base font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>My Slang</h3>
           <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
             <h2 className="text-6xl md:text-[6rem] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 uppercase">
               {student.slang}
             </h2>
             <img src={student.slangImg} className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover shadow-lg rotate-12" alt="Slang vibe" />
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
                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }} 
                className="flex flex-col"
             >
                {student.bestEraArray.map((lvl) => (
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
             <p className={`text-4xl md:text-5xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
               {student.leastFavCourse}
             </p>
           </div>
        </div>

        {/* FAVORITE LECTURER */}
        <div className="w-full flex flex-col items-start md:items-center gap-4">
           <h3 className={`text-sm md:text-base font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Fav Lecturer</h3>
           <div className={`flex items-center gap-6 p-4 md:p-6 rounded-[2rem] border shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
             <img src={student.favLecturerImg} className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-inner" alt="Lecturer" />
             <p className={`text-2xl md:text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
               {student.favLecturerName}
             </p>
           </div>
        </div>

        {/* DREAM PATH (Horizontal Timeline Animation) */}
        <div className="w-full flex flex-col items-start md:items-center gap-10 py-10 overflow-hidden">
           <h3 className={`text-sm md:text-base font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Dream Path</h3>
           
           <div className="relative w-full max-w-2xl flex items-center justify-start md:justify-center gap-4 md:gap-8 min-h-[100px]">
              <motion.div 
                initial={{ width: 0 }} 
                whileInView={{ width: "100%" }} 
                transition={{ duration: 1.5, ease: "easeInOut" }}
                viewport={{ once: false, amount: 0.8 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 md:h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 z-0 rounded-full" 
              />
              
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", bounce: 0.6 }}
                className={`relative z-10 p-2 rounded-full shadow-2xl border-4 border-indigo-500 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
              >
                <img src={student.dreamPathIcon} className="rounded-full object-cover  size-12 object-top" alt="Path" />
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className={`relative z-10 text-2xl md:text-5xl font-black bg-opacity-90 px-6 py-3 rounded-2xl shadow-sm backdrop-blur-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              >
                {student.dreamPath}
              </motion.p>
           </div>
        </div>

        {/* CORE PASSION (GIF) */}
        <div className="w-full flex flex-col items-start md:items-center gap-8 py-10">
           <h3 className={`text-sm md:text-base font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Core Passion</h3>
           <motion.img 
             initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.4 }}
             src={student.passionGif} 
             className={`w-72 h-72 md:w-96 md:h-96 rounded-[2.5rem] object-cover shadow-2xl border-4 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}
             alt="Passion GIF"
           />
        </div>

        {/* FAREWELL WORDS (Gold Gradient) & SIGN BOOK */}
        <div className="w-full py-20 flex flex-col items-start md:items-center gap-12">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
             className="text-[4rem] md:text-[8rem] font-black italic tracking-tighter text-left md:text-center leading-none bg-clip-text text-transparent bg-gradient-to-r from-black via-slate-600 to-slate-200 drop-shadow-sm"
           >
             {student.finalquote}
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