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
import { type DropzoneState, useDropzone } from "react-dropzone";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { FileArchive } from "lucide-react";

interface ViewAsignacionProps {
  assignmentId: string;
}

export default function SubmissionAsignacion({
  assignmentId,
}: ViewAsignacionProps) {
  const numericAssignmentId = parseInt(assignmentId, 10);
  const userId = 4;

  useEffect(() => {}, [assignmentId, numericAssignmentId]);

  const { data, loading, error, refetch } = useQuery<
    GetAsignacionResponse,
    GetAsignacionesVars
  >(GET_ASIGNACION, {
    variables: { assignmentId: numericAssignmentId },
    fetchPolicy: "cache-and-network", // Usar caché pero actualizar en segundo plano
    nextFetchPolicy: "cache-first",
    errorPolicy: "all",
  });

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
    (enrollment) => enrollment.courseid === data?.assignment.course
  )?.course;

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
    acceptedFiles,
  }: DropzoneState = useDropzone({
    accept: {
      "image/*": [], // Todos los formatos de imagen
      "application/pdf": [], // PDF
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [], // DOCX
      "audio/mpeg": [], // MP3
      "video/mp4": [], // MP4
    },
    multiple: false,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const focusedClass = "border-neutral-500 bg-neutral-500/10 text-neutral-500";
  const acceptClass = "border-green-500 bg-green-500/10 text-green-500";
  const rejectClass = "border-red-500 bg-red-500/10 text-red-500";

  const getClassName = () => {
    if (isDragReject) return rejectClass;
    if (isDragAccept) return acceptClass;
    if (isFocused) return focusedClass;
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
            <Navegacion courseName={cursoActual?.fullname} />
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
                      <form action="">
                        <div className="col-span-full">
                          <Label htmlFor="cover-photo" className="block">
                            Agregar un archivo{" "}
                          </Label>
                          <div
                            {...getRootProps()}
                            className={`mt-4 flex text-gray-600 flex-col justify-center items-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 transition-colors duration-200 ${getClassName()} cursor-pointer hover:bg-slate-100`}
                          >
                            <input name="file" {...getInputProps()} />
                            {acceptedFiles.length > 0 ? (
                              <p>
                                Archivo seleccionado: {acceptedFiles[0].name}
                              </p>
                            ) : (
                              <>
                                {isDragAccept && <p>Suelta el archivo aquí</p>}
                                {isDragReject && <p>Formato no permitido</p>}
                                {!isDragActive && (
                                  <div className="text-center">
                                    <FileArchive
                                      className="mx-auto h-12 w-12 text-neutral-400"
                                      aria-hidden="true"
                                    />
                                    <div className="mt-4 text-sm text-gray-600">
                                      <p className="pl-1">
                                        <span className="text-blue-600">
                                          Sube{" "}
                                        </span>
                                        o arrastra y suelta un archivo
                                      </p>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      Formatos: PDF, DOCX, MP3, MP4, Imágenes
                                      (20MB máx)
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                            {acceptedFiles.length > 0 && (
                              <Image
                                src={URL.createObjectURL(acceptedFiles[0])}
                                alt={`Imagen de`}
                                width={150}
                                height={150}
                                className="h-40 w-40 mt-2 rounded-full border-4 border-green-500/50 object-cover"
                              />
                            )}
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
                <div className="ml-8 flex flex-row gap-3">
                  <div className="flex justify-center items-center">
                    <Button
                      variant="blue"
                      className="hover:cursor-pointer hover:shadow-gray-600 hover:z-20"
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                  <div className="flex justify-center items-center">
                    <Button
                      variant="outline"
                      className="hover:cursor-pointer hover:shadow-gray-600 hover:z-20"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
