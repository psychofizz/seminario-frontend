"use client";
import { GET_ASIGNACIONES_PROXIMAS } from "@/app/api/graphql/api";
import { AsignacionesProxResponse } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@apollo/client";
import { format } from "date-fns";

export default function TodasActProximas() {
//   const numericCourseId = parseInt(courseId, 10);
  // const userId = 4;

  const {
    data: asignacionesProxData,
    // loading: asignacionesLoading,
    // error: asignacionesError,
    // refetch: refetchAsignaciones,
  } = useQuery<AsignacionesProxResponse>(
    GET_ASIGNACIONES_PROXIMAS,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    }
  );

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "No establecida";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (e) {
      console.error("Error formateando fecha:", e);
      return "Fecha inválida";
    }
  };

  return (
    <div className="min-w-72 p-6">
      <div className="flex flex-col justify-center gap-4">
        <Card className="border-2">
          {asignacionesProxData?.AllAssigmentsProx.map((asignaciones) => (
            <div className="flex flex-col items-start space-x-4 py-4 border-b last:border-0 cursor-pointer" key={asignaciones.id}>
              <CardHeader>
                <CardTitle className="text-lg">{asignaciones.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {formatDate(asignaciones.duedate)}
                </p>
              </CardContent>
            </div>
          ))}       
        </Card>
      </div>
    </div>
  );
}
