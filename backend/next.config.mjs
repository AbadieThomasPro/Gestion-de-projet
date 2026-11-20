/** @type {import('next').NextConfig} */
const nextConfig = {
  // pg is a Node.js dependency, it must not be bundled by webpack
  experimental: { serverComponentsExternalPackages: ['pg'] },
};

export default nextConfig;
