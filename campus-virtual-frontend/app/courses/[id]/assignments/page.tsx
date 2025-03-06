'use client';

import { useEffect, useState } from 'react';
import { courseAPI } from '@/lib/api';
import { Assignment, Course } from '@/types';
import Link from 'next/link';
import { isAdmin } from '@/lib/auth';

export default function CourseAssignmentsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const admin = isAdmin();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar información del curso y las tareas en paralelo
        const [courseData, assignmentsData] = await Promise.all([
          courseAPI.getById(id),
          courseAPI.getAssignments(id)
        ]);
        
        setCourse(courseData);
        setAssignments(assignmentsData || []);
      } catch (err: any) {
        setError('Error al cargar los datos: ' + (err.message || 'Desconocido'));
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'No definido';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p>Cargando tareas del curso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        <h1 className="text-xl font-bold mb-2">Error</h1>
        <p>{error}</p>
        <Link href={`/courses/${id}`} className="text-blue-600 hover:underline mt-4 inline-block">
          Volver al curso
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
          <Link href={`/courses/${id}`} className="text-blue-600 hover:underline inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Volver al curso
          </Link>
          <h1 className="text-3xl font-bold mt-2">Tareas</h1>
          <p className="text-gray-600">{course.name}</p>
        </div>
        
        {admin && (
          <Link 
            href={`/courses/${id}/assignments/create`} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Nueva Tarea
          </Link>
        )}
      </div>
      
      {assignments.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-600 mb-4">No hay tareas disponibles para este curso.</p>
          {admin && (
            <Link 
              href={`/courses/${id}/assignments/create`} 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              Crear la primera tarea
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha límite
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calificación máxima
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{assignment.name}</div>
                      {assignment.description && (
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {assignment.description.replace(/<[^>]+>/g, '').substring(0, 100)}
                          {assignment.description.length > 100 ? '...' : ''}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(assignment.duedate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{assignment.maxgrade || 'No definida'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/courses/${id}/assignments/${assignment.id}`} 
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Ver
                      </Link>
                      {admin && (
                        <>
                          <Link 
                            href={`/courses/${id}/assignments/${assignment.id}/edit`} 
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
                                // Aquí iría la lógica para eliminar la tarea
                                alert('Función de eliminación no implementada');
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}