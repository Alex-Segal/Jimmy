const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        server: './src/server/main.js',
    },
    externals: [nodeExternals()],
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'njs'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: [ '.js', '.json' ]
    },
    plugins: [
    /*    new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
      }),*/
    ],
    module: {
        loaders: [

        ]
    }
};
