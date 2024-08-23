const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DotenvWebpackPlugin = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let environments = {
    dev : {
        sourceMaps:true,
        mode: 'development',
    }
}

let bundles = [
    {
        name: 'top',
        path: './src/top.index.ts',
        hash: null,
    },
    {
        name: 'background',
        path: './src/service-workers/background.ts',
        hash: null,
    },
    {
        name: 'settings-content-script',
        path: './src/content-scripts/settings-content.script.ts',
        hash: null
    },
    {
        name: 'history-content-script',
        path: './src/content-scripts/history-content-script.ts',
        hash: null
    },
    {
        name: 'base-content-script',
        path: './src/content-scripts/base-content-script.ts',
        hash: null
    },
    {
        name: 'trainings',
        path:"./src/pages/trainings.index.ts",
    }

];

const DEFAULT_ENVIRONMENT = "dev";

module.exports = commandArgs => {
    let environment = environments[commandArgs?.mode || DEFAULT_ENVIRONMENT];

    let webpackConfig = {
        devtool: environment.sourceMaps ? "inline-source-map" : false,
        mode: environment.mode,
        entry: bundles.reduce((entry, bundle) => {
            entry[bundle.name] = bundle.path;
            return entry;
        }, {}),
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, './dist'),
            chunkFilename: '[name].js',
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-inline-loader'
                },
                {
                    test: /\.css$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                // esModule: true,
                                // modules: {
                                //     namedExport: true,
                                // },
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                esModule: true,
                                modules: { 
                                    namedExport: true,
                                    localIdentName: '[local]__[name]__word-wander',
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|webp)$/i,
                    use: [
                      {
                        loader: 'file-loader',
                      },
                    ],
                },
            ]
        },
        plugins: [
            new DotenvWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: 'WordWander | Trainings',
                filename: 'trainings.html',
                chunks: ['trainings'],
                publicPath: "",
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: './assets/',
                        to: './assets/'
                    },
                    {
                        from: './manifest.json',
                        to: './manifest.json'
                    },
                    {
                        from: './loader.js',
                        to: './loader.js'
                    }
               
                ]
            }),
            new MiniCssExtractPlugin()
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },
    }

    return webpackConfig;
}