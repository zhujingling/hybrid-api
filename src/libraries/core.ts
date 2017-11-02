import { Bridge } from './help';

const setupWebViewJavascriptBridge = new Promise<Bridge>(resolve => {

    const callback = function () {
        resolve(window['WebViewJavascriptBridge']);
    };

    if (window['WebViewJavascriptBridge']) {
        resolve(window['WebViewJavascriptBridge']);
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', callback, false);
    }

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

    registerHandler(methodName: string, fn: (data: any, responseCallback: () => any) => any): Promise<any> {
        return new Promise<any>(resolve => {
            if (!this.bridge) {
                this.bridgeWrapper.then(() => {
                    this.bridge.registerHandler(methodName, (data, responseCallback) => {
                        resolve(data);
                        responseCallback();
                    });
                });
                return;
            }
            this.bridge.registerHandler(methodName, (data, responseCallback) => {
                resolve(data);
                responseCallback();
            });
        });
    }

    callHandler(methodName: string, params?: any): Promise<any> {
        return new Promise<any>(resolve => {
            if (!this.bridge) {
                this.bridgeWrapper.then(() => {
                    this.bridge.callHandler('dd.native.call', {
                        handlerName: methodName,
                        params: params || {}
                    }, responseData => {
                        resolve(responseData);
                    });
                });
                return;
            }
            this.bridge.callHandler('dd.native.call', {
                handlerName: methodName,
                params
            }, responseData => {
                resolve(responseData);
            });
        });
    }
}

export const register = new APIRegister();