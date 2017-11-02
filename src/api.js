/**
 * Created by Haiyun.Qian(DtDream) on 2017/3/7.
 */
window.dd = {};
!function (This) {
    //"use strict";
    function mergeData(data, newData, replace) {
        for (var key in newData) replace ? data[key] = newData[key] : data[key] = (void 0 !== data[key] ? data[key] : newData[key])
    }

    function callHandlerEx(handlerName, data) {
        if ("undefined" == typeof window.WebViewJavascriptBridge) {
            //alert("WebViewJavascriptBridge 未定义")
            return console.log("WebViewJavascriptBridge 未定义");
        }
        var handleData = data || {},
            onSuccess = function (result) {
                console.log("默认成功回调", handlerName, result)
            },
            onFail = function (result) {
                console.log("默认失败回调", handlerName, result)
            },
            onCancel = function () {
            };
        handleData.onSuccess && (onSuccess = handleData.onSuccess, delete handleData.onSuccess),
        handleData.onFail && (onFail = handleData.onFail, delete handleData.onFail),
        handleData.onCancel && (onCancel = handleData.onCancel, delete handleData.onCancel);
        var responseCallback = function (responseData) {
                //alert(responseData)
                var response = JSON.parse(responseData || '')
                var errorCode = response.errorCode
                var result = response.result;
                //alert('response' + response + '   errorCode' + errorCode + '  result' + result);
                "0" === errorCode ? onSuccess && onSuccess.call(null, result) : "-1" === errorCode ? onCancel && onCancel.call(null, result) : onFail && onFail.call(null, result, errorCode)
            },
            registered = false;
        //alert(1)
        switch (handlerName) {
            case "device.notification.alert":
                mergeData(handleData, {
                    title: "",
                    buttonName: "确定"
                });
                break;
            case "device.notification.confirm":
            case "device.notification.prompt":
                mergeData(handleData, {
                    title: "",
                    buttonLabels: ["确定", "取消"]
                });
                break;
            case "device.notification.vibrate":
                mergeData(handleData, {
                    duration: 300
                });
                break;
            case "device.accelerometer.watchShake":
                bridgeModuleDict.ios && (registered = true, handleData.sensitivity = 3.2);
                break;
            case "biz.util.openLink":
                mergeData(handleData, {
                    credible: true,
                    showMenuBar: true
                });
                break;
            case "biz.contact.choose":
                mergeData(handleData, {
                    multiple: true,
                    startWithDepartmentId: 0,
                    users: [],
                    corpId: appConfig && appConfig.corpId || ""
                });
                break;
            case "biz.contact.complexChoose":
                mergeData(handleData, {
                    startWithDepartmentId: 0,
                    selectedUsers: [],
                    selectedDepartments: [],
                    corpId: appConfig && appConfig.corpId || ""
                });
                break;
            case "biz.navigation.setLeft":
            case "biz.navigation.setRight":
                bridgeModuleDict.ios && (registered = true),
                    mergeData(handleData, {
                        show: true,
                        control: false,
                        showIcon: true,
                        text: ""
                    });
                break;
            case "ui.pullToRefresh.enable":
                bridgeModuleDict.ios && (registered = true);
                break;
            case "device.notification.toast":
                mergeData(handleData, {
                    text: "toast",
                    duration: bridgeModuleDict.android ? (bridgeModuleDict.duration - 3 > 0) + 0 : 3,
                    delay: 0
                });
                break;
            case "device.notification.showPreloader":
                mergeData(handleData, {
                    text: "加载中...",
                    showIcon: true
                });
                break;
            case "biz.util.uploadImage":
                mergeData(handleData, {
                    multiple: false
                });
                break;
            case "biz.util.scan":
                //alert('biz.util.scan');
                mergeData(handleData, {
                    type: "qrCode"
                });
                break;
            case "biz.map.search":
                mergeData(handleData, {
                    scope: 500
                });
                break;
            case "biz.util.ut":
                var j, l = handleData.value;
                if (l && "Object" == bridgeModuleDict.type(l) && window.JSON) {
                    if (bridgeModuleDict.ios) l = JSON.stringify(l);
                    else if (bridgeModuleDict.android) {
                        for (var m in l) j.push(m + "=" + l[m]);
                        l = j.join(",")
                    }
                } else window.JSON || (l = "");
                mergeData(handleData, {
                        value: l
                    },
                    true);
                break;
            case "internal.util.encryData":
                var j, n = handleData.data;
                if ("Object" == bridgeModuleDict.type(n)) {
                    for (var m in n) j.push(m + "=" + n[m]);
                    n = j.json("&")
                }
                mergeData(handleData, {
                        data: n
                    },
                    true);
                break;
            case "biz.navigation.setIcon":
                bridgeModuleDict.ios && (registered = true),
                    mergeData(handleData, {
                        showIcon: true,
                        iconIndex: "1"
                    });
                break;
            case "dd.biz.util.encrypt":
                mergeData(handleData, {
                    corpId: 'test',
                    data: {
                        h: 'hello',
                        w: 'world'
                    }
                });
                break;
            case "dd.biz.util.decrypt":
                mergeData(handleData, {
                    orpId: 'test',
                    data: {
                        h: '1_1_29ae62f3a655aecd14b639a5aa50d3408e21c1ff668c71ea78f3d5cc340a9880',
                        w: '1_1_62983a28e92e59e2d889eb6bbba872cc141dd7b495e7a076847125fe70472e1e'
                    },
                });
                break;
            case "biz.customContact.multipleChoose":
            case "biz.customContact.choose":
                mergeData(handleData, {
                    isShowCompanyName: false
                })
        }
        //alert(2)
        var handleFullData = {
            handlerName: handlerName,
            params: handleData
        }
        //alert('handlerName='+handlerName);
        //alert('handleData='+handleData);
        if (bridgeModuleDict.android) {
            var handleNameSplit = handlerName.split("."),
                popName = handleNameSplit.pop(),
                funcName = handleNameSplit.join(".");
//            alert('popName='+popName);
//        		alert('funcName='+funcName);
            WebViewJavascriptBridgeAndroid(onSuccess, onFail, funcName, popName, handleFullData)
        } else if (bridgeModuleDict.ios) {
            if (registered) {
                WebViewJavascriptBridge.registerHandler(handlerName,
                    function (data, callback) {
                        //alert('handlerName callback' + data);
                        responseCallback(data),
                        callback && callback({
                            errorCode: "0",
                            errorMessage: "成功"
                        })
                    })
//                alert('AA');
                WebViewJavascriptBridge.callHandler("dd.native.call", handleFullData)
            } else {
                //alert('BB');
                //alert(handleFullData);
                WebViewJavascriptBridge.callHandler("dd.native.call", handleFullData, responseCallback)
            }
        }
    }

    var actionHandleArray = ["backbutton", "online", "offline", "pause", "resume", "swipeRefresh"]
    var handleNameArray = ["device.notification.alert",
        "device.notification.confirm",
        "device.notification.prompt",
        "device.notification.vibrate",
        "device.accelerometer.watchShake",
        "device.accelerometer.clearShake",
        "biz.util.open",
        "biz.util.openLink",
        "biz.util.share",
        "biz.util.ut",
        "biz.util.datepicker",
        "biz.util.timepicker",
        "biz.user.get",
        "biz.navigation.setLeft",
        "biz.navigation.setRight",
        "biz.navigation.setTitle",
        "biz.navigation.setSegmentedTitle",
        "biz.navigation.setMenu",
        "biz.navigation.back",
        "device.notification.toast",
        "device.notification.showPreloader",
        "device.notification.hidePreloader",
        "device.location.get",
        "device.location.baidu.get",
        "biz.util.uploadImage",
        "biz.util.previewImage",
        "ui.input.plain",
        "device.notification.actionSheet",
        "biz.util.qrcode",
        "device.connection.getNetworkType",
        "runtime.info",
        "biz.ding.post",
        "biz.telephone.call",
        "biz.chat.chooseConversation",
        "biz.contact.createGroup",
        "biz.util.datetimepicker",
        "biz.util.chosen",
        "device.base.getUUID",
        "device.base.getInterface",
        "device.launcher.checkInstalledApps",
        "device.launcher.launchApp",
        "ui.progressBar.setColors",
        "runtime.permission.requestAuthCode",
        "runtime.permission.requestJsApis",
        "ui.pullToRefresh.enable",
        "ui.pullToRefresh.stop",
        "ui.pullToRefresh.disable",
        "ui.webViewBounce.enable",
        "ui.webViewBounce.disable",
        "biz.chat.getConversationInfo",
        "biz.map.search",
        "biz.map.locate",
        "biz.util.scan",
        "biz.util.pay",
        "biz.contact.choose",
        "biz.contact.complexChoose",
        "util.localStorage.getItem",
        "util.localStorage.setItem",
        "util.localStorage.removeItem",
        "biz.navigation.createEditor",
        "biz.navigation.finishEditor",
        "biz.chat.pickConversation",
        "device.notification.modal",
        "biz.navigation.setIcon",
        "biz.navigation.close",
        "biz.util.uploadImageFromCamera",
        "internal.lwp.call",
        "device.geolocation.openGps",
        "biz.util.test",
        "internal.microapp.checkInstalled",
        "internal.user.getRole",
        "device.notification.extendModal",
        "internal.request.lwp",
        "biz.user.secretID",
        "internal.util.encryData",
        "biz.customContact.choose",
        "biz.customContact.multipleChoose",
        "biz.util.encrypt",
        "biz.util.decrypt",
        "device.audio.startRecord",
        "device.audio.stopRecord",
        "device.audio.onRecordEnd",
        "device.audio.play",
        "device.audio.pause",
        "device.audio.resume",
        "device.audio.stop",
        "device.audio.onPlayEnd",
        "device.audio.translateVoice",
        "device.audio.download",
        "biz.user.getUserInfo",
        "biz.util.selectLocalCity",
        "biz.util.selectCity",
        "device.notification.selectImg",
        "device.notification.toast",
        "device.notification.chooseImage",
        "biz.util.selectFiveRegionDivision",
        "biz.user.realAuthentication",
        "biz.zwfw.openPage",
        "biz.app.open",
        "biz.app.isSubscribe",
        "biz.app.addSubscribe",
        "biz.app.deleteSubscribe",
        "biz.util.search",
        "biz.map.zjnavi",
        "biz.navigation.setRightBtn",
        "biz.navigation.show",
        "biz.navigation.hide"
    ]
    var f = "0.5.0"
    var userAgent = This.navigator.userAgent;
    var userAgentMatch = userAgent.match(/AliApp\(\w+\/([a-zA-Z0-9.-]+)\)/);
    null === userAgentMatch && (userAgentMatch = userAgent.match(/DingTalk\/([a-zA-Z0-9.-]+)/));
    var appVersion = userAgentMatch && userAgentMatch[1],
        actionHandleRegister = false,
        appConfig = null,
        requestJsApisHandle = "runtime.permission.requestJsApis",
        errorCallback = null,
        n = false;

    var bridgeModuleDict = {
        isInit: false,
        ios: true,
        android: false,
        version: appVersion,
        support: "1.2.2" === appVersion || "1.3.2" === appVersion,
        ability: "",
        config: function (conf) {
            conf && (appConfig = {
                corpId: conf.corpId,
                appId: conf.appId || -1,
                timeStamp: conf.timeStamp,
                nonceStr: conf.nonceStr,
                signature: conf.signature,
                jsApiList: conf.jsApiList
            },
            conf.agentId && (appConfig.agentId = conf.agentId))
        },
        error: function (callback) {
            errorCallback = callback
        }, type: function (typeName) {
            return Object.prototype.toString.call(typeName).match(/^\[object\s(.*)\]$/)[1]
        },
        compareVersion: function (a, b, c) {
            if ("string" != typeof a || "string" != typeof b) return !1;
            for (var d, e, f = a.split("."), g = b.split("."); d === e && g.length > 0;) d = f.shift(),
                e = g.shift();
            return c ? (0 | e) >= (0 | d) : (0 | e) > (0 | d)
        }
    };

    var registerModule = function (functionName, callbackFunc) {
        for (var nameSplit = functionName.split("."), moduleDict = bridgeModuleDict, index = 0, splitLen = nameSplit.length; splitLen > index; index++) index === splitLen - 1 && (moduleDict[nameSplit[index]] = callbackFunc),
        "undefined" == typeof moduleDict[nameSplit[index]] && (moduleDict[nameSplit[index]] = {}),
            moduleDict = moduleDict[nameSplit[index]]
    };

    handleNameArray.forEach(function (handleName) {
        registerModule(handleName, function (params) {
            callHandlerEx(handleName, params)
        })
    }),
        bridgeModuleDict.__ns = registerModule,
        "object" == typeof module && module && "object" == typeof module.exports ? module.exports = bridgeModuleDict : "function" == typeof define && (define.amd || define.cmd) ? define("dd", [], function () {
            return bridgeModuleDict
        }) : This.dd = bridgeModuleDict
}(window)

function setupWebViewJavascriptBridge(callback) {
    //alert("init setupWebViewJavascriptBridge");
    if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    } else {
//  		alert('qqq');
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function () {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'ddjsscheme://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
    }, 0)
    //alert("inited setupWebViewJavascriptBridge");
}

if (typeof jQuery == 'undefined') {
    //alert("jquery init");
    var host = window.location.host;
    if (host == 'jhsbmxcx.yyhj.zjzwfw.gov.cn') {
        //alert('host:' + host);
    } else {
        document.write('<\script type="text/javascript" src="http://app.zjzwfw.gov.cn/client/jssdkcheck/js/jquery-1.8.3.min.js"><\/script>');
    }
}

// 初始化
if (!!dd && !dd.isInit) {
//alert("dd init");
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.init(function (message, responseCallback) {
            console.log('JS got a message', message);
            var data = {
                'Javascript Responds': '测试中文!'
            };
            console.log('JS responding with', data);
            responseCallback(data);
        });
//                });

        /*if (typeof jQuery === 'undefined') {
        var head = document.getElementsByTagName("head")[0];
        var _TagObjs;
        _TagObjs = document.createElement("script");
        _TagObjs.setAttribute('type', 'text/javascript');
        _TagObjs.setAttribute('src', 'http://app.zjzwfw.gov.cn/client/jssdkJS/js/jquery-1.8.3.min.js');
        head.appendChild(_TagObjs);
        _TagObjs.onload = function () {
        //alert('jquery2:' + typeof jQuery)
        }
        }*/
//dd.isInit = true;
    });
}

window.onerror = function (msg, url, l) {
//alert('window.onerror: ' + msg + '-' + url + '-' + l)
}

// ------ public ------

/**
 * @public
 * 对外调用的函数, 此处是为了兼容大汉Hybrid App
 * */
function networkType(options) {
    _executeFuction('networkType', options);
}

function getUserID(options) {
    _executeFuction('getUserID', options);
}

function getUserInfo(options) {
    _executeFuction('getUserInfo', options);
}

function registerUser(options) {
    _executeFuction('registerUser', options);
}

function modifyPassword(options) {
    _executeFuction('modifyPassword', options);
}

function loginApp(options) {
    _executeFuction('loginApp', options);
}

function logout(options) {
    _executeFuction('logout', options);
}

function loginQQ(options) {
    _executeFuction('loginQQ', options);
}

function logoutQQ(options) {
    _executeFuction('logoutQQ', options);
}

function loginTencentWeibo(options) {
    _executeFuction('loginTencentWeibo', options);
}

function logoutTencentWeibo() {
    _executeFuction('loginTencentWeibo', options);
}

function loginSinaWeibo(options) {
    _executeFuction('loginSinaWeibo', options);
}

function logoutSinaWeibo(options) {
    _executeFuction('logoutSinaWeibo', options);
}

function getUUID(options) {
    _executeFuction('getUUID', options);
}

function getDistance(options) {
    _executeFuction('getDistance', options);
}

function getlocation(options) {
    _executeFuction('getLocation', options);
}

function getLocation(options) {
    _executeFuction('getLocation', options);
}

function chooseImage(options) {
    _executeFuction('chooseImage', options);
}

function chooseVideo(options) {
    _executeFuction('chooseVideo', options);
}

function chooseVideoAndPic(options) {
    _executeFuction('chooseVideoAndPic', options);
}

function startVoice(options) {
    _executeFuction('startVoice', options);
}

function stopVoice(options) {
    _executeFuction('stopVoice', options);
}

function playVoice(options) {
    _executeFuction('playVoice', options);
}

function stopPlayVoice(options) {
    _executeFuction('stopPlayVoice', options);
}

function getQRCode(options) {
    _executeFuction('getQRCode', options);
}

function share(options) {
    _executeFuction('share', options);
}

function pay(options) {
    _executeFuction('pay', options);
}

function setItem(options) {
    _executeFuction('setItem', options);
}

function getItem(options) {
    _executeFuction('getItem', options);
}

function removeItem(options) {
    _executeFuction('removeItem', options);
}

function showOrHiddenNav(options) {
    _executeFuction('showOrHiddenNav', options);
}

function submit(options) {
    _executeFuction('submit', options);
}

function callPhone(options) {
    _executeFuction('callPhone', options);
}

function sendMessage(options) {
    _executeFuction('sendMessage', options);
}

function sendEmail(options) {
    _executeFuction('sendEmail', options);
}

function faceIdentification(options) {
    _executeFuction('faceIdentification', options);
}

function alipayIdentification(options) {
    _executeFuction('alipayIdentification', options);
}

function closeWindow(options) {
    _executeFuction('closeWindow', options);
}

function onShowOrHiddenNav(options) {
    _executeFuction('onShowOrHiddenNav', options);
}

// ------ private ------
/**
 * @private
 * 根据methodName执行该方法, 执行之前判断dd环境是否ready
 * @param {string} methodName - 执行的方法名称
 * @param {object} options - 执行的方法所带的参数
 * */
function _executeFuction(methodName, options) {
//alert('_executeFuction' + methodName)
    if (dd.isInit) {
        !!window['_' + methodName] && window['_' + methodName](options)
    } else {
        !!dd && setupWebViewJavascriptBridge(function () {
            if (window.WebViewJavascriptBridge.init) {
                if (!dd.isInit) {
//alert('WebViewJavascriptBridge init')
                    window.WebViewJavascriptBridge.init(function (message, responseCallback) {

                    })
                }
            }
            dd.isInit = true;
            setTimeout(function () {
                !!window['_' + methodName] && window['_' + methodName](options)
            }, 100);
        });
    }
}

/**
 * @private
 * 真正执行的方法函数,
 * 命名规则: 方法名称为['_'+methodName]
 * @param {string} options - 该方法执行的参数
 * */
function _networkType(options) {
    dd.device.connection.getNetworkType({
        onSuccess: function (data) {
            !!options && !!options.success && options.success(JSON.stringify(data))
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    });
}

function _getUserID(options) {
//alert('getUserId');
    dd.biz.user.getUserInfo({
        onSuccess: function (info) {
            var data = {userid: info.userid};
            if (info.appConEntUniCode) {
//alert('fruser called.');
                data['appConEntUniCode'] = info.appConEntUniCode;
                data['uniscid'] = info.uniscid;
            }
            !!options && !!options.success && options.success(JSON.stringify(data))
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    });
}

function _getUserInfo(options) {
//alert('get user info')
    dd.biz.user.getUserInfo({
        onSuccess: function (info) {
//alert(JSON.stringify(info))
            var sex = info.sex;
            if (sex == '女') {
                info['sex'] = '2';
            } else {
                info['sex'] = '1';
            }
            !!options && !!options.success && options.success(JSON.stringify(info))
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    });
}

function _registerUser(options) {
    alert('registerUser method not realize in [dd] environment!')
}

function _modifyPassword(options) {
    alert('modifyPassword method not realize in [dd] environment!')
}

function _loginApp(options) {
    alert('loginApp method not realize in [dd] environment!')
}

function _logout(options) {
    alert('logout method not realize in [dd] environment!')
}

function _loginQQ(options) {
    alert('loginQQ method not realize in [dd] environment!')
}

function _logoutQQ(options) {
    alert('logoutQQ method not realize in [dd] environment!')
}

function _loginTencentWeibo(options) {
    alert('loginTencentWeibo method not realize in [dd] environment!')
}

function _logoutTencentWeibo(options) {
    alert('logoutTencentWeibo method not realize in [dd] environment!')
}

function _loginSinaWeibo(options) {
    alert('loginSinaWeibo method not realize in [dd] environment!')
}

function _logoutSinaWeibo(options) {
    alert('logoutSinaWeibo method not realize in [dd] environment!')
}

function _getUUID(options) {
    dd.device.base.getUUID({
        onSuccess: function (info) {
            !!options && !!options.success && options.success(info)
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    });
}

function _getDistance(options) {
    alert('getDistance method not realize in [dd] environment!')
}

function _getLocation(options) {
    dd.device.location.get({
        onSuccess: function (info) {
            !!options && !!options.success && options.success(info)
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    })
}

function _getLocationBD(options) {
    dd.device.location.baidu.get({
        onSuccess: function (info) {
            !!options && !!options.success && options.success(info)
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    })
}

function _chooseImage(options) {
    dd.device.notification.chooseImage({
        size: options.arg,
        onSuccess: function (info) {
            var data = {result: 'true', picPath: info.picPath};
            !!options && !!options.success && options.success(data)
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    })
}

function _chooseVideo(options) {
    alert('chooseVideo method not realize in [dd] environment!')
}

function _chooseVideoAndPic(options) {
//alert('chooseVideoAndPic method not realize in [dd] environment!')
    dd.device.notification.chooseImage({
        size: options.arg,
        onSuccess: function (info) {
            var data = {result: 'true', picPath: info.picPath, videoPath: ''};
            !!options && !!options.success && options.success(data)
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    })
}

function _startVoice(options) {
    dd.device.audio.startRecord({
        localAudioId: "localAudioId",
        onSuccess: function (info) {
            !!options && !!options.success && options.success(JSON.stringify(info))
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    });
}

function _stopVoice(options) {
    dd.device.audio.stopRecord({
        onSuccess: function (info) {
            !!options && !!options.success && options.success(JSON.stringify(info))
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    });
}

function _playVoice(options) {
    dd.device.audio.play({
        localAudioId: "localAudioId",
        onSuccess: function (info) {
            !!options && !!options.success && options.success(JSON.stringify(info))
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    });
}

function _stopPlayVoice(options) {
    dd.device.audio.stop({
        localAudioId: "localAudioId",
        onSuccess: function (info) {
            !!options && !!options.success && options.success(JSON.stringify(info))
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    });
}

function _getQRCode(options) {
    dd.biz.util.scan({
        type: 'qrCode',//type为qrCode或者barCode
        onSuccess: function (info) {
//!!options && !!options.success && options.success(info.qrcode)
            alert(info.text)
        },
        onFail: function (err) {
//!!options && !!options.fail && options.fail(err)
        }
    })
}

function _share(options) {
//alert('share' + options.arg)
    dd.biz.util.share({
        arg: options.arg,
        onSuccess: function (info) {
            !!options && !!options.success && options.success(JSON.stringify(info))
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    })
}

function _pay(options) {
    alert('pay method not realize in [dd] environment!')
}

function _setItem(options) {
    var timer = setTimeout(function () {
        !!options && !!options.success && options.success(options.key)
    }, 500);
    dd.util.localStorage.setItem({
        key: options.key,
        value: options.value,
        onSuccess: function (info) {
            clearTimeout(timer);
            !!options && !!options.success && options.success(JSON.stringify(info))
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    })
}

function _getItem(options) {
    dd.util.localStorage.getItem({
        key: options.key,
        onSuccess: function (info) {
            !!options && !!options.success && options.success(info[options.key])
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    })
}

function _removeItem(options) {
    var timer = setTimeout(function () {
        !!options && !!options.success && options.success(options.key)
    }, 500);
    dd.util.localStorage.removeItem({
        key: options.key,
        onSuccess: function (info) {
            clearTimeout(timer);
            !!options && !!options.success && options.success(JSON.stringify(info))
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    })
}

function _showOrHiddenNav(options) {
//alert('showOrHiddenNav method not realize in [dd] environment!')
}

function _submit(options) {
    alert('submit method not realize in [dd] environment!')
}

function _callPhone(options) {
    dd.biz.telephone.call({
        users: ['101', '102'], //用户列表，工号
        corpId: options.phone, //企业id
        onSuccess: function (info) {
            !!options && !!options.success && options.success(JSON.stringify(info))
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    })
}

function _sendMessage() {
    alert('sendMessage method not realize in [dd] environment!')
}


function _sendEmail() {
    alert('sendEmail method not realize in [dd] environment!')
}

function _faceIdentification() {
    alert('faceIdentification method not realize in [dd] environment!')
}

function _alipayIdentification() {
    alert('alipayIdentification method not realize in [dd] environment!')
}


function _closeWindow() {
    dd.biz.navigation.close({
        onSuccess: function (info) {
            !!options && !!options.success && options.success(JSON.stringify(info))
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    })
}

function _setNavTitle() {
    dd.biz.navigation.setTitle({
        title: '邮箱正文',
        onSuccess: function (data) {
//alert(data);
            document.getElementById("show").innerHTML = data;
        },
        onFail: function (error) {
        }
    })
}

//设置-导航栏-切换分段控制器
function _setSegmentedTitle() {
    dd.biz.navigation.setSegmentedTitle({
        segmentedTitle: ['11', '22', '33'],
        onSuccess: function (data) {
// data => {buttonIndex: 0}
        },
        onFail: function (err) {
        }
    })
}

function _selectImg() {
    dd.device.notification.selectImg({
        onSuccess: function (data) {
// data => {"imgPath":path}
        },
        onFail: function (error) {
        }
    })
}

function _onShowOrHiddenNav() {
//alert('onShowOrHiddenNav method not realize in [dd] environment!')
}

//alert('2222222255')

var trueurl;

function config(key, secret) {
    alert('config called');
    var urlcan = window.location.href;
    var url = 'http://app.zjzwfw.gov.cn/jmopen/interfaces/checklightvalid.do';
    $.ajax(url, {
        data: {
            'urlString': urlcan,
            'key': key,
            'secret': secret,
        },
        dataType: 'json',
        type: 'post',
        async: false,
        timeout: 10000,
        success: function (data) {
            alert('success called' + data);
            var result = data.isvalid;
            if (result == "false") {
//alert('config error' + data.code);
            } else {
                trueurl = data.urldomain;
            }
        },
        error: function (err) {
//alert('error' + err);
//alert('error msg' + err.errmsg);
        }
    });
};
/*function config(key, secret) {
alert('config called');
}*/
/*
function config(key, secret) {
alert('config called')
val urlcan = window.location.href;
var url = 'http://app.zjzwfw.gov.cn/jmopen/interfaces/checklightvalid.do';
$.ajax(url, {
data: {
'urlString': urlcan,
'key': key,
'secret': secret,
},
dataType: 'json',
type: 'post',
async: false,
timeout: 10000,
success: function(data) {
alert('success called')
var result = data.isvalid;
if(result == "false") {
alert('config error' + data.code);
} else {
trueurl = data.urldomain;
alert('trueurl' + trueurl);
}
},
error: function(e) {
alert('cuowu' + e);
alert('cuowu' + e.errmsg);
}
});
};*/

//alert('22222222')

function getUserInfoString(success, fail) {
    _executeFuction('getUserInfoString', {success: success, fail: fail});
}

function getQRCodeString(success, fail) {
    _executeFuction('getQRCode', {success: success, fail: fail});
}

function _getUserInfoString(options) {
//alert('get user info')
    dd.biz.user.getUserInfo({
        onSuccess: function (info) {
//alert(JSON.stringify(info))
            !!options && !!options.success && options.success(JSON.stringify(info))
        },
        onFail: function (err) {
            !!options && !!options.fail && options.fail(err)
        }
    });
}

window.jmportal = {login: {getUserInfo: getUserInfoString}, QRCode: {getQRCode: getQRCodeString}};

//window.jmportal = {login:{getUserInfo:getUserInfo}};
