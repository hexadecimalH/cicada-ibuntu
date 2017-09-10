var path = require('path');
var webpack = require('webpack');
var glob = require("glob");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");


module.exports = {
    entry: {
        'login': './/resources/vue/Login/component.js',
        'professor-registration': './/resources/vue/Registration/professor.js',
        'professor-dashboard': './/resources/vue/Dashboard/professor.js',
        'professor-course': './/resources/vue/Course/professor.js',
        'student-registration': './/resources/vue/Registration/student.js',
        'student-course': './/resources/vue/Course/student.js',
        'student-dashboard': './/resources/vue/Dashboard/student.js',
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
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    plugins: [
        new CommonsChunkPlugin("commons")
    ]
};