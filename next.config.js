/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: './',
  images: {
    loader: 'akamai',
    path: '',
  },
  output: 'export',
}

module.exports = nextConfig
