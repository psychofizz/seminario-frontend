'use client';

import { useEffect, useState } from 'react';
import { courseAPI } from '@/lib/api';
import { Course } from '@/types';
import Link from 'next/link';
import { isAdmin } from '@/lib/auth';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const admin = isAdmin();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseAPI.getById(id);
        setCourse(data);
      } catch (err: any) {
        setError('Error al cargar el curso: ' + (err.message || 'Desconocido'));
        console.error('Error fetching course:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'No definido';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p>Cargando información del curso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        <h1 className="text-xl font-bold mb-2">Error</h1>
        <p>{error}</p>
        <Link href="/courses" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver a la lista de cursos
        </Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
        <h1 className="text-xl font-bold mb-2">Curso no encontrado</h1>
        <p>El curso que estás buscando no existe o ha sido eliminado.</p>
        <Link href="/courses" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver a la lista de cursos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/courses" className="text-blue-600 hover:underline inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Volver a cursos
          </Link>
          <h1 className="text-3xl font-bold mt-2">{course.name}</h1>
          <p className="text-gray-600">{course.shortname}</p>
        </div>
        
        {admin && (
          <div className="flex space-x-3">
            <Link 
              href={`/courses/${course.id}/edit`} 
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Editar Curso
            </Link>
            <button 
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => {
                if (confirm('¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.')) {
                  // Aquí iría la lógica para eliminar el curso
                  courseAPI.delete(course.id).then(() => {
                    window.location.href = '/courses';
                  }).catch(err => {
                    alert('Error al eliminar el curso: ' + (err.message || 'Error desconocido'));
                  });
                }
              }}
            >
              Eliminar Curso
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Información del Curso</h2>
            <div className="prose max-w-none">
              {course.description ? (
                <div dangerouslySetInnerHTML={{ __html: course.description }} />
              ) : (
                <p className="text-gray-500 italic">No hay descripción disponible para este curso.</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Tareas
              </h2>
              <Link href={`/courses/${course.id}/assignments`} className="text-blue-600 hover:underline flex justify-between items-center">
                <span>Ver todas las tareas</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                Foros
              </h2>
              <Link href={`/courses/${course.id}/forums`} className="text-blue-600 hover:underline flex justify-between items-center">
                <span>Ver todos los foros</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Recursos
              </h2>
              <Link href={`/courses/${course.id}/resources`} className="text-blue-600 hover:underline flex justify-between items-center">
                <span>Ver todos los recursos</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Matriculaciones
              </h2>
              <Link href={`/courses/${course.id}/enrollments`} className="text-blue-600 hover:underline flex justify-between items-center">
                <span>Ver matriculaciones</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Detalles</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nombre corto</h3>
                <p>{course.shortname}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Fecha de inicio</h3>
                <p>{formatDate(course.startdate)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Fecha de fin</h3>
                <p>{formatDate(course.enddate)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.visible ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {course.visible ? 'Visible' : 'Oculto'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}