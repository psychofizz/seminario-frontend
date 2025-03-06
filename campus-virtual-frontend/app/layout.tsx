// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Campus Virtual UNAH',
  description: 'Plataforma educativa de la Universidad Nacional Autónoma de Honduras',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}