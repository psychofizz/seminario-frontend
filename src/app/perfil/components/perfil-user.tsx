"use client";


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  MessageSquare,
  PanelRightOpen,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CoursesUser from "@/app/cursos/components/course";
import PerfilMenu from "./perfil-menu";

export default function PerfilUser() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pages = [
    { ruta: "Area Personal", href: "/perfil", current: true },
    { ruta: "Pagina Principal del Sitio", href: "/", current: false },
    { ruta: "Archivos Privados", href: "/archivos", current: false },
    { ruta: "Mis Cursos", href: "/cursos", current: false },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] overflow-x-hidden">
      {/* Navbar */}
      <header
        className={`bg-[#003366] text-white transition-all duration-300 fixed z-40 ${
          isMenuOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="">
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <PanelRightOpen className={`h-5 w-5 transition-colors`} />
                </Button>
              </div>
              <h1 className="text-xl font-bold hidden md:block">
                Campus Virtual
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-[#002347] rounded-full" title="Notificaciones">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-[#002347] rounded-full" title="Mensajes">
                <MessageSquare className="h-5 w-5" />
              </button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Navegacion Sidebar */}
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

      {/* Contenido General */}
      <main
        className={`container mx-auto px-10 py-6 transition-all duration-300 ${
          isMenuOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
        }`}
      >
        <PerfilMenu/>
      <CoursesUser/>
      </main>
    </div>
  );
}
