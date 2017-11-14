export function androidContextInit() {

    let u = navigator.userAgent;
    // let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isIOS) {
        return;
    }
    if (window.WebViewJavascriptBridge) {
        return;
    }
    let messagingIframe;
    let sendMessageQueue = [];
    let receiveMessageQueue = [];
    let messageHandlers = {};
    let CUSTOM_PROTOCOL_SCHEME = 'yy';
    let QUEUE_HAS_MESSAGE = '__QUEUE_MESSAGE__/';
    let responseCallbacks = {};
    let uniqueId = 1;

    function _createQueueReadyIframe(doc) {
        messagingIframe = doc.createElement('iframe');
        messagingIframe.style.display = 'none';
        doc.documentElement.appendChild(messagingIframe);
    }

    function init(messageHandler) {
        if (WebViewJavascriptBridge._messageHandler) {
            throw new Error('WebViewJavascriptBridge.init called twice');
        }
        WebViewJavascriptBridge._messageHandler = messageHandler;
        let receivedMessages = receiveMessageQueue;
        receiveMessageQueue = null;
        for (let i = 0; i < receivedMessages.length; i++) {
            _dispatchMessageFromNative(receivedMessages[i]);
        }
    }

    function send(data, responseCallback) {
        _doSend({
                data: data
            },
            responseCallback);
    }

    function registerHandler(handlerName, handler) {
        messageHandlers[handlerName] = handler;
    }

    function callHandler(handlerName, data, responseCallback) {
        _doSend({
                handlerName: handlerName,
                data: data
            },
            responseCallback);
    }

    function _doSend(message, responseCallback) {
        if (responseCallback) {
            let callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime();
            responseCallbacks[callbackId] = responseCallback;
            message.callbackId = callbackId;
        }
        sendMessageQueue.push(message);
        messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
    }

    function _fetchQueue() {
        let messageQueueString = JSON.stringify(sendMessageQueue);
        sendMessageQueue = [];
        messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://return/_fetchQueue/' + encodeURIComponent(messageQueueString);
    }

    function _dispatchMessageFromNative(messageJSON) {
        setTimeout(function () {
            let message = JSON.parse(messageJSON);
            let responseCallback;
            if (message.responseId) {
                responseCallback = responseCallbacks[message.responseId];
                if (!responseCallback) {
                    return;
                }
                responseCallback(message.responseData);
            } else {
                if (message.callbackId) {
                    let callbackResponseId = message.callbackId;
                    responseCallback = function (responseData) {
                        _doSend({
                            responseId: callbackResponseId,
                            responseData: responseData
                        });
                    };
                }
                let handler = WebViewJavascriptBridge._messageHandler;
                if (message.handlerName) {
                    handler = messageHandlers[message.handlerName];
                }
                try {
                    handler(message.data, responseCallback);
                } catch (exception) {
                    if (typeof console != 'undefined') {
                        console.log('WebViewJavascriptBridge: WARNING: javascript handler threw.', message, exception);
                    }
                }
            }
        });
    }

    function _handleMessageFromNative(messageJSON) {
        console.log(messageJSON);
        if (receiveMessageQueue && receiveMessageQueue.length > 0) {
            receiveMessageQueue.push(messageJSON);
        } else {
            _dispatchMessageFromNative(messageJSON);
        }
    }

    let WebViewJavascriptBridge = window.WebViewJavascriptBridge = {
        init: init,
        send: send,
        registerHandler: registerHandler,
        callHandler: callHandler,
        _fetchQueue: _fetchQueue,
        _handleMessageFromNative: _handleMessageFromNative
    };
    let doc = document;
    _createQueueReadyIframe(doc);
    let readyEvent = doc.createEvent('Events');
    readyEvent.initEvent('WebViewJavascriptBridgeReady');
    readyEvent.bridge = WebViewJavascriptBridge;
    doc.dispatchEvent(readyEvent);
}