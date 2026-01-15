/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ignore TypeScript errors during build. We'll rely on `npm run typecheck`.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during build. We'll rely on `npm run lint`.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      }
    ],
  },
};

module.exports = nextConfig;
