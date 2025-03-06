// components/layouts/DashboardLayout.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layouts/Sidebar';
import Navbar from '@/components/common/Navbar';
import { useAuth } from '@/lib/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Don't render anything if not authenticated to prevent flash of content
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <Navbar />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}