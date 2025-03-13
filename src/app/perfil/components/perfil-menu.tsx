"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Calendar } from "lucide-react";
import Image from "next/image";
import CoursesUser from "@/app/cursos/components/course";
import { Enrollment, UserEnrollmentsVars } from "@/app/types";
import { GET_USER_ENROLLMENTS } from "@/app/api/graphql/api";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
// import { usePathname } from "next/navigation";

export default function MainContent() {
  const userId = 4;
  // const pathname = usePathname();
  const router = useRouter();

  const { data: enrollmentsData, error, loading } = useQuery<{ userEnrollments: Enrollment[] }, UserEnrollmentsVars>(
    GET_USER_ENROLLMENTS,
    {
      variables: { userId },
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    }
  );

  const handleCardClick = (curso: Enrollment) => {
    startTransition(() => {
      router.push(`/cursos/${curso.id}`);
    });
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="container mx-auto px-10 py-6">
      <div className="">
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
                {enrollmentsData?.userEnrollments.map((curso) => (
                  <Card className="hover:cursor-pointer" key={curso.id} onClick={() => handleCardClick(curso)}>
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
                        {curso.course.fullname}
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
      <CoursesUser />
    </main>
  );
}