import { APIRegister } from '../core';

export class Navigation {
    private register: APIRegister;

    constructor(register: APIRegister) {
        this.register = register;
    }

    // 退出 webview
    close(): Promise<any> {
        return this.register.callHandler('biz.navigation.close');
    }

    // 隐藏导航条
    hide(): Promise<any> {
        return this.register.callHandler('biz.navigation.hide');
    }

    // 显示导航条
    show(): Promise<any> {
        return this.register.callHandler('biz.navigation.show');
    }
}