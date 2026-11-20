/** @type {import('next').NextConfig} */
const nextConfig = {
  // Node.js dependencies read at runtime, they must not be bundled by webpack
  experimental: { serverComponentsExternalPackages: ['pg', 'swagger-ui-dist'] },
};

export default nextConfig;
