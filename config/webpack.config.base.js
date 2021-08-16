const path = require('path');
const execSync = require('child_process').execSync;

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const baseDir = process.cwd();

require('dotenv').config({ silent: true });

const NODE_ENV = process.env.NODE_ENV || 'development';
const TRACKJS_APPLICATION = process.env.TRACKJS_APPLICATION || NODE_ENV;
const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID;
const GOOGLE_ANALYTICS_CONVERSION_ID = process.env.GOOGLE_ANALYTICS_CONVERSION_ID;
const GOOGLE_ANALYTICS_CONVERSION_LABEL = process.env.GOOGLE_ANALYTICS_CONVERSION_LABEL;
const VERSION = process.env.SOURCE_VERSION || execSync('git log -n 1 --abbrev=15 --format=%h').toString().trim();
const PREVIEW_FEATURES = process.env.PREVIEW_FEATURES || (NODE_ENV === 'test');
const DEFAULT_LANGUAGE = process.env.DEFAULT_LANGUAGE || 'de';
const INTERCOM_APP_ID = process.env.INTERCOM_APP_ID;
const DOMAIN = process.env.DOMAIN || 'appcamps.de';
const WWW_URL = process.env.WWW_URL;
const COMMUNITY_URL = process.env.COMMUNITY_URL;
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;

const config = {
  context: path.join(baseDir, './frontend'),
  entry: {
    vendor: [
      'babel-polyfill',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-orm',
    ],
    jsx: './index.jsx',
  },
  output: {
    path: path.join(baseDir, './public/frontend'),
    filename: 'bundle-[hash].js',
    publicPath: '/frontend/',
  },
  mode: 'none',
  bail: true,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: /frontend/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: { loader: 'url-loader', options: { limit: 25000 } },
        include: /frontend/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'process.env.TRACKJS_APPLICATION': JSON.stringify(TRACKJS_APPLICATION),
      'process.env.GOOGLE_ANALYTICS_ID': JSON.stringify(GOOGLE_ANALYTICS_ID),
      'process.env.GOOGLE_ANALYTICS_CONVERSION_ID': JSON.stringify(GOOGLE_ANALYTICS_CONVERSION_ID),
      'process.env.GOOGLE_ANALYTICS_CONVERSION_LABEL': JSON.stringify(GOOGLE_ANALYTICS_CONVERSION_LABEL),
      'process.env.VERSION': JSON.stringify(VERSION),
      'process.env.INTERCOM_APP_ID': JSON.stringify(INTERCOM_APP_ID),
      'process.env.PREVIEW_FEATURES': JSON.stringify(PREVIEW_FEATURES),
      'process.env.WWW_URL': JSON.stringify(WWW_URL),
      'process.env.COMMUNITY_URL': JSON.stringify(COMMUNITY_URL),
      'process.env.DOMAIN': JSON.stringify(DOMAIN),
      'process.env.SUPPORT_EMAIL': JSON.stringify(SUPPORT_EMAIL),
      'process.env.DEFAULT_LANGUAGE': JSON.stringify(DEFAULT_LANGUAGE),
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      title: 'App Camps - Programmieren im Unterricht',
      filename: '../../app/views/teach/index.erb',
      alwaysWriteToDisk: true,
    }),
    new FaviconsWebpackPlugin({
      logo: './favicon.png',
      title: 'App Camps - Programmieren im Unterricht',
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
      },
    }),
  ],
};

module.exports.config = config;
