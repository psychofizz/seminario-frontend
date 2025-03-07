// app/layout.tsx
import './globals.css';
import { ApolloProvider } from './poviders';

export const metadata = {
  title: 'Plataforma de Cursos',
  description: 'Sistema de gestión de cursos y estudiantes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
