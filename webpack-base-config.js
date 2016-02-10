var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: __dirname,
    //entry: './src/index.js',
    entry: {
        entry: './src/index.js',
        //layers: './example/layers/layers.js',
        //choropleth: './example/choropleth/choropleth.js',
        cluster: './example/cluster/cluster.js',
        earthengine: './example/earthengine/earthengine.js',
        //list: './example/list/list.js',
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/lib',
        filename: '[name]/index.js',
        libraryTarget: 'var',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/, /temp/],
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-2'],
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
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ],
};
