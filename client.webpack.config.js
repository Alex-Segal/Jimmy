const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        client: './src/client/main.js',
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'html/njs'),
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
