"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const pages = [
    { ruta: "Area Personal", href: "/perfil", current: true },
    { ruta: "Pagina Principal del Sitio", href: "/", current: false },
    { ruta: "Archivos Privados", href: "/archivos", current: false },
    { ruta: "Mis Cursos", href: "/cursos", current: false },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform z-50 ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <nav className="p-4">
        <div
          className="flex justify-end mb-4 cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        >
          <X className="h-8 w-8" />
          <span className="sr-only">Close</span>
        </div>
        <div className="space-y-2">
          {pages.map((vista) => (
            <Link
              key={vista.ruta}
              href={vista.href}
              className={`text-left pl-3 rounded-md block md:inline-block py-2 transition-colors ${
                pathname === vista.href
                  ? "bg-gray-200/75 w-full text-gray-900 border-l-4 "
                  : `hover:bg-gray-200/75 w-full hover:text-gray-900`
              }`}
              aria-current={pathname === vista.href ? "page" : undefined}
            >
              {vista.ruta}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
