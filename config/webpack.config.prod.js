const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackConfig = require('./webpack.config.base').config;

const extractCss = new ExtractTextPlugin('styles-[contenthash].css');

webpackConfig.mode = 'production';
webpackConfig.devtool = 'source-map';
webpackConfig.module.rules.push({
  test: /\.s?css$/,
  include: /frontend/,
  loader: extractCss.extract({
    fallback: 'style-loader',
    use: [
      'css-loader?modules&importLoaders=1&camelCase&localIdentName=[folder]__[local]__[hash:base64:5]',
      'postcss-loader',
      'sass-loader',
    ],
  }),
});

module.exports = webpackConfig;
