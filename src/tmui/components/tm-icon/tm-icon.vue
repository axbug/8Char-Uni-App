<template>
	<view :render-whole="true" class="flex flex-row flex-row-center-center" :style="[{
		marginRight: custom_space_size[0] + 'rpx',
		marginBottom: custom_space_size[1] + 'rpx'
	}]">
		<!-- #ifndef APP-NVUE -->
		<text @click="clickhandle" @longpress="emits('longpress', $event)"
			:class="[spinComputed ? 'spin' : '', 'text-size-n d-inline-block', 'tmicon ', prefx, iconComputed, customClass]"
			:style="[fontSizeComputed, { color: textColor }, customCSSStyle]" v-if="!isImg"></text>
		<!-- #endif  -->
		<!-- #ifdef APP-NVUE-->
		<text :render-whole="true" ref="icon" @click="clickhandle" @longpress="emits('longpress', $event)"
			:class="[spinComputed ? 'spin' : '', 'text-size-n d-inline-block ', 'tmicon', customClass]"
			:style="[{ fontFamily: 'tmicon', color: textColor }, fontSizeComputed, customCSSStyle]" v-if="!isImg">
			{{ iconComputed }}
		</text>
		<!-- #endif  -->
		<image :render-whole="true" @click="clickhandle" @longpress="emits('longpress', $event)" ref="icon" v-if="isImg"
			:src="iconComputed" :class="[spinComputed ? 'spin' : '', customClass]"
			:style="[{ width: (props.fontSize || 30) + props.unit, height: (props.fontSize || 30) + props.unit }, customCSSStyle]">
		</image>
	</view>
</template>
<script lang="ts" setup>
/**
 * 图标
 * @description 图标，提供了一个spin功能用于自动旋转图标在Nvue中使用原生动画。
 */

import { getCurrentInstance, computed, ref, provide, inject, onMounted, onUnmounted, nextTick, watch, onBeforeMount } from 'vue';
import theme from "../../tool/theme/theme";
import { cssstyle, tmVuetify, colorThemeType } from '../../tool/lib/interface';
import { custom_props, computedTheme, computedClass, computedStyle, computedDark } from '../../tool/lib/minxs';
import { useTmpiniaStore } from '../../tool/lib/tmpinia';
// #ifdef APP-NVUE || APP-PLUS-NVUE
import fontList from '../../tool/tmicon/iconfont.json';
import { tmiconFont } from './tmicon';
var domModule = weex.requireModule('dom');
const Binding = uni.requireNativePlugin('bindingx');
// #endif
const store = useTmpiniaStore();
// 混淆props共有参数
const props = defineProps({
	...custom_props,
	label: {
		type: String,
		default: ''
	},
	fontSize: {
		type: [Number],
		default: 34
	},
	color: {
		type: String,
		default: ''
	},
	name: {
		type: String, //图标名称。
		default: ''
	},
	spin: {
		type: [Boolean],
		defalut: true
	},
	unit: {
		type: String,
		default: 'rpx'
	},
	//-1表示自动
	lineHeight:{
		type: [Number],
		default: -1
	}
});

const emits = defineEmits(['click', 'longpress']);
const { proxy } = getCurrentInstance();
// 设置响应式全局组件库配置表。
const tmcfg = computed<tmVuetify>(() => store.tmStore);
//自定义样式：
const customCSSStyle = computed(() => computedStyle(props));
//自定类
const customClass = computed(() => computedClass(props));
//是否暗黑模式。
const isDark = computed(() => computedDark(props, tmcfg.value));
//计算主题
const tmcomputed = computed<cssstyle>(() => computedTheme(props, isDark.value,tmcfg.value));
// 点击文字事件。
function clickhandle(e: Event): void {
	emits('click', e);
}
//从父应用组件中获取自动文字色。
const appTextColor = inject("appTextColor", computed(() => undefined));
const textColor = computed(() => {
	if (props.followTheme && store.tmStore.color) return store.tmStore.color;
	let isColorHex = theme.isCssColor(props.color);
	//如果当前是自定义颜色值，直接返回。
	if (isColorHex) return props.color;
	//如果定义了颜色，但不是值，而是主题色，则返回对应的主题文本色。
	if (props.color && !isColorHex) {
		let nowcolor: colorThemeType = theme.getColor(props.color);

		return nowcolor.csscolor;
	}
	if (appTextColor.value) return appTextColor.value;
	return 'rgba(34, 34, 34, 1.0)';
});
//图标大小。
const fontSizeComputed = computed(() => {
	// #ifdef H5
	if (props.fontSize < 24 && props.unit == 'rpx') return { 
		transform: 'scale(0.8)', fontSize: (props.fontSize || 30) + props.unit ,
		lineHeight:props.lineHeight>-1?props.lineHeight + props.unit:(props.fontSize || 30) + props.unit
		};
	// #endif
	return { fontSize: (props.fontSize || 30) + props.unit,lineHeight:props.lineHeight>-1?props.lineHeight + props.unit:(props.fontSize || 30) + props.unit };
});
//图标前缀
const prefx = computed(() => {
	let prefix = props.name.split('-')[0];
	return prefix;
});
//图标名称。
const iconComputed = computed(() => {
	// #ifdef APP-NVUE

	let name = props.name.substr(props.name.indexOf('-') + 1)

	let itemIcon = fontList.glyphs.find((item, index) => {
		return item.font_class == name;
	});
	if (itemIcon) {
		return JSON.parse('"\\u' + String(itemIcon.unicode) + '"');
	}
	// #endif
	return props.name;
});

//当前图标是否是图片。
const isImg = computed(() => {
	if (
		props.name[0] == '.' ||
		props.name[0] == '/' ||
		props.name.substring(0, 5) == 'data:' ||
		props.name.substring(0, 4) == 'http' ||
		props.name.substring(0, 5) == 'https' ||
		props.name.substring(0, 3) == 'ftp'
	) {
		return true;
	}
	return false;
});
//是否使图标旋转。
const spinComputed = computed(() => props.spin);
//间隙排列。
const custom_space_size = inject('custom_space_size', [0, 0]);
//图标的宽度和高度
const iconWidth = computed(() => parseInt(props.fontSize || 34) + custom_space_size[0]);
const iconHeight = computed(() => parseInt(props.fontSize || 34) + custom_space_size[1]);
// nvue旋转动画的token
const bindxToken = ref(null);
function getEl(el) {
	if (typeof el === 'string' || typeof el === 'number') return el;
	if (WXEnvironment) {
		return el.ref;
	} else {
		return el instanceof HTMLElement ? el : el.$el;
	}
}
function spinNvueAni() {
	if (!proxy.$refs['icon']) return;
	let icon = getEl(proxy.$refs.icon);
	let icon_bind = Binding.bind(
		{
			eventType: 'timing',
			exitExpression: 't>1200',
			props: [
				{
					element: icon,
					property: 'transform.rotate',
					expression: 'linear(t,0,360,1200)'
				}
			]
		},
		function (res) {
			if (res.state === 'exit') {
				spinNvueAni();
			}
			bindxToken.value = res.token;
		}
	);
}
watch(spinComputed, () => {
	// #ifdef APP-PLUS-NVUE
	Binding.unbindAll();
	if (val) {
		nextTick(function () {
			spinNvueAni();
		});
	}
	// #endif
});
onBeforeMount(() => {
	// #ifdef APP-PLUS-NVUE
	domModule.addRule('fontFace', {
		fontFamily: 'tmicon', //注意这里必须是驼峰命名，跟上面的css样式对照
		src: "url('data:font/ttf;charset=utf-8;base64," + tmiconFont + "')"
	});
	// #endif
})
onMounted(() => {
	// #ifdef APP-PLUS-NVUE
	if (spinComputed.value) {
		spinNvueAni();
	}
	// #endif
});
onUnmounted(() => {
	// #ifdef APP-PLUS-NVUE
	if (bindxToken.value) {
		Binding.unbind({
			token: bindxToken.value,
			eventType: 'timing'
		});
	}
	// #endif
});
</script>

<style scoped="scoped">
/* #ifndef APP-PLUS-NVUE */
.spin {
	transform-origin: 50% 50%;
	animation: xhRote 1.2s infinite linear;
}

@keyframes xhRote {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

/* #endif */
</style>
