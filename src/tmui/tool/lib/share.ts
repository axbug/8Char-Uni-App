/**
 * 分享配置
 */
import {onShareAppMessage,onShareTimeline} from "@dcloudio/uni-app"
import { wxshareConfig } from "./interface"
export const share = function (args:wxshareConfig={}) {
	let defaultWxshareConfig:wxshareConfig = {
		...args
	}
	const sapp = (args:wxshareConfig={})=>{
		onShareAppMessage(()=>{
			return {...defaultWxshareConfig,...args}
		})
		
	}
	const sTimeline = (args:wxshareConfig={})=>{
		onShareTimeline((args:wxshareConfig={})=>{
			return {...defaultWxshareConfig,...args}
		})
	}
	
	return {
		onShareAppMessage:sapp,
		onShareTimeline:sTimeline
	}
}