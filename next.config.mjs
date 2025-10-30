import { withPayload } from '@payloadcms/next/withPayload';

const NEXT_PUBLIC_SERVER_URL = "https://analyser.skde.no"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  trailingSlash: false,
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL, 'http://localhost:3000'].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
    qualities: [25, 50, 75, 100],
    // localPatterns: [
    //   {
    //     pathname: '/api/media/**',
    //   },
    // ],
  },
  eslint: {
    dirs: ['src']
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/.auth/login/cognito',
        permanent: true,
      },
      { // Denne redirecten er lagt til som en fiks for problemer i FNSP. Problemet er at vi vil ha et
        // forsidekort med link til samlesiden for alle helseatlas, uten å få med banner-bildet til skde.no/helseatlas/
        source: '/helseatlas-forside/',
        destination: 'https://www.skde.no/helseatlas/',
        permanent: true,
      }
    ]
  },
};

export default withPayload(nextConfig);
