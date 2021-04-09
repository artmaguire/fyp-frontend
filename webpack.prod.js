const glob = require('glob')
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

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
    ],
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true,
    usedExports: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionWebpackPlugin(),
    new PurgeCSSPlugin({
      paths: glob.sync(`${ PATHS.src }/**/*`, { nodir: true }),
      safelist: {
        standard: [/leaflet/, /marker/]
      }
    })
  ]
});
