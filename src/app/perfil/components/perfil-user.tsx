"use client";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useState } from "react";
import MainContent from "./perfil-menu";

export default function PerfilUser() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] overflow-x-hidden">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <main
        className={`container mx-auto px-10 py-16 transition-all duration-300 ${
          isMenuOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
        }`}
      >
        <MainContent />
      </main>
      
    </div>
  );
}