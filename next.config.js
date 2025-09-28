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