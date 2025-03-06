'use client';

import { useEffect, useState } from 'react';
import { courseAPI } from '@/lib/api';
import { Course, Forum } from '@/types';
import Link from 'next/link';
import { isAdmin } from '@/lib/auth';

export default function CourseForumsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [course, setCourse] = useState<Course | null>(null);
  const [forums, setForums] = useState<Forum[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const admin = isAdmin();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar información del curso y los foros en paralelo
        const [courseData, forumsData] = await Promise.all([
          courseAPI.getById(id),
          courseAPI.getForums(id)
        ]);
        
        setCourse(courseData);
        setForums(forumsData || []);
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
        <p>Cargando foros del curso...</p>
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
          <h1 className="text-3xl font-bold mt-2">Foros</h1>
          <p className="text-gray-600">{course.name}</p>
        </div>
        
        {admin && (
          <Link 
            href={`/courses/${id}/forums/create`} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Nuevo Foro
          </Link>
        )}
      </div>
      
      {forums.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <p className="text-gray-600 mb-4">No hay foros disponibles para este curso.</p>
          {admin && (
            <Link 
              href={`/courses/${id}/forums/create`} 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              Crear el primer foro
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {forums.map((forum) => (
            <div key={forum.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{forum.name}</h2>
                    {forum.timecreated && (
                      <p className="text-sm text-gray-500 mt-1">
                        Creado el {formatDate(forum.timecreated)}
                      </p>
                    )}
                  </div>
                  {admin && (
                    <div className="flex space-x-2">
                      <Link 
                        href={`/courses/${id}/forums/${forum.id}/edit`} 
                        className="text-sm text-gray-600 hover:text-blue-600"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('¿Estás seguro de que deseas eliminar este foro?')) {
                            // Aquí iría la lógica para eliminar el foro
                            alert('Función de eliminación no implementada');
                          }
                        }}
                        className="text-sm text-gray-600 hover:text-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  {forum.description ? (
                    <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: forum.description }} />
                  ) : (
                    <p className="text-gray-400 italic">Sin descripción</p>
                  )}
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <Link 
                    href={`/courses/${id}/forums/${forum.id}`} 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver discusiones
                  </Link>
                  
                  <div>
                    <span className="text-sm text-gray-500">
                      Tipo: {forum.type || 'Estándar'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}