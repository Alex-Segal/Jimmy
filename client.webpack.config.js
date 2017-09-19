const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        client: './src/client/main.js',
    },
    output: {
        path: path.resolve(__dirname, 'html/njs'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: [ '.js', '.json', '.jsx' ]
    },
    plugins: [
    /*    new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
      }),*/
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader']
            },
            {
                test: /\.jsx$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react']
                        }
                    }
                ],
                exclude: /node_modules/,
            }
        ]
    }
};
