<h3 align="center" style="margin: 30px 0 30px;font-weight: bold;font-size:40px;">八字排盘工具</h3>

[![star](https://gitee.com/yxbug/8Char-H5/badge/star.svg?theme=dark)](https://gitee.com/yxbug/8Char-H5/stargazers)
[![fork](https://gitee.com/yxbug/8Char-H5/badge/fork.svg?theme=dark)](https://gitee.com/yxbug/8Char-H5/members)
[![stars](https://img.shields.io/github/stars/axbug/8Char-H5?style=flat-square&logo=GitHub)](https://github.com/axbug/8Char-H5)
[![forks](https://img.shields.io/github/forks/axbug/8Char-H5?style=flat-square&logo=GitHub)](https://github.com/axbug/8Char-H5)
[![issues](https://img.shields.io/github/issues/axbug/8Char-H5?style=flat-square&logo=GitHub)](https://github.com/axbug/8Char-H5/issues)
[![Website](https://img.shields.io/badge/site-blog.yxbug.cn-blue?style=flat-square)](https://blog.yxbug.cn)
[![release](https://img.shields.io/github/v/release/axbug/8Char-H5?style=flat-square)](https://gitee.com/axbug/8Char-H5/releases)
[![license](https://img.shields.io/github/license/axbug/8Char-H5?style=flat-square)](https://en.wikipedia.org/wiki/MIT_License)

## 项目说明
本项目基于 **Uni-APP** 框架开发的 **八字排盘工具** ，可根据已知时间、四柱进行排盘！

 - 排盘界面分命主信息、基本命盘、专业细盘和在线批命四个界面。
 - 排盘数据包含四柱、十神、藏干、纳音、星运、空亡、天罡称骨、五行数据、大运流年、古籍参考等信息。
 - 支持浅色模式、深色模式切换（含切换动画）

本项目基于 **Uni-APP** 开发，理论上可以将本项目打包发布到iOS、Android、Web、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台。

本项目主要发布到 **H5** 平台，**未对其他平台进行发布测试** ，若其他平台存在差异，请提交issues并备注问题、截图、平台、机型、复现过程等，若您有更好的建议和想法请提交issues，万分感谢！

**声明：项目持续更新，若有Bug请提交issues，开源不易，仅供学习研究，部署在其他服务器请务必保留本项目信息（包括但不限于LOGO、版权、赞助、友链等），禁止商用，违者必究！**

## 参考来源
非常感谢各位前辈的开源项目，对本项目参考的来源表示由衷的感谢！！！

| 网站/项目  | 链接                                        |
|--------|-------------------------------------------|
| uniapp | 	https://uniapp.dcloud.net.cn/            |
| tmui   | 	https://gitee.com/LYTB/tmui-design       |
| lunar  | 	https://gitee.com/6tail/lunar-javascript |
| …      | 	致敬各位大佬                                   |

## 安装
```shell
yarn install
```

## 运行&发布
```shell
yarn run dev:%PLATFORM%
yarn run build:%PLATFORM%
```

``%PLATFORM%`` 可取值如下：

|值|平台|
|---|---|
|app-plus|app平台生成打包资源（支持npm run build:app-plus，可用于持续集成。不支持run，运行调试仍需在HBuilderX中操作）|
|h5|H5|
|mp-alipay|支付宝小程序|
|mp-baidu|百度小程序|
|mp-weixin|微信小程序|
|mp-toutiao|字节跳动小程序|
|mp-lark|飞书小程序|
|mp-qq|qq 小程序|
|mp-360|360 小程序|
|mp-kuaishou|快手小程序|
|mp-jd|京东小程序|
|mp-xhs|小红书小程序|
|quickapp-webview|快应用(webview)|
|quickapp-webview-union|快应用联盟|
|quickapp-webview-huawei|快应用华为|

可以自定义更多条件编译平台，比如钉钉小程序，参考[package.json文档](https://uniapp.dcloud.io/collocation/package)。

## 赞助项目
如果您觉得本项目对您有所帮助，请适当的赞助，我将持续更新项目以回报您的支持，赞助金将用于服务器维护和公益捐赠，赞助请备注大名，未来版本将有赞助榜，感谢您的赞助与支持！

<div style="display: flex;width:100%;text-align: center">
    <div style="width:30%;">
        <div><span style="font-weight: 800;line-height: 3rem;font-size: 1rem;">微信</span></div>
        <div><img src="./src/static/icon/support/wechat.gif"  alt="微信赞助"/></div>
    </div>
    <div style="width:30%;">
        <div><span style="font-weight: 800;line-height: 3rem;font-size: 1rem;">支付宝</span></div>
        <div><img src="./src/static/icon/support/alipay.gif"  alt="支付宝赞助" /></div>
    </div>
    <div style="width:30%;">
        <div><span style="font-weight: 800;line-height: 3rem;font-size: 1rem;">QQ</span></div>
        <div><img src="./src/static/icon/support/qq.gif"  alt="QQ赞助" /></div>
    </div>
</div>

## 关于项目
预览地址：[https://app.yxbug.cn/app/8char/](https://app.yxbug.cn/app/8char/)

作者博客：[https://blog.yxbug.cn/](https://blog.yxbug.cn/)
