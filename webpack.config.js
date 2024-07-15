const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');


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
            ]
        },
        plugins: [
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
            })
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },
    }

    return webpackConfig;
}