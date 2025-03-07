// StudentCourses.tsx
'use client';

import { useQuery } from '@apollo/client';
import { Enrollment, UserEnrollmentsResponse, UserEnrollmentsVars } from '@/app/types';
import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, BookOpen, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { gql } from '@apollo/client';

// Define la consulta GraphQL aquí dentro del componente
// para evitar problemas de importación
const GET_USER_ENROLLMENTS = gql`
  query GetUserEnrollments($userId: Int!) {
    userEnrollments(userId: $userId) {
      id
      enrolid
      userid
      courseid
      status
      timestart
      timeend
      timecreated
      timemodified
      course {
        id
        fullname
        shortname
        summary
        visible
        startdate
        enddate
        format
      }
    }
  }
`;

interface StudentCoursesProps {
  userId: number;
}

export default function StudentCourses({ userId }: StudentCoursesProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  // Usar useQuery de Apollo para obtener los datos
  const { data, loading, error, refetch } = useQuery<UserEnrollmentsResponse, UserEnrollmentsVars>(
    GET_USER_ENROLLMENTS,
    {
      variables: { userId },
      fetchPolicy: 'cache-and-network', // Usar caché pero actualizar en segundo plano
      nextFetchPolicy: 'cache-first',
    }
  );

  // Resto del código igual...
  // Filtrar los cursos utilizando useMemo para optimizar el rendimiento
  const filteredEnrollments = useMemo(() => {
    if (!data?.userEnrollments) return [];

    switch (filter) {
      case 'active':
        return data.userEnrollments.filter(
          (enrollment) => enrollment.status === 0 && enrollment.course.visible
        );
      case 'completed':
        return data.userEnrollments.filter(
          (enrollment) => 
            enrollment.timeend && new Date(enrollment.timeend) < new Date()
        );
      default:
        return data.userEnrollments;
    }
  }, [data, filter]);

  // Formatear fecha para mostrar
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Convertir a tiempo restante legible
  const getTimeRemaining = (endDate?: string) => {
    if (!endDate) return 'Sin fecha límite';
    
    const end = new Date(endDate);
    const now = new Date();
    
    if (end < now) return 'Finalizado';
    
    const diffTime = Math.abs(end.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 día restante';
    return `${diffDays} días restantes`;
  };

  if (loading && !data) return <div className="flex justify-center p-8">Cargando cursos...</div>;
  
  if (error) return (
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
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mis Cursos</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
        >
          Actualizar
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(value as 'all' | 'active' | 'completed')}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="completed">Completados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderCoursesList(filteredEnrollments)}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          {renderCoursesList(filteredEnrollments)}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {renderCoursesList(filteredEnrollments)}
        </TabsContent>
      </Tabs>
    </div>
  );

  // Función para renderizar la lista de cursos
  function renderCoursesList(enrollments: Enrollment[]) {
    if (enrollments.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No se encontraron cursos en esta categoría.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrollments.map((enrollment) => (
          <CourseCard 
            key={enrollment.id} 
            enrollment={enrollment} 
            formatDate={formatDate}
            getTimeRemaining={getTimeRemaining}
          />
        ))}
      </div>
    );
  }
}

// Componente de tarjeta de curso para mejorar la estructura del código
interface CourseCardProps {
  enrollment: Enrollment;
  formatDate: (date?: string) => string;
  getTimeRemaining: (endDate?: string) => string;
}

function CourseCard({ enrollment, formatDate, getTimeRemaining }: CourseCardProps) {
  const { course } = enrollment;
  const isActive = enrollment.status === 0 && course.visible;
  const isCompleted = enrollment.timeend && new Date(enrollment.timeend) < new Date();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{course.fullname}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.summary || `Curso: ${course.shortname}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span>Inicio: {formatDate(course.startdate)}</span>
          </div>
          
          {course.enddate && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{getTimeRemaining(course.enddate)}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {isActive ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span>{isActive ? 'Activo' : 'Inactivo'}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" variant={isCompleted ? "outline" : "default"}>
          <BookOpen className="mr-2 h-4 w-4" />
          {isCompleted ? 'Ver certificado' : 'Ir al curso'}
        </Button>
      </CardFooter>
    </Card>
  );
}
