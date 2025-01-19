/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '12mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['sxkmrpzbtqpraucnmnjm.supabase.co', 'placehold.co'], // Add your Supabase storage domain and placehold.co
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sxkmrpzbtqpraucnmnjm.supabase.co',
        port: '',
        pathname: '/**', // Adjust as needed to match the path structure
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
