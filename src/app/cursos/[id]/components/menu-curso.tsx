import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, GraduationCap } from "lucide-react";
import Link from "next/link";
import React from "react";
import { gql, useQuery } from '@apollo/client';
import { CursoAsignacionResponse, CursoAsignacionesVars } from '@/app/types';
import { Button } from "@/components/ui/button";


export const GET_CURSO_ASIGNACIONES = gql`
  query GetCursoAsignaciones($courseId: Int!) {
    assignments(courseId: $courseId) {
      allowsubmissionsfromdate
      course
      duedate
      grade
      id
      intro
      name
      timemodified
    }
  }
`;

export default function MenuCurso() {
  const courseId = 1; // ID del usuario logueado (para pruebas)
  
    const { data, loading, error, refetch } = useQuery<CursoAsignacionResponse, CursoAsignacionesVars>(
      GET_CURSO_ASIGNACIONES,
      {
        variables: { courseId },
        fetchPolicy: 'cache-and-network', // Usar caché pero actualizar en segundo plano
        nextFetchPolicy: 'cache-first',
      }
    );

  return (
    <>
      <div className="w-4/5 p-8">
        <div className="pb-10 max-w-max" id="navegacion">
          <div className="md:col-span-9">
            <Tabs defaultValue="cursos" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="inicio" className="flex items-center">
                  <Link className="hover:underline" href="/perfil">Area Personal</Link>
                </TabsTrigger>
                <TabsTrigger value="MisCursos" className="flex items-center">
                  Mis Cursos
                </TabsTrigger>
                <TabsTrigger value="curso" className="flex items-center">
                  <Link className="hover:underline" href="/cursos">Curso</Link>
                </TabsTrigger>
                <TabsTrigger value="unidad1" className="flex items-center">
                  <Link className="hover:underline" href="/unidad1">Unidad 1</Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className="pb-10">
          <h1 className="text-4xl font-bold"> 1800 - Semiario de Investigacion</h1>
        </div>
        <div className="" id="main">
          {/* Contennido */}
          <div className="md:col-span-9">
            <Tabs defaultValue="inicio" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="inicio" className="flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Inicio
                </TabsTrigger>
                <TabsTrigger value="unidadI" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Unidad I
                </TabsTrigger>

                <TabsTrigger value="unidadII" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Unidad II
                </TabsTrigger>
                <TabsTrigger value="unidadIII" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Unidad III
                </TabsTrigger>
                <TabsTrigger value="cierre" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Cierre
                </TabsTrigger>
              </TabsList>
              <TabsContent value="inicio" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {[1, 2, 3].map((activity) => (
                        <div
                          key={activity}
                          className="flex items-center space-x-4 py-6 border-b last:border-0"
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
              <TabsContent value="unidadI" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
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
                {data?.assignments?.map((asignaciones) => (
                  <div key={asignaciones.id} className="p-2">
                    {asignaciones.intro}
                  </div>
                ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="unidadII" className="mt-6">
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
              <TabsContent value="unidadIII" className="mt-6">
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
              <TabsContent value="cierre" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {[1, 2, 3].map((activity) => (
                        <div
                          key={activity}
                          className="flex items-start space-x-4 gap-4 pb-4 border-b last:border-0"
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
      </div>
    </>
  );
}
