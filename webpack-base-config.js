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
        path: __dirname + '/lib',
        filename: '[name]/index.js',
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
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                    {
                        loader: 'image-webpack-loader',
                        query: {
                            mozjpeg: {
                                progressive: true,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            optipng: {
                                optimizationLevel: 4,
                            },
                            pngquant: {
                                quality: '75-90',
                                speed: 3,
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
    ],
};
