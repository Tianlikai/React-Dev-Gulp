/*
 * @Author: jason.tian 
 * @Date: 2017-09-17 20:52:37 
 * @Last Modified by: jason.tian
 * @Last Modified time: 2017-09-17 21:26:57
 */

var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    index: "./src/app.js",
    common: ['react','react-dom','react-router'],
  },
  output: {
    path: path.join(__dirname, '/dist/js'),
    filename: '[name].js',
    // chunkFilename: '[name].[chunkhash:5].chunk.js', // 按需加载，分隔js文件
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        // loader: 'babel?presets[]=es2015&presets[]=react&presets[]=stage-3',
        loader:'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    //提取公共文件
    new webpack.optimize.CommonsChunkPlugin('common',  'common.js'),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify("production") }
    }),
    // 如需压缩js文件，将以下注释去掉
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}