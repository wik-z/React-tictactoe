const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const HtmlWebPackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: path.join(__dirname, 'src/js/app.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'app.css',
        }),
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
        }),
        new OptimizeCSSAssetsPlugin({}),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: '../index.html'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?url=false',
                    'less-loader',
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};