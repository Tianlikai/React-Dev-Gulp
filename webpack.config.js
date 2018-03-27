const webpack = require("webpack");
const manifest = require('./vendor-manifest.json');

module.exports = {
    cache: false,
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        publicPath: '/dist/', // 这是静态资源引用路径,url 相对于 HTML 页面
        filename: 'app.js',
        chunkFilename: '[name].[chunkhash:5].chunk.js', // 按需加载，分隔js文件
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/, // exclude 是必不匹配选项（优先于 test 和 include）
            loader: 'babel-loader',
        }]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: manifest,
        })
    ]
};
