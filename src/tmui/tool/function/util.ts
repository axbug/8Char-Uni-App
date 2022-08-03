
// #ifdef H5
// var clipboardJS = require( from ''./clipboardJS'');
// import clipboardJS from './clipboardJS'
// #endif
import {ComponentInternalInstance} from 'vue'
/**
 * 预览图片。
 @param {Object} url 必填 当前预览的图片链接。
 @param {Object} list 可以是url数组，也可以是对象，数据比如：["http:url"] or [{url:"https:url",...}]
 @param {Object} rangKey 如果list是对象数组，需要提供url字段。
 */
import {preview} from "./preview.js"
export default preview;
/**
* 数据分组
* @param {Array} oArr - 原数组列表
* @param {Number} length - 单个数组长度
* @return {Array}  arr - 分组后的新数组
*/
export function splitData(oArr:Array<any> = [], length = 1) {
	let arr:Array<any> = [];
	let minArr:Array<any> = [];
	oArr.forEach(c => {
		if (minArr.length === length) {
			minArr = [];
		}
		if (minArr.length === 0) {
			arr.push(minArr);
		}
		minArr.push(c);
	});

	return arr;
}

/**
* 剩余时间格式化
* @param {Number} t - 剩余多少秒
* @return {Object}  format - 格式后的天时分秒对象
*/
export function timeMuch(t:number) {
	let format:any = {
		d: '00',
		h: '00',
		m: '00',
		s: '00'
	};
	if (t > 0) {
		let d = Math.floor(t / 86400);
		let h = Math.floor((t / 3600) % 24);
		let m = Math.floor((t / 60) % 60);
		let s = Math.floor(t % 60);
		format.d = d < 10 ? '0' + d : d;
		format.h = h < 10 ? '0' + h : h;
		format.m = m < 10 ? '0' + m : m;
		format.s = s < 10 ? '0' + s : s;
	}
	return format;
}
//获取时间距离当前时间
export function getDateToNewData(timestamp:number|string|Date = new Date().getTime()){
	if(typeof timestamp == 'string'){
		timestamp = new Date(timestamp).getTime();
	}
	
	 // 补全为13位
	 var arrTimestamp:Array<string> = (timestamp + '').split('');
	 for (var start = 0; start < 13; start++) {
		 if (!arrTimestamp[start]) {
			 arrTimestamp[start] = '0';
		 }
	 }
	 timestamp = Number(arrTimestamp.join(''))* 1;
 
	 var minute = 1000 * 60;
	 var hour = minute * 60;
	 var day = hour * 24;
	 var halfamonth = day * 15;
	 var month = day * 30;
	 var now = new Date().getTime();
	 var diffValue = now - timestamp;
 
	 // 如果本地时间反而小于变量时间
	 if (diffValue < 0) {
		 return '不久前';
	 }
	 // 计算差异时间的量级
	 var monthC = diffValue / month;
	 var weekC = diffValue / (7 * day);
	 var dayC = diffValue / day;
	 var hourC = diffValue / hour;
	 var minC = diffValue / minute;
 
	 // 数值补0方法
	 var zero = function (value:number) {
		 if (value < 10) {
			 return '0' + value;
		 }
		 return value;
	 };
 
	 // 使用
	 if (monthC > 12) {
		 // 超过1年，直接显示年月日
		 return (function () {
			 var date = new Date(timestamp);
			 return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
		 })();
	 } else if (monthC >= 1) {
		 return parseInt(monthC+'') + "月前";
	 } else if (weekC >= 1) {
		 return parseInt(weekC+'') + "周前";
	 } else if (dayC >= 1) {
		 return parseInt(dayC+'') + "天前";
	 } else if (hourC >= 1) {
		 return parseInt(hourC+'') + "小时前";
	 } else if (minC >= 1) {
		 return parseInt(minC+'') + "分钟前";
	 }
	 return '刚刚'; 
}

/**
* 打电话
* @param {String<Number>} phoneNumber - 数字字符串
* @return {Promise}
*/
export function callPhone(phoneNumber = '') {
	let num = phoneNumber.toString()
	return new Promise((rs,rj)=>{
		uni.makePhoneCall({
			phoneNumber: num,
			success:()=> rs(true),
			fail:(err)=> rj(err)
		});
	})
}

/**
 * 调起客户端相机扫码。
 * @param {Boolean} onlyFromCamera true 是否只允许相机扫码识别
 * @param {Array<string>} scanType ['barCode', 'qrCode', 'datamatrix','datamatrix']
 * @returns Promise 成功返回相关数据结构
 */
 export function scanCode(onlyFromCamera = true, scanType = ['barCode', 'qrCode', 'datamatrix','datamatrix']):Promise<string|UniApp.ScanCodeSuccessRes>{
	// #ifdef H5
	return Promise.reject('不支持H5');
	// #endif
	return new Promise((rs,rj)=>{
		uni.scanCode({
			onlyFromCamera: onlyFromCamera,
			scanType: scanType,
			success: (res) => rs(res),
			fail:(error)=>rj(error)
		});
	})
}

/**
 * 设置剪切板内容。
 * @param {String} data 
 * @returns Promise true/false
 */
 export function setClipboardData(data:string):Promise<string|boolean>{

	// #ifndef H5
	return new Promise((rs,rj)=>{
		uni.setClipboardData({
			data: data,
			success:()=>rs(true),
			fail:(error)=>rj(error)
		});
	})
	// #endif
	// #ifdef H5
	return new Promise((rs,rj)=>{
		let btn = document.createElement('button');
		btn.style.display = 'none';
		btn.className='hi-test-hi';
		document.body.appendChild(btn);
		clipboardJS = clipboardJS.bind(window);
		let cb = new clipboardJS('.hi-test-hi', {
			text: () => data
		})
		
		cb.on('success', function (res) {
			rs(true);
		})
		cb.on('error', function (err) {
			rj(err)
		})
		btn.click = btn.click.bind(window.document.body.querySelector('.hi-test-hi'))
		btn.click()
	})
	// #endif
}
/**
 * 获取剪切板内容
 * @returns Promise 剪切板内容
 */
 export function getClipboardData():Promise<boolean|string>{
	// #ifndef H5
	return new Promise((rs, rj) => {
		uni.getClipboardData({
			success: (res) => rs(res.data),
			fail: (error) => rj(error)
		});
	})
	// #endif
	// #ifdef H5
	return Promise.reject('H5无法获取剪切板内容')
	// #endif
}

/**
 * 设置cookie数据
 * @param {String} key 键值
 * @param {String} data 值
 * @returns Boolean
 */
 export function setCookie(key:string, data:any) {
	try {
		uni.setStorageSync(key, data);
		return true;
	} catch (e) {
		return false;
	}
}
/**
 * 删除一个本地cookie
 * @param {String} key 键值
 * @returns Boolean
 */
 export function delCookie(key:string) {
	try {
		uni.removeStorageSync(key);
		return true;
	} catch (e) {
		return false;
	}
}

/**
 * 获取一个cookie数据
 * 如果存入的是对象，返回的也是对象。如果是string返回的也是字符串。
 * @param {String} key 键
 * @returns json/string
 */
 export function getCookie(key:string) {
	try {
		const value = uni.getStorageSync(key);
		try {
			let val = JSON.parse(value)
			return val;
		} catch (e) {
			return value;
		}
	} catch (e) {
		return undefined;
	}
}


/**
 * 向地址连接追加参数。
 * @param {string} uri 网址
 * @param {string} key 字段
 * @param {string} value 字段值
 * @returns 
 */
 export function httpUrlAddKey(uri:string, key:string, value:string) {
	if (!value) {
		return uri;
	}
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = uri.indexOf("?") !== -1 ? "&" : "?";
	if (uri.match(re)) {
		return uri.replace(re, "$1" + key + "=" + value + "$2");
	} else {
		return uri + separator + key + "=" + value;
	}
}
/**
 * 取url参数
 * @param {string} uri 网址
 * @param {string} key 字段
 * @returns string
 */
export function getQueryString(url:string,key:string):string {
  var query_string = url.substring(url.indexOf("?")); 
  if (!query_string) return "";
  var re = /[?&]?([^=]+)=([^&]*)/g;
  var tokens:any;
  while (tokens = re.exec(query_string)) {
    if (decodeURIComponent(tokens[1]) === key) {
      return decodeURIComponent(tokens[2]);
	  break;
    }
  }
  return "";
}

export function getUid (length=12){
	
	return Number(Number(Math.random().toString().substr(3,length) + Date.now()).toString(8));
}

/*
防抖
防抖原理：在一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
	@param {Function} func 要执行的回调函数
	@param {Number} wait 延迟的时间
	@param{Boolean} immediate 是否要立即执行
*/
var timeout= getUid(1)
export function debounce(func:Function, wait = 500, immediate = false) {
  // 清除定时器
  if (timeout !== null) clearTimeout(timeout);
  // 立即执行，此类情况一般用不到
  if (immediate) {
    var callNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, wait);
    if (callNow) typeof func === "function" && func();
  } else {
    // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
	timeout = getUid(1);
    timeout = setTimeout(() => {
      typeof func === "function" && func();
    }, wait);
  }
}

/**
 * 节流
	节流原理：在一定时间内，只能触发一次
 * @param {Function} func 要执行的回调函数 
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
export function throttle(func:Function, wait = 500, immediate = true,timer=85688,flag=false) {
	if (immediate) {
		if (!flag) {
			flag = true;
			// 如果是立即执行，则在wait毫秒内开始时执行
			typeof func === 'function' && func();
			timer = setTimeout(() => {
				flag = false;
			}, wait);
		}
	} else {
		if (!flag) {
			flag = true
			// 如果是非立即执行，则在wait毫秒内的结束处执行
			timer = setTimeout(() => {
				flag = false
				typeof func === 'function' && func();
			}, wait);
		}
		
	}
};


// 深度克隆
export function deepClone (obj:any) {
	// 对常见的“非”值，直接返回原来值
	if([null, undefined, NaN, false].includes(obj)) return obj;
    if(typeof obj !== "object" && typeof obj !== 'function') {
		//原始类型直接返回
        return obj;
    }
    var o:any = Array.isArray(obj) ? [] : {};
    for(let i in obj) {
        if(obj.hasOwnProperty(i)){
            o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
        }
    }
    return o;
}

export function quereyDom(t:ComponentInternalInstance,node:string){
	// #ifdef APP-NVUE
	const dom:any = uni.requireNativePlugin('dom')
	return new Promise((res,rej)=>{
		setTimeout(function(){
			node = node.replace(/#\./g,'')
			
			dom.getComponentRect(t.refs[node], function(el:any) {
				res(el.size);
			})
		},60)
	})
	// #endif
	// #ifndef APP-NVUE
	return new Promise((res,rej)=>{
		const query = uni.createSelectorQuery().in(t);
		query.select(node).boundingClientRect(el => {
			res(el);
		}).exec();
	})
	// #endif
}

/**
 * 是否是手机号码
 * @param phone 号码
 * @returns Boolean
 */
export function isPhone(phone:string|number){
	let val = String(phone);
	let reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
	return !!val.match(reg);
}

/**
 * 是否含有中文
 * @param s 字符串
 * @returns Boolean
 */
 export function isChina(s:string){
	var patrn=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
	return !!patrn.exec(s);
}

/**
 * 是否为空
 * @description 判断是否是null,对象是否为空，数组是否为空。是否为 undefaind，是否为 “”空字符串。
 * @param s 任意
 */
export function isEmpty(s:any){
	if(typeof s === 'string'){
		s = s.trim();
	}
	if(s=="") return true
	if(s==null) return true;
	if(typeof s === 'undefined') return true;
	if(Array.isArray(s)){
		if(s.length==0) return true;
	}
	if(typeof s ==='object'){
		if(Object.keys(s).length==0) return true;
	}
	return false;
}
/**
 * 是否邮箱
 * @param s 字符串
 * @returns Boolean
 */
export function isEmail(s:string){
	let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	return !!s.match(reg);
}
/**
 * 是否身份证号
 * @param val 字符号或者数字
 * @returns Boolean
 * @author https://cloud.tencent.com/developer/article/1114323
 */
export function isIdCard (val:string|number) {
	val = String(val)
    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
    var code = val.substring(17);
    if(p.test(val)) {
        var sum:number = 0;
        for(var i=0;i<17;i++) {
			let id:number|string|any = val[i]
            sum += id*factor[i];
        }
        if(parity[sum % 11] == code.toUpperCase()) {
            return true;
        }
    }
    return false;
}
/**
 * 是否车牌
 * @description 蓝牌5位，绿牌6位。
 * @param s 字符串
 * @returns Boolean
 */
export function isIdCar(s:string){
	let reg = /^[京|沪|津|渝|鲁|冀|晋|蒙|辽|吉|黑|苏|浙|皖|闽|赣|豫|湘|鄂|粤|桂|琼|川|贵|云|藏|陕|甘|青|宁|新|港|澳|台|新|使]{1}[A-Z]{1}[A-Z_0-9]{5,6}$/
	return !!s.match(reg);
}

/**
 * 纯数字密码验证
 * @param s 字符串或者数字
 * @param len 最小长度，默认6
 * @param maxLen 最大长度，默认20
 * @returns Boolean
 */
export function isPasswordOfNumber(s:number|string,len=6,maxLen=20){
	s = String(s);
	let reg = new RegExp(`^[0-9]{${len},${maxLen}}$`)
	return !!s.match(reg)
}

/**
 * 密码验证
 * @param s 字符串或者数字
 * @param len 最小长度，默认6
 * @param maxLen 最大长度，默认20
 * @param model 0数字和英文，1数字，英文必须包含，不允许有特殊字符，2数字和字母必须包含，可以有特殊字符。
 * @returns Boolean
 */
export function isPasswordOfOther(s:string|number,len=6,maxLen=20,model=0){
	s = String(s);
	//密码至少包含 数字和英文，长度6-20
	let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
	//密码包含 数字,英文,字符中的两种以上，长度6-20
	if(model===1){
		reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/
	}

	//至少包含数字跟字母，可以有字符
	if(model===2){
		reg = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/
	}

	return !!s.match(reg)
}

/**
 * 是否是一个有效的日期
 * @param s 字符串，数字，日期对象
 * @returns Boolean
 */
export function isDate(s:string|number|Date){
	if(s==null||typeof s === 'undefined' || !s) return false;
	if(typeof s ==='string'){
		//兼容ios,mac
		s = s.replace('-','/');
	}
	let d = new Date(s);
	if(d.toString() == 'Invalid Date') return false;
	return true;
}
/**
 * 显示信息
 * @param word 标题
 * @param mask 不允许穿透
 * @param icon 图标
 */
export function toast(word:string,mask:boolean=true,icon:any='none'){
	uni.showToast({
		mask:mask,
		title:word,
		icon:icon
	})
}
/**
 * 获取屏幕窗口安全高度和宽度
 * 注意是针对种屏幕的统一计算，统一高度，不再让uni获取有效高度而烦恼。
 * 请一定要在onMounted或者onLoad中调用，否则不准确在h5端。
 * @return {height,width}
 */
export function getWindow(){
	let appsys = uni.getWindowInfo();
	const sysinfo = uni.getSystemInfoSync();
	let top =0;
	let height = appsys.windowHeight;
	let nowPage = getCurrentPages().pop()
	let isCustomHeader = false;
	for(let i=0;i<uni.$tm.pages.length;i++){
		if(nowPage?.route==uni.$tm.pages[i].path&&uni.$tm.pages[i].custom=='custom'){
			isCustomHeader = true;
			break;
		}
	}
	// #ifdef H5
	if (isCustomHeader) {
		height = sysinfo.windowHeight+44
	}else{
		top = 44
	}
	// #endif
	
	// #ifdef APP-NVUE 
	if(!isCustomHeader){
		if(sysinfo.osName=="android"){
			height = appsys.safeArea.height - 44 - appsys.safeAreaInsets.bottom
		}else{
			height = appsys.safeArea.height - 44
		}
	}else{
		height= appsys.safeArea.height + appsys.statusBarHeight + appsys.safeAreaInsets.bottom
	}
	// #endif
	// #ifdef APP-VUE 
	if(!isCustomHeader){
		height = appsys.safeArea.height - 44
	}else{
		height = appsys.safeArea.height + appsys.statusBarHeight + appsys.safeAreaInsets.bottom
	}
	// #endif
	return {height:height,width:appsys.windowWidth,top:top};
}
type openUrlType = "navigate"|"redirect"|"reLaunch"|"switchTab"|"navigateBack"
/**
 * 
 * @param url string 打开的页面路径
 * @param type openUrlType "navigate"|"redirect"|"reLaunch"|"switchTab"|"navigateBack"
 */
export function routerTo(url:string,type:openUrlType='navigate'){
	type openUrlTypeFun = "navigateTo"|"redirectTo"|"reLaunch"|"switchTab"|"navigateBack"
	let funType = {
		navigate:"navigateTo",
		redirect:"redirectTo",
		switchTab:"switchTab",
		reLaunch:"reLaunch",
		navigateBack:"navigateBack",
	}
	let fun= <openUrlTypeFun>funType[type];
	uni[fun]({
		url:url,
		fail(result) {
			console.error(result)
		},
	})
}