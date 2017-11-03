const ip = require('ip');
const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');
const localIp = ip.address();
const port = '4321';
const buildPath = path.resolve(__dirname, isProduction ? 'bundles' : 'dist');
const appPath = path.resolve(__dirname, 'src');
const localPath = 'http://' + localIp + ':' + port + '/';

module.exports = {
    ip: localIp,
    port,
    localPath,
    buildPath,
    staticPublicPath: 'static/',
    onlinePublishPathPrefix: '/',
    appPath
};
