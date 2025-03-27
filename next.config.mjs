/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    trailingSlash: true,
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

export default nextConfig;
