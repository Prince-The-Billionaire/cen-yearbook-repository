import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full flex items-center justify-between p-4 md:px-8 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 text-white font-serif transition-all duration-300">
      {/* Logo Placeholder */}
      <div className="flex items-center gap-2 cursor-pointer">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-12 h-12 md:w-16 md:h-16 object-contain hover:scale-105 transition-transform duration-300" 
        />
      </div>

      {/* Main Title - Applied the matching vertical silver gradient */}
      <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase bg-gradient-to-b from-slate-100 via-gray-400 to-zinc-600 bg-clip-text text-transparent cursor-pointer">
        Comp Engr
      </h1>

      {/* Hamburger Menu - Updated for dark mode with a micro scale interaction */}
      <button className="p-2 text-white hover:bg-white/10 rounded-full transition-all duration-300 active:scale-90">
        <Menu className="w-7 h-7" />
      </button>
    </nav>
  );
}