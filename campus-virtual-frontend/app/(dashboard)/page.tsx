'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { courseAPI } from '@/lib/api';
import { Course } from '@/types';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();

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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bienvenido al Campus Virtual</h1>
      
      {user && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Hola, {user.firstname} {user.lastname}</h2>
          <p className="text-gray-600">
            Bienvenido a tu panel de Campus Virtual. Aquí puedes acceder a todos tus cursos y recursos educativos.
          </p>
        </div>
      )}
      
      <h2 className="text-2xl font-semibold mb-4">Mis Cursos</h2>
      
      {isLoading ? (
        <div className="text-center p-4">Cargando cursos...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
          <p className="text-gray-600">No tienes cursos activos en este momento.</p>
          <Link href="/courses" className="mt-2 inline-block text-blue-600 hover:underline">
            Ver todos los cursos disponibles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link 
              key={course.id} 
              href={`/courses/${course.id}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-blue-600 h-3 w-full"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{course.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{course.shortname}</p>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {course.description || "Sin descripción"}
                  </p>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                  <span className="text-sm text-gray-500">
                    {course.visible ? 'Visible' : 'Oculto'}
                  </span>
                  <span className="text-sm text-blue-600">Ver detalles →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}