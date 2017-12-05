const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
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
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new UglifyJSPlugin({
            uglifyOptions: {
                ie8: false,
                ecma: 6,
            }
        }),
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
