const path = require("path");
/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["ui"],
  output: "standalone",
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    turbotrace: {
      logDetail: true
    },
    typedRoutes: true,
  },
};
