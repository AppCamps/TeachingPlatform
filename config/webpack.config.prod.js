const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpackConfig = require("./webpack.config.base").config;
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const extractCss = new MiniCssExtractPlugin({
  filename: "[name]-[contenthash].css",
  chunkFilename: "[id]-[contenthash].css",
});

webpackConfig.mode = "production";
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
webpackConfig.optimization.minimize = true;
webpackConfig.optimization.minimizer = [
  new TerserPlugin(),
  new CssMinimizerPlugin(),
];

module.exports = webpackConfig;
