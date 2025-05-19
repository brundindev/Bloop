/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
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
  // Deshabilitar la generación estática para páginas que usan el contexto AuthProvider
  typescript: {
    ignoreBuildErrors: true, // Ignorar errores de TypeScript durante la compilación
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignorar errores de ESLint durante la compilación
  },
  // Configuración adicional para deshabilitar la generación estática
  experimental: {
    // Opciones experimentales
    isrMemoryCacheSize: 0, // Desactivar ISR cache
  },
  // Configuración del renderizado
  env: {
    // Variables de entorno para control de renderizado
    NEXT_DISABLE_PRERENDER: 'true',
  }
}

module.exports = nextConfig 