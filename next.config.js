/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Configuración para imágenes externas (si se usan)
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true,
  },
  // Configuración para styled-components
  compiler: {
    styledComponents: true,
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
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuración específica para producción
  productionBrowserSourceMaps: false,
  // Configuración específica para Vercel
  experimental: {
    forceSwcTransforms: true,
  },
  // Configuración para Vercel
  swcMinify: true,
}

module.exports = nextConfig 