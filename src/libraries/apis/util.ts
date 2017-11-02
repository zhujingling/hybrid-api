import { register } from '../core';

export interface ShareArgs {
    title: string;
    content: string;
    imageUrl: string;
    targetUrl: string;
}

export class Util {
    private register = register;

    // 打开新的webview
    openLink(url: string): Promise<any> {
        return this.register.callHandler('biz.util.openLink', {
            url
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
}