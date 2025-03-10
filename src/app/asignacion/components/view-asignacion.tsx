"use client";
import { GET_CURSO_ASIGNACIONES } from "@/app/api/graphql/api";
import { CursoAsignacionesVars, CursoAsignacionResponse } from "@/app/types";
import Navegacion from "@/components/navegacion";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";

export default function ViewAsignacion() {
  const courseId = 1;
  const { data, loading, error, refetch } = useQuery<
    CursoAsignacionResponse,
    CursoAsignacionesVars
  >(GET_CURSO_ASIGNACIONES, {
    variables: { courseId },
    fetchPolicy: "cache-and-network", // Usar caché pero actualizar en segundo plano
    nextFetchPolicy: "cache-first",
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <div className="flex flex-row">
        <main
          className={`container w-full flex flex-col pl-6 py-20 ml-4 transition-all duration-300 ${
            isMenuOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
          }`}
        >
          <div className="pb-10 max-w-max" id="navegacion">
            <Navegacion />
          </div>
          <div className="pb-4">
            <h1 className="text-5xl font-bold font-sans">1800- Seminario</h1>
          </div>
          <div>
            {loading && (
              <div className="flex justify-center p-8">Cargando cursos...</div>
            )}
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
            {data?.assignments?.map((asignaciones) => (
              <div key={asignaciones.id} className="p-2">
                <div className="text-3xl font-light pb-4">
                  {asignaciones.name}
                </div>
                <div className="flex flex-row pb-16 gap-4">
                  <div className="bg-amber-200 rounded-2xl p-2">
                    {asignaciones.allowsubmissionsfromdate}
                  </div>
                  <div className="bg-amber-200 rounded-2xl p-2">
                    {asignaciones.duedate}
                  </div>
                </div>
                <div className="">{asignaciones.name}</div>
                <div>{asignaciones.intro}</div>

                <div className="pb-60">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4 w-full">
                        <div className="flex items-center space-x-4 py-6 border-b last:border-0">
                          <div className="w-full">
                            <p className="text-sm text-gray-500">Grupo</p>
                            <hr className="my-2 border-gray-300 w-full" />{" "}
                            <p className="text-sm text-gray-500">
                              Estado de Entrega
                            </p>
                            <hr className="my-2 border-gray-300" />{" "}
                            <p className="text-sm text-gray-500">
                              Estado de la calificación
                            </p>
                            <hr className="my-2 border-gray-300" />{" "}
                            <p className="text-sm text-gray-500">
                              Tiempo restante
                            </p>
                            <hr className="my-2 border-gray-300" />{" "}
                            <p className="text-sm text-gray-500">
                              Última Modificación
                            </p>
                            <hr className="my-2 border-gray-300" />{" "}
                            <p className="text-sm text-gray-500">
                              Comentarios de la entrega
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-center items-center">
                  <Button variant="default"> Agregar Entrega</Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
