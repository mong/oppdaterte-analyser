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
        ]
      },
};

export default nextConfig;
