import { APIRegister } from '../core';

export interface CertificationInfo {
    certSuccess: string;  // '0' 失败， '1' 成功，'2'审核中
    username: string;
    idCardNo: string;
    mobile: string;
}

export interface AuthorizationInfo {
    state: string;
    code: string;
}

export class User {
    private register: APIRegister;

    constructor(register: APIRegister) {
        this.register = register;
    }

    // 用户认证
    certification(appId: string): Promise<CertificationInfo> {
        return new Promise<CertificationInfo>((resolve, reject) => {
            this.register.callHandler('user.certification', {
                appId
            }).then(result => {
                resolve(result);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    // 用户授权
    authorization(targetUrl: string): Promise<AuthorizationInfo> {
        return new Promise<AuthorizationInfo>((resolve, reject) => {
            this.register.callHandler('user.authorization', {
                url: targetUrl
            }).then(result => {
                if (result.code === 10000) {
                    resolve({
                        state: result.data.state,
                        code: result.data.code
                    });
                } else {
                    reject(result.message);
                }
            }).catch(e => {
                reject(e);
            });
        });
    }

    // 用户登录
    login(): Promise<boolean> {
        return this.register.callHandler('user.login');
    }
}