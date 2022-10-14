const fs = require("fs");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devConfig = require("./webpack.config.base").config;
const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: "[name]-[contenthash].css",
  chunkFilename: "[id]-[contenthash].css",
});
devConfig.output.publicPath = "https://localhost:8080/frontend/";
devConfig.optimization.moduleIds = "named";
devConfig.mode = "development";

devConfig.module.rules.push({
  test: /\.s?css$/,
  include: /frontend/,
  use: [
    MiniCssExtractPlugin.loader,
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

devConfig.plugins.push(new HtmlWebpackHarddiskPlugin(), miniCssExtractPlugin);

devConfig.devServer = {
  hot: true,
  static: "./frontend",
  compress: true,
  host: "localhost",
  allowedHosts: ".appcamps.localhost",
  server: {
    type: "https",
    options: {
      key: fs.readFileSync("certs/www/webpack.key"),
      cert: fs.readFileSync("certs/www/webpack.crt"),
    },
  },
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  client: {
    progress: true,
    reconnect: 5,
  },
};

devConfig.devtool = "source-map"; // used by redux dev tools in order to show the trace.

module.exports = devConfig;
