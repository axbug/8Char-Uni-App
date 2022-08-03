<template>
	<view :style="{ width: `${_width}rpx`, height: `${_height}rpx` }">
		<!-- #ifdef APP-NVUE -->
		<gcanvas :id="canvasId" :ref="canvasId" class="canvas"
			:style="{ width: `${_width}rpx`, height: `${_height}rpx` }">
		</gcanvas>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN || MP-ALIPAY || MP-QQ -->
		<canvas type="2d" id="canvasId" canvas-id="canvasId" class="canvas"
			:style="{ width: `${_width}rpx`, height: `${_height}rpx` }"></canvas>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN || MP-ALIPAY || MP-QQ || APP-NVUE -->
		<canvas :id="canvasId" :canvas-id="canvasId" class="canvas"
			:style="{ width: `${_width}rpx`, height: `${_height}rpx` }"></canvas>
		<!-- #endif -->
	</view>
</template>

<script lang="ts" setup>
	/**
	 * 二维码
	 * @description 这是一个二维码组件，属性多，可以生成非常个性化的组件哦~
	 * 如果想知道生成的属性请查看：qrOpts类型属性。
	 * 更改任意属性，都将会导致重绘
	 */
	import {getCurrentInstance, computed, ref, provide, inject, onUpdated, onMounted, onUnmounted, nextTick, watch } from 'vue';


	// #ifdef APP-NVUE
	import {
		enable,
		WeexBridge,
	} from '../tm-progress/gcanvas/index.js';
	// #endif
	const { proxy } = getCurrentInstance();
	const props = defineProps({
		width:{
			type:Number,
			default:750
		},
		height:{
			type:Number,
			default:500
		}
		
	})
	const vnodeCtx = proxy
	const canvasId = ref("canvasId")
	// #ifndef MP-WEIXIN || MP-ALIPAY || MP-QQ
	canvasId.value = "tm" + uni.$tm.u.getUid(5);
	// #endif
	let ctx = null

	const _width = computed(()=>props.width)
	const _height = computed(()=>props.height)
	
	onMounted(() => {
		nextTick(async function () {
			await init();
		})
	})
	
	watch(()=>props.option,()=>{
		if(!ctx){
			// init().then(()=>)
		}else{
			
			
		}
	},{deep:true})
	function init(){
		return new Promise((res,rej)=>{
			setTimeout(async function () {
				// #ifdef APP-NVUE
				ctx = await drawNvue_init();
				// #endif
				// #ifdef MP-WEIXIN || MP-ALIPAY || MP-QQ
				ctx = await MpWeix_init();
				// #endif
				// #ifndef MP-WEIXIN || MP-ALIPAY || MP-QQ || APP-NVUE
				ctx = await appvueH5Other();
				// #endif
				res()
			}, 150)
		})
	}
	//appvue,h5,和其它平台。
	function appvueH5Other() {
		return Promise.resolve(uni.createCanvasContext(canvasId.value, vnodeCtx))
	}
	//支付宝和微信，QQ 支持2d渲染。
	function MpWeix_init() {
		return new Promise((resolve,rej)=>{
			const query = uni.createSelectorQuery().in(vnodeCtx)
			query.select('#canvasId')
				.fields({
					node: true,
					size: true
				})
				.exec((res) => {
					const canvas = res[0].node
					const ctxvb = canvas.getContext('2d')
					const dpr = uni.getSystemInfoSync().pixelRatio
					canvas.width = res[0].width * dpr
					canvas.height = res[0].height * dpr
					ctxvb.scale(dpr, dpr)
					resolve(ctxvb)
				})
		})
	}
	function drawNvue_init() {
		/*获取元素引用*/
		var ganvas = vnodeCtx.$refs[canvasId.value];
		/*通过元素引用获取canvas对象*/
		var canvasObj = enable(ganvas, {
			bridge: WeexBridge
		});
		return canvasObj.getContext('2d')
	}
	
</script>

<style>
</style>