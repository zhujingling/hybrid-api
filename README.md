# Hybrid 混合开发API @^2.0.0

为了更好的可维护性和可扩展性。本项目用 Typescript 实现，并已发布在 npm，要使用，请通过 npm 安装。
```bash
npm install hybrid-api --save
```
## 更新日志

[CHANGELOG.md](CHANGELOG.md)

## 调用方法

hybrid 所有方法均返回一个 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 实例，通过 then 方法，获取调用结果。

以下是 Typescript 文档，查看 [Javascript 文档](./README-JS.md)。


### 在项目中导入 hybrid-api

```typescript
import { hybrid } from 'hybrid-api';
```

## 方法

### Device

#### 获取设备UUID

```typescript
hybrid.device.getUUID().then((info: UUIDInfo) => {
   console.log(info.uuid); 
});
```
#### 通过拍照或相册获取一张图片
```typescript
/**
* interface SelectImgParams {
*     cancelButton: string;
*     otherButtons: Array<SelectImgOptions>;
* }
*/

const params: SelectImgParams = {
    cancelButton: '取消',
    otherButtons: ['拍照', '相册']
};

hybrid.device.selectImg(params).then((info: SelectImgInfo) => {
    // info.imgPath 为本地地址
    console.log(info.imgPath);
});
```

#### 通过拍照或相册上传一张图片
```typescript
/**
* interface SelectImgParams {
*     cancelButton: string;
*     otherButtons: Array<SelectImgOptions>;
* }
*/

const params: SelectImgParams = {
    cancelButton: '取消',
    otherButtons: ['拍照', '相册']
};

hybrid.device.chooseImg(params).then((info: ChooseImgInfo) => {
    // info.picPath 为网络地址
    console.log(info.picPath);
});
```

### Location

#### 获取当前定位信息
```typescript
/**
* interface LocationInfo {
*   longitude: string; // 经度
*   latitude: string; // 纬度
*   detailAddress: string; // 详细地址
*   cityName: string; // 城市
*   region: string; // 区域名称
* }
*/
hybrid.location.get().then((location: LocationInfo) => {
    console.log(location);
});
```

### Navigation


#### 关闭 webview
```typescript
hybrid.navigation.close();
```
#### 隐藏导航条
```typescript
hybrid.navigation.hide();
```
#### 显示导航条
```typescript
hybrid.navigation.show();
```

### User

#### 用户认证
```typescript
/**
* interface CertificationInfo {
*   certSuccess: string;  // '0' 失败， '1' 成功，'2'审核中
*   username: string; // 用户名
*   idCardNo: string; // 身份证号码
*   mobile: string; // 手机号码
* }
*/
const appId: string = 'appId';
hybrid.user.certification(appId).then((data: CertificationInfo) => {
    console.log(data); 
});
```

#### 用户授权
```typescript
/**
* interface AuthorizationInfo {
*   state: string;
*   code: string;
* }
*/

const targetUrl: string = 'http://user.test.com';
hybrid.user.authorization(targetUrl).then((data: AuthorizationInfo) => {
    console.log(data);
});
```

#### 用户登录
```typescript
hybrid.user.login().then((isLogin: boolean) => {
    if (isLogin) {
        console.log('登录成功');
    }
});
```

### Util

#### 打开新的 webview 或 APP 页面
```typescript
const url: string = 'http://user.test.com';
const params: { [key: string]: any} = {name: 'name'};
// params 是可选的
hybrid.util.openLink(url, params);
```

#### 分享
```typescript
/**
* interface ShareArgs {
*   title: string; // 标题
*   content: string; // 分享内容
*   imageUrl: string; // 分享图片地址
*   targetUrl: string; // 分享跳转的目标地址
* }
*/
const args: ShareArgs = {
    title: '标题',
    content: '分享内容',
    imageUrl: 'http://test.user.com/a.jpg',
    targetUrl: 'http://test.user.com/target'
};
hybrid.util.share(args).then(() => {
    console.log('分享成功！');
}).cache(error => {
    console.log('分享失败！');
})
```

#### 扫描二维码
```typescript
/**
* enum ScanType {
*    QrCode = 'qrCode'
* }
*/
const scanType = ScanType.QrCode;
hybrid.util.scan(scanType).then((result: ScanResult) => {
    console.log(result);
});
```

#### 支付
```typescript
/**
* interface PaymentInfo {
*    errCode: any;
*    stateCode: number;
*    resultDes: string;
* }
*/

const params: string = '{key: value}'; // 由后台提供的字符串
hybrid.util.pay(params).then((response: PaymentInfo) => {
   console.log(response); 
});
```

#### 获取本地IP

```typescript
hybrid.util.getIP().then(response => {
    console.log(response.clientIP);
});
```

#### 获取浏览器指纹信息

```typescript
hybrid.util.fingerprint().then((result: string) => {
   console.log(result); 
});
```

#### 微信H5支付

拿到指纹采集的结果和IP，并传给后台，由后台生成微信支付的 url，前端跳转到对应地址即可。示例如下：

```typescript
Promise.all([hybrid.util.fingerprint(), hybrid.util.getIP()]).then((result: Array<any>) => {
    const fingerprint = result[0];
    const ip = result[1].clientIP;
    
    return this.http.post('http://www.demo.com/get-weixin-pay-url', {
        fingerprint,
        ip
    });
}).then(response => {
    if (response.success) {
        // response.data: weixin://pay.com/XXXXXXX
        location.href = response.data;
    }
});


```

#### 弹出微信支付结果模态框

在调用微信支付后的回调页面，可以调用弹出窗，由用户选择是支付成功，还是重新支付，**不分用户选择什么，真正的支付结果，均以查询为准**

```typescript
hybrid.util.showWeixinPayModal().then((selectResult: boolean) => {
    if (selectResult) {
        console.log('用户选择了支付成功');
    } else {
        console.log('用户选择了重新支付');
    }
});
```