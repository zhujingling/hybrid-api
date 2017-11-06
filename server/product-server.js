const historyApiFallback = require("connect-history-api-fallback");
const favicon = require('express-favicon');
const path = require('path');
const express = require('express');
const app = express();

const globalConfig = require('../global.config');

const appPort = '8710';
const appBasePath = path.resolve(__dirname, '../dist/');


app.use(historyApiFallback({}));


app.use(express.static(appBasePath));
app.use(favicon('/favicon.ico'));

app.listen(appPort, globalConfig.ip, error => {
    if (error) {
        console.log(error);
        return;
    }
    console.log('打开地址：', 'http://' + globalConfig.ip + ':' + appPort);
});