<template>
	<view
		ref="tmRow"
		@click.stop="emits('click',$event)"
		class="flex tm-row " 
		:class="['overflow ', `round-${props.round}`, customClass,`mx-${props.margin[0]} my-${margin[1]}`]"
		:style="[
			{flexDirection: 'row',flexWrap: 'wrap'},
			props.height ? { height: props.height + 'rpx' } : '',
			width_px_rect?{ width:(width_px_rect) + 'rpx' }:'',
			{justifyContent:justify_rp,alignItems:align_rp},
			!props.transprent  ? tmcomputed.backgroundColorCss : '',
			!props.transprent ? tmcomputed.shadowColor : '',
			customCSSStyle
		]"
	>
		<slot></slot>
		
	</view>
	
	
</template>

<script lang="ts" setup>
	/**
	 * 布局row
	 * @description 布局，必须配合tmCol，采用flex布局。必须在class上写flex-x，x=[1,12]
	 * row和col为了高性能，和兼容全平台，全部使用flex布局，因此用起来可能有点不方便。但这是值得的。
	 * 如果row设定了宽度，子col将会自动设定宽度。此时如果要切换，必须设定column列数。
	 * @example 例子中演示了col套入row时，如何让col中的row进行自动100%宽度。切换不可直接写宽度100%,请使用专用类来编写。
	 * <tm-row >
			<tm-col class="flex-1">1</tm-col>
			<tm-col class="flex-1">1</tm-col>
			<tm-col class="flex-1 " _class="flex-row flex">
				<tm-row class="flex-12 fulled">
					<tm-col v-for="item in 3" :key="item" class="flex-1">1</tm-col>
				</tm-row>
			</tm-col>
		</tm-row>
	 */
	import { getCurrentInstance, computed, ref, provide, inject , onUpdated, onMounted, onUnmounted, nextTick ,watch, PropType  } from 'vue';
	import { cssstyle, tmVuetify,colorThemeType } from '../../tool/lib/interface';
	import { custom_props, computedTheme, computedClass, computedStyle, computedDark } from '../../tool/lib/minxs';
	import { useTmpiniaStore } from '../../tool/lib/tmpinia';
	type justifyAlignType = "start"|"end"|"center"|"around"|"between"
	type AlignAlignType = "start"|"end"|"center"|"stretch"
	const store = useTmpiniaStore();
	// #ifdef APP-PLUS-NVUE
		const dom = uni.requireNativePlugin('dom')
	// #endif
	const props = defineProps({
	  ...custom_props,
	 height: {
	 	type: [Number, String],
	 	default: 0
	 },
	 margin:{
		 type:Array as PropType<Array<number>>,
		 default:()=>[0,0]
	 },
	 width: {
	 	type: [Number, String],
	 	default: 0,
	 },
	 round: {
	 	type: [Number, String],
	 	default: 0
	 },
	 //单元格之间的间距
	 gutter: {
	 	type: Number,
	 	default: 0
	 },
	 //总列数。
	 column:{
	 	type: Number,
	 	default: 10
	 },
	 //横向排列
	 justify:{
	 	type:String as PropType<justifyAlignType>,
	 	default:'start',//'start' | 'center' | 'end' | 'around' | 'between'
	 },
	 //纵向排列
	 align:{
	 	type:String as PropType<AlignAlignType>,
	 	default:'center',//'start' | 'center' | 'end' | 'stretch'
	 },
	 color: {
	 	type: String,
	 	default: 'white'
	 },
	});
	const emits = defineEmits(['click']);
	const { proxy} = getCurrentInstance();
	// 设置响应式全局组件库配置表。
	const tmcfg = computed<tmVuetify>(() => store.tmStore);
	//自定义样式：
	const customCSSStyle = computed(()=>computedStyle(props));
	//自定类
	const customClass = computed(()=>computedClass(props));
	//是否暗黑模式。
	const isDark = computed(() => computedDark(props, tmcfg.value));
	//计算主题
	const tmcomputed = computed<cssstyle>(() => computedTheme(props, isDark.value,tmcfg.value));
	
	//宽度，
	const width_px_rect = computed(()=>props.width)
	const width_px_rect_rp = computed(()=>width_px_rect.value)
	//横向对齐方式
	const justifyAlign ={
		start:"flex-start",
		end: "flex-end",
		center:"center",
		around:"space-around",
		between:"space-between",
	}
	const justify_rp = computed(()=>justifyAlign[props.justify]||'start')
	const AlignAlign = {
		start:"flex-start",
		end:"flex-end",
		center:"center",
		stretch:"stretch",
	}
	const align_rp = computed(()=>AlignAlign[props.align]||'start')
	function wxmpGetRect() {
		if(props.width){
			return 
		}
		uni.createSelectorQuery()
			.in(proxy)
			.select('.tm-row')
			.boundingClientRect()
			.exec(function(res) {
				width_px_rect.value = res[0].width;
			});
	}
	function nvueGetRect(){
		if(props.width){
			return 
		}
		// #ifdef APP-PLUS-NVUE
		try {
			nextTick(function() {
				dom.getComponentRect(proxy.$refs.tmRow, function(res) {
					width_px_rect.value = res.size.width;
				})
			})
		} catch (e) {
			//TODO handle the exception
		}
		// #endif
	}
	//对col子组件暴露数据。
	provide('TmRowWidth',width_px_rect_rp);//微信端面使用
	provide('TmRowColumn',computed(()=>props.column)) ;
	provide('TmRowGutter',computed(()=>props.gutter));
	// 设置响应式主题文字色。
	let textColor = computed(() => tmcomputed.value.textColor);
	provide("appTextColor", textColor);
	
	

</script>

<style></style>
