type fetchConfigResponseType= "arraybuffer"|"text";
type fetchConfigDataType = "json"|"text";
type fetchConfigMethod= "GET"|"POST"|"PUT"|"DELETE"|"CONNECT"|"HEAD"|"OPTIONS"|"TRACE";

interface fetchConfigSuccessType{
    data:object|string|ArrayBuffer,
    statusCode:number,
    header:object,
    cookies:Array<string>
}
interface fetchConfig {
    url?:string,
    data?:object|string|ArrayBuffer,
    header?:object,
    method?:fetchConfigMethod,
    timeout?:number,
    dataType?:fetchConfigDataType,
    responseType?:fetchConfigResponseType,
    sslVerify?:boolean,
    withCredentials?:boolean,
    firstIpv4?:boolean,
    success?:Function,
    fail?:Function,
    complete?:Function
}
type openUrlType = "navigate"|"redirect"|"reLaunch"|"switchTab"|"navigateBack"
declare interface Uni{
    /**
     * tmui3.0 函数库，更多请访问https://tmui.design
     */
    $tm:tmUtil
}


type tmUtil = {
    //pagejson下的pages配置。
	pages:Array<{path:string,custom:'custom'|'default'}>,
	//pagejson下的配置。
	tabBar:{
		color: string,
		selectedColor: string,
		borderStyle: string,
		backgroundColor: string,
	},
    /**
     * 判断是否是颜色值
     * @param color 颜色值
     */
    isColor(color:string):boolean,
    /**
     * 国际化
     * @param key 关键字
     * @return 语言值
     */
    language(key:string):string,
    fetch:{
        /**
         * GET请求
         * @param url 请求地址
         * @param data 请求的数据
         * @param opts 请求的配置
         * @help https://tmui.design/doc/JSTool/fetch.html
         */
        get(url:string,data:object,opts:fetchConfig):Promise<UniApp.GeneralCallbackResult>,
        /**
         * POST请求
         * @param url 请求地址
         * @param data 请求的数据
         * @param opts 请求的配置
         * @help https://tmui.design/doc/JSTool/fetch.html
         */
        post(url:string,data:object,opts:fetchConfig):Promise<UniApp.GeneralCallbackResult>,
        /**
         * 自定义请求
         * @param cog 请求的配置
         * @param beforeFun 请求前执行的函数
         * @param afterFun 请求后执行的函数
         * @param complete 请求完成的函数
         * @help https://tmui.design/doc/JSTool/fetch.html
         */
        request(cog:fetchConfig,beforeFun?:Function,afterFun?:Function,complete?:Function):Promise<UniApp.GeneralCallbackResult>,
    },
    /**
     * 快捷工具
     */
    u:{
        /**
        * 预览图片。
        * @param {Object} url 必填 当前预览的图片链接。
        * @param {Object} list 可以是url数组，也可以是对象，数据比如：["http:url"] or [{url:"https:url",...}]
        * @param {Object} rangKey 如果list是对象数组，需要提供url字段。
        */
        preview(url:string,list?:Array<string>,rangKey?:string):void,
        /**
        * 数据分组
        * @param {Array} oArr - 原数组列表
        * @param {Number} length - 单个数组长度
        * @return {Array}  arr - 分组后的新数组
        */
        splitData(oArr:Array<any>,length:number):Array<any>,
        
        /**
        * 剩余时间格式化
        * @param {Number} t - 剩余多少秒
        * @return {Object}  format - 格式后的天时分秒对象
        */
        timeMuch(t:number):string,
        /**
         * 获取时间距离当前时间
         * @param timestamp 当前时间
         * @return 返回比如：不久前，1年前这样的格式文本
         */
        getDateToNewData(timestamp?:number|string|Date):string,
        /**
        * 打电话
        * @param {String<Number>} phoneNumber - 数字字符串
        * @return Promise<boolean>
        */
        callPhone(phoneNumber:string):Promise<boolean|any>,
        /**
         * 调起客户端相机扫码。
         * @param {Boolean} onlyFromCamera true 是否只允许相机扫码识别
         * @param {Array<string>} scanType ['barCode', 'qrCode', 'datamatrix','datamatrix']
         * @returns Promise 成功返回相关数据结构
         */
        scanCode(onlyFromCamera:boolean, scanType:Array<any>):Promise<UniApp.ScanCodeSuccessRes|string>,
        /**
         * 设置剪切板内容。
         * @param {String} data 
         * @returns Promise true/false
         */
        setClipboardData(data:string):Promise<boolean|string>,
        /**
         * 获取剪切板内容
         * @returns Promise 剪切板内容
         */
        getClipboardData():Promise<string|boolean>,
        /**
         * 设置cookie数据
         * @param {String} key 键值
         * @param {String} data 值
         * @returns Boolean
         */
        setCookie(key:string, data:any):boolean,
        /**
         * 删除一个本地cookie
         * @param {String} key 键值
         * @returns Boolean
         */
        delCookie(key:string):boolean,
        /**
         * 获取一个cookie数据
         * 如果存入的是对象，返回的也是对象。如果是string返回的也是字符串。
         * @param {String} key 键
         * @returns json/string
         */
        getCookie(key:string):Object|string,
        /**
         * 向地址连接追加参数。
         * @param {string} uri 网址
         * @param {string} key 字段
         * @param {string} value 字段值
         * @returns 网址
         */
        httpUrlAddKey(uri:string, key:string, value:string):string,
        /**
         * 取url参数
         * @param {string} uri 网址
         * @param {string} key 字段
         * @returns string|undefined
         */
        getQueryString(url:string,key:string):string,
        /**
             * 取得唯一标识id
             * @param length 标识长度
             */
            getUid (length:number):number,
            /**
             * 防抖
             * 防抖原理：在一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
             * @param {Function} func 要执行的回调函数
             * @param {Number} wait 延迟的时间
             * @param {Boolean} immediate 是否要立即执行
         */
            debounce(func:Function, wait?:number, immediate?:boolean):void,
            /**
         * 节流
         * 节流原理：在一定时间内，只能触发一次
         * @param {Function} func 要执行的回调函数 
         * @param {Number} wait 延时的时间
         * @param {Boolean} immediate 是否立即执行
         * @return void
         */
            throttle(func:Function, wait?:number, immediate?:boolean,timer?:number,flags?:boolean):void,
            /**
             * 深度克隆
             * @param obj Object 
             */
            deepClone (obj:any):Object,
            quereyDom(t:any,node:string):any,
            /**
             * 是否是手机号码
             * @param phone 号码
             * @returns Boolean
             */
            isPhone(phone:string|number):boolean,
            /**
             * 是否含有中文
             * @param s 字符串
             * @returns Boolean
             */
            isChina(s:string):boolean,
            /**
             * 是否为空
             * @description 判断是否是null,对象是否为空，数组是否为空。是否为 undefaind，是否为 “”空字符串。
             * @param s 任意
             */
            isEmpty(s:any):boolean,
            /**
             * 是否邮箱
             * @param s 字符串
             * @returns Boolean
             */
            isEmail(s:string):boolean,
            /**
             * 是否身份证号
             * @param val 字符号或者数字
             * @returns Boolean
             * @author https://cloud.tencent.com/developer/article/1114323
             */
            isIdCard (val:string|number):boolean,
            /**
             * 是否车牌
             * @description 蓝牌5位，绿牌6位。
             * @param s 字符串
             * @returns Boolean
             */
            isIdCar(s:string):boolean,
            /**
             * 纯数字密码验证
             * @param s 字符串或者数字
             * @param len 最小长度，默认6
             * @param maxLen 最大长度，默认20
             * @returns Boolean
             */
            isPasswordOfNumber(s:number|string,le:number,maxLen:number):boolean,
            /**
             * 密码验证
             * @param s 字符串或者数字
             * @param len 最小长度，默认6
             * @param maxLen 最大长度，默认20
             * @param model 0数字和英文，1数字，英文必须包含，不允许有特殊字符，2数字和字母必须包含，可以有特殊字符。
             * @returns Boolean
             */
            isPasswordOfOther(s:string|number,len:number,maxLen:number,model:number):boolean,
            /**
             * 是否是一个有效的日期
             * @param s 字符串，数字，日期对象
             * @returns Boolean
             */
            isDate(s:string|number|Date):boolean,
            /**
             * 显示信息
             * @param word 标题
             * @param mask 不允许穿透
             * @param icon 图标
             */
            toast(word:string,mask:boolean,icon:any):void,
			/**
			 * 获取屏幕窗口安全高度和宽度
			 * 注意是针对种屏幕的统一计算，统一高度，不再让uni获取有效高度而烦恼。
			 * 请一定要在onMounted或者onLoad中调用，否则不准确在h5端。
			 * @return {height,width}
			 */
			getWindow():{width:number,height:number,top:number},

            /**
             * 打开页面路径
             * @param url string 打开的页面路径
             * @param type openUrlType "navigateTo"|"redirectTo"|"reLaunch"|"switchTab"
             */
            routerTo(url:string,type:openUrlType):void
            
    }
}
