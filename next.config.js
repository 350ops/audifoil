/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cikeyqrsslkczzzklixf.supabase.co' },
    ],
  },
  async redirects() {
    return [
      { source: '/activities', destination: '/book', permanent: true },
      { source: '/activities/:slug', destination: '/book/:slug', permanent: true },
      { source: '/crew', destination: '/about', permanent: true },
    ];
  },
};

module.exports = nextConfig;
