/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

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
};

module.exports = withPWA(nextConfig);
