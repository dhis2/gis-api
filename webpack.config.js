var webpack = require('webpack');
var webpackBaseConfig = require('./webpack-base-config');

webpackBaseConfig.devServer = {
    contentBase: './example/',
    progress: true,
    colors: true,
    port: 8081,
    inline: true,
    devtool: 'source-map',
};

module.exports = webpackBaseConfig;
