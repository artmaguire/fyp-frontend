const { merge } = require('webpack-merge');
const dev = require('./webpack.dev.js');

module.exports = merge(dev, {
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
