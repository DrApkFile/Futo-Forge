/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint checks during `next build`
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip TypeScript errors during `next build`
    ignoreBuildErrors: true,
  },
  images: {
    // Avoid automatic image optimization
    unoptimized: true,
  },
}

export default nextConfig
