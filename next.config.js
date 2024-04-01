/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  assetPrefix: './',
  images: {
    loader: 'akamai',
    path: '',
  },
}

module.exports = nextConfig
