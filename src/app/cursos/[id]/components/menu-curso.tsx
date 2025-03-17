'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
// import Link from "next/link";
import React, { startTransition, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  CursoAsignacionesVars,
  UserEnrollmentsResponse,
  UserEnrollmentsVars,
  CursoSeccionesResponse,
  CursoSeccionesVars,
  Asignacion,
} from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  GET_USER_ENROLLMENTS,
  GET_CURSO_SECCIONES,
  GET_CURSO_ASIGNACIONES,
} from "@/app/api/graphql/api";
import Navegacion from "@/components/navegacion";
import { format } from "date-fns";
// import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface MenuCursoProps {
  courseId: string;
}

export default function MenuCurso({ courseId }: MenuCursoProps) {
  // const params = useParams();
  const numericCourseId = parseInt(courseId, 10);
  const userId = 4;
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
  }, [courseId, numericCourseId]);

  // Consulta para obtener las inscripciones del usuario
  const { data: enrollmentsData } = useQuery<
    UserEnrollmentsResponse,
    UserEnrollmentsVars
  >(GET_USER_ENROLLMENTS, {
    variables: { userId },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  // Consulta para obtener las secciones del curso
  const { data: seccionesData } = useQuery<
    CursoSeccionesResponse,
    CursoSeccionesVars
  >(GET_CURSO_SECCIONES, {
    variables: { courseId:numericCourseId },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !numericCourseId,
  });

  // Consulta para obtener las asignaciones del curso
  const {
    data: asignacionesData,
    loading: asignacionesLoading,
    error: asignacionesError,
    refetch: refetchAsignaciones,
  } = useQuery<{ assignments: Asignacion[] }, CursoAsignacionesVars>(
    GET_CURSO_ASIGNACIONES,
    {
      variables: { courseId:numericCourseId, sectionId: 0 },
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      skip: !courseId,
    }
  );

  const cursoActual = enrollmentsData?.userEnrollments?.find(
    (enrollment) => enrollment.courseid === numericCourseId
  )?.course;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleClick = (asignacion: Asignacion) => {
      startTransition(() => {
        router.push(`/asignacion/${asignacion.id}`);
      });
    };

    const formatDate = (dateString: string | null | undefined) => {
      if (!dateString) return "No establecida";
      try {
        return format(new Date(dateString), "dd/MM/yyyy HH:mm");
      } catch (e) {
        console.error("Error formateando fecha:", e);
        return "Fecha inválida";
      }
    };

    useEffect(() => {
      if (seccionesData?.courseSections.length) {
        setActiveTab(`seccion-${seccionesData.courseSections[0].id}`);
      }
    }, [seccionesData]);
  
    if (!activeTab) {
      return <div className="w-4/5 p-8">Cargando...</div>;
    }

    if (!courseId) {
      return <div className="w-4/5 p-8">Cargando...</div>;
    }  

  return (
    <>
      <div className="w-4/5 p-8">
        <div className="pb-10 max-w-max" id="navegacion">
          <Navegacion courseName={cursoActual?.fullname}/>
        </div>
        <div className="pb-10">
          <h1 className="text-4xl font-bold">
            {" "}
            1800 - {cursoActual ? cursoActual.fullname : "Cargando curso..."}
          </h1>
        </div>
        <div className="" id="main">
          <div className="md:col-span-9">
            <Tabs
              defaultValue= {activeTab}
              className="w-full"
              onValueChange={handleTabChange}
            >
              <TabsList className="w-full justify-start">
                {/* <TabsTrigger value="inicio" className="flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Inicio
                </TabsTrigger> */}
                {seccionesData?.courseSections?.map((seccion) => (
                  <TabsTrigger
                    key={seccion.id}
                    value={`seccion-${seccion.id}`}
                    className="flex items-center"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {seccion.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {/* <TabsContent value="inicio" className="mt-6">
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
              </TabsContent> */}
              {seccionesData?.courseSections?.map((seccion) => {
                // Filtrar las asignaciones que pertenecen a esta sección
                const seccionAsignaciones =
                  asignacionesData?.assignments?.filter(
                    (asignacion) => asignacion.section === seccion.id
                  ) || [];

                return (
                  <TabsContent
                    key={seccion.id}
                    value={`seccion-${seccion.id}`}
                    className="mt-6"
                  >
                    <Card>
                      <CardContent className="pt-6">
                        <h2 className="text-xl font-semibold mb-4">
                          {seccion.name}
                        </h2>
                        <div className="space-y-4">
                          {asignacionesLoading &&
                            activeTab === `seccion-${seccion.id}` && (
                              <div className="flex justify-center p-8">
                                Cargando asignaciones...
                              </div>
                            )}
                          {asignacionesError &&
                            activeTab === `seccion-${seccion.id}` && (
                              <div className="text-red-500 p-4 bg-red-50 rounded-md">
                                Error al cargar las asignaciones:{" "}
                                {asignacionesError.message}
                                <Button
                                  variant="outline"
                                  className="mt-2"
                                  onClick={() => refetchAsignaciones()}
                                >
                                  Reintentar
                                </Button>
                              </div>
                            )}

                          {seccionAsignaciones.length > 0
                            ? seccionAsignaciones.map((asignacion) => (
                                <div
                                  key={asignacion.id}
                                  onClick={() => handleClick(asignacion)}
                                  className="flex items-start space-x-4 pb-4 border-b last:border-0 cursor-pointer"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {asignacion.name ||
                                        `Actividad ${asignacion.id}`}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {asignacion.intro}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Fecha límite:{" "}
                                      {asignacion.duedate
                                        ? formatDate(asignacion.duedate)
                                        : "No especificada"}
                                    </p>
                                  </div>
                                </div>
                              ))
                            : !asignacionesLoading &&
                              !asignacionesError && (
                                <div className="text-center p-4 text-gray-500">
                                  No hay actividades disponibles en esta sección
                                </div>
                              )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
