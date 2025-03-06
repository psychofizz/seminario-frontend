// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['localhost'], // Add the domain of your API server for images
    },
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8000/graphql',
    },
  };
  
  module.exports = nextConfig;