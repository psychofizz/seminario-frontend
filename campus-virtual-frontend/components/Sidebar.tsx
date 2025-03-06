// components/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAdmin } from '@/lib/auth';

interface SidebarProps {
  courseId?: string | number;
}

export default function Sidebar({ courseId }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const admin = isAdmin();
  
  // Determinar si estamos en un contexto de curso
  const isInCourse = !!courseId;
  
  return (
    <div className={`bg-gray-100 text-gray-800 min-h-screen ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        {isOpen && <h2 className="font-semibold">Navegación</h2>}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded hover:bg-gray-200"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
      
      <nav className="mt-4 px-2">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/"
              className={`flex items-center p-2 rounded ${pathname === '/' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {isOpen && <span>Inicio</span>}
            </Link>
          </li>
          <li>
            <Link 
              href="/courses"
              className={`flex items-center p-2 rounded ${pathname === '/courses' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {isOpen && <span>Mis Cursos</span>}
            </Link>
          </li>
          
          {/* Enlaces específicos de un curso */}
          {isInCourse && (
            <>
              <li className="pt-4 pb-2">
                {isOpen && <div className="text-xs uppercase text-gray-500 font-semibold pl-2">Curso Actual</div>}
              </li>
              <li>
                <Link 
                  href={`/courses/${courseId}`}
                  className={`flex items-center p-2 rounded ${pathname === `/courses/${courseId}` ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {isOpen && <span>Información</span>}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/courses/${courseId}/assignments`}
                  className={`flex items-center p-2 rounded ${pathname?.includes(`/courses/${courseId}/assignments`) ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {isOpen && <span>Tareas</span>}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/courses/${courseId}/forums`}
                  className={`flex items-center p-2 rounded ${pathname?.includes(`/courses/${courseId}/forums`) ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  {isOpen && <span>Foros</span>}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/courses/${courseId}/resources`}
                  className={`flex items-center p-2 rounded ${pathname?.includes(`/courses/${courseId}/resources`) ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  {isOpen && <span>Recursos</span>}
                </Link>
              </li>
            </>
          )}
          
          {/* Enlaces de administración */}
          {admin && (
            <>
              <li className="pt-4 pb-2">
                {isOpen && <div className="text-xs uppercase text-gray-500 font-semibold pl-2">Administración</div>}
              </li>
              <li>
                <Link 
                  href="/admin/users"
                  className={`flex items-center p-2 rounded ${pathname?.includes('/admin/users') ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {isOpen && <span>Usuarios</span>}
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/courses"
                  className={`flex items-center p-2 rounded ${pathname?.includes('/admin/courses') ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h14zm-7 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  {isOpen && <span>Cursos</span>}
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/roles"
                  className={`flex items-center p-2 rounded ${pathname?.includes('/admin/roles') ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {isOpen && <span>Roles</span>}
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}