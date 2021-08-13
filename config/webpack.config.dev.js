const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const devConfig = require('./webpack.config.base').config;

devConfig.entry.jsx = ['react-hot-loader/patch', devConfig.entry.jsx];
devConfig.output.publicPath = 'https://localhost:8080/frontend/';

devConfig.mode = 'development';
devConfig.module.rules.push({
  test: /\.s?css$/,
  include: /frontend/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      query: 'modules&sourceMap&importLoaders=1&camelCase&localIdentName=[folder]__[local]__[hash:base64:5]',
    },
    'postcss-loader',
    'sass-loader',
  ],
});

devConfig.plugins.push(
  new CircularDependencyPlugin({
    exclude: /node_modules/,
    include: /frontend/,
  }),
  new HtmlWebpackHarddiskPlugin()
);

devConfig.devServer = {
  contentBase: './frontend',
  https: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

devConfig.devtool = 'cheap-eval-source-map';

module.exports = devConfig;
