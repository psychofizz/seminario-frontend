// components/common/Navbar.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

export default function Navbar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const pathname = usePathname();

  // Get current section name based on path
  const getCurrentSection = () => {
    if (pathname.startsWith('/courses')) {
      return 'Mis Cursos';
    } else if (pathname.startsWith('/calendar')) {
      return 'Calendario';
    } else if (pathname.startsWith('/messages')) {
      return 'Mensajes';
    } else if (pathname.startsWith('/grades')) {
      return 'Calificaciones';
    } else if (pathname.startsWith('/profile')) {
      return 'Perfil';
    } else if (pathname.startsWith('/admin')) {
      return 'Administración';
    } else {
      return 'Dashboard';
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 shadow-sm">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800 mr-10">
            {getCurrentSection()}
          </h1>

          {/* Search bar */}
          <div className={`relative ${searchFocused ? 'w-96' : 'w-64'} transition-all duration-200`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder="Buscar cursos, recursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-3">
          {/* Notifications dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span className="sr-only">Notificaciones</span>
              
              {/* Notification badge */}
              <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
                3
              </div>
            </button>

            {/* Notifications dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {/* Sample notifications */}
                  {[1, 2, 3].map((item) => (
                    <a href="#" key={item} className="flex px-4 py-3 hover:bg-gray-50">
                      <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Nueva tarea disponible</p>
                        <p className="text-xs text-gray-500">La tarea "Entrega de instrumento(s) de investigación" está disponible</p>
                        <span className="text-xs text-blue-600">Hace 2 horas</span>
                      </div>
                    </a>
                  ))}
                </div>
                <a href="#" className="block py-2 text-sm font-medium text-center text-blue-600 bg-gray-50 hover:bg-gray-100 rounded-b-lg">
                  Ver todas las notificaciones
                </a>
              </div>
            )}
          </div>

          {/* Messages icon */}
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <span className="sr-only">Mensajes</span>
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              type="button"
              className="flex items-center focus:outline-none"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium overflow-hidden">
                {user?.profilePic ? (
                  <Image 
                    src={user.profilePic} 
                    alt={`${user.firstname} ${user.lastname}`}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{user?.firstname?.charAt(0)}{user?.lastname?.charAt(0)}</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                {user?.firstname} {user?.lastname}
              </span>
              <svg className="w-4 h-4 ml-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>

            {/* Profile dropdown menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mi Perfil
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Configuración
                  </Link>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      const { logout } = useAuth();
                      logout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}