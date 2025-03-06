/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configuración para entornos de desarrollo y producción
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    },
    // Permitir la carga de fuentes desde Google
    headers: async () => {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*'
            }
          ]
        }
      ]
    },
    // Redireccionar peticiones /api a la API del backend
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
        },
        {
          source: '/graphql',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/graphql`,
        }
      ]
    }
  };
  
  module.exports = nextConfig;