<template>
	<view :style="{ width: `${props.width}rpx`, height: `${props.height}rpx` }">
		<!-- #ifdef APP-NVUE -->
		<!-- <gcanvas
      v-if="show"
      :id="canvasId"
      :ref="canvasId"
      class="canvas"
      :style="{ width: `${tmcvOpts.width}rpx`, height: `${tmcvOpts.height}rpx` }"
    >
    </gcanvas> -->
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN || MP-ALIPAY || MP-QQ -->
		<canvas :height="tmcvOpts.height" :width="tmcvOpts.width" type="2d" id="canvasId" canvas-id="canvasId"
			class="canvas" :style="{ width: `${props.width}rpx`, height: `${props.height}rpx` }"></canvas>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN || MP-ALIPAY || MP-QQ || APP-NVUE -->
		<canvas :height="tmcvOpts.height" :width="tmcvOpts.width" :id="canvasId" :canvas-id="canvasId" class="canvas"
			:style="{ width: `${props.width}rpx`, height: `${props.height}rpx` }"></canvas>
		<!-- #endif -->
	</view>
</template>

<script lang="ts" setup>
	/**
 * render为画面绘制组件
 * @description 可以通过render组件对canvas组件进行操作并绘制相关内容。
 */
	import { getCurrentInstance, onUnmounted, ref, onMounted, reactive } from "vue";
	import { tmCv } from "./tmCv/index";
	
	const emits = defineEmits(["onInit", "touchend", "touchstart", "touchmove"]);
	const proxy = getCurrentInstance()?.proxy ?? null;
	const props = defineProps({
		width: {
			type: Number,
			default: 750,
		},
		height: {
			type: Number,
			default: 500,
		},
	});

	const canvasId = ref("canvasId");
	const tmcvOpts = reactive({
		left: 0,
		top: 0,
		width: uni.upx2px(props.width),
		height: uni.upx2px(props.height),
	});

	/** 获取tmcv对象 */
	async function getTmCv(){
		if(!proxy) return null;
		const tmcv = new tmCv(proxy, canvasId.value, { width: tmcvOpts.width, height: tmcvOpts.height })
		await tmcv.init();
		return tmcv
	}

defineExpose({ getTmCv });
</script>

<style></style>