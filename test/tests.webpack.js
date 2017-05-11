// https://github.com/babel/babelify/issues/22
// require('babel-polyfill');

const context = require.context('./', true, /\.test\.js$/);
context.keys().forEach(context);
