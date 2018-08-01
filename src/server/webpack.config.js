var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: './server.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'personal_logger_driver.js'
    },
    mode: "production",
    target: "node",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', "stage-0"]
                },
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
