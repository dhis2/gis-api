var path = require('path');
var webpack = require('webpack');

// console.log(path.resolve('src/'));
module.exports = function karmaConfigHandler(config) {
    config.set({
        browsers: [ 'PhantomJS' ], // run in Headless browser PhantomJS
        singleRun: false,
        frameworks: [
            'mocha', // Test runner
            'chai',  // Assertion library
            'sinon', // Mocking library
            'sinon-chai', // Assertions for mocks and spies
        ],
        files: [
            '../node_modules/phantomjs-polyfill/bind-polyfill.js',
            '../node_modules/babel-polyfill/dist/polyfill.js',
            'tests.webpack.js',
        ],
        preprocessors: {
            'tests.webpack.js': [ 'webpack', 'sourcemap' ], // preprocess with webpack and our sourcemap loader
        },
        reporters: [ 'dots', 'coverage' ], // report results in this format
        coverageReporter: {
            type: 'lcov',
            dir: '../coverage',
            subdir: function simplifyBrowsername(browser) {
                // normalization process to keep a consistent browser name accross different OS
                return browser.toLowerCase().split(/[ /-]/)[0];
            },
        },
        webpack: { // kind of a copy of your webpack config
            devtool: 'inline-source-map', // just do inline source maps instead of the default
            module: {
                loaders: [
                    // transpile layers files except testing sources with babel as usual
                    {
                        test: /\.js$/,
                        include: [
                            path.resolve('test')
                        ],
                        loader: 'babel-loader',
                        query: {
                            cacheDirectory: true,
                            presets: ['es2015', 'stage-2'],
                        },
                    },
                    {
                        test: /\.js$/,
                        include: path.resolve('src'),
                        loader: 'babel-loader',
                        query: {
                            cacheDirectory: true,
                            presets: ['es2015', 'stage-2'],
                        },
                    },
                ],
            },
        },

        webpackServer: {
            noInfo: false, // please don't spam the console when running in karma!
        },
    });
};
