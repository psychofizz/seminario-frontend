'use client'
import MenuCurso from './menu-curso'
import ActividadesProximas from './activ-prox'
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useState } from "react";

interface DetalleCursoProps {
  courseId: string;
}

export function DetalleCursoCLient({ courseId }: DetalleCursoProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

  return (
    <div className='min-h-screen w-full overflow-x-hidden'>
        <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <div className='flex flex-row'>
      <main
        className={`container w-full flex flex-row justify-end py-16 ml-64 transition-all duration-300 ${
          isMenuOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
        }`}
      >
        <MenuCurso courseId={courseId}/>
        <ActividadesProximas courseId={courseId}/>
      </main>
      </div>
        
    </div>
  )
}
