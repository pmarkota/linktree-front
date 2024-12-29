/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://linktree-back.vercel.app/api/:path*",
      },
    ];
  },
  images: {
    domains: ["linktree-back.vercel.app", "localhost"],
  },
};

module.exports = nextConfig;
