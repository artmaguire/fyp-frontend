const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const { dummy_route, dummy_search, dummy_reverse } = require("./dummy");

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    hot: true,
    port: 8081,
    before: (app) => {
      // Workaround to not being able to start a socketio session on webpack-dev-server
      const io = require('socket.io')(app.listen(8082));

      io.on('connection', function (socket) {
        socket.on('geoname_search', data => {
          socket.emit('geoname_result', { node: data.node, geonames: dummy_search })
        });

        socket.on('reverse_geoname_search', data => {
          socket.emit('reverse_geoname_result', { action: data.action, geoname: dummy_reverse[data.action - 1] })
        });
      });

      app.get('/route', (req, res) => {
        res.json(dummy_route);
      });
    },
    proxy: {
      '/socket.io': {
        target: 'http://localhost:8082',
        ws: true
      }
    }
  }
});
