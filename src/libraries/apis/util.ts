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
    errorCode: string;
    stateCode: string;
    resultDes: string;
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