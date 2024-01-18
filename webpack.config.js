const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = MiniCssExtractPlugin.loader;



const config = {
    entry: {
        index: './src/assets/js/index.js',
        results: './src/assets/js/results.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        open: {
            app: {
                name: 'firefox',
            }
        },
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['index']
        }),

        new HtmlWebpackPlugin({
            template: './src/results/index.html',
            filename: 'results.html',
            chunks: ['results'],
        }),

        new MiniCssExtractPlugin(),
        new LodashModuleReplacementPlugin()

    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';


    } else {
        config.mode = 'development';
    }
    return config;
};
