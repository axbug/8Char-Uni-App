import {fetchConfigMethod} from "@/tmui/tool/lib/interface";

interface Response {
	code: number;
	msg: string;
	data: any[] | Object | String | null;
}

export const APP_API = (import.meta.env.VITE_API_URL||"https://api.app.yxbug.cn") + "/api"

export const Post = (url:string, param:any, host:string) => {
	return Request(url, "POST", param, host)
}

export const Get = (url:string, param:any, host:string) => {
	return Request(url, "GET", param, host)
}

export const Request = (url:string, method:fetchConfigMethod, param:any, host:string) => {
	return new Promise(async (cback, reject) => {
		uni.request({
			url: host + url,
			data: param,
			method: method,
			header: {},
		}).then(async response => {
			const status = response.statusCode.toString();
			const result = response.data

			if (status.charAt(0) == 2) {
				cback(result.data);
			} else {
					const msg = result.msg ? result.msg : '网络请求异常!'
					uni.$tm.u.toast(msg)
					reject(result)
			}
		}).catch(err => {
			reject(err)
		})
	})
}
