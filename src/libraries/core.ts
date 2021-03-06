import { Bridge } from './help';
import './polyfills';

const setupWebViewJavascriptBridge = new Promise<Bridge>(resolve => {

    const callback = function () {
        resolve(window['WebViewJavascriptBridge']);
    };

    if (window['WebViewJavascriptBridge']) {
        return resolve(window['WebViewJavascriptBridge']);
    }
    document.addEventListener('WebViewJavascriptBridgeReady', callback, false);

    if (window['WVJBCallbacks']) {
        return window['WVJBCallbacks'].push(callback);
    }
    window['WVJBCallbacks'] = [callback];
    const WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(() => {
        document.documentElement.removeChild(WVJBIframe);
    });
});

export class APIRegister {
    private bridge: Bridge;
    private bridgeWrapper = setupWebViewJavascriptBridge.then((bridge: Bridge) => {
        this.bridge = bridge;
    });

    private rawValueCallback: (data: any) => any;

    constructor(rawValueCallback?: (data: any) => any) {
        this.rawValueCallback = rawValueCallback;
    }

    registerHandler(methodName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const fn = function (data: any, responseCallback: () => void) {
                try {
                    const response = JSON.parse(data);
                    if (this.rawValueCallback) {
                        this.rawValueCallback(response);
                    }
                    if (response.errorCode === '0') {
                        resolve(response.result);
                    } else {
                        reject(response.result);
                    }
                } catch (e) {
                    reject(e);
                }
                responseCallback();
            }.bind(this);
            if (!this.bridge) {
                this.bridgeWrapper.then(() => {
                    this.bridge.registerHandler(methodName, fn);
                });
                return;
            }
            this.bridge.registerHandler(methodName, fn);
        });
    }

    callHandler(methodName: string, params?: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const fn = function (responseData: any) {
                try {
                    const response = JSON.parse(responseData);
                    if (this.rawValueCallback) {
                        this.rawValueCallback(response);
                    }
                    if (response.errorCode === '0') {
                        resolve(response.result);
                    } else {
                        reject(response.result);
                    }
                } catch (e) {
                    reject(e);
                }
            }.bind(this);
            if (!this.bridge) {
                this.bridgeWrapper.then(() => {
                    this.bridge.callHandler('dd.native.call', {
                        handlerName: methodName,
                        params: params || {}
                    }, fn);
                });
                return;
            }
            this.bridge.callHandler('dd.native.call', {
                handlerName: methodName,
                params
            }, fn);
        });
    }
}