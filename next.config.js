/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-domain.com'],
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    optimizeCss: false, // Matikan CSS optimization
    workerThreads: false, // Matikan worker threads
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named',
        chunkIds: 'named',
        minimize: false,
      }
    }

    return config
  },
}

module.exports = nextConfig
