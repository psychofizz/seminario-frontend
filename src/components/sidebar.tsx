"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useQuery } from '@apollo/client';
import { Enrollment, UserEnrollmentsVars } from '@/app/types';
import { Button } from "./ui/button";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { GET_USER_ENROLLMENTS } from "@/app/api/graphql/api";

interface SidebarProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export default function Sidebar({ isMenuOpen, toggleMenu }: SidebarProps) {
  const pathname = usePathname();
  const userId = 4; 
  const router = useRouter();
  // const { data, loading, error, refetch } = useQuery<UserEnrollmentsResponse, UserEnrollmentsVars>(
  //   GET_USER_ENROLLMENTS,
  //   {
  //     variables: { userId },
  //     fetchPolicy: 'cache-and-network', // Usar caché pero actualizar en segundo plano
  //     nextFetchPolicy: 'cache-first',
  //   }
  // );
  const { data, error, loading, refetch } = useQuery<{ userEnrollments: Enrollment[] }, UserEnrollmentsVars>(
      GET_USER_ENROLLMENTS,
      {
        variables: { userId },
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
      }
    );

  const pages = [
    { ruta: "Area Personal", href: "/perfil", current: true },
    { ruta: "Pagina Principal del Sitio", href: "/", current: false },
    { ruta: "Archivos Privados", href: "/archivos", current: false },
  ];

  const handleClick = (curso: Enrollment) => {
      startTransition(() => {
        router.push(`/cursos/${curso.courseid}`);
      });
    };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform z-50 ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <nav className="p-4">
        <div
          className="flex justify-end mb-4 cursor-pointer"
          onClick={toggleMenu}
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
          <Accordion className="p-4" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="cursor-pointer">Mis Cursos</AccordionTrigger>
              <AccordionContent>
                {loading && <div className="flex justify-center p-8">Cargando cursos...</div>}
                {error && (
                  <div className="text-red-500 p-4 bg-red-50 rounded-md">
                    Error al cargar los cursos: {error.message}
                    <Button 
                      variant="outline" 
                      className="mt-2" 
                      onClick={() => refetch()}
                    >
                      Reintentar
                    </Button>
                  </div>
                )}
                {data?.userEnrollments?.map((curso) => (
                  <div key={curso.courseid} className="p-2 hover:cursor-pointer hover:bg-gray-200 rounded-md" onClick={() => handleClick(curso)}>
                    {curso.course.fullname}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </nav>
    </div>
  );
}