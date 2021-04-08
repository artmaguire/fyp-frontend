const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require("vue-loader");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  /** @namespace env.PROXY **/
    entry: './src/main.js',
    mode: 'development',
    target: 'web',
    devtool: 'inline-source-map',
    output: {
      path: __dirname + '/public',
      publicPath: '/',
      filename: 'bundle.js'
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
        },
        {
          test: /\.vue$/,
          loader: "vue-loader"
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]",
          },
        },
        {
          test: /\.(png|jpe?g|gif|webm|mp4|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                esModule: false,
                name: 'images/[name].[ext]'
              }
            }
          ]
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: 'body',
        favicon: "./src/assets/favicon_io/favicon.ico"
      }),
      new MiniCssExtractPlugin(),
      new VueLoaderPlugin(),
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          { from: "src/assets/markers", to: "images/markers" },
          { from: "src/assets/gifs", to: "images/gifs" },
        ]
      })
    ],
    resolve: {
      alias: {
        vue$: "vue/dist/vue.runtime.esm.js"
      },
      extensions: ["*", ".js", ".vue", ".json"]
    }
};