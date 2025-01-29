/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-domain.com'],
    unoptimized: true, // add domains where your images are hosted
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
  // Disable static optimization to reduce memory usage
  experimental: {
    // Disable memory-intensive features
    optimizeCss: false,
    
    // Enable parallel builds
    workerThreads: true,
    // Optimize page loading
    optimizeCss: true,
    // optimizeImages: false,
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize webpack configuration
    config.cache = {
      type: 'filesystem',
      // Reduce cache size
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      buildDependencies: {
        config: [__filename],
      },
    }

    // Add memory optimization for development
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
