const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpackConfig = require("./webpack.config.base").config;
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: "[name]-[contenthash].css",
  chunkFilename: "[id]-[contenthash].css",
});

webpackConfig.mode = "production";
webpackConfig.module.rules.push({
  test: /\.s?css$/,
  include: /frontend/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        importLoaders: 1,
        modules: {
          localIdentName: "[folder]__[local]__[hash:base64:5]",
          exportLocalsConvention: "camelCase",
        },
      },
    },
    "postcss-loader",
    "sass-loader",
  ],
});
webpackConfig.plugins.push(miniCssExtractPlugin);
webpackConfig.optimization.minimize = true;
webpackConfig.optimization.minimizer = [
  new TerserPlugin(),
  new CssMinimizerPlugin(),
];

module.exports = webpackConfig;
