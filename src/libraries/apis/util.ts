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

export interface PaymentInfo {
    errorCode: string; // 1. 支付成功 2.支付失败 3.用户主动取消支付
    stateCode: string; // 支付出错时，支付平台返回的errorCode，具体值参考：
                       // 支付宝：https://docs.open.alipay.com/204/105301/
                       // 微信：https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=8_5
    resultDes: string; // 结果描述，具体描述为各个支付平台对应的错误描述
}

export class Util {
    private register: APIRegister;

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
    scan(type: ScanType): Promise<string> {
        return this.register.callHandler('biz.util.scan', {
            type
        });
    }

    // 统一支付接口
    pay(params: string): Promise<PaymentInfo> {
        return this.register.callHandler('biz.util.pay', {
            content: params
        });
    }
}