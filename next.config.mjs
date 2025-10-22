/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",          // when user goes to homepage
        destination: "/feed", //  send them to feed instead
        permanent: true,      // use false if you may change later
      },
    ];
  },
};

export default nextConfig;
