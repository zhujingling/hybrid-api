import { Component } from '@angular/core';

import { hybrid, ShareArgs, ScanType } from '../libraries/index';

@Component({
    selector: 'my-app',
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class AppComponent {
    isError: boolean = false;
    log: string = '';

    certificationAppId: string = '';
    authorizationUrl: string = '';
    openLinkUrl: string = '';
    shareArgs: ShareArgs = {
        title: '',
        content: '',
        imageUrl: '',
        targetUrl: ''
    };

    scanType: ScanType;

    getLocation() {
        this.resultHandle(hybrid.location.get());
    }

    navClose() {
        this.resultHandle(hybrid.navigation.close());
    }

    navShow() {
        this.resultHandle(hybrid.navigation.show());
    }

    navHide() {
        this.resultHandle(hybrid.navigation.hide());
    }

    userCertification() {
        this.resultHandle(hybrid.user.certification(this.certificationAppId));
    }

    userAuthorization() {
        this.resultHandle(hybrid.user.authorization(this.authorizationUrl));
    }

    openLink() {
        this.resultHandle(hybrid.util.openLink(this.openLinkUrl));
    }

    share() {
        this.resultHandle(hybrid.util.share(this.shareArgs));
    }

    scan() {
        this.resultHandle(hybrid.util.scan(this.scanType));
    }

    private resultHandle(result: Promise<any>) {
        result.then(data => {
            this.isError = false;
            this.log = JSON.stringify(data, null, 2);
        }).catch(error => {
            this.isError = true;
            this.log = JSON.stringify(error, null, 2);
        });
    }
}