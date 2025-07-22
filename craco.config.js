const path = require("path");
require("dotenv").config();

module.exports = {
  webpack: {
    configure: (config, { env, paths }) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });
      return config;
    },
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@atom": path.resolve(__dirname, "src/components/atom"),
      "@molecule": path.resolve(__dirname, "src/components/molecule"),
      "@api": path.resolve(__dirname, "src/api"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@utility": path.resolve(__dirname, "src/utility"),
    },
  },
};
