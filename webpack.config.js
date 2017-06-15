var path = require('path');
var webpack = require('webpack');
var glob = require("glob");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");


module.exports = {
    entry: {
        'login': './/resources/vue/Login/component.js',
        'registration': './/resources/vue/Registration/professor.js',
        'student-registration': './/resources/vue/Registration/studentDashboard.js',
        'dashboard': './/resources/vue/Dashboard/professor.js',
        'course': './/resources/vue/Dashboard/course.js',
        'student-course': './/resources/vue/Dashboard/studentCourse.js',
        'student-dashboard': './/resources/vue/Dashboard/studentDashboard.js',
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