<template>
	<view  v-if="showMask"
	ref="overlay"
	@click.stop="close" 
	:class="[bgColor_rp&&!props.transprent?'blurbg':'', align_rpx,' navbarheight flex flex-col  l-0  ',customClass,]" 
	:style="[bgColor_rp&&!props.transprent ? { backgroundColor: showMask?bgColor_rp:'' } : '',{ position:'fixed'},
		zIndex ? { zIndex: zIndex } : '', { width: width + 'px', height: height + 'px',top:top+'px'},customCSSStyle, ]" 
		:animation="animationData">
		<slot></slot>
	</view>
</template>
<script lang="ts" setup>
	/**
	 * 遮罩层
	 * @description 遮罩层全屏弹出。
	 */
	import {
		getCurrentInstance,
		computed,
		ref,
		provide,
		inject,
		onMounted,
		onUnmounted,
		nextTick,
		watch,
ComponentInternalInstance
	} from 'vue';
	import {
		cssstyle,
		tmVuetify
	} from '../../tool/lib/interface';
	import {
		custom_props,
		computedClass,
		computedStyle
	} from '../../tool/lib/minxs';
	// #ifdef APP-PLUS-NVUE
	const animation = uni.requireNativePlugin('animation')
	// #endif
	// 混淆props共有参数
	const props = defineProps({
		...custom_props,
		// 内容的对齐方式的类
		align:{
			type:String,
			default:'flex-center'
		},
		//当前组件的主题。可以是颜色值，也可以是主题名称。
		bgColor: {
			type: String,
			default: 'rgba(0,0,0,0.35)'
		},
		zIndex: {
			type: [Number, String],
			default: 999
		},
		show: {
			type: Boolean,
			default: false
		},
		overlayClick:{
			type: Boolean,
			default: true
		},
		transprent:{
			type: [Boolean,String],
			default: false
		},
		duration:{
			type:Number,
			default:300
		},
	});
	const emits = defineEmits(['click', 'open', 'close', 'update:show']);
	const {proxy} = <ComponentInternalInstance>getCurrentInstance();
	//自定义样式：
	const customCSSStyle = computedStyle(props);
	//自定类
	const customClass = computedClass(props);
	const width = ref(0);
	const height = ref(0);
	const top = ref(0);
	const isAniing = ref(false)
	let timids=uni.$tm.u.getUid(1);
	const sysinfo = uni.getSystemInfoSync();
	width.value = sysinfo.windowWidth;
	height.value = sysinfo.windowHeight;

	let nowPage = getCurrentPages().pop()
	let isCustomHeader = false;
	for(let i=0;i<uni.$tm.pages.length;i++){
		if(nowPage?.route==uni.$tm.pages[i].path&&uni.$tm.pages[i].custom=='custom'){
			isCustomHeader = true;
			break;
		}
	}
	

	// #ifdef H5
	if (isCustomHeader) {
		height.value  = sysinfo.windowHeight+44
	}else{
		top.value = 44
	}
	// #endif
	let appsys = uni.getWindowInfo();
	// #ifdef APP-NVUE 
	if(!isCustomHeader){
		if(sysinfo.osName=="android"){
			height.value = appsys.safeArea.height - 44 - appsys.safeAreaInsets.bottom
		}else{
			height.value = appsys.safeArea.height - 44
		}
	}else{
		height.value = appsys.safeArea.height + appsys.statusBarHeight + appsys.safeAreaInsets.bottom
	}
	// #ifdef APP-VUE 
	if(!isCustomHeader){
		height.value = appsys.safeArea.height - 44
	}else{
		height.value = appsys.safeArea.height + appsys.statusBarHeight + appsys.safeAreaInsets.bottom
	}
	// #endif
	// #endif
	let timerId = NaN;
	
	const animationData = ref(null)
	const showMask = ref(false)
	onUnmounted(()=>clearTimeout(timerId))
	const align_rpx = computed(()=>props.align)
	const bgColor_rp = computed(()=>{
		if(!props.bgColor|| props.transprent) return 'rgba(0,0,0,0)';
		return props.bgColor||'rgba(0,0,0,0.2)';
	})
	onMounted(()=>{
		if(!props.show) return;
		
		open(props.show)
	})
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
	
	function close(e:Event) {
		try{
			e.stopPropagation()
			e.stopImmediatePropagation()
		}catch(e){
			//TODO handle the exception
		}
		
		emits('click', e);
		if(timerId){
			clearTimeout(timerId)
			timerId = NaN
		}
		debounce(()=>{
			
			if(!props.overlayClick) return;
			open(false)
		},250,true)
	}
	function open(off:boolean) {
		// #ifndef APP-PLUS-NVUE
		fadeInVue(off);
		// #endif
		// #ifdef APP-PLUS-NVUE
		fadeInNvue(off);
		// #endif
	}
	function getEl(el:HTMLElement) {
		if (typeof el === 'string' || typeof el === 'number') return el;
		if (WXEnvironment) {
			return el.ref;
		} else {
			return el instanceof HTMLElement ? el : el.$el;
		}
	}
	function fadeInNvue(off:boolean = false) {
		if(off==false){
			if(showMask.value==off) return;
			// if(isAniing.value==true) return;
			// isAniing.vale = true;
			clearTimeout(timids)
			timids = setTimeout(function() {
				var testEl = proxy.$refs.overlay;
				  animation.transition(testEl, {
					  styles: {
						  backgroundColor:bgColor_rp.value,
						  opacity:0
					  },
					  duration: props.duration, //ms
					  timingFunction: 'ease',
					  delay: 0 //ms
				  },()=>{
					  showMask.value = off;
					  emits('close');
					  emits('update:show', false);
					  // isAniing.vale = false;
				  })
			}, props.duration);
			
		}else{
			showMask.value = off;
			emits('open');
			clearTimeout(timids)
			timids = setTimeout(function() {
				var testEl = proxy.$refs.overlay;
				  animation.transition(testEl, {
					  styles: {
						  backgroundColor:bgColor_rp.value,
						  opacity:1
					  },
					  duration: props.duration, //ms
					  timingFunction: 'ease',
					  delay: 0 //ms
				  },()=>{
					  
				  })
			}, 50);
	
			
		}
		
	}
	function fadeInVue(off = false) {
		debounce(function(){
			let animation = uni.createAnimation({
				duration: props.duration,
				timingFunction: 'ease',
				delay: 0
			});
			animation.opacity(off ? 1 : 0).step();
			animationData.value = animation.export();
			if(off==false){
				
				if(showMask.value==off) return;
				showMask.value = off;
				emits('close');
				emits('update:show', false);
			}else{
				showMask.value=off
				emits('open');
			}
		},props.duration,false)
		
	}
	watch(()=>props.show,(newval)=>{
		
		open(newval)
	})
	defineExpose({close:close,open:open})
</script>

<style scoped="scoped">
	
	.blurbg{
		/* #ifndef APP-PLUS-NVUE */ 
		/* backdrop-filter: blur(4px); */
		/* #endif */ 
		opacity: 0;
	}

</style>
