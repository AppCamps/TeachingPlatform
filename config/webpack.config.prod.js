const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackConfig = require('./webpack.config.base').config;

webpackConfig.mode = 'production';
webpackConfig.devtool = 'source-map';
webpackConfig.module.rules.push({
  test: /\.s?css$/,
  include: /frontend/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: {
          localIdentName: '[folder]__[local]__[hash:base64:5]',
          exportLocalsConvention: 'camelCase',
        },
      },
    },
    'postcss-loader',
    'sass-loader',
  ],
});
webpackConfig.plugins.push(
  new MiniCssExtractPlugin({ filename: 'styles-[contenthash].css' }),
);

module.exports = webpackConfig;
9