import { APIRegister } from '../core';

export interface CertificationInfo {
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
                if (result.certSuccess === '1') {
                    resolve({
                        username: result.username,
                        idCardNo: result.idCardNo,
                        mobile: result.mobile
                    });
                } else {
                    reject('用户认证失败！');
                }
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
}