const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["ipfs.io", "gateway.pinata.cloud", "cloudflare-ipfs.com"], // Add more IPFS gateways if needed
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        url: require.resolve("url"),
      };

      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, "");
        }),
      );

      config.plugins.push(new NodePolyfillPlugin());
    }

    return config;
  },
};

module.exports = nextConfig;
