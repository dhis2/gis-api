var webpack = require('webpack');
var webpackBaseConfig = require('./webpack-base-config');

webpackBaseConfig.entry = './src/index.js';
webpackBaseConfig.output.libraryTarget = 'commonjs2';

webpackBaseConfig.plugins = [
    // Replace any occurance of process.env.NODE_ENV with the string 'production'

    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '\'production\'',
        },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false // Includes many warnings from 3rd party libraries
        },
        mangle: false, // https://github.com/dhis2/gis-api/issues/3
        sourceMap: true,
    }),
];

module.exports = webpackBaseConfig;