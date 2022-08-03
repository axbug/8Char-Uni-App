<template>
	<view>
		<!-- #ifndef MP-WEIXIN || MP-ALIPAY || MP-QQ || APP-NVUE -->
		
		<canvas @click="emits('click',$event)" v-if="!isPc" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :id="canvasId" :canvas-id="canvasId" class="canvas"
			:style="{ width: `${_width}rpx`, height: `${_height}rpx` }"></canvas>
			
		<canvas @click="emits('click',$event)" v-if="isPc" :id="canvasId" :canvas-id="canvasId" class="canvas"
			:style="{ width: `${_width}rpx`, height: `${_height}rpx` }"></canvas>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN || MP-ALIPAY || MP-QQ -->
		<canvas @click="emits('click',$event)"  @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" type="2d" id="canvasId" canvas-id="canvasId" class="canvas"
			:style="{ width: `${_width}rpx`, height: `${_height}rpx` }"></canvas>
		<!-- #endif -->
		
		<!-- #ifdef APP-NVUE -->
		<tm-text label="请使用vue页面,不支持nvue页面"></tm-text>
		<gcanvas v-if="false" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"  :id="canvasId" :ref="canvasId" class="canvas"
			:style="{ width: `${_width}rpx`, height: `${_height}rpx` }">
		</gcanvas>
		<!-- #endif -->
		

	</view>
</template>
<script lang="ts" setup>
	/**
	 * Echart图表
	 * @description 使用最新的5.3.2 ，注意不能在nvue上使用，请改用vue页面。已经兼容了pc端
	 * ref:getChart:获取成功渲染的图表。
	 * 事件：onInit:渲染成功后执行，并返回chart对象。
	 * 安装百度图表 npm install echarts --save 后需要作下生产下的兼容，发布不影响，但开发时会报错，很烦。
	 * 请找到：node_modules/echarts/lib/core/echarts.js,
	 * 原文：
	 * 
	 * if (process.env.NODE_ENV !== 'production') {
      var root =
      hasWindow ? window : global;
      defaultRenderer = root.__ECHARTS__DEFAULT__RENDERER__ || defaultRenderer;
      var devUseDirtyRect = root?.__ECHARTS__DEFAULT__USE_DIRTY_RECT__;
      defaultUseDirtyRect = devUseDirtyRect == null ? defaultUseDirtyRect : devUseDirtyRect;
	  
	  改成：
	  * if (process.env.NODE_ENV !== 'production') {
	   var root =
	   hasWindow ? window : global;
	   【修改一】defaultRenderer = root?.__ECHARTS__DEFAULT__RENDERER__ ?? defaultRenderer;
	   【修改二】var devUseDirtyRect = root?.__ECHARTS__DEFAULT__USE_DIRTY_RECT__??null;
	   【修改三】defaultUseDirtyRect = devUseDirtyRect == null ? defaultUseDirtyRect : devUseDirtyRect;
    }
	 */
	import {
		getCurrentInstance,
		computed,
		ref,
		onMounted,
		nextTick,
ComponentInternalInstance,
	} from 'vue';
	import WxCanvas from './canvasinit';
	import * as echarts from "echarts";
	import tmText from "../tm-text/tm-text.vue"
	// import * as echarts from "./simple";
	import {
		optionChartTest
	} from "./option"
	// #ifdef APP-NVUE
	import {
		enable,
		WeexBridge,
	} from '../../tool/gcanvas/index.js';
	// #endif
	const {
		proxy
	} = <ComponentInternalInstance>getCurrentInstance();

	const emits = defineEmits(['onInit','touchStart','touchMove','touchEnd','mousedown','mousemove','mouseup','click'])
	const props = defineProps({
		width: {
			type: Number,
			default: 750
		},
		height: {
			type: Number,
			default: 450
		},
	})
	const canvasId = ref("canvasId")
	// #ifdef H5 || APP-PLUS || APP-VUE
	canvasId.value = "tm" + uni.$tm.u.getUid(1);
	// #endif
	const _width = computed(() => props.width)
	const _height = computed(() => props.height)
	let ctx:UniApp.CanvasContext;
	let chart:echarts.ECharts|null = null
	const pixelRatio = uni.getSystemInfoSync().pixelRatio
	const is2d = ref(false)
	// #ifdef MP-WEIXIN || MP-ALIPAY || MP-QQ 
	is2d.value=true
	// #endif
	const isPc = ref(false)
	
	isPc.value = uni.getSystemInfoSync().deviceType == 'pc'?true:false;
	
	function wrapEvent(e:Event) {
		if (!e) return;
		if (!e.preventDefault) {
			e.preventDefault = function() {};
		}
		return e;
	}
	onMounted(() => {
		
		nextTick(()=>{
			if(is2d.value){
				console.log(66)
				setTimeout(() => MpWeix_init(), 100)
			}else{
				// #ifdef APP-PLUS-NVUE
				// setTimeout(() => drawNvue_init(), 300)
				// #endif
				
				// #ifndef APP-PLUS-NVUE
				setTimeout(() => appvueH5Other(), 50)
				// #endif
			}
		})
		
	})
	//appvue,h5,和其它平台。
	function appvueH5Other() {
		echarts.registerPreprocessor((option:any) => {
			if (option && option.series) {
				if (option.series.length > 0) {
					option.series.forEach((series:echarts.SeriesOption) => {
						series.progressive = 0;
					});
				} else if (typeof option.series === 'object') {
					option.series.progressive = 0;
				}
			}
		});
		ctx = uni.createCanvasContext(canvasId.value, proxy);
		if(!isPc.value){
			const canvas:any = new WxCanvas(ctx, canvasId.value, false,false)
			echarts.setPlatformAPI({createCanvas:() => canvas});
			chart = echarts.init(canvas, "", {
				width: uni.upx2px(_width.value),
				height: uni.upx2px(_height.value),
			});
			canvas.setChart(chart);
		}else{
			const canvasNode = document.querySelector('#'+canvasId.value)?.getElementsByTagName("canvas")[0];
			document.querySelector('#'+canvasId.value)?.removeChild(<HTMLElement>document.querySelector('#'+canvasId.value)?.getElementsByTagName("div")[0])
			ctx = canvasNode.getContext("2d")
			const canvas:any = new WxCanvas(ctx, canvasId.value, false,false)
			chart = echarts.init(<HTMLElement>canvasNode);
			chart.on("mousedown",(e)=>emits('mousedown',e))
			chart.on("mousemove",(e)=>emits('mousemove',e))
			chart.on("mouseup",(e)=>emits('mouseup',e))
			chart.on("mouseover",(e)=>emits('mouseover',e))
		}
		
		emits("onInit",chart)
	}
	//支付宝和微信，QQ 支持2d渲染。
	function MpWeix_init() {
		echarts.registerPreprocessor((option:any) => {
			if (option && option.series) {
				if (option.series.length > 0) {
					option.series.forEach((series:echarts.SeriesOption) => {
						series.progressive = 0;
					});
				} else if (typeof option.series === 'object') {
					option.series.progressive = 0;
				}
			}
		});

		const query = uni.createSelectorQuery().in(proxy)
		query.select('#canvasId')
			.fields({
				node: true,
				size: true
			})
			.exec((res) => {
				const canvasNode = res[0].node
				const ctxvb = canvasNode.getContext('2d')
				canvasNode.width = res[0].width * pixelRatio
				canvasNode.height = res[0].height * pixelRatio
				ctxvb.scale(pixelRatio, pixelRatio)
				ctx = ctxvb;

				const canvas = new WxCanvas(ctx, canvasId.value, true, canvasNode)
				echarts.setCanvasCreator(() => {
					return canvas;
				});

				chart = echarts.init(canvas, null, {
					width: uni.upx2px(_width.value),
					height: uni.upx2px(_height.value),
					devicePixelRatio: pixelRatio
				});

				canvas.setChart(chart);
				emits("onInit",chart)
			})
	}

	function drawNvue_init() {
		/*获取元素引用*/
		var ganvas = proxy.$refs[canvasId.value];
		// console.log(ganvas)
		/*通过元素引用获取canvas对象*/
		var canvasNode = enable(ganvas, {
			bridge: WeexBridge
		});
		ctx = canvasNode.getContext('2d');
		const w = uni.upx2px(_width.value);
		const h = uni.upx2px(_height.value);

		// chart = echarts.init(canvas, null, {
		// 	width: uni.upx2px(_width.value),
		// 	height: uni.upx2px(_height.value)
		// });
		
		// canvas.setChart(chart);
		// chart.setOption(optionChartTest);
	}

	function getChart(){
		return chart;
	}
	
	defineExpose(getChart)

	function compareVersion(v11:string, v22:string) {
		let v1 = v11.split('.')
		let v2 = v22.split('.')
		const len = Math.max(v1.length, v2.length)

		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}

		for (let i = 0; i < len; i++) {
			const num1 = parseInt(v1[i])
			const num2 = parseInt(v2[i])

			if (num1 > num2) {
				return 1
			} else if (num1 < num2) {
				return -1
			}
		}
		return 0
	}

	function touchStart(e:TouchEvent) {
		if (chart && e.touches.length > 0) {
			var touch = e.touches[0];
			var handler = chart.getZr().handler;
			handler.dispatch('mousedown', {
				zrX: touch.x,
				zrY: touch.y
			});
			handler.dispatch('mousemove', {
				zrX: touch.x,
				zrY: touch.y
			});
			handler.processGesture(wrapTouch(e), 'start');
			emits('touchStart',e)
		}
	}

	function touchMove(e:TouchEvent) {
		if (chart && e.touches.length > 0) {
			var touch = e.touches[0];
			var handler = chart.getZr().handler;
			handler.dispatch('mousemove', {
				zrX: touch.x,
				zrY: touch.y
			});
			handler.processGesture(wrapTouch(e), 'change');
			emits('touchMove',e)
		}
	}

	function touchEnd(e:TouchEvent) {
		if (chart) {
			const touch = e.changedTouches ? e.changedTouches[0] : {};
			var handler = chart.getZr().handler;
			handler.dispatch('mouseup', {
				zrX: touch.x,
				zrY: touch.y
			});
			handler.dispatch('click', {
				zrX: touch.x,
				zrY: touch.y
			});
			handler.processGesture(wrapTouch(e), 'end');
			emits('touchEnd',e)
		}
	}

	function wrapTouch(event:TouchEvent) {
		for (let i = 0; i < event.touches.length; ++i) {
			const touch = event.touches[i];
			touch.offsetX = touch.x;
			touch.offsetY = touch.y;
		}
		return event;
	}
</script>
