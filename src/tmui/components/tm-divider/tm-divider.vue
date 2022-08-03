<template>
	<view>
		<view v-if="!props.label || props.vertical"
			:style="[tmcomputed.borderCss, props.vertical ? { width: '0px', height: props.height + 'rpx' } : '']"
			:class="[props.vertical ? `mx-${props.margin[0]}` : `my-${props.margin[1]}`]"></view>
		<view v-if="label && !props.vertical" class="flex flex-row flex-center">
			<view :style="[tmcomputed ? { backgroundColor: (props.realColor?tmcomputed.color:tmcomputed.border), height: props.border + 'rpx' } : '']"
				:class="[`my-${props.margin[1]}`, align == 'left' ? 'flex-2' : '', align == 'right' ? 'flex-10' : '', align == 'center' ? 'flex-1' : '']">
			</view>
			<view :class="[(isDark ? 'opacity-4' : '')]">
				<tm-text :fontSize="26" :dark="isDark" :followTheme="props.followTheme" :color="props.fontColor"
					:label="props.label" :_class="['mx-32']"></tm-text>
			</view>
			<view :style="[tmcomputed ? { backgroundColor:(props.realColor?tmcomputed.color:tmcomputed.border), height: props.border + 'rpx' } : '']"
				:class="[`my-${props.margin[1]}`, align == 'left' ? 'flex-10' : '', align == 'right' ? 'flex-2' : '', align == 'center' ? 'flex-1' : '']">
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
/**
 * 分割线
 * @description 分割线，带文本标签，提供左，中，右文本标签。
 */
import {
	getCurrentInstance,
	computed,
	ref,
	provide,
	inject
} from "vue";
import { tmVuetify } from "../../tool/lib/interface";
import {
	custom_props,
	computedTheme,
	computedDark,
} from "../../tool/lib/minxs";
import { useTmpiniaStore } from '../../tool/lib/tmpinia';
const store = useTmpiniaStore();
import tmText from "../tm-text/tm-text.vue";
// 混淆props共有参数
const props = defineProps({
	...custom_props,
	color: {
		type: String,
		default: 'grey-3'
	},
	fontColor:{
		type: String,
		default: 'grey-1'
	},
	vertical: {
		type: [Boolean],
		default: false
	},
	height: {
		type: [Number, String],
		default: 26
	},
	label: {
		type: String,
		default: ''
	},
	align: {
		type: String,
		default: 'center' //left,right,center
	},
	margin: {
		type: Array,
		default: () => [16, 24]
	},
	border: {
		type: [Number],
		default: 1
	},
	//使用原始颜色为线条色，而不使用计算过的颜色值。
	realColor:{
		type: [Boolean],
		default: false
	}
});
//线的方向。
const borderDir = computed(() => props.vertical ? 'left' : 'bottom');
const {
	proxy
} = getCurrentInstance();
// 设置响应式全局组件库配置表。
const tmcfg = computed<tmVuetify>(() => store.tmStore);
//自定义样式：
//const customCSSStyle = computedStyle(props);
//自定类
//const customClass = computedClass(props);
//是否暗黑模式。

// props_cust.value.borderDirection=borderDir.value
const isDark = computed(() => computedDark({ ...props, borderDirection: borderDir.value }, tmcfg.value));
//计算主题
const tmcomputed = computed(() => computedTheme({ ...props, borderDirection: borderDir.value }, isDark.value,tmcfg.value));
</script>

<style>
</style>
