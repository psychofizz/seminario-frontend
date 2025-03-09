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
import { gql, useQuery } from '@apollo/client';
import { UserEnrollmentsResponse, UserEnrollmentsVars } from '@/app/types';
import { Button } from "./ui/button";

const GET_USER_ENROLLMENTS = gql`
  query GetUserEnrollments($userId: Int!) {
    userEnrollments(userId: $userId) {
      id
      course {
        id
        fullname
      }
    }
  }
`;

interface SidebarProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export default function Sidebar({ isMenuOpen, toggleMenu }: SidebarProps) {
  const pathname = usePathname();
  const userId = 1; // ID del usuario logueado (para pruebas)

  const { data, loading, error, refetch } = useQuery<UserEnrollmentsResponse, UserEnrollmentsVars>(
    GET_USER_ENROLLMENTS,
    {
      variables: { userId },
      fetchPolicy: 'cache-and-network', // Usar caché pero actualizar en segundo plano
      nextFetchPolicy: 'cache-first',
    }
  );

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
                {data?.userEnrollments?.map((enrollment) => (
                  <div key={enrollment.id} className="p-2">
                    {enrollment.course.fullname}
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