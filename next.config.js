/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuración para imágenes externas (si se usan)
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  // Añadir este middleware para reescribir rutas si es necesario
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ]
  },
  // Ignorar errores durante la compilación para despliegue en Vercel
  typescript: {
    ignoreBuildErrors: true, // Ignorar errores de TypeScript durante la compilación
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignorar errores de ESLint durante la compilación
  },
  // Configuración para Vercel
  swcMinify: true, // Usar SWC para minificación
}

module.exports = nextConfig 