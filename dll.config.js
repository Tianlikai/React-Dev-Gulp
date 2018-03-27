let webpack = require("webpack");

const vendors = [
    'react',
    'react-dom',
    'reflux',
    'react-router',
    'rc-tooltip',
    'react-modal-bootstrap',
    'classnames',
    'echarts',
    'fecha',
    'object.omit',
    'react-table',
    'prop-types'
];

module.exports = {
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/public/dist',
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
