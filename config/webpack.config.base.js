const path = require("path");
const execSync = require("child_process").execSync;

const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const baseDir = process.cwd();

require("dotenv").config({ silent: true });

const NODE_ENV = process.env.NODE_ENV || "development";
const TRACKJS_APPLICATION = process.env.TRACKJS_APPLICATION || NODE_ENV;
const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID;
const GOOGLE_ANALYTICS_CONVERSION_ID =
  process.env.GOOGLE_ANALYTICS_CONVERSION_ID;
const GOOGLE_ANALYTICS_CONVERSION_LABEL =
  process.env.GOOGLE_ANALYTICS_CONVERSION_LABEL;
const VERSION =
  process.env.SOURCE_VERSION ||
  execSync("git log -n 1 --abbrev=15 --format=%h").toString().trim();
const PREVIEW_FEATURES = process.env.PREVIEW_FEATURES || NODE_ENV === "test";
const DEFAULT_LANGUAGE = process.env.DEFAULT_LANGUAGE || "de";
const INTERCOM_APP_ID = process.env.INTERCOM_APP_ID;
const DOMAIN = process.env.DOMAIN || "appcamps.de";
const WWW_URL = process.env.WWW_URL;
const COMMUNITY_URL = process.env.COMMUNITY_URL;
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;

const config = {
  mode: "none",
  context: path.join(baseDir, "./frontend"),
  entry: {
    vendor: [
      "babel-polyfill",
      "react",
      "react-dom",
      "react-redux",
      "react-router",
      "react-router-redux",
      "redux",
      "redux-orm",
    ],
    main: ["./index.jsx"],
  },
  output: {
    path: path.join(baseDir, "./public/frontend"),
    filename: "bundle-[name]-[contenthash].js",
    chunkFilename: "[name]-[contenthash].chunk.js",
    publicPath: "/frontend/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: /frontend/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: { loader: "url-loader" },
        include: /frontend/,
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              encoding: "base64",
            },
          },
        ],
        include: /frontend/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
      "process.env.TRACKJS_APPLICATION": JSON.stringify(TRACKJS_APPLICATION),
      "process.env.GOOGLE_ANALYTICS_ID": JSON.stringify(GOOGLE_ANALYTICS_ID),
      "process.env.GOOGLE_ANALYTICS_CONVERSION_ID": JSON.stringify(
        GOOGLE_ANALYTICS_CONVERSION_ID
      ),
      "process.env.GOOGLE_ANALYTICS_CONVERSION_LABEL": JSON.stringify(
        GOOGLE_ANALYTICS_CONVERSION_LABEL
      ),
      "process.env.VERSION": JSON.stringify(VERSION),
      "process.env.INTERCOM_APP_ID": JSON.stringify(INTERCOM_APP_ID),
      "process.env.PREVIEW_FEATURES": JSON.stringify(PREVIEW_FEATURES),
      "process.env.WWW_URL": JSON.stringify(WWW_URL),
      "process.env.COMMUNITY_URL": JSON.stringify(COMMUNITY_URL),
      "process.env.DOMAIN": JSON.stringify(DOMAIN),
      "process.env.SUPPORT_EMAIL": JSON.stringify(SUPPORT_EMAIL),
      "process.env.DEFAULT_LANGUAGE": JSON.stringify(DEFAULT_LANGUAGE),
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      title: "App Camps - Programmieren im Unterricht",
      filename: "../../app/views/teach/index.html",
      alwaysWriteToDisk: true,
    }),
    new FaviconsWebpackPlugin({
      logo: "./favicon.png",
      title: "App Camps - Programmieren im Unterricht",
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
      },
    }),
  ],
};

module.exports.config = config;
