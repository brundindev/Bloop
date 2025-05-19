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
}

module.exports = nextConfig 