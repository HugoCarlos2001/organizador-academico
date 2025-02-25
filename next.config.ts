import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
      domains: ["res.cloudinary.com"], // Adicione o domínio do Cloudinary
  },
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
