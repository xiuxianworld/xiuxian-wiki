/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

module.exports = nextConfig