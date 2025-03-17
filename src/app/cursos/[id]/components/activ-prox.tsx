'use client'
import { CURSO_ASIGNACIONES_PROXIMAS } from '@/app/api/graphql/api';
import { CursoAsigProxResponse, GetCursoAsignacionesVars } from '@/app/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { useEffect } from 'react';

interface CursoProps {
  courseId: string;
}

export default function ActividadesProximas({ courseId }: CursoProps) {
  const numericCourseId = parseInt(courseId, 10);
    // const userId = 4;

  const {
      data: asignacionesData,
      // loading: asignacionesLoading,
      // error: asignacionesError,
      // refetch: refetchAsignaciones,
    } = useQuery<CursoAsigProxResponse, GetCursoAsignacionesVars>(
      CURSO_ASIGNACIONES_PROXIMAS,
      {
        variables: { courseId:numericCourseId },
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
        skip: !courseId,
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
    
    useEffect(() => {
    }, [courseId, numericCourseId]);
  
  return (
    <div className='w-1/5 bg-blue-200 p-6'>
        <div className="flex flex-col justify-center gap-4">
            {asignacionesData?.CourseAssignmentsProx.map((asignaciones) => (
              <Card key={asignaciones.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                  {asignaciones.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500"> 
                    {formatDate(asignaciones.duedate)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
    </div>
  )
}
