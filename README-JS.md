# hybrid-api Javascript 文档

## 引入类库

```html
<script src="https://nnapp.cloudbae.cn:38080/storage/api/v1/file/hybridapi/hybridapi-2.3.2.js"></script>
```

## 方法


### Device

#### 获取设备UUID

```js
YBB.hybrid.device.getUUID().then(function(info) {
   console.log(info.uuid); 
});
```
#### 通过拍照或相册获取一张图片
```js

var params = {
    cancelButton: '取消',
    otherButtons: ['拍照', '相册']
};

YBB.hybrid.device.selectImg(params).then(function(info) {
    // info.imgPath 为本地地址
    console.log(info.imgPath);
});
```

#### 通过拍照或相册上传一张图片
```js

var params = {
    cancelButton: '取消',
    otherButtons: ['拍照', '相册']
};

YBB.hybrid.device.chooseImg(params).then(function(info) {
    // info = {result: boolean, picPath: string}
    // info.picPath 为网络地址
    console.log(info.picPath);
});
```

### Location

#### 获取当前定位信息
```js
YBB.hybrid.location.get().then(function(location) {
    /**
    * location = {
    *   longitude: string; // 经度
    *   latitude: string; // 纬度
    *   detailAddress: string; // 详细地址
    *   cityName: string; // 城市
    *   region: string; // 区域名称
    * }
    */
    console.log(location);
});
```

### Navigation


#### 关闭 webview
```js
YBB.hybrid.navigation.close();
```
#### 隐藏导航条
```js
YBB.hybrid.navigation.hide();
```
#### 显示导航条
```js
YBB.hybrid.navigation.show();
```

### User

#### 用户认证
```js
var appId = 'appId';
YBB.hybrid.user.certification(appId).then(function(data) {
    /**
    * data = {
    *   certSuccess: string;  // '0' 失败， '1' 成功，'2'审核中
    *   username: string; // 用户名
    *   idCardNo: string; // 身份证号码
    *   mobile: string; // 手机号码
    * }
    */
    console.log(data); 
});
```

#### 用户授权
```js

var targetUrl = 'http://user.test.com';
YBB.hybrid.user.authorization(targetUrl).then(function(data) {
    /**
    * data = {
    *   state: string;
    *   code: string;
    * }
    */
    console.log(data);
});
```

#### 用户登录
```js
YBB.hybrid.user.login().then(function(isLogin) {
    if (isLogin) {
        console.log('登录成功');
    }
});
```

### Util

#### 打开新的 webview 或 APP 页面
```js
var url = 'http://user.test.com';
var params = {name: 'name'};
// params 是可选的
YBB.hybrid.util.openLink(url, params);
```

#### 分享
```js
var args = {
    title: '标题', // 标题
    content: '分享内容', // 分享内容
    imageUrl: 'http://test.user.com/a.jpg', // 分享图片地址
    targetUrl: 'http://test.user.com/target' // 分享跳转的目标地址
};
YBB.hybrid.util.share(args).then(function() {
    console.log('分享成功！');
}).cache(function(error) {
    console.log(error);
    console.log('分享失败！');
})
```

#### 扫描二维码
```js
var scanType = 'qrCode';
YBB.hybrid.util.scan(scanType).then(function(result) {
    // result = {text: 'text text'}
    console.log(result);
});
```

### 支付
```js

var params = '{key: value}'; // 由后台提供的字符串
YBB.hybrid.util.pay(params).then(function(response) {
    /**
    * response = {
    *    errCode: any;
    *    stateCode: number;
    *    resultDes: string;
    * }
    */
   console.log(response); 
});
```
#### 获取本地IP

```js
YBB.hybrid.util.getIP().then(function(response) {
    console.log(response.clientIP);
});
```

#### 获取浏览器指纹信息

```js
YBB.hybrid.util.fingerprint().then(function(result) {
   console.log(result); 
});
```

#### 微信H5支付

拿到指纹采集的结果和IP，并传给后台，由后台生成微信支付的 url，前端跳转到对应地址即可。示例如下：

```js
Promise.all([YBB.hybrid.util.fingerprint(), YBB.hybrid.util.getIP()]).then(function(result) {
    var fingerprint = result[0];
    var ip = result[1].clientIP;
    
    $.ajax({
        url: 'http://www.demo.com/get-weixin-pay-url',
        method: 'post',
        data: {
            fingerprint: fingerprint,
            ip: ip
        }
    }).success(function(response) {
       if (response.success) {
           // response.data: weixin://pay.com/XXXXXXX
           location.href = response.data;
       }
   });
});


```

#### 弹出微信支付结果模态框

在调用微信支付后的回调页面，可以调用弹出窗，由用户选择是支付成功，还是重新支付，**不分用户选择什么，真正的支付结果，均以查询后台接口为准**

```js
YBB.hybrid.util.showWeixinPayModal().then(function(selectResult) {
    if (selectResult) {
        console.log('用户选择了支付成功');
    } else {
        console.log('用户选择了重新支付');
    }
});
```

