var webpack = require("webpack");

const vendors = [
    'react',
    'react-dom',
    'reflux',
    'react-router',
    'react-modal-bootstrap',
    'classnames',
    'react-table'
];

module.exports = {
    resolve: {
		extensions: ['', '.js', '.jsx']
	},
    output: {
        path: __dirname + '/dist/js',
        filename: 'app.[name].js',
        library: '[name]_[hash]'
    },
    entry: {
        vendor: vendors
    },
    plugins: [
        // 定义全局常量
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        // 生成一份 vendor-manifest.json文件
        new webpack.DllPlugin({
            path: __dirname + "/[name]-manifest.json",
            name: '[name]_[hash]'
        })
    ]
};
