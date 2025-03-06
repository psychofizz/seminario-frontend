'use client';

import { useEffect, useState } from 'react';
import { courseAPI } from '@/lib/api';
import { Course } from '@/types';
import Link from 'next/link';
import { isAdmin } from '@/lib/auth';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const admin = isAdmin();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseAPI.getAll();
        setCourses(data);
      } catch (err: any) {
        setError('Error al cargar los cursos: ' + (err.message || 'Desconocido'));
        console.error('Error fetching courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filtrar cursos basado en el término de búsqueda
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.shortname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Cursos</h1>
        
        {admin && (
          <Link 
            href="/courses/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Nuevo Curso
          </Link>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center p-8">Cargando cursos...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
          {searchTerm ? (
            <p className="text-gray-600">No se encontraron cursos que coincidan con "{searchTerm}"</p>
          ) : (
            <p className="text-gray-600">No hay cursos disponibles en este momento.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{course.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{course.shortname}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.visible ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.visible ? 'Visible' : 'Oculto'}
                    </span>
                  </div>
                </div>
                
                <p className="mt-4 text-gray-600">
                  {course.description ? (
                    course.description
                  ) : (
                    <span className="text-gray-400 italic">Sin descripción</span>
                  )}
                </p>
                
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex space-x-3">
                    <Link 
                      href={`/courses/${course.id}`} 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Ver Curso
                    </Link>
                    
                    {admin && (
                      <Link 
                        href={`/courses/${course.id}/edit`} 
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Editar
                      </Link>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      href={`/courses/${course.id}/assignments`} 
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      Tareas
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link 
                      href={`/courses/${course.id}/forums`} 
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      Foros
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link 
                      href={`/courses/${course.id}/resources`} 
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      Recursos
                    </Link>
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