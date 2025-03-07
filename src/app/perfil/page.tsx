"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Calendar,
  GraduationCap,
  MessageSquare,
  PanelRightOpen,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProfilePage() {
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
        className={`bg-[#003366] text-white transition-all duration-300 ${
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
        className={`container mx-auto px-4 py-6 transition-all duration-300 ${
          isMenuOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
        }`}
      >
        <div className="">
          {/* Contennido */}
          <div className="md:col-span-9">
            <Tabs defaultValue="cursos" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="cursos" className="flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Cursos matriculados
                </TabsTrigger>
                <TabsTrigger value="actividad" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Actividad reciente
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cursos" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((course) => (
                    <Card key={course}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          <Image
                            src="https://campusvirtual.unah.edu.hn/pluginfile.php/1/core_admin/logo/0x200/1738566175/thumbnail_logo-02.png"
                            alt="UNAH Logo"
                            width={140}
                            height={140}
                            className="mx-auto"
                          />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">Período: 2025-1</p>
                        <p className="text-sm text-gray-500">
                          Docente: Nombre del Docente
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="actividad" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {[1, 2, 3].map((activity) => (
                        <div
                          key={activity}
                          className="flex items-start space-x-4 pb-4 border-b last:border-0"
                        >
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Actividad {activity}</p>
                            <p className="text-sm text-gray-500">Hace 2 días</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
