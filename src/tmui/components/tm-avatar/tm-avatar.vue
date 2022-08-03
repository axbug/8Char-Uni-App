<template>
	<view ref="avatar" class="flex-col flex "  :class="[trigger?'trigger':'',`mx-${props.margin[0]} my-${props.margin[1]}`]" :style="{width:width+'rpx',height:height+'rpx'}" >
		<tm-sheet
		@click="emits('click',$event)"
		:color="props.color"
		:_class="[customClass,'flex-center flex-col']"
		:_style="[customCSSStyle,{flexShrink: 1}]"
		:followTheme="props.followTheme"
		:dark="props.dark"
		:round="props.round"
		:shadow="props.shadow"
		:outlined="props.outlined"
		:border="props.border"
		:borderStyle="props.borderStyle"
		:borderDirection="props.borderDirection"
		:text="props.text"
		:transprent="props.img?true:props.transprent"
		:linear="props.linear"
		:linearDeep="props.linearDeep"
		:width="width"
		:height="height"
		:margin="[0,0]"
		:padding="props.padding"
		>
			<tm-text :userInteractionEnabled="false" v-if="props.label&&!props.icon&&!props.img" :label="props.label" :font-size="fontSize"></tm-text>
			<tm-icon :userInteractionEnabled="false" v-if="!props.label&&props.icon&&!props.img" :name="props.icon" :font-size="fontSize"></tm-icon>
			<image :userInteractionEnabled="false" v-if="!props.label&&!props.icon&&props.img" :src="props.img" mode="scaleToFill" 
			:style="{width:imgsize,height:imgsize}" :class="['round-'+props.round]"></image>
		</tm-sheet>
		<view @click.stop="emits('click',$event)" v-if="props.triggerIcon" class="absolute flex flex-col-bottom-end b-0 r-0 " :style="{width:`${width}rpx`}">
			<tm-sheet :userInteractionEnabled="false" :width="triggSize.size" :height="triggSize.size" 
			:_style="props.triggerStyle" :text="props.img?false:!props.text" :color="(props.triggerColor||props.color)" 
			:transprent="false" :dark="props.dark" _class="flex-center " 
			:margin="[0,0]" :padding="[0,0]" :round="24">
				<tm-icon :name="props.triggerIcon" :font-size="triggSize.fontSize"></tm-icon>
			</tm-sheet>
		</view>
	</view>
	
</template>

<script lang="ts" setup>
	/**
	 * 头像
	 * @description 也可以搭配头像组形成头像组合。tm-avatar-group
	 */
	import { getCurrentInstance, computed, ref, provide, inject , onUpdated, onMounted, onUnmounted, nextTick ,watch, PropType } from 'vue';
	import { cssstyle, tmVuetify,colorThemeType } from '../../tool/lib/interface';
	import { custom_props, computedTheme, computedClass, computedStyle, computedDark } from '../../tool/lib/minxs';
	import tmSheet from "../tm-sheet/tm-sheet.vue";
	import tmText from "../tm-text/tm-text.vue";
	import tmIcon from "../tm-icon/tm-icon.vue";
	const emits = defineEmits(['click'])
	const props = defineProps({
		...custom_props,
		size: {
			type: [Number],
			default: 90
		},
		//是否开启交互，在pc端有用，鼠标移上去变成手型
		trigger:{
			type:[Boolean,String],
			default:false,
		},
		triggerColor:{
			type:[String],
			default:'',
		},
		triggerIcon:{
			type:[String],
			default:'',
		},
		triggerStyle:{
			type:[String],
			default:'',
		},
		round: {
			type: [Number],
			default: 6
		},
		border: {
			type: [Number],
			default: 0
		},
		margin: {
		  type: Array as PropType<Array<number>>,
		  default: () => [0, 0],
		},
		padding: {
		  type: Array as PropType<Array<number>>,
		  default: () => [0, 0],
		},
		transprent: {
			type: [Boolean, String],
			default: false
		},
		label:{
			type:String,
			default:''
		},
		icon:{
			type:String,
			default:''
		},
		img:{
			type:String,
			default:''
		},
		//自动匹配字体大小。
		fontSize: {
			type: [Number],
			default: 0
		},
	})
	//自定义样式：
	const customCSSStyle = computed(()=>computedStyle(props));
	//自定类
	const customClass = computed(()=>computedClass(props));
	const width = computed(()=>props.size??90)
	const height = computed(()=>props.size??90)
	const fontSize = computed(()=>{
		if(props.fontSize) return props.fontSize;
		if(props.label) return parseInt(String(width.value))*0.4
		if(props.icon) return parseInt(String(width.value))*0.7
		return props.size??90;
	})
	const imgsize = computed(()=>{
		return uni.upx2px(fontSize.value-4) + "px"
	})
	const triggSize = computed(()=>{
		let wh = width.value/3+6;
		wh = wh >=64?64:wh;
		
		return {
			size:wh,
			fontSize:wh*0.5
		}
	})
	
</script>

<style scoped>
.trigger{
	/* #ifndef APP-PLUS-NVUE */
	cursor: pointer;
	/* #endif */
}
</style>
