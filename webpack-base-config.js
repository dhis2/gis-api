var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: __dirname,
    entry: {
        entry: './src/index.js',
        layers: './example/layers/index.js',
        choropleth: './example/choropleth/index.js',
        cluster: './example/cluster/index.js',
        earthengine: './example/earthengine/index.js',
        list: './example/list/index.js',
        geoserver: './example/geoserver/index.js',
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/build',
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
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
                ]
            },
            /*
            {   // https://github.com/ljagis/leaflet-measure/issues/30
                test: /leaflet-measure.+\.js$/,
                loader: 'transform/cacheable?brfs',
            },
            */
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
    ],
    /*
    node: {
        fs: 'empty',
    },
    */
};
