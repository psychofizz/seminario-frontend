'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

// Este layout se aplica a todas las rutas excepto /auth/*
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redireccionar a la página de login si no está autenticado
    if (!isAuthenticated() && !pathname?.startsWith('/auth/')) {
      router.push('/auth/login');
    }
  }, [pathname, router]);

  // Extraer el ID del curso de la URL si existe
  const getCourseId = () => {
    if (!pathname) return undefined;
    const match = pathname.match(/\/courses\/(\d+)/);
    return match ? match[1] : undefined;
  };

  const courseId = getCourseId();

  // Si no está autenticado y no estamos en una ruta de auth, no renderizar nada
  if (!isAuthenticated() && !pathname?.startsWith('/auth/')) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar courseId={courseId} />
        
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}