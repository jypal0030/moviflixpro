/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO and Performance Optimizations
  reactStrictMode: false, // Disabled for development with nodemon
  
  // Image optimization
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/movie/:id',
        destination: '/movies/:id',
        permanent: true,
      },
      {
        source: '/series/:id',
        destination: '/web-series/:id',
        permanent: true,
      },
    ];
  },

  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // TypeScript and ESLint settings for production
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Webpack configuration for development
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable webpack's hot module replacement for nodemon
      config.watchOptions = {
        ignored: ['**/*'],
      };
    }
    return config;
  },
};

module.exports = nextConfig;