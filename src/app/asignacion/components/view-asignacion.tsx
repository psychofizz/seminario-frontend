"use client";
import { GET_ASIGNACION, GET_USER_ENROLLMENTS } from "@/app/api/graphql/api";
import {
  GetAsignacionesVars,
  GetAsignacionResponse,
  UserEnrollmentsResponse,
  UserEnrollmentsVars,
} from "@/app/types";
import Navegacion from "@/components/navegacion";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface ViewAsignacionProps {
  assignmentId: string;
}

export default function ViewAsignacion({ assignmentId }: ViewAsignacionProps) {
  const courseId = 1;
  const numericAssignmentId = parseInt(assignmentId, 10);
  const userId = 4;
  
    useEffect(() => {
    }, [assignmentId, numericAssignmentId]);

  const { data, loading, error, refetch } = useQuery<
    GetAsignacionResponse,
    GetAsignacionesVars
  >(GET_ASIGNACION, {
    variables: { assignmentId:numericAssignmentId },
    fetchPolicy: "cache-and-network", // Usar caché pero actualizar en segundo plano
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
  });

  console.log(data)

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
    // Log solo en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.log("Datos obtenidos:", data);
    }
  }, [data]);

  const { data: enrollmentsData } = useQuery<
    UserEnrollmentsResponse,
    UserEnrollmentsVars
  >(GET_USER_ENROLLMENTS, {
    variables: { userId },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !numericAssignmentId,
  });

  const cursoActual = enrollmentsData?.userEnrollments?.find(
    (enrollment) => enrollment.courseid === courseId
  )?.course;

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
            <h1 className="text-5xl font-bold font-sans">
              1800 - {cursoActual ? cursoActual.fullname : "Cargando curso..."}
            </h1>
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
            {data?.assignment && (
              <div className="p-2">
                <div className="text-3xl font-light pb-4">
                  {data.assignment.name}
                </div>
                <div className="flex flex-row pb-16 gap-4">
                  <div className="bg-amber-200 rounded-2xl p-2">
                    Apertura:{" "}
                    {formatDate(data.assignment.allowsubmissionsfromdate)}
                  </div>
                  <div className="bg-amber-200 rounded-2xl p-2">
                    Cierre: {formatDate(data.assignment.duedate)}
                  </div>
                </div>
                <div className="">{data.assignment.name}</div>
                <div>{data.assignment.intro}</div>

                <div className="pb-32">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4 w-full">
                        <div className="flex items-center space-x-4 py-6 border-b last:border-0">
                          <div className="w-full">
                            <div className="flex flex-row">
                              <p className="font-bold text-gray-800">Grupo:</p>
                            </div>
                            <hr className="my-2 border-gray-300 w-full" />{" "}
                            <div className="flex flex-row">
                              <p className="font-bold text-gray-800">
                                Estado de Entrega:
                              </p>
                            </div>
                            <hr className="my-2 border-gray-300" />{" "}
                            <div className="flex flex-row">
                              <p className="font-bold text-gray-800">
                                Estado de la calificación:
                              </p>
                            </div>
                            <hr className="my-2 border-gray-300" />{" "}
                            <div className="flex flex-row">
                              <p className="font-bold text-gray-800">
                                Tiempo restante:
                              </p>
                            </div>
                            <hr className="my-2 border-gray-300" />{" "}
                            <div className="flex flex-row">
                              <p className="font-bold text-gray-800">
                                Última Modificación:
                              </p>
                              <p className="font-normal mx-4">
                                {formatDate(data.assignment.timemodified)}
                              </p>
                            </div>
                            <hr className="my-2 border-gray-300" />{" "}
                            <div className="flex flex-row">
                              <p className="font-bold text-gray-800">
                                Comentarios de la entrega:
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-center items-center">
                  <Button variant="outline" className="hover:cursor-pointer hover:shadow-gray-600 hover:z-20">Agregar entrega</Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
