/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  // Optimize production builds
  compress: true,
};

export default nextConfig;
