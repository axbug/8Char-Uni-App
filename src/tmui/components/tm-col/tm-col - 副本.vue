<template>
	<view v-if="colWidth" class="flex flex-col" :style="[{ width: colWidth+'px' }]">
		<view
		:style="[
			TmRowGutter?{marginLeft:`${TmRowGutter}rpx`,marginRight:`${TmRowGutter}rpx`}:'',
			props.height?{height:props.height+'rpx'}:'',
			!transprent  ? tmcomputed.backgroundColorCss : '',
			{alignItems:alignComputed,justifyContent:'center'},
			customCSSStyle
		]"
		:class="[customClass]"
		><slot name="default" :data="{width:colWidth,height:props.height}"></slot></view>
	</view>
	
</template>

<script lang="ts" setup>
	/**
	 * 单元格
	 * @description 必须配置tmRow使用。否则报错。
	 */
	import { getCurrentInstance, computed, ref, provide, inject , onUpdated, onMounted, onUnmounted, nextTick ,watch } from 'vue';
	import { cssstyle, tmVuetify,colorThemeType } from '../../tool/lib/interface';
	import { custom_props, computedTheme, computedClass, computedStyle, computedDark } from '../../tool/lib/minxs';
	import { useTmpiniaStore } from '../../tool/lib/tmpinia';
	const store = useTmpiniaStore();
	const props = defineProps({
	  ...custom_props,
	  height: {
	  	type: [Number, String],
	  	default: 0
	  },
	  span: {
	  	type: Number,
	  	default: 2
	  },
	  color:{
	  	type:String,
	  	default:'white'
	  },
	  transprent:{
	  	type: [Boolean,String],
	  	default: false
	  },
	  align:{
	  	type:String,
	  	default:'center',//'start' | 'center' | 'end' 
	  },
	});
	const emits = defineEmits(['click']);

	// 设置响应式全局组件库配置表。
	const tmcfg = computed<tmVuetify>(() => store.tmStore);
	//自定义样式：
	const customCSSStyle = computed(()=>computedStyle(props));
	//自定类
	const customClass = computed(()=>computedClass(props));
	//是否暗黑模式。
	const isDark = computed(() => computedDark(props, tmcfg.value));
	//计算主题
	const tmcomputed = computed<cssstyle>(() => computedTheme(props, isDark.value));
	const TmRowWidth = inject('TmRowWidth')
	const TmRowColumn = inject('TmRowColumn')
	const TmRowGutter = inject('TmRowGutter')
	const colWidth = computed(()=>{
		return Math.ceil(TmRowWidth.value / TmRowColumn.value * Number(props.span))
	})
	const span_rp = computed(()=>{
		if(!props.span) return '100%';
		return (props.span/TmRowColumn.value * 100) + '%';
	})
	//横向对齐方式
	enum justifyAlign {
		start = "flex-start",
		end = "flex-end",
		center = "center",
	}
	const alignComputed = computed(()=>justifyAlign[props.align])
	// 设置响应式主题文字色。
	let textColor = computed(() => tmcomputed.value.textColor);
	provide("appTextColor", textColor);
</script>

