"use client";
import React from 'react';
import Link from 'next/link';
import { students } from '@/data/studentsData';


const Yearbook = () => {

  return (
    <div className="min-h-screen bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-b from-gray-700 to-gray-200 bg-clip-text text-transparent">
              Class of 2026
            </span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-400 sm:mt-4">
            The amazing Class of 2026 set.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          
          {Object.values(students).map((student) => (
            <Link
              // Dynamic routing passing the name into the URL slug
              href={`/student/${encodeURIComponent(student.name)}`}
              key={student.name}
              className="
                group relative bg-[#1c1c1c] rounded-2xl overflow-hidden cursor-pointer block
                border border-gray-800
                transition-all duration-300 ease-in-out
                hover:scale-105 hover:border-gray-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.07)]
              "
            >
              <div className="aspect-w-3 aspect-h-4 w-full h-72 overflow-hidden">
                <img
                  src={student.profilePic}
                  alt={student.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
              </div>

              <div className="p-5 border-t border-gray-800 group-hover:border-gray-600 transition-colors duration-300">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {student.name}
                </h3>
                
                <div className="flex items-center mt-2 group-hover:opacity-100 transition-all duration-300">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/instagram/default.svg" 
                    alt="Instagram" 
                    className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" 
                  />
                  <p className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                    {student.igHandle}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          
        </div>
      </div>
    </div>
  );
};

export default Yearbook;