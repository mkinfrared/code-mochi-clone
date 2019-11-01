require("dotenv").config();
const withCSS = require("@zeit/next-css");
const withSass = require("@zeit/next-sass");
const webpack = require("webpack");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = withSass({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[name]__[local]--[hash:base64:5]"
  },
  sassLoaderOptions: {
    includePaths: ["components/**", "pages/**"]
  },
  webpack(config) {
    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsConfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsConfigPathsPlugin()];
    }

    return config;
  },
  env: {
    /*
      You need to define environment variables in .env file,
      and in order to make them work in your code you have to
      define them here as well like this (next.js's convenience :) )
    */
    TMDB_MOVIE_KEY: process.env.TMDB_MOVIE_KEY,
    TMDB_IMAGE_URL: process.env.TMDB_IMAGE_URL
  }
});
