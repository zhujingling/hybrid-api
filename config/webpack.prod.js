const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const path = require('path');
const globalConfig = require('../global.config');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

const config = webpackMerge(commonConfig, {
    devtool: 'source-map',
    output: {
        path: globalConfig.buildPath,
        filename: 'hybrid-api.js',
        libraryTarget: 'umd',
        library: 'YBB',
        umdNamedDefine: true
    }
});
config.entry = {
    app: path.resolve(globalConfig.appPath, 'libraries/index.ts')
};

config.plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            'ENV': JSON.stringify(ENV)
        }
    })
];

module.exports = config;
