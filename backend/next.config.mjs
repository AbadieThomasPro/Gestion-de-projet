/** @type {import('next').NextConfig} */
const nextConfig = {
  // Node.js dependencies read at runtime (Prisma, its PostgreSQL driver, Swagger UI files):
  // they must not be bundled by webpack
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg', 'swagger-ui-dist'],
  },
};

export default nextConfig;
