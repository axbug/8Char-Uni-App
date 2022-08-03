<template>
	<view>
		<view class="statusHeight" :style="{height:_barHeight+'px'}"></view>
		<view class="fixed l-0 t-0 statusHeightTop flex" :style="{width:_width+'px',height:_barHeight+'px'}">
			<tm-sheet
				@click="emits('click', $event)"
				:blur="_blur"
				:color="props.color"
				:_class="_class"
				:_style="_style"
				:followTheme="props.followTheme"
				:dark="props.dark"
				:round="props.round"
				:shadow="props.shadow"
				:outlined="props.outlined"
				:border="props.border"
				:borderStyle="props.borderStyle"
				:borderDirection="props.borderDirection"
				:text="props.text"
				:transprent="props.transprent"
				:linear="props.linear"
				:linearDeep="props.linearDeep"
				:margin="props.margin"
				:padding="props.padding"
				:height='_barHeight'
				:width="_width"
				unit='px'
			>
				<view class="statusHeight" :style="{height:statusBarHeight+'px'}"></view>
				
				<view class="flex flex-row flex-1 flex-row flex-row-center-betweent ">
					<view class="flex-row flex flex-row-center-start pl-24" :style="{width:_leftWidth+'rpx'}">
						<tm-icon :unit="props.unit" :font-size="props.iconFontSize" _class="pointer" :color="_homeColor" @click="goback" v-if="_pages>1&&props.hideBack" name="tmicon-angle-left"></tm-icon>
						<tm-icon :unit="props.unit" _class="pointer" @click="backhome" v-if="_pages==1&&!hideHome" :color="_homeColor" :font-size="props.iconFontSize" name="tmicon-md-home"></tm-icon>
						<slot name="left"></slot>
					</view>
					<view class=" flex flex-row-center-center" :style="{width:contentwidth+'px'}">
						<slot>
							<tm-text :unit="props.unit" _class="text-weight-b text-overflow-1" :color="_fontColor" :font-size="props.fontSize" :label="_title"></tm-text>
						</slot>
					</view>
					<view class="flex-row flex flex-row-center-end  pr-24" :style="{width:_rightWidth+'rpx'}">
						<slot name="right"></slot>
					</view>
				</view>
			</tm-sheet>
		</view>
	</view>
</template>
<script lang="ts" setup>
	/**
	 * 标题栏
	 * @description 页面自定标题栏，时，请务必放置在页面的最顶部。
	 */
	import tmSheet from "../tm-sheet/tm-sheet.vue";
	import tmText from "../tm-text/tm-text.vue";
	import tmIcon from "../tm-icon/tm-icon.vue";
	import {
		custom_props,
	} from '../../tool/lib/minxs';
	import { getCurrentInstance, computed, ref, provide, inject , onUpdated, onMounted, onUnmounted, nextTick ,watch, PropType } from 'vue';
	import { useTmpiniaStore } from '../../tool/lib/tmpinia';
	const store = useTmpiniaStore();
	const emits = defineEmits(['click','close'])
	const {proxy} = getCurrentInstance();
	const props = defineProps({
		...custom_props,
		followTheme:{
			type:[Boolean,String],
			default:true
		},
		transprent:{
			type: [Boolean,String],
			default: false
		},
		color:{
			type: [ String],
			default: 'white'
		},
		text:{
			type: [ Boolean],
			default: false
		},
		border: {
			type: [Number],
			default: 0
		},
		shadow: {
			type: [Number],
			default: 1
		},
		borderDirection:{
			type:String,
			default:"bottom"
		},
		round: {
			type: [Number],
			default: 0
		},
		margin: {
			type:Array as PropType<Array<number>>,
			default: () => [0, 0]
		},
		padding: {
			type:Array as PropType<Array<number>>,
			default: () => [0, 0]
		},
		height:{
			type: [Number],
			default: 44
		},
		//指两边，左宽度除了中间，中间标题宽度为自动
		leftWidth:{
			type: [Number],
			default: 220
		},
		//指两边，左宽度除了中间，中间标题宽度为自动
		rightWidth:{
			type: [Number],
			default: 220
		},
		fontSize:{
			type: [Number],
			default: 30
		},
		iconFontSize:{
			type: [Number],
			default: 37
		},
		title:{
			type: [String],
			default: "标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题"
		},
		//默认为自动，提供了，将强制使用本主题色。
		fontColor:{
			type: [String],
			default: ""
		},
		homeColor:{
			type: [String],
			default: ""
		},
		hideHome:{
			type:Boolean,
			default:false
		},
		hideBack:{
			type:Boolean,
			default:true
		},
		//返回首页的路径，默认/pages/index/index
		homePath:{
			type: [String],
			default: "/pages/index/index"
		},
		beforeBack:{
			type:[Boolean,Function],
			default:()=>true
		},
		blur:{
			type:Boolean,
			default:false
		},
		unit:{
			type:String,
			default:"rpx"
		}
	})

	const _height = computed(()=>props.height)
	const _width = uni.getSystemInfoSync().windowWidth
	const statusBarHeight = uni.getSystemInfoSync().statusBarHeight
	const _barHeight = computed(()=>statusBarHeight+_height.value)
	const _leftWidth = computed(()=>props.leftWidth)
	const _rightWidth = computed(()=>props.rightWidth)
	const contentwidth = computed(()=>{
		return _width - uni.upx2px(_leftWidth.value) - uni.upx2px(_rightWidth.value)
	})
	const _title = computed(()=>props.title)
	const _fontColor = computed(()=>props.fontColor)
	const _homeColor = computed(()=>props.homeColor)
	const _blur = computed(()=>props.blur)
	const _pages = ref(0)
	onMounted(()=>{
		_pages.value = getCurrentPages().length;
	})
	
	const backhome = ()=>{
		uni.reLaunch({
			url:props.homePath
		})
	}
	let timerId = NaN;
	function debounce(func:Function, wait = 500, immediate = false) {
	  // 清除定时器
	  if (!isNaN(timerId)) clearTimeout(timerId);
	  // 立即执行，此类情况一般用不到
	  if (immediate) {
	    var callNow = !timerId;
	    timerId = setTimeout(() => {
	      timerId = NaN;
	    }, wait);
	    if (callNow) typeof func === "function" && func();
	  } else {
	    // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
	    timerId = setTimeout(() => {
	      typeof func === "function" && func();
	    }, wait);
	  }
	}
	
	const goback = ()=>{
		debounce(async ()=>{
			console.log(112)
			if (typeof props.beforeBack === 'function') {
				let p = await props.beforeBack();
				if(typeof p === 'function'){
					p = await p();
				}
				if (!p) return;
			}
			uni.navigateBack({})
		},250,true)
	}
</script>

<style scoped>
.statusHeightTop{
	z-index: 400;
}

</style>
