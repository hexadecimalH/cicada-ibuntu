var path = require('path');
var webpack = require('webpack');
var glob = require("glob");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
    entry: {
        'login': './/resources/vue/Login/component.js',
    },
    output: { path: __dirname + '/front-end/js/vue-components', filename: '[name].chunk.js' },
    module: {
        loaders: [
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        new CommonsChunkPlugin("commons.chunk.js")
    ]
};