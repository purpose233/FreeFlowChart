var webpack = require('webpack')
var path = require('path')

var libraryName = 'FreeFlowChart'
var env = process.env.WEBPACK_ENV;
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
var entryFileName = '/index.js'
var fileName = libraryName + '.js'

var plugins = [];

if (env !== 'dev') {
  fileName = libraryName + '.min.js'
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    })
  );
}

module.exports = {
  entry:  APP_PATH + entryFileName,
  output: {
    path: BUILD_PATH,
    filename: fileName
  },

  devtool: 'source-map',

  devServer:{
    publicPath: "/dist/"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: APP_PATH,
        options: {
          presets: ['es2015']
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
        include: APP_PATH
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: '40000'
            }
          }
        ]
      }
    ]
  },

  plugins: plugins
}
