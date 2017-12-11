const webpack = require('webpack');
const path = require('path');
const version = require('../package.json').version;
const globalConfig = require('../global.config');

const ENV = process.env.NODE_ENV = process.env.ENV = 'lib';

module.exports = {
    devtool: 'source-map',
    entry: {
        app: path.resolve(globalConfig.appPath, 'libraries/index.ts'),
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        path: globalConfig.buildPath,
        filename: 'hybrid-api-' + version + '.js',
        libraryTarget: 'umd',
        library: 'YBB',
        umdNamedDefine: true
    },
    module: {
        rules: [{
            test: /\.ts$/,
            enforce: 'pre',
            use: [{
                loader: 'tslint-loader',
                options: {
                    configuration: require('../tslint.json'),
                    emitErrors: false,
                    failOnHint: false,
                    formatter: 'tslint-formatter-eslint-style'
                }
            }]
        }, {
            test: /\.ts$/,
            use: ['awesome-typescript-loader']
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV),
                'version': JSON.stringify(version)
            }
        })
    ]
};
