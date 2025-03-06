// app/(dashboard)/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { coursesAPI } from '@/lib/api/rest';
import { graphqlAPI } from '@/lib/api/graphql';
import { formatDate } from '@/lib/utils/dateFormatter';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Define types
type Course = {
  id: string;
  name: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  isVisible: boolean;
};

type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  courseId: string;
  courseName: string;
};

export default function DashboardPage() {
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        // Fetch recent courses
        const coursesData = await graphqlAPI.getAllCourses();
        
        // Sort by last access (if we had that data) or just use the most recent courses
        // For now just limiting to 3 courses
        setRecentCourses(coursesData.slice(0, 3));
        
        // Fetch upcoming assignments from all courses
        const upcomingAssignmentsData: Assignment[] = [];
        
        // We would need an API endpoint to get all upcoming assignments
        // For now, let's simulate by getting assignments from each course
        for (const course of coursesData) {
          try {
            const assignments = await coursesAPI.getCourseAssignments(course.id);
            
            // Add course name to each assignment and filter for upcoming ones
            const courseAssignments = assignments
              .filter((assignment: any) => new Date(assignment.dueDate) > new Date())
              .map((assignment: any) => ({
                ...assignment,
                courseId: course.id,
                courseName: course.name
              }));
            
            upcomingAssignmentsData.push(...courseAssignments);
          } catch (err) {
            console.error(`Error fetching assignments for course ${course.id}:`, err);
            // Continue with other courses even if one fails
          }
        }
        
        // Sort by due date (closest first) and limit to 5
        const sortedAssignments = upcomingAssignmentsData
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 5);
        
        setUpcomingAssignments(sortedAssignments);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Welcome section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenido{user ? `, ${user.firstname}` : ''}
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido a tu panel de Campus Virtual. Aquí puedes ver un resumen de tus cursos y actividades pendientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent courses section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">Mis cursos recientes</h2>
                <Link href="/courses" className="text-blue-600 hover:underline text-sm">
                  Ver todos
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentCourses.length > 0 ? (
                recentCourses.map((course) => (
                  <Link key={course.id} href={`/courses/${course.id}`}>
                    <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
                      <h3 className="text-md font-medium text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 truncate">{course.code}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No hay cursos recientes</p>
                  <Link href="/courses" className="text-blue-600 hover:underline mt-2 inline-block">
                    Explorar cursos
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming assignments section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-yellow-50 border-b border-yellow-100">
              <h2 className="text-lg font-medium text-gray-800">Próximas entregas</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingAssignments.length > 0 ? (
                upcomingAssignments.map((assignment) => (
                  <Link key={assignment.id} href={`/courses/${assignment.courseId}/assignments/${assignment.id}`}>
                    <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
                      <h3 className="text-md font-medium text-gray-900 truncate">{assignment.title}</h3>
                      <p className="text-sm text-blue-600 mt-1">{assignment.courseName}</p>
                      <div className="flex items-center mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-500">
                          Fecha límite: {formatDate(assignment.dueDate)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No hay entregas próximas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick access section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {/* Quick access cards */}
        <div className="bg-white rounded-lg shadow-md p-4 text-center hover:bg-blue-50 transition-colors duration-150">
          <Link href="/calendar" className="block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="font-medium text-gray-900">Calendario</h3>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center hover:bg-blue-50 transition-colors duration-150">
          <Link href="/messages" className="block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="font-medium text-gray-900">Mensajes</h3>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center hover:bg-blue-50 transition-colors duration-150">
          <Link href="/grades" className="block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="font-medium text-gray-900">Calificaciones</h3>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center hover:bg-blue-50 transition-colors duration-150">
          <Link href="/profile" className="block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="font-medium text-gray-900">Perfil</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}