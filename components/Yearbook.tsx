"use client";
import React from 'react';
import Link from 'next/link';

const students = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    handle: '@sarahj_designs',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    name: 'Michael Chen',
    handle: '@mchen_dev',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    name: 'Aisha Patel',
    handle: '@aisha.creates',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    name: 'David Okafor',
    handle: '@david_o',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    handle: '@emmacodes',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 6,
    name: 'James Rodriguez',
    handle: '@jrod_99',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 7,
    name: 'Chloe Kim',
    handle: '@chloe_k',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 8,
    name: 'Alexis Osell',
    handle: '@alexis_builds',
    image: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&q=80'
  }
];

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
            The amazing C and 2026 set.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          
          {students.map((student) => (
            <Link
              // Dynamic routing passing the name into the URL slug
              href={`/student/${encodeURIComponent(student.name)}`}
              key={student.id}
              className="
                group relative bg-[#1c1c1c] rounded-2xl overflow-hidden cursor-pointer block
                border border-gray-800
                transition-all duration-300 ease-in-out
                hover:scale-105 hover:border-gray-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.07)]
              "
            >
              <div className="aspect-w-3 aspect-h-4 w-full h-72 overflow-hidden">
                <img
                  src={student.image}
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
                    {student.handle}
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