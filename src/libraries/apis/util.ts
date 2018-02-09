import { APIRegister } from '../core';

export interface ShareArgs {
    title: string;
    content: string;
    imageUrl: string;
    targetUrl: string;
}

export enum ScanType {
    QrCode = 'qrCode'
}

export interface ScanResult {
    text: string;
}

export interface PaymentInfo {
    stateCode: number; // 1. 支付成功 2.支付失败 3.用户主动取消支付
    errCode: any; // 支付出错时，支付平台返回的errorCode，具体值参考：
    // 支付宝：https://docs.open.alipay.com/204/105301/
    // 微信：https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=8_5
    resultDes: string; // 结果描述，具体描述为各个支付平台对应的错误描述
}

export class Util {
    private register: APIRegister;
    /* tslint:disable */
    private modalCSS = '.ybb-modal{line-height:16px;position:absolute;left:0;right:0;top:0;bottom:0;z-index:100000;background-color:rgba(0,0,0,.5)}.ybb-modal-content{width:260px;height:158px;background-color:#fff;border-radius:13px;overflow:hidden;text-align:center;position:absolute;left:50%;top:50%;margin-left:-130px;margin-top:-79px}.ybb-modal-title{padding:24px 0;font-size:16px;color:#333}#ybb-modal-btn-fail,#ybb-modal-btn-success{width:100%;display:block;text-align:center;background:0 0;border:none;outline:0}#ybb-modal-btn-fail:active,#ybb-modal-btn-success:active{background-color:#e9eaec}#ybb-modal-btn-success{border-top:.55px solid #b4b7bd;border-bottom:.5px solid #b4b7bd;padding-top:14px;padding-bottom:14px;font-size:17px;color:#31AB40}#ybb-modal-btn-fail{font-size:14px;color:#777;padding-top:15px;padding-bottom:15px}';

    private modalHTML = '<div class="ybb-modal-content"><div class="ybb-modal-title">请确认微信支付是否已完成</div><button type="button" id="ybb-modal-btn-success">已完成支付</button> <button type="button" id="ybb-modal-btn-fail">支付遇到问题，重新支付</button></div>';

    /* tslint:enable */

    private isAppend: boolean = false;

    constructor(register: APIRegister) {
        this.register = register;
    }

    // 打开新的webview
    openLink(url: string, params?: { [key: string]: any }): Promise<any> {
        return this.register.callHandler('biz.util.openLink', {
            url,
            params
        });
    }

    // 分享
    share(arg: ShareArgs): Promise<any> {
        return this.register.callHandler('biz.util.share', {
            arg: {
                titleStr: arg.title,
                contentStr: arg.content,
                imageStr: arg.imageUrl,
                shareUrlStr: arg.targetUrl
            }
        });
    }

    // 扫描二维码
    scan(type: ScanType): Promise<ScanResult> {
        return this.register.callHandler('biz.util.scan', {
            type
        }).then((result: any) => {
            if (typeof result === 'string') {
                return JSON.parse(result);
            }
            return result;
        });
    }

    // 统一支付接口
    pay(params: string): Promise<PaymentInfo> {
        return this.register.callHandler('biz.util.pay', {
            content: params
        }).then((result: any) => {
            let n = result;
            if (typeof result === 'string') {
                n = JSON.parse(result);
            }

            return {
                errCode: n.errCode,
                resultDes: n.reultDes,
                stateCode: n.stateCode
            };
        });
    }

    getIP(): Promise<{ clientIP: string }> {
        return new Promise<{ clientIP: string }>((resolve, reject) => {
            const body = document.body;
            const script = document.createElement('script');
            const callbackName = ('ybb' + Math.random()).replace(/\./g, '');

            window[callbackName] = function (result: any) {
                if (result.code === 10000) {
                    resolve({clientIP: result.data});
                } else {
                    reject(new Error(result.message));
                }
                window[callbackName] = null;
            };

            script.onload = function () {
                body.removeChild(script);
            };

            script.onerror = function () {
                body.removeChild(script);
                reject(new Event('接口调用失败'));
            };

            script.src = 'http://121.43.187.16:8087/api/v1/ip?callback=' + callbackName;
            body.appendChild(script);
        });
    }

    fingerprint(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (window['Fingerprint2']) {
                const fp = new (<any> window).Fingerprint2();
                fp.get((result: string) => {
                    resolve(result);
                });
                return;
            }
            const script = document.createElement('script');
            script.src = '//wx.gtimg.com/wxpay_h5/fingerprint2.min.1.4.1.js';

            script.onload = () => {
                document.body.removeChild(script);
                if (window['Fingerprint2']) {
                    const fp = new (<any> window).Fingerprint2();
                    fp.get((result: string) => {
                        resolve(result);
                    });
                } else {
                    reject(new Error('未找到 `Fingerprint2` 类'));
                }
            };

            script.onerror = () => {
                document.body.removeChild(script);
                reject(new Error('微信sdk下载失败'));
            };

            document.body.appendChild(script);
        });
    }

    weixinPayByH5(url: string): Promise<void> {
        const body = document.body;
        if (this.isAppend === false) {
            const style = document.createElement('style');
            style.innerHTML = this.modalCSS;
            body.appendChild(style);
            this.isAppend = true;
        }

        return new Promise<void>((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'ybb-modal';
            modal.innerHTML = this.modalHTML;

            body.appendChild(modal);

            const successBtn = modal.getElementsByTagName('button')[0];
            const failBtn = modal.getElementsByTagName('button')[1];

            location.href = url;

            successBtn.onclick = function () {
                body.removeChild(modal);
                resolve();
            };
            failBtn.onclick = function () {
                location.href = url;
            };
        });
    }
}