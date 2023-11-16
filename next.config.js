/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // domains: ["uploadthing.com", "utfs.io"], --- deprecated
        remotePatterns: [{
            protocol: "https",
            hostname: "**",
        }],
    }
};

module.exports = nextConfig;
