/** @type {import('next').NextConfig} */
const nextConfig = {
  // Node.js dependencies (Prisma and its PostgreSQL driver) must not be bundled by webpack
  experimental: { serverComponentsExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg'] },
};

export default nextConfig;
