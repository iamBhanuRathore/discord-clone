/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferUtil: "commonjs bufferutil",
    });
    return config;
  },
  images: {
    // domains: ["uploadthing.com", "utfs.io"], --- deprecated
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
