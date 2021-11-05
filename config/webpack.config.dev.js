const fs = require("fs");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");

const devConfig = require("./webpack.config.base").config;

devConfig.output.publicPath = "https://localhost:8080/frontend/";
devConfig.optimization.moduleIds = "named";
devConfig.mode = "development";

devConfig.module.rules.push({
  test: /\.s?css$/,
  include: /frontend/,
  use: [
    "style-loader",
    {
      loader: "css-loader",
      options: {
        modules: {
          localIdentName: "[folder]__[local]__[hash:base64:5]",
          exportLocalsConvention: "camelCase",
        },
        sourceMap: true,
        importLoaders: 1,
      },
    },
    "postcss-loader",
    "sass-loader",
  ],
});

devConfig.plugins.push(new HtmlWebpackHarddiskPlugin());

devConfig.devServer = {
  static: "./frontend",
  http2: true,
  compress: true,
  https: {
    key: fs.readFileSync("certs/www/webpack.key"),
    cert: fs.readFileSync("certs/www/webpack.crt"),
  },
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  allowedHosts: [".appcamps.localhost"],
  hot: true,
  client: {
    progress: true,
    reconnect: 5,
  },
};

devConfig.devtool = "source-map"; // used by redux dev tools in order to show the trace.

module.exports = devConfig;
