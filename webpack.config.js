const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: {
        index: './src/index.js',
        graphy: './src/functions_relationship.js'
    },
    output: {
        filename: 'bundle.js',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname,'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'To Do List',
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body',

        }),
    ],
    devServer: {
        watchFiles: ['src/**/*.php', 'public/**/*'],
        // static: './dist'

    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader','css-loader'], //'style-loader' comes first and followed by 'css-loader'. If this convention is not followed, webpack is likely to throw errors.
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'acorn-loader',
                        options: {
                            ecmaVersion: 2020, // Specify the ECMAScript version
                            sourceType: 'module', // Specify the source type (e.g., 'module' or 'script')
                        },
                    },
                ],
            },
        ],
    },
}