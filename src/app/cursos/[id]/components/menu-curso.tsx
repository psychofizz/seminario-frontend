'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, GraduationCap } from "lucide-react";
// import Link from "next/link";
import React from "react";
import { useQuery } from '@apollo/client';
import { CursoAsignacionResponse, CursoAsignacionesVars, UserEnrollmentsResponse, UserEnrollmentsVars, CursoSeccionesResponse, CursoSeccionesVars } from '@/app/types';
import { Button } from "@/components/ui/button";
import { GET_USER_ENROLLMENTS, GET_CURSO_SECCIONES, GET_CURSO_ASIGNACIONES } from '@/app/api/graphql/api';
import Navegacion from "@/components/navegacion";

export default function MenuCurso() {
  const courseId = 1; // ID del curso (para pruebas)
    const userId = 4; // ID del usuario logueado (para pruebas)
  
    // Consulta para obtener las inscripciones del usuario
    const { data: enrollmentsData } = useQuery<UserEnrollmentsResponse, UserEnrollmentsVars>(
      GET_USER_ENROLLMENTS,
      {
        variables: { userId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
      }
    );
  
    // Consulta para obtener las secciones del curso
    const { data: seccionesData } = useQuery<CursoSeccionesResponse, CursoSeccionesVars>(
      GET_CURSO_SECCIONES,
      {
        variables: { courseId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
      }
    );
  
    // Consulta para obtener las asignaciones del curso
    const { data: asignacionesData, loading: asignacionesLoading, error: asignacionesError, refetch: refetchAsignaciones } = useQuery<CursoAsignacionResponse, CursoAsignacionesVars>(
      GET_CURSO_ASIGNACIONES,
      {
        variables: { courseId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
      }
    );

    const cursoActual = enrollmentsData?.userEnrollments?.find(
      (enrollment) => enrollment.courseid === courseId
    )?.course;

  return (
    <>
      <div className="w-4/5 p-8">
        <div className="pb-10 max-w-max" id="navegacion">
          <Navegacion/>
        </div>
        <div className="pb-10">
          <h1 className="text-4xl font-bold"> 1800 - {cursoActual ? cursoActual.fullname : "Cargando curso..."}</h1>
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
              {/* <TabsList className="w-full justify-start">
     <TabsTrigger value="inicio" className="flex items-center">
      <GraduationCap className="mr-2 h-4 w-4" />
      Inicio
    </TabsTrigger> 

    {seccionesData?.courseSections?.map((seccion) => (
      <TabsTrigger
        key={seccion.id}
        value={seccion.id.toString()} // Usar el ID de la sección como valor
        className="flex items-center"
      >
        <Calendar className="mr-2 h-4 w-4" />
        {seccion.name} {/* Mostrar el nombre de la sección */}
      {/* </TabsTrigger>
    ))}
  </TabsList> */}
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
                    {asignacionesLoading && <div className="flex justify-center p-8">Cargando cursos...</div>}
                {asignacionesError && (
                  <div className="text-red-500 p-4 bg-red-50 rounded-md">
                    Error al cargar los cursos: {asignacionesError.message}
                    <Button 
                      variant="outline" 
                      className="mt-2" 
                      onClick={() => refetchAsignaciones()}
                    >
                      Reintentar
                    </Button>
                  </div>
                )}
                {asignacionesData?.assignments?.map((asignaciones) => (
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
