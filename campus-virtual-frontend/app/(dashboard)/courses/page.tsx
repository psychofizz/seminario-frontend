// app/(dashboard)/courses/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { graphqlAPI } from '@/lib/api/graphql';
import CourseCard from '@/components/courses/CourseCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Define Course type
type Course = {
  id: string;
  name: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  isVisible: boolean;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'card' | 'list'>('card');
  const [sort, setSort] = useState<'name' | 'date'>('name');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        // Using GraphQL for this endpoint as it provides a cleaner data structure
        const coursesData = await graphqlAPI.getAllCourses();
        setCourses(coursesData);
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated]);

  // Sort courses based on selected option
  const sortedCourses = [...courses].sort((a, b) => {
    if (sort === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Mis Cursos</h1>
        
        <div className="flex space-x-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'name' | 'date')}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Nombre del curso</option>
              <option value="date">Fecha de inicio</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setView('card')}
              className={`px-3 py-2 ${
                view === 'card' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-2 ${
                view === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center p-6 bg-gray-100 rounded-lg">
          <p className="text-gray-600 mb-4">No tienes cursos disponibles.</p>
          {user && user.roles.some(role => ['admin', 'teacher'].includes(role.shortname)) && (
            <Link 
              href="/courses/create" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Crear un nuevo curso
            </Link>
          )}
        </div>
      ) : (
        <>
          {view === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {sortedCourses.map((course) => (
                  <li key={course.id} className="p-4 hover:bg-gray-50">
                    <Link href={`/courses/${course.id}`} className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                        <p className="text-sm text-gray-500">{course.code}</p>
                      </div>
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}