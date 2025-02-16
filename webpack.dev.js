const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
    },
})