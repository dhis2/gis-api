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
        filename: 'index.js',
        libraryTarget: 'var',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/, /temp/],
                loader: 'babel-loader',
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
                loader: 'style-loader!css-loader!sass-loader',
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader: 'url-loader',
            },
            {   // https://github.com/webpack-contrib/expose-loader
                test: require.resolve('leaflet'),
                loader: 'expose-loader?L',
            },
            {  
                test: require.resolve('@google/earthengine'),
                loader: 'imports-loader?this=>window',
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
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
            'L': 'leaflet',
        }),
    ],
};
