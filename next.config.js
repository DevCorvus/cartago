/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      unoptimized: true, // Not recommended but it works
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
