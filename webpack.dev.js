const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack'); // <-- Added
require('dotenv').config();         // <-- Added

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    plugins: [ // <-- New plugins array
        new webpack.DefinePlugin({
            "process.env.API_KEY": JSON.stringify(process.env.API_KEY),
        }),
    ],
});
