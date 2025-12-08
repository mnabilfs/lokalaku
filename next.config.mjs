/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
       {
        protocol: "https",
        hostname: "web-production-e7f3b.up.railway.app", 
        pathname: "/storage/**",
      }
    ],
  },
};

export default nextConfig;
