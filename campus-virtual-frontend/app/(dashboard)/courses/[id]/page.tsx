// app/(dashboard)/courses/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { graphqlAPI } from '@/lib/api/graphql';
import { useAuth } from '@/lib/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDate } from '@/lib/utils/dateFormatter';

// Define types for course details
type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxGrade: number;
};

type Resource = {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  uploadDate: string;
};

type Forum = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

type Course = {
  id: string;
  name: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  isVisible: boolean;
  assignments: Assignment[];
  resources: Resource[];
  forums: Forum[];
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'resources' | 'forums'>('overview');
  const { isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!isAuthenticated || !id) return;
      
      setLoading(true);
      try {
        // Using the GraphQL API for detailed course information with all related data
        const courseData = await graphqlAPI.getCourseWithDetails(id as string);
        setCourse(courseData);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [isAuthenticated, id]);

  const navigateToTab = (tab: 'overview' | 'assignments' | 'resources' | 'forums') => {
    setActiveTab(tab);
  };

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

  if (!course) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 mb-4">Course not found</p>
        <Link href="/courses" className="text-blue-500 hover:underline">
          Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Course header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{course.name}</h1>
              <p className="text-blue-100">{course.code}</p>
            </div>
            <div className="flex space-x-2">
              {(hasRole('admin') || hasRole('teacher')) && (
                <Link 
                  href={`/courses/${id}/edit`}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50"
                >
                  Editar curso
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Navigation tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => navigateToTab('overview')}
              className={`py-4 px-6 ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => navigateToTab('assignments')}
              className={`py-4 px-6 ${
                activeTab === 'assignments'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tareas
              <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {course.assignments?.length || 0}
              </span>
            </button>
            <button
              onClick={() => navigateToTab('resources')}
              className={`py-4 px-6 ${
                activeTab === 'resources'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recursos
              <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {course.resources?.length || 0}
              </span>
            </button>
            <button
              onClick={() => navigateToTab('forums')}
              className={`py-4 px-6 ${
                activeTab === 'forums'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Foros
              <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {course.forums?.length || 0}
              </span>
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="p-6">
          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="flex flex-col md:flex-row md:justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Información del curso</h2>
                  <div className="flex space-x-6">
                    <div>
                      <p className="text-sm text-gray-500">Fecha de inicio</p>
                      <p className="font-medium">{formatDate(course.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha de fin</p>
                      <p className="font-medium">{formatDate(course.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estado</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.isVisible
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.isVisible ? 'Visible' : 'Oculto'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <h2>Descripción</h2>
                <div dangerouslySetInnerHTML={{ __html: course.description }} />
              </div>
            </div>
          )}
          
          {/* Assignments tab */}
          {activeTab === 'assignments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Tareas</h2>
                {(hasRole('admin') || hasRole('teacher')) && (
                  <Link 
                    href={`/courses/${id}/assignments/create`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600"
                  >
                    Crear tarea
                  </Link>
                )}
              </div>
              
              {course.assignments && course.assignments.length > 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {course.assignments.map((assignment) => (
                      <li key={assignment.id}>
                        <Link 
                          href={`/courses/${id}/assignments/${assignment.id}`}
                          className="block hover:bg-gray-50"
                        >
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <p className="text-sm font-medium text-blue-600 truncate">
                                  {assignment.title}
                                </p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="text-sm text-gray-500">
                                  Fecha límite: <span className="font-semibold">{formatDate(assignment.dueDate)}</span>
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                  Calificación máxima: {assignment.maxGrade}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tareas</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Actualmente no hay tareas disponibles para este curso.
                  </p>
                  {(hasRole('admin') || hasRole('teacher')) && (
                    <div className="mt-6">
                      <Link 
                        href={`/courses/${id}/assignments/create`}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Crear tarea
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Resources tab */}
          {activeTab === 'resources' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Recursos</h2>
                {(hasRole('admin') || hasRole('teacher')) && (
                  <Link 
                    href={`/courses/${id}/resources/upload`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600"
                  >
                    Subir recurso
                  </Link>
                )}
              </div>
              
              {course.resources && course.resources.length > 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {course.resources.map((resource) => (
                      <li key={resource.id}>
                        <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-600 truncate">
                                  {resource.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {resource.description || 'Sin descripción'}
                                </p>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <button 
                                onClick={() => window.open(resource.fileUrl, '_blank')}
                                className="px-3 py-1 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                              >
                                Descargar
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Subido el {formatDate(resource.uploadDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay recursos</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Actualmente no hay recursos disponibles para este curso.
                  </p>
                  {(hasRole('admin') || hasRole('teacher')) && (
                    <div className="mt-6">
                      <Link 
                        href={`/courses/${id}/resources/upload`}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Subir recurso
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Forums tab */}
          {activeTab === 'forums' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Foros</h2>
                {(hasRole('admin') || hasRole('teacher')) && (
                  <Link 
                    href={`/courses/${id}/forums/create`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600"
                  >
                    Crear foro
                  </Link>
                )}
              </div>
              
              {course.forums && course.forums.length > 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {course.forums.map((forum) => (
                      <li key={forum.id}>
                        <Link 
                          href={`/courses/${id}/forums/${forum.id}`}
                          className="block hover:bg-gray-50"
                        >
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                  </svg>
                                </div>
                                <p className="text-sm font-medium text-blue-600 truncate">
                                  {forum.title}
                                </p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="text-sm text-gray-500">
                                  Creado el: <span className="font-semibold">{formatDate(forum.createdAt)}</span>
                                </p>
                              </div>
                            </div>
                            {forum.description && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 truncate">
                                  {forum.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay foros</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Actualmente no hay foros disponibles para este curso.
                  </p>
                  {(hasRole('admin') || hasRole('teacher')) && (
                    <div className="mt-6">
                      <Link 
                        href={`/courses/${id}/forums/create`}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Crear foro
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}