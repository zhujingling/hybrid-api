import { APIRegister } from '../core';

export class User {
    private register: APIRegister;

    constructor(register: APIRegister) {
        this.register = register;
    }

    // 用户认证
    certification(appId: string) {
        return this.register.callHandler('user.certification', {
            appId
        });
    }

    // 用户授权
    authorization(targetUrl: string) {
        return this.register.callHandler('user.authorization', {
            url: targetUrl
        });
    }
}