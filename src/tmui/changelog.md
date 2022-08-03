## 3.0.74（2022-07-18）
* tm-picker-view 【优化】当项目文字超过7个时，自动把文字缩小，以免挤满单元格。
* tm-button 【优化】新增small尺寸，现在有：mini,small,normal,large,block可选。同时修改了一些默认的样式尺寸属性。
* tm-app【优化】添加了属性：darkColor，用来设定自定义的暗黑下的背景色值（只能设置为颜色值，而不是主题 。）
* tm-dropdown优化了属性类型设置错误
* 一些代码上的优化。
## 3.0.73（2022-07-15）
* tm-icon增加了unit单位属性【社区 ：tycool Song 贡献】
* tm-text增加了unit单位属性【社区 ：tycool Song 贡献】
* tm-sheet【修复】计算宽度问题【社区 ：tycool Song 贡献】
* tm-image【修复】计算宽度问题【社区 ：tycool Song 贡献】
* tm-navbar【增加了unit】单位属性,方便宽屏使用时，字号过大时，通过此属性设计单位【社区 ：tycool Song 贡献】
* fetch请求工具，【修复变更重名问题】。
* tm-overlay【修复】导航设置为全屏时，判断出错，调用了top导致内容往下掉了44px.请大家及时 更新（如果用到了全屏页面）
* tm-sign-board【修复】在h5端失效的问题，【修复因sdk 3.5.1更新了canvas的event的返回参数与之前版本不一致，导致本组件在nvue上失效！！！无奈】
* tm-form【严重】【修复】校验问题。
* tm-grid【修复】showBorder,不起作用的bug问题。
* 【新增组件】tm-watermark ，由【社区 ：tycool Song 贡献】,但目前作者本人未对其审核适配到全平台，目前仅web/h5可用。
* tm-roll-notice【修复】在小程序端断行的bug
* tm-segtab【优化】对齐相差1px像素的问题。
* 其它代码优化
## 3.0.72（2022-07-09）
* 因sdk351导致tm-dropdown报错现已修复。并优化，美化了该组件，现在更为美观了。
* tm-tabbar-item【修复】公共属性缺失，导致投影，渐变失效的bug，现在凸起按钮，可以设置渐变了。
* tm-modal优化了样式细节
* tm-float-button主按钮添加了一个默认的插槽，用于自定义主按钮内容。
* 核心主题计算参数调整。
## 3.0.71（2022-07-08）
* uniapp官方已发布3.5.1，将及时根据更新日志更新本组件一些新特性。
* movable-area在sdk 3.5.1版本新增了一个属性动态disable，我立即更新了tm-slide-witch组件的问题，现在你用力往左拉将会动态阻止你向左偏移过多距离的问题。
* 因新的sdk支持在h5中使用hover-class。将使得pc web操作变得可有指向性。我也跟进更新。
* 新的sdk修复了ref的bug，支付宝，百度们可试下本组件pcker是否正常了，建议大家及时更新版本sdk.
* 因sdk3.5.1更新了IOS端nvue bindingx等，导致tm-switch开关动画异常。现已修复。
* tm-icon去除默认行高，否则导致排版偏上。
* tm-tabbar修复在安卓上出现裁剪的情况
* 【新增组件】tm-barcode 条形码，用于产品，打印场景。支持的码制众多，有需要的同学可以使用。
* tm-roll-notice删除一个小问题
* tm-form-item,新增：showError控制（在验证失败时是否显示错误信息提示），同时新增rules属性规则支持数据校验对象。旧版本升级后，请检查tm-form校验是否有问题，如果有问题请按照新文档使用。
  理论上tm-form是向下兼容了的。
* 其它一些问题的修改
## 3.0.7（2022-07-05）
* tm-tag新增fontColor属性，默认为空即自动配色。
* 框架内部增加了小程序分享
* tm-tabar增强了类型错误提示。
* tm-tabbar-item增加了属性：data，自定绑定数据到项目上。方便在beforeClick函数体内调用当前自定义数据。
* tm-input type="texarea"时同步了官方的一些属性。同时在demo示例了添加了文本域换行的例子。同时修复因uniapp自身的输入框bug（出现password属性即可显示）导致安卓端无法换行
* tm-alert,新增showDot属性，默认为false,是否显示底部序号数字。
* 【新增组件】tm-sign-borad,签名板,使用见文档。
* tm-divider,新增属性realColor，是否使用原始色值
* tm-image新增close事件，当关闭图片时触发。请注意与delete事件的区别。
* tm-qrcode新增ref方法save，保存当前二维码图片
* 【新增组件】tm-roll-notice，滚动消息通知,使用见文档。
* tm-form【优化】表单在重置时，在小程序平台，可能造成概率性未重置到默认初始值。而是被清除至空。
* tm-float-button 【修复】主按钮在微信小程序下图标颜色和文字颜色未跟随主题适配颜色。
* tm-collapse 【优化增强】，新增iconPos属性，展开的图标位置，可选left,right
* tm-collapse-item 【优化增强】，新增leftIcon,leftIconColor标题前图标。现在标题不限制长度和行数。
* tm-button,增加了fontColor属性，默认为空，自动配色
* 【新增组件】tm-coupon，优惠券，使用见文档。
* tm-tabs一个兼容性问题
* tm-tabbar兼容了appvue页面
* cssTool文档错误更正
* cssTool新增类：flex-row-center-between 上下居中，两边对齐。
* jsTool增加了fecth网络请求工具。
## 3.0.62（2022-06-28）
* 因uniapp 3.5.0.20220623-alpha sdk版本起渲染调整，在安卓端elevation属性将失效。然后同步所有平台的投影属性为box-shadow写法。导致布局错乱，特紧急发布新版本跟随新的sdk更新，支持新的特性。
## 3.0.61（2022-06-23）
* tm-input 优化校验逻辑
* tm-app 修复在nvue下，设定主题时，可能会发生概率性报错的问题。
* 紧急修复一个逻辑问题，请大家及时更新新版本。如果是已安装应用请先卸载再安装。如果是调试应用，请也卸载再重新编译到基座（就是老的基座和老应用要删除重新安装。
  包括小程序的所有平台，需要先清除本地应用数据再重新启动。）
* 非常抱歉！
## 3.0.6（2022-06-23）
* tm-button 【修复】在表单组件中，如果当button为loading时，还能触发提交表单事件。
* tm-countdown 【修复】当初始时插槽中未能正确返回当前是否完成的数据。
* tm-input 【修复】上个版本未能加上focus属性。
* tm-message 【修复】3.0.5版本引出的关闭问题。
* tm-checkbox,默认插槽名称default已删除（不是删除这个插槽）。因为uniapp的bug。不能在插槽中写入数据和写默认的name="default"，否则不兼容微信 小程序。
* 【uniapp bug】修复兼容pinia因为uniapp的vue页面bug，导致在nvue和vue页面混用或者纯vue页面时，会造成白屏，或者其它出现pinia未引入的问题。
* 【uniapp bug】修复兼容uniapp的uni.getSystemSync()函数在nvue页面调用时，如果出现在weex调试时，会造成获取不到系统信息时，造成页面崩溃。
* tm-form-item 优化
* 其它的小问题修复。
* 文档的修正和完善。
## 3.0.5（2022-06-20）
* tm-more 【优化修复】在pc端显示异常的样式问题。
* tm-button 优化样式，修复文字不居中的问题。
* tm-upload 【优化】添加了常用操作的ref函数方法，比如手动调用：上传，停止上传，清除文件列表等等。
* tm-time-picker ,tm-picker 等选择器组件已经兼容暗黑模式。
* tm-message 【修复】在原生nvue页面弹出时，概率性出现重复播放动画的问题。（其它平台正常）。
	[优化]在TS语法上的提示，已经为参数添加了interface类型提示。以增强代码书写的严谨性。
* tm-picker 【修复】confirm事件第一次触发时未返回索引的bug.
* tm-radio 【修复】允许value为true.
* tm-skeleton-line 【优化】自定骨架屏组件，添加了个圆角属性round。
* tm-avatr 【修复】在web端开启trigger时，鼠标移上去未出现手形手势。
* tm-input 【优化】添加了foucs属性，以便初始使用时自动获得焦点。
* tm-notification 【优化修复】当label为空时，默认不显示。更新内容时自动显示，或者手动调用显示。
* 【核心】主题核心驱动参数调整优化,主要调整渐变配色，以及某些色域值过高饱和度时，文字配色过浅，不易于阅读。
## 3.0.4（2022-06-13）
* 【重磅新增】i18n国际化配置，简便封装，降低配置难度，抹平全平台差异，不破坏原生国际化配置,不管是原生nvue还是小程序，亦是h5平台，统一调取方法，使用更简单。
* 【重磅新增】这个版本开始，已经可以自动切换主题配色了。相关的组件主色调会跟着全局的主题色切换，而跟随切换。
* 【重磅新增】这个版本开始，你可以手动在交互中添加主题并应用整个应用，比如让用户自定主题，而不是使用默认的主题，很爽吧！。
* tm-tabbar-item 【重磅新增load属性】当此值为true时，图标会变为加载中效果。
  同时如果提供了beforeClick异步函数，再没返回结果前图标同样是处于加载动画，加载中，点击事件效果不起作用。
* tm-tabbar-item 【修复】修复在安卓上凸起按钮被裁剪的问题。
* tm-app 【优化】app端，暗黑和亮切换在安卓下底部虚拟按钮区域的颜色与主题适应。
* tm-calendar 【优化】样式视觉。
* tm-tabbar 【优化修复】底部安全区域自动适配，只有showSafe为false时，自动适配。showSafe为false时，整体高度未减掉安全区域高度，并调整了整体的高度为60，之前为50.
* tm-keyborad 【优化】底部安全区域高度的适配。
* tm-form 【优化]输入框组件在输入内容后的校验，通过代码方式主动赋值时再次进行检测校验。
* tm-message 【修复】在nvue中的一个小错误。
* tm-upload 【修复】在tm-from校验中错误的逻辑判断。
* tm-drag-list 【修复】在微信小程序下拖动失效的问题。
* tm-navbar,tm-sheet 【修复】在ios下磨砂文字色彩问题,当前所有组件应用磨砂效果时，背景色自动 启动text模式。如果想要纯背景色，请关闭磨砂效果。
* tm-input 【修复】其它值为null时，会通过校验。
* tm-time-picker 【修复】在h5端（其它平台正常）设置默认值时，显示不正确
* tm-float-button 【优化】现在主按钮你将不需要填写图标颜色了，将使用主题的推断色，以便于主题切换，暗黑切换时，自动响应更改文字色值。如果提供了：将强制使用你提供的值，那将不能获得响应变化。
* 完善相关文档教程
## 3.0.3（2022-06-08）
* 文件上上传错误，更正下。
## 3.0.2（2022-06-08）
* tm-overlay 【优化】了背景视觉
* tm-action-menu 【优化】视觉
* tm-checkbox 【优化】取消选中时返回false而不是"",虽然相等但是在强===下是不相等的。
* tm-input 【优化】样式警告信息
* 【新增】tm-chart图表组件，采用了Echarts 5.3.2最新版本，性能更为强劲。注意如果要在nvue平台显示，请创建vue页面展现图表获得更好的性能。同时兼容PC端。
* 【新增】tm-navbar 标题导航栏
* tm-sheet 【优化】兼容vue页面。
* 【微调优化】了暗黑模式下的对比色，使得暗黑模式更具有质感与精致。
* 优化各弹层组件在h5,pc端的底部距离，防止被遮住。
* 【修复】tm-image单独开启预览时，无法预览的bug
* tm-action-menu 【优化】视觉效果，增加磨砂效果
* tm-input【优化】了样式，补齐了投影和渐变这些属性。
* tm-skeleton-line暂时关闭了，闪动效果，在ios nvue上会造成卡钝
* tm-collapse 取消了原有的渐显动画
* tm-picker增加了open打开,close关闭时事件
* tm-button 【优化】设置宽和高的便捷性，宽和高可以任意设置一个，不再强制宽度和高必须同时设置，设置任意一个值时，另一个未设置时将取默认的size值。
* tm-icon 【修复】在定义主题色彩为黑白灰时，切换到暗黑时，未跟随自适应，同时修复一个默认值的bug。
* tm-image 【修复】动态更改地址时，没有正确匹配。
* 【新增】tm-tabbar 底部导航栏
* 【新增】tm-slide-switch 左滑操作栏
## 3.0.1（2022-05-31）
* tm-indexes 【优化】引导层背景在暗黑模式下的背景使其与背景色区分开来。
* tm-message 【优化】其在在暗黑和亮色下的边框显示。修复其在切换暗黑和亮色系后，未跟随切换回亮色系的bug。所有平台增加了背景磨砂效果【安卓原生nvue不支持】。修复其在安卓原生nvue下高度有时失效的问题。
* tm-sheet 【优化】所有平台增加了背景磨砂效果。属性为：blur.设置为true后，自动虚化背景。【安卓原生nvue不支持】,ios原生nvue下是苹果的原生亮系磨砂。其它平台为css渲染的磨砂效果，样式可能有差异。
* tm-modal 【优化】修改了默认宽度，使其占比稍微大一点。
* tm-codeinput 【优化】会导致原生页面卡顿。因此去掉了原生的闪动动画，
* tm-progress 【修复】进度条在绘制圆形或者半圆型时丢失了背景色。
* tm-keyborad [优化]顶部输入文字的大小和背景色。
* tm-calendar 【优化】在暗模式下，周选择的同层背景色。优化了位置样式。
## 3.0.0（2022-05-29）
* 发布第一个3.0.0版本为公测版本
* 如果有遇到问题请提交bug至[Gitee](https://gitee.com/LYTB/tmui-design)
