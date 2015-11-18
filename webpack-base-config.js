var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: __dirname,
    entry: {
        config: './example/config/config.js',
        cluster: './example/cluster/cluster.js',
        'cluster-functional': './example/cluster-functional/cluster-functional.js',
        list: './example/list/list.js',
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/build',
        filename: '[name]/[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    stage: 2,
                },
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass',
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ],
};
