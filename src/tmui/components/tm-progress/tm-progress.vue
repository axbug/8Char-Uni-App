<template>
	<view class="flex flex-col">

		<view v-if="model == 'line'" :style="[{ width: width + 'rpx', paddingTop: '16rpx', paddingBottom: '16rpx' }]"
			class=" flex relative flex flex-col overflow  ">
			<view class="relative">
				<tm-sheet no-level :round="props.round" 
					:followTheme="false" :dark="props.dark" :margin="[0, 0]" :width="props.width"
					:height="props.height" :color="props.bgColor" :padding="[0, 0]">
				</tm-sheet>
			</view>
			<view class="absolute l-0 tmRogress overflow " :style="[{ width: activeWidth + 'rpx', top: 16 + 'rpx' }]">
				<tm-sheet :round="props.round" :followTheme="props.followTheme" :dark="props.dark" :margin="[0, 0]"
					:linear="props.linear" :linearDeep="props.linearDeep" :width="activeWidth" :height="props.height"
					:color="props.color" :padding="[0, 0]">
				</tm-sheet>
			</view>
			<view v-if="props.showBar" class="absolute l-0 t-0  tmRogress flex flex-col" :style="[
				{ width: activeWidth + 'rpx', height: (props.height + 32) + 'rpx', 'align-items': 'flex-end', 'justify-content': 'center' }
			]">
				<slot>
					<tm-sheet :linear="props.linear" :linearDeep="props.linearDeep" :followTheme="props.followTheme"
						:dark="props.dark" :color="props.color" :margin="[0, 0]" :padding="[12, 4]" :round="4">
						<tm-text _class="text-size-xxs" :fontSize="22" :label="props.percent + props.percentSuffix">
						</tm-text>
					</tm-sheet>
				</slot>
			</view>
		</view>
		<view v-if="model == 'circle'"
			:style="{ width: `${props.width}rpx`, height: `${props.semicircle ? props.width / 2 + 16 : props.width}rpx` }"
			class="flex  relative flex-col">
			<!-- #ifdef APP-NVUE -->
			<gcanvas :id="canvasId" :ref="canvasId" class="canvas"
				:style="{ width: `${props.width}rpx`, height: `${props.semicircle ? props.width / 2 + 16 : props.width}rpx` }">
			</gcanvas>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN || MP-ALIPAY || MP-QQ -->
			<canvas type="2d" id="canvasId" canvas-id="canvasId" class="canvas"
				:style="{ width: `${props.width}rpx`, height: `${props.semicircle ? props.width / 2 + 16 : width}rpx` }"></canvas>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN || MP-ALIPAY || MP-QQ || APP-NVUE -->
			<canvas :id="canvasId" :canvas-id="canvasId" class="canvas"
				:style="{ width: `${props.width}rpx`, height: `${props.semicircle ? props.width / 2 + 16 : props.width}rpx` }"></canvas>
			<!-- #endif -->
			<!-- #ifndef APP-NVUE -->
			<cover-view :style="[
				{ width: `${props.width}rpx`, height: `${props.semicircle ? props.width / 2 + 16 : props.width}rpx` },
				props.semicircle && props.semicircleFlip ? { 'justify-content': 'flex-start', 'align-items': 'center' } : '',
				props.semicircle && !props.semicircleFlip ? { 'justify-content': 'flex-end', 'align-items': 'center' } : '',
			
			]" class="relative absolute l-0 t-0 flex flex-col" :class="[!props.semicircle ? 'flex-center' : '']">
				<cover-view :style="[{ fontSize: props.fontSize + 'rpx', color: isDark ? darkcolor : txtcolor }]">
					{{ props.percent + props.percentSuffix }}</cover-view>
			</cover-view>
			<!-- #endif -->
			<!-- #ifdef APP-NVUE -->
			<cover-view :style="[
				{ width: `${props.width}rpx`, height: `${props.semicircle ? props.width / 2 + 16 : props.width}rpx` },
				props.semicircle && props.semicircleFlip ? { 'justify-content': 'flex-start', 'align-items': 'center' } : '',
				props.semicircle && !props.semicircleFlip ? { 'justify-content': 'flex-end', 'align-items': 'center' } : '',
			]" class="relative absolute l-0 t-0 flex flex-col" :class="[!props.semicircle ? 'flex-center' : '']">
				<tm-text :color="props.color" :followTheme="props.followTheme" :dark="props.dark"
					:fontSize="props.fontSize" :label="props.percent + props.percentSuffix"></tm-text>
			</cover-view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script lang="ts" setup>
/**
 * 进度条
 * @description 进度条，圆形进度条，在不同的平台使用2d或者webgl方法，使得性能更加强劲。NVUE中貌似是uniapp的插件bug无法实现渐变绘制。
 * Nvue中需要在manifest.json中设置canvas模块，才能打包详见：https://github.com/dcloudio/NvueCanvasDemo
 */
import { cssstyle, tmVuetify, colorThemeType } from '../../tool/lib/interface';
import { custom_props, computedDark, computedTheme } from '../../tool/lib/minxs';
import { getCurrentInstance, computed, ref, provide, inject, onUpdated, onMounted, onUnmounted, nextTick, watch } from 'vue';
import tmSheet from "../tm-sheet/tm-sheet.vue";
import tmText from "../tm-text/tm-text.vue";
import tool from '../../tool/theme/theme'
import { useTmpiniaStore } from '../../tool/lib/tmpinia';
// #ifdef APP-NVUE 
import {
	enable,
	WeexBridge,
} from '../../tool/gcanvas/index.js';
// #endif
const store = useTmpiniaStore();
const emits = defineEmits(['update:percent', 'change'])
const { proxy } = getCurrentInstance();
const vnodeCtx = proxy
const props = defineProps({
	...custom_props,
	model: {
		type: String,
		default: 'line' //line,circle
	},
	//model==circle,是否是半圆。
	semicircle: {
		type: [Boolean, String],
		default: false,
	},
	//model==circle有效,半圆正常是在上方。如果反转就在下方。
	semicircleFlip: {
		type: [Boolean, String],
		default: false,
	},
	//model==circle有效
	fontSize: {
		type: [Number, String],
		default: 28
	},
	//进度 百分比数值，不带%号。也可以使用v-model:percent
	percent: {
		type: Number,
		default: 0
	},
	//数值后缀。默认为%
	percentSuffix: {
		type: String,
		default: '%'
	},
	width: {
		type: Number,
		default: 120
	},
	height: {
		type: Number,
		default: 6
	},
	bgColor: {
		type: String,
		default: 'grey-3'
	},
	color: {
		type: String,
		default: 'primary'
	},
	//是否跟随全局主题的变换而变换
	followTheme: {
		type: [Boolean, String],
		default: true
	},
	//暗黑
	dark: {
		type: [Boolean],
		default: false
	},
	linear: {
		type: [String],
		default: '', //left:右->左，right:左->右。top:下->上，bottom:上->下。
	},
	// 渐变的亮浅
	linearDeep: {
		type: [String],
		default: 'light', //light,dark,accent亮系渐变和深色渐变。
	},
	round: {
		type: [Number, String],
		default: 3
	},
	//显示数值点
	showBar: {
		type: [Boolean, String],
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	}
})
const canvasId = ref("canvasId")
// #ifndef MP-WEIXIN || MP-ALIPAY || MP-QQ
canvasId.value = "tm" + uni.$tm.u.getUid(5);
// #endif
let ctx:UniApp.CanvasContext;
const shadow_pr = computed(() => props.shadow * 4)
// 设置响应式全局组件库配置表。
const tmcfg = computed<tmVuetify>(() => store.tmStore);
//是否暗黑模式。
const isDark = computed(() => computedDark(props, tmcfg.value));
//计算主题
const tmcomputed = computed<cssstyle>(() => computedTheme(props, isDark.value,tmcfg.value));

const _bgColor = computed(()=>computedTheme({...props,color:props.bgColor,followTheme:false}, isDark.value,tmcfg.value).backgroundColor)
const txtcolor = tool.getColor(props.color).value;
const darkcolor = tmcomputed.value.backgroundColor
const activeWidth = computed(() => {
	let pr = props.percent >= 100 ? 100 : props.percent
	let w = Math.floor(pr / 100 * props.width)
	w = w >= props.width ? props.width : w;
	return w;
})
const percent_rp = computed(() => {
	let pr = props.percent >= 100 ? 100 : props.percent
	return pr;
})
watch(() => props.percent, (val) => {
	if (props.disabled) return;
	// #ifdef APP-NVUE ||  MP-WEIXIN || MP-ALIPAY || MP-QQ
	drawNvue_draw();
	// #endif
	// #ifndef MP-WEIXIN || MP-ALIPAY || MP-QQ || APP-NVUE
	appvueH5Other();
	// #endif
	let newval = val >= 100 ? 100 : val;
	newval = newval <= 0 ? 0 : newval;
	emits("update:percent", newval)
	emits("change", newval)
})
onMounted(() => {
	nextTick(function () {
		
		// #ifdef APP-NVUE
		setTimeout(()=>drawNvue_init(),300)
		// #endif
		// #ifdef MP-WEIXIN || MP-ALIPAY || MP-QQ
		setTimeout(()=>MpWeix_init(),100)
		// #endif
		// #ifndef MP-WEIXIN || MP-ALIPAY || MP-QQ || APP-NVUE
		setTimeout(()=>appvueH5Other(),50)
		// #endif
		

	})
})

//appvue,h5,和其它平台。
function appvueH5Other() {
	if (props.model != 'circle') return;
	ctx = uni.createCanvasContext(canvasId.value, vnodeCtx);

	otherDraw();
}
//支付宝和微信，QQ 支持2d渲染。
function MpWeix_init() {
	if (props.model != 'circle') return;
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
			ctx = ctxvb;
			drawNvue_draw();
		})
}
function drawNvue_init() {
	if (props.model != 'circle') return;
	/*获取元素引用*/
	var ganvas = vnodeCtx.$refs[canvasId.value];
	/*通过元素引用获取canvas对象*/
	var canvasObj = enable(ganvas, {
		bridge: WeexBridge
	});
	ctx = canvasObj.getContext('2d');
	drawNvue_draw();
}

//其它平台的绘制使用 webgl
function otherDraw() {
	if (props.model != 'circle') return;
	let width = uni.upx2px(props.width);
	let center = {
		x: width / 2,
		y: width / 2,
		r: width / 2 - uni.upx2px(props.height) / 2 - 4 - uni.upx2px(shadow_pr.value)
	};
	if (props.semicircle && props.semicircleFlip) {
		center = {
			x: width / 2,
			y: 6,
			r: width / 2 - uni.upx2px(props.height) / 2 - 4 - uni.upx2px(shadow_pr.value)
		};
	}

	let c = tmcomputed.value

	let bgColor =_bgColor.value;

	let activeColor = tool.getColor(props.color).csscolor;
	let strokeWidth = uni.upx2px(props.height);
	//先绘制背景圆;
	ctx.setLineWidth(strokeWidth)
	ctx.setStrokeStyle(bgColor)
	ctx.setLineCap('round')
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 0;
	ctx.shadowColor = "rgba(255,255,255,0)";
	ctx.beginPath();
	if (props.semicircle) {
		ctx.arc(center.x, center.y, center.r, -Math.PI, 0, props.semicircleFlip);
	} else {
		ctx.arc(center.x, center.y, center.r, 0, 2 * Math.PI, props.semicircleFlip);
	}
	ctx.stroke();
	ctx.closePath();
	ctx.save()
	//绘制进度半圆。
	let blv = Math.PI / 50;
	let jinduo = (percent_rp.value - 25) * blv
	if (props.semicircle) {
		let base = percent_rp.value / 2;
		let rpp = base >= 50 ? 50 : base
		jinduo = (rpp - 50) * blv
		if (props.semicircleFlip) {
			jinduo = -jinduo
		}
	}
	
	// ctx.clearRect(0, 0, props.width, props.width)
	//如果是渐变
	if (props.linear) {
		var gradient = ctx.createLinearGradient(props.width / 2, 0, props.width / 2, props.width);
		gradient.addColorStop(0, c.gradientColor[0]);
		gradient.addColorStop(1, c.gradientColor[1]);
		ctx.strokeStyle = gradient;
		ctx.setStrokeStyle(gradient)
		ctx.shadowColor = c.gradientColor[0];
	} else {
		ctx.setStrokeStyle(activeColor)
		ctx.shadowColor = activeColor;
	}
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = uni.upx2px(shadow_pr.value);

	
	ctx.beginPath();

	if (props.semicircle) {
		ctx.arc(center.x, center.y, center.r, -Math.PI, jinduo, props.semicircleFlip);
	} else {
		ctx.arc(center.x, center.y, center.r, -Math.PI / 2, jinduo, props.semicircleFlip);
	}
	ctx.stroke();
	ctx.closePath();
	ctx.restore()
	ctx.draw(true)
}

function drawNvue_draw() {
	if (props.model != 'circle') return;
	let width = uni.upx2px(props.width);
	let center = {
		x: width / 2,
		y: width / 2,
		r: width / 2 - uni.upx2px(props.height / 2) - 4 - uni.upx2px(shadow_pr.value) * 2
	};
	if (props.semicircle && props.semicircleFlip) {
		center = {
			x: width / 2,
			y: 6,
			r: width / 2 - uni.upx2px(props.height) / 2 - 4 - uni.upx2px(shadow_pr.value) * 2
		};
	}

	let c = tmcomputed.value;
	let bgColor =_bgColor.value||"#f5f5f5";

	let activeColor = tool.getColor(props.color).csscolor||"#ff0000";
	let strokeWidth = uni.upx2px(props.height);

	//先绘制背景圆;
	ctx.lineWidth = strokeWidth;

	ctx.strokeStyle = bgColor;
	ctx.lineCap = "round";
	ctx.beginPath();
	if (props.semicircle) {
		ctx.arc(center.x, center.y, center.r, -Math.PI, 0, props.semicircleFlip?true:false);
	} else {
		ctx.arc(center.x, center.y, center.r, 0, 2 * Math.PI, props.semicircleFlip?true:false);
	}
	ctx.stroke();
	ctx.closePath();
	// #ifdef APP-NVUE
	ctx.clearRect(0, 0, props.width, props.width)
	// #endif
	// ctx.clearRect(0, 0, props.width, props.width)
	ctx.save()
	//绘制进度半圆。
	let blv = Math.PI / 50;
	let jinduo = (percent_rp.value - 25) * blv

	if (props.semicircle) {
		let base = percent_rp.value / 2;
		let rpp = base >= 50 ? 50 : base
		jinduo = (rpp - 50) * blv

		if (props.semicircleFlip) {
			jinduo = -jinduo
			jinduo = jinduo >= Math.PI ? Math.PI - 0.00001 : jinduo
			jinduo = jinduo >= Math.PI ? Math.PI - 0.00001 : jinduo
		}

	}
	// #ifdef MP-WEIXIN || MP-ALIPAY || MP-QQ
	//如果是渐变
	if (props.linear) {
		var gradient = ctx.createLinearGradient(props.width / 2, 0, props.width / 2, props.width);
		gradient.addColorStop(0, c.gradientColor[0]);
		gradient.addColorStop(1, c.gradientColor[1]);
		ctx.strokeStyle = gradient;
		ctx.fillStyle = gradient;
		ctx.shadowColor = c.gradientColor[0];
	} else {
		ctx.strokeStyle = activeColor;
		ctx.shadowColor = activeColor;
	}
	// #endif
	// #ifdef APP-NVUE
	ctx.strokeStyle = activeColor;
	// #endif
	ctx.strokeStyle = activeColor;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = shadow_pr.value;
	ctx.beginPath();
	if (props.semicircle) {
		ctx.arc(center.x, center.y, center.r, -Math.PI, jinduo, props.semicircleFlip);
	} else {
		ctx.arc(center.x, center.y, center.r, -Math.PI / 2, jinduo, props.semicircleFlip);
	}
	ctx.stroke();
	ctx.closePath();
	ctx.restore()
	// #ifdef APP-NVUE
	ctx.draw()
	// #endif
}



</script>
<style>
.tmRogress {
	transition-duration: 0.5s;
	transition-timing-function: ease-in-out;
	transition-property: width;
}
</style>
