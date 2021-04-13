const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(css)$/,
        use: ['vue-style-loader', 'css-loader']
      }]
  },
  devServer: {
    open: true,
    hot: true,
    host: "0.0.0.0",
    port: 8081,
    disableHostCheck: true,
    useLocalIp: true,
    proxy: {
      '/route': 'http://localhost:5000',
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true
      }
    }
  }
});
