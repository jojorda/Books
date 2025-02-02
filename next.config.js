/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-domain.com'],
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
  serverExternalPackages: ['sqlite3'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle sqlite3 on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Optimize build performance
    config.cache = true;
    
    if (process.env.NODE_ENV === 'production') {
      // Production optimizations
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }

    return config;
  }
}

module.exports = nextConfig
