const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        server: './src/server/main.js',
    },
    externals: [nodeExternals()],
    target: 'node',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'njs'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.js', '.json']
    },
};
