const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const glob = require('glob');
const zlib = require('zlib');

const PATHS = {
  src: __dirname + '/src',
  node_modules: __dirname + '/node_modules'
}

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      })
    ],
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true,
    usedExports: true
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.(js|css|html|svg|png|gif)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      filename: "[path][base].br",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg|png|gif)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${ PATHS.src }/**/*`, { nodir: true }),
      safelist: {
        standard: [/leaflet/, /marker/]
      }
    })
  ]
});
