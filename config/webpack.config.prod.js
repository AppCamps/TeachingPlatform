const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpackConfig = require("./webpack.config.base").config;

const extractCss = new MiniCssExtractPlugin({
  filename: "styles-[contenthash].css",
});

webpackConfig.mode = "production";
webpackConfig.devtool = "source-map";
webpackConfig.module.rules.push({
  test: /\.s?css$/,
  include: /frontend/,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader?modules&importLoaders=1&camelCase&localIdentName=[folder]__[local]__[hash:base64:5]",
    "postcss-loader",
    "sass-loader",
  ],
});
webpackConfig.plugins.push(extractCss);

module.exports = webpackConfig;
