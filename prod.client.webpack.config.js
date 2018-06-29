const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        client: './src/client/main.js',
    },
    output: {
        path: path.resolve(__dirname, 'html'),
        filename: 'njs/[name].bundle.js',
    },
    resolve: {
        extensions: [ '.js', '.json', '.jsx' ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Voyager',
            template: 'src/template.html',
            hash: true,
        }),
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
