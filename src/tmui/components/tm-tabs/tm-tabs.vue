<template>
	<view class="flex flex-col overflow " :style="[
      props.height&&isDulitabs==false ? { height: height + 'rpx' } : '',
      { width: props.width + 'rpx' },
    ]">
	<!-- 此源码有uniapp bug.如果在nvue页面编译至h5平台时，开启enable-flexr后需要里面再套层view再写flex才能真正的开flex -->
	<!-- 因此下面的内容作了条件编译分为nvue和非nvue -->
	<!-- https://ask.dcloud.net.cn/question/143230 -->
		<!-- #ifndef APP-NVUE -->
		<view
		@touchmove="onMove"
		@touchend="onEnd" 
		@touchstart="onStart"
		@touchcancel="onEnd" 
		
		@mousemove="onMove"
		@mouseup="onEnd"
		@mouseleave="onEnd"
		@mousedown="onStart"
		ref="tabsDom"
		:style="{width:props.swiper?`${totalWidth}px`:`${props.width}rpx`,transform:props.swiper?`translateX(${directoStyle}px)`:`translateX(0px)`}"
		v-if="_tabPos=='bottom'&&isDulitabs==false" 
		:class="[!isEndMove||isNvue?'tmTabsPane':'']" 
		class="flex flex-row flex-nowrap  overflow">
			<slot></slot>
		</view>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<!-- @touchmove="onMove"
		@touchend="onEnd" 
		@touchstart="onStart" -->
		<view
		@touchmove="onMove"
		@touchend="onEnd" 
		@touchcancel="onEnd" 
		@touchstart="onStart"
		
		ref="tabsDom"
		:style="{width:props.swiper?`${totalWidth}px`:`${props.width}rpx`,transform:`translateX(0px)`}"
		v-if="_tabPos=='bottom'&&isDulitabs==false" 
		class="flex flex-row flex-nowrap  overflow">
			<slot></slot>
		</view>
		<!-- #endif -->
		
		<tm-sheet :transprent="props.transprent" :color="props.color" :followTheme="props.followTheme"
			:dark="props.dark" :round="props.round" :shadow="props.shadow" :outlined="props.outlined"
			:border="props.border" :borderStyle="props.borderStyle" :borderDirection="props.borderDirection"
			:text="props.text" :linear="props.linear" :linearDeep="props.linearDeep" :margin="[0, 0]" :padding="[0, 0]"
			:height="props.itemHeight + modelStyle.border + props.gutter+4"
			:_class="['flex-center flex-row nonvue', cstomClass]" :_style="props._style" :width="props.width">
			<!-- #ifndef APP-NVUE -->
			<scroll-view 
	
			:style="[{ width: `${props.width}rpx`, height: `${props.itemHeight+8}rpx` }]"
			:scroll-with-animation="true" 
			:scroll-into-view="_scrollToId" 
			:scroll-x="true" 
			:show-scrollbar="false" 
			enable-flex class="tableHeader flex-row relative">
				<view class="flex flex-row nowrap  nonvue" :class="[_align]"
					:style="[{height: `${props.itemHeight+4}rpx`}]">
					<view :id="tabsid+item.key" v-for="(item, index) in cacheTabs"  :key="index">
						<tm-sheet @click="changeKey(item.key)"  :round="props.itemRound" :linear="props.itemLinear" :linearDeep="props.itemLinearDeep"
							borderDirection="bottom" :text="item.key == _active ? modelStyle.text : false"
							:border="item.key == _active ? modelStyle.border : 0"
							:transprent="item.key == _active ? modelStyle.transprent : true" :color="
							props.activeColor && item.key == _active ? props.activeColor : props.color
							" :width="props.itemWidth" _class="flex-col flex-col-center-center" 
							:margin="[0, 0]" :padding="[20, 0]" :height="props.itemHeight">
							<view :style="[props.itemWidth>0?{width:props.itemWidth+'rpx'}:{}]" class="flex flex-col flex-col-center-center">
								<view class="flex flex-row flex-center">
									<tm-icon :userInteractionEnabled="false" v-if="item.icon" _class="pr-5"
										:color="item.key == _active ? props.activeFontColor : props.unSelectedColor"
										:font-size="item.key == _active ? props.activeFontSize : props.itemFontSize" :name="item.icon">
									</tm-icon>
									<tm-text :userInteractionEnabled="false" :font-size="item.key == _active ? props.activeFontSize : props.itemFontSize"
									:_class="item.key == _active?'text-weight-b':''"
										:color="item.key == _active ? props.activeFontColor : props.unSelectedColor"
										:label="item.title">
									</tm-text>
								</view>
							</view>
						</tm-sheet>
						
					</view>
					
				</view>
				<view class="anilineBar absolute l-0" :style="{ 
					width: `${contentWidth}rpx`,height:'1px',
					bottom:'2px',backgroundColor:props.showTabsLineAni?(store.tmStore.dark?'#616161':'#ebebeb'):'' }"
				></view>
				<view  v-if="props.showTabsLineAni&&props.itemWidth>0" class="anilineBar absolute l-0 b-2" :style="{transform:`translateX(${anitLineLeft}px)`}">
					<tm-sheet :follow-dark="false" :color="props.tabsLineAniColor" :height="8" :width="40" :margin="[0,0]" :padding="[0,0]"></tm-sheet>
				</view>
			</scroll-view>
			
			<!-- #endif -->
			
			<!-- #ifdef APP-NVUE -->
			
			<scroll-view 
			:scroll-into-view="_scrollToId" :scroll-x="true" :scroll-with-animation="true" 
			:show-scrollbar="false" enable-flex class="flex-row" :class="[_align]"
				:style="[{width:props.width+'rpx', height: `${props.itemHeight+4}rpx`}]">
				<view :id="tabsid+item.key" v-for="(item, index) in cacheTabs"  :key="index" >
					<tm-sheet  @click="changeKey(item.key)"  
						:round="props.itemRound" 
						:linear="props.itemLinear" 
						:linearDeep="props.itemLinearDeep"
						borderDirection="bottom" :text="item.key === _active ? modelStyle.text : false"
						:border="(item.key === _active ? modelStyle.border : 0)"
						:transprent="(item.key === _active ? modelStyle.transprent : true)" :color="
						(props.activeColor && item.key === _active ? props.activeColor : props.color)
						" :width="props.itemWidth" _class="flex-center flex-row"
						:margin="[0, 0]" :padding="[20, 0]" :height="props.itemHeight">
						<tm-icon :userInteractionEnabled="false" v-if="item.icon" _class="pr-5"
							:color="item.key === _active ? props.activeFontColor : props.unSelectedColor"
							:font-size="item.key === _active ? props.activeFontSize : props.itemFontSize" :name="item.icon">
						</tm-icon>
						<tm-text :userInteractionEnabled="false"  
						:font-size="item.key === _active ? props.activeFontSize : props.itemFontSize"
							:color="item.key === _active ? props.activeFontColor : props.unSelectedColor"
							:label="item.title">
						</tm-text>
					</tm-sheet>
				</view>
				<view class="anilineBar absolute l-0 b-0" :style="{ width: `${contentWidth}rpx`,height:'1px',
					backgroundColor:props.showTabsLineAni?(store.tmStore.dark?'#616161':'#ebebeb'):'' }"></view>
				<view v-if="props.showTabsLineAni&&props.itemWidth>0" class="anilineBar absolute l-0 b-0" :style="{transform:`translateX(${anitLineLeft-2}px)`}">
					<tm-sheet  :follow-dark="false" :color="props.tabsLineAniColor" :height="8" :width="40" :margin="[0,0]" :padding="[0,0]"></tm-sheet>
				</view>
			</scroll-view>
			<!-- #endif -->
		</tm-sheet>
		<!-- #ifndef APP-NVUE -->
		<view
		@touchmove="onMove"
		@touchend="onEnd" 
		@touchstart="onStart"
		@touchcancel="onEnd" 
		
		@mousemove="onMove"
		@mouseup="onEnd"
		@mouseleave="onEnd"
		@mousedown="onStart"
		ref="tabsDom"
		:style="{width:props.swiper?`${totalWidth}px`:`${props.width}rpx`,transform:props.swiper?`translateX(${directoStyle}px)`:`translateX(0px)`}"
		v-if="_tabPos=='top'&&isDulitabs==false" 
		:class="[!isEndMove||isNvue?'tmTabsPane':'']" 
		class="flex flex-row flex-nowrap  overflow">
			<slot></slot>
		</view>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<!-- @touchmove="onMove"
		@touchend="onEnd" 
		@touchstart="onStart" -->
		<view
		@touchmove="onMove"
		@touchend="onEnd" 
		@touchcancel="onEnd" 
		@touchstart="onStart"
		
		ref="tabsDom"
		:style="{width:props.swiper?`${totalWidth}px`:`${props.width}rpx`,transform:`translateX(0px)`}"
		v-if="_tabPos=='top'&&isDulitabs==false" 
		class="flex flex-row flex-nowrap  overflow">
			<slot></slot>
		</view>
		<!-- #endif -->
	</view>
</template>
<script lang="ts" setup>
	/**
	 * 选项卡
	 * @description 可以单独使用，配合tm-tabs-pane可实现卡片内容切换。
	 * @example
	 * <tm-tabs :width="750" default-name="6">
			<tm-tabs-pane v-for="item in 20" :name="item" :title="'未收件'+item">
				{{item}}
			</tm-tabs-pane>
		</tm-tabs>
	 */
	import {
		computed,
		ref,
		provide,
		watch,
		toRaw,nextTick,onMounted, watchEffect, PropType,getCurrentInstance,onUnmounted
	} from "vue";
	import tmSheet from "../tm-sheet/tm-sheet.vue";
	import tmText from "../tm-text/tm-text.vue";
	import tmIcon from "../tm-icon/tm-icon.vue";
	import {
		custom_props,
		computedClass
	} from "../../tool/lib/minxs";
	import { useTmpiniaStore } from '../../tool/lib/tmpinia';
	const store = useTmpiniaStore();
	// #ifdef APP-NVUE || APP-PLUS-NVUE
	var dom = weex.requireModule('dom');
	const Binding = uni.requireNativePlugin('bindingx');
	const animation = uni.requireNativePlugin('animation')
	// #endif
	const {proxy} = getCurrentInstance()
	//缓存已添加的项
	interface tabsobj {
		key: string | number;
		title: string;
		icon ? : string;
	}
	const bindxToken = ref(null);
	const emits = defineEmits(["update:activeName", "change", "click"]);
	const props = defineProps({
		...custom_props,
		//如果提供了，那么就不需要tm-tabs-pane，可以单独使用。
		list: {
			type: Array as PropType<Array<tabsobj>>,
			default: () => [],
		},
		color: {
			type: String,
			default: "white",
		},
		transprent: {
			type: [Boolean, String],
			default: false,
		},
		width: {
			type: Number,
			default: 500,
		},
		itemHeight: {
			type: Number,
			default: 80,
		},
		//不设定窗口高度，在真机上有闪烁。如果设定为0将是自动高度。
		height: {
			type: Number,
			default: 1000,
		},
		//内容在bar中的上下间隔。当有选项背景色时，底部为白色，这相当有用。
		gutter: {
			type: Number,
			default: 0,
		},
		defaultName: {
			type: [String, Number],
			default: "",
		},
		//当前活动项。v-model:active-name
		activeName: {
			type: [String, Number],
			default: "",
		},
		//标签导航的位置，
		//top导航在上方，bottom导航在下方。
		tabPos:{
			type:String,
			default:'top'
		},
		//项目的宽度。如果提供，每个标签是等宽度的，如果不提供自动宽度。
		itemWidth: {
			type: Number,
			default: 0,
		},
		//tab选中的背景颜色。默认为空
		activeColor: {
			type: String,
			default: "primary",
		},
		activeFontColor: {
			type: String,
			default: "primary",
		},
		activeFontSize: {
			type: Number,
			default: 28,
		},
		//选项卡样式模型
		itemModel: {
			type: String,
			default: "text", //line底部线条，card背景颜色模式，text文本模式,textLight背景减淡模式，文字会变灰。
		},
		//默认为空即根据主题自定颜色。如果填写了将使用该颜色为未选中色。
		unSelectedColor: {
			type: String,
			default: "",
		},
		itemFontSize: {
			type: Number,
			default: 28,
		},
		itemLinear: {
			type: String,
			default: "",
		},
		itemLinearDeep: {
			type: String,
			default: "light",
		},
		itemRound: {
			type: Number,
			default: 0,
		},
		align: {
			type: String,
			default: "left", //left:左对齐,right：右对齐,center：剧中,around：剧中均分
		},
		//是否启用pane滑动切换tabs。如果关闭有助于页面更顺畅。如果启用请不要大量内容。
		swiper:{
			type: Boolean,
			default:false
		},
		//是否显示底部线条动画样式。
		showTabsLineAni:{
			type:Boolean,
			default:false
		},
		//下面活动的横线的颜色。
		tabsLineAniColor:{
			type:String,
			default:'primary'
		}
	});
	const _align = computed(() => {
		let align_list = {
			right: "flex-row-center-end",
			left: "flex-row-center-start",
			center: "flex-row-center-center",
			around: "flex-around",
		};
		let key = "center";
		if(align_list.hasOwnProperty(String(props.align))){
			key = String(props.align)
		}
		
		return align_list[key];
	});
	const _active = ref(props.defaultName);
	emits("update:activeName",_active.value)
	const cstomClass = computed(() => computedClass(props));
	const _scrollToId = ref("")
	const modelStyle = computed(() => {
		if (props.itemModel == "text") {
			return {
				transprent: true,
				border: 0,
				text: false,
			};
		} else if (props.itemModel == "line") {
			return {
				transprent: true,
				border: 4,
				text: false,
			};
		} else if (props.itemModel == "textLight") {
			return {
				transprent: false,
				border: 4,
				text: true,
			};
		} else if (props.itemModel == "card") {
			return {
				transprent: false,
				border: 0,
				text: false,
			};
		}
		return {
			transprent: true,
			border: 0,
			text: false,
		};
	});
	const tmTabsId = "tmTabsId"
	const _tabPos = computed(()=>props.tabPos)
	const cacheTabs = ref < Array < tabsobj >> ([]);

	const isDulitabs = computed(()=>props.list.length>0)
	const tabsid = 'tabs_id_'+uni.$tm.u.getUid(1)+'_'
	const isNvue = ref(false);
	const totalWidth = computed(()=>uni.upx2px(cacheTabs.value.length*props.width))
	const contentWidth = computed(()=>{
		let width = (props.itemWidth+40)*cacheTabs.value.length;
		if(width<=props.width){
			width = props.width;
		}
		return width;
	})
	// 线滚动动画。
	const anitLineLeft = ref(0)


	
	// #ifdef APP-NVUE
	isNvue.value=true;
	// #endif
	// 判断滑动方向及距离start------------------------------------------------
	const _startx = ref(0);
	const _starty = ref(0);
	const _movex = ref(0);
	const _movey = ref(0);
	const _x = ref(0);
	const _y = ref(0);
	const directo = 'none'
	const directoStyle= ref("")
	const isEndMove = ref(true)
	const maxLen = 80;//只有拖拉距离大于此值才会切换。
	const activeIndex = computed(()=>cacheTabs.value.findIndex(el=>el.key==_active.value))
	let ctxLeft = 0;
	let ctxTop = 0;
	let timeDetail = 1;//动画时长。
	let isMoveEnb = false
	// 判断滑动方向及距离end------------------------------------------------
	
	watchEffect(()=>{
		cacheTabs.value = [];
		props.list.forEach((el,index)=>{
			cacheTabs.value.push({ key: el?.key??String(index), title: el?.title??String(index), icon: el?.icon??""})
		})
	})
	function pushKey(o: tabsobj) {
		let index: number = cacheTabs.value.findIndex((el) => el.key === o.key);
		if (index > -1) {
			cacheTabs.value.splice(index, 1, {
				...cacheTabs.value[0],
				...o
			});
		} else {
			cacheTabs.value.push(o);
		}

		if (_active.value == "") {
			changeKey(cacheTabs.value[0].key, false);
		}
	}

	function changeKey(key: string | number, isclick = true) {
		isEndMove.value=true;
		_active.value = key;
		timeDetail=1;
		emits("update:activeName", toRaw(_active.value));
		emits("change", key);
		if (isclick) {
			emits("click", key);
		}
		
	}

	function setTitle(o: tabsobj) {
		let index: number = cacheTabs.value.findIndex((el) => el.key == o.key);
		if (index > -1) {
			cacheTabs.value.splice(index, 1, o);
		}
	}
	
	function setTabsBarLineLeft(key:string|number=""){
		if(!props.showTabsLineAni) return;
		let keybl = key||_active.value
		let index = cacheTabs.value.findIndex(el=>el.key==keybl)
		
		if(index>-1){
			let itemwidth = props.itemWidth+40;
			let leftPx =uni.upx2px(itemwidth)*index+(uni.upx2px(itemwidth-40))/2
			if(props.align=="center"){
				leftPx = leftPx + uni.upx2px(props.width-(props.itemWidth+40)*cacheTabs.value.length)/2
			}
			
			anitLineLeft.value = leftPx+2
		}
	}

	function unbindKey(key: string | number) {
		let index: number = cacheTabs.value.findIndex((el) => el.key == key);
		if (index > -1) {
			cacheTabs.value.splice(index, 1);
		}
		let index2: number = cacheTabs.value.findIndex((el) => el.key == _active.value);

		if (index2 == -1 && cacheTabs.value.length > 0) {
			changeKey(cacheTabs.value[0].key, false);
		} else if (cacheTabs.value.length == 0) {
			changeKey("", false);
		}
	}
	watch(
		() => props.activeName,
		() => {
			changeKey(props.activeName, false);
		}
	);

	onMounted(()=>{
		setTimeout(()=>{
			_scrollToId.value = tabsid+_active.value;
			// #ifdef APP-NVUE
			nextTick(()=>{
				dom.getComponentRect(proxy.$refs.tabsDom, function(res) {
					if(res?.size){
						ctxLeft = Math.floor(res.size.left);
						ctxTop = Math.floor(res.size.top);
			
						spinNvueAniEnd(0,-uni.upx2px((activeIndex.value)*props.width),1)
					}
				})
			})
			// #endif
			setTabsBarLineLeft(props.defaultName)
		},300)
	})
	watchEffect(()=>{
		directoStyle.value = uni.upx2px(-(activeIndex.value)*props.width);
		spinNvueAniEnd(0,-uni.upx2px((activeIndex.value)*props.width),timeDetail)
	})
	watch(()=>_active.value,()=>{
		
		nextTick(()=>{
			let index = cacheTabs.value.findIndex(el=>el.key == _active.value)
			
			if(index>-1){
				if(typeof cacheTabs.value[index-2] !== 'undefined'){
					_scrollToId.value = tabsid+cacheTabs.value[index-2]?.key;
				}else{
					_scrollToId.value = tabsid+cacheTabs.value[0]?.key;
				}
				
			}else{
				_scrollToId.value = tabsid+_active.value;
			}
			
			setTabsBarLineLeft()
		})
	})
	
	defineExpose({
		pushKey: pushKey,
		changeKey: changeKey,
		unbindKey,
		setTitle: setTitle,
		tmTabsId
	});
	provide(
		"tabsActiveName",
		computed(() => _active.value)
	);
	provide(
		"tabsActiveCacheTabse",
		computed(() => cacheTabs.value)
	);
	provide(
		"tabsWidth",
		computed(() => props.width)
	);
	provide(
		"tabsheight",
		computed(() => {
			if (!props.height) return 0;
			return props.height - props.itemHeight - props.gutter;
		})
	);
	provide(
		"tabsSwiper",
		computed(() => props.swiper)
	);
	
	function onStart(event:Event){
		if(!props.swiper) return;
		isEndMove.value=true;
		isMoveEnb=true
		if(event?.preventDefault) event?.preventDefault()
		if(event?.stopPropagation) event?.stopPropagation()
		if (event.type.indexOf('mouse')==-1&&event.changedTouches.length == 1) {
			var touch = event.changedTouches[0];
			if(typeof touch?.pageX !=='undefined'){
				_startx.value = touch.pageX-ctxLeft
				_starty.value = touch.pageY-ctxTop
			}else{
				_startx.value = touch.x
				_starty.value = touch.y
			}
		}else{
			_startx.value = event.pageX-event.currentTarget.offsetLeft-ctxLeft
			_starty.value = event.pageY-event.currentTarget.offsetTop-ctxTop
		}
	}
	function onMove(event:Event){
		if(!props.swiper||isMoveEnb==false) return;
		if(event?.preventDefault) event?.preventDefault()
		if(event?.stopPropagation) event?.stopPropagation()
		let nowx = 0;
		let nowy = 0;
		if (event.type.indexOf('mouse')==-1&&event.changedTouches.length == 1) {
			var touch = event.changedTouches[0];
			if(typeof touch?.pageX !=='undefined'){
				nowx = touch.pageX-ctxLeft
				nowy = touch.pageY-ctxTop
			}else{
				nowx = touch.x
				nowy = touch.y
			}
		}else{
			nowx = event.pageX-event.currentTarget.offsetLeft-ctxLeft
			nowy = event.pageY-event.currentTarget.offsetTop-ctxTop
		}
		
		_x.value = nowx - _startx.value;
		_y.value = nowy - _starty.value;
		
		setDirXy(_x.value,_y.value)
	}
	function onEnd(event:Event){
		
		if(!props.swiper||!isMoveEnb) return;
		isEndMove.value=false;
		setDirXy(_x.value,_y.value,true)
		isMoveEnb=false
	}
	
	function setDirXy(x:number,y:number,isEnd=false){
		const oldindex = activeIndex.value;
		let nowLeft = uni.upx2px((activeIndex.value)*props.width)
		directoStyle.value = x-nowLeft;
		// #ifdef APP-NVUE
		spinNvueAniEnd(-nowLeft,x,0)
		// #endif
		uni.$tm.u.debounce(()=>{
			if(x>0&&Math.abs(x)>Math.abs(y)){
				// console.log("right")
				if(isEnd){
					if(x<maxLen||activeIndex.value<=0){
						directoStyle.value = -nowLeft;
						
					}else{
						_active.value = cacheTabs.value[activeIndex.value-1].key;
					}
					// #ifdef APP-NVUE
					nextTick(()=>{
						if(oldindex==activeIndex.value){
							uni.$tm.u.debounce(()=>{
								timeDetail=250;
								spinNvueAniEnd(-nowLeft-x,x,250)
								nextTick(()=>{
									_x.value=0;
									_y.value=0;
								})
							},50,true)
						}else{
							timeDetail=250;
						}
					})
					// #endif
				}
				// console.log(directoStyle.value)
			}else if(x<0&&Math.abs(x)>Math.abs(y)){
				// console.log("left")
				if(isEnd){
					if(Math.abs(x)<maxLen||activeIndex.value>=cacheTabs.value.length-1){
						directoStyle.value = -nowLeft;
					}else{
						_active.value = cacheTabs.value[activeIndex.value+1].key;
					}
					// #ifdef APP-NVUE
					nextTick(()=>{
						if(oldindex==activeIndex.value){
							uni.$tm.u.debounce(()=>{
								timeDetail=250;
								spinNvueAniEnd(-nowLeft-x,x,250)
								nextTick(()=>{
									_x.value=0;
									_y.value=0;
								})
							},50,true)
						}else{
							timeDetail=250;
						}
					})
					// #endif
				}
			}else if(y>0&&Math.abs(y)>Math.abs(x)){
				// console.log("down")
			}else if(y<0&&Math.abs(y)>Math.abs(x)){
				// console.log("up")
			}else{
				// console.log("none")
			}
			
		},60,true)
	}
	function onSwipe(e){
		console.log(e)
	}
	function getEl(el) {
		if (typeof el === 'string' || typeof el === 'number') return el;
		if (WXEnvironment) {
			return el.ref;
		} else {
			return el instanceof HTMLElement ? el : el.$el;
		}
	}
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
	function spinNvueAni() {
		// #ifdef APP-NVUE
		if (!proxy.$refs?.tabsDom) return;
		let icon = getEl(proxy.$refs.tabsDom);
		let nowLeft = uni.upx2px((activeIndex.value)*props.width)
		let icon_bind = Binding.bind(
			{
				 anchor:icon,
				 eventType:'pan',
				props: [
					{
						element:icon, 
						property:'transform.translateX',
						expression:`linear(t,${nowLeft},x,0)`
					}
				]
			},
			function (res) {
			}
		);
		// #endif
	}
	function spinNvueAniEnd(start:number,end:number,time=timeDetail) {
		if(!props.swiper) return;
		// #ifdef APP-NVUE
		if (!proxy.$refs?.tabsDom) return;
		 animation.transition(proxy.$refs.tabsDom, {
			  styles: {
				  transform: `translateX(${start+end}px)`,
				  transformOrigin: 'center center'
			  },
			  duration: time, //ms
			  timingFunction: 'linear',
			  delay: 50 //ms
		  },()=>{
			 
		  })
		
		
		
		
		
		
		return;
		
		let icon = getEl(proxy.$refs.tabsDom);
		let icon_bind = Binding.bind(
			{
				eventType: 'timing',
				props: [
					{
						element:icon, 
						property:'transform.translateX',
						expression:`linear(t,${start},${end},${time})`
					}
				]
			},
			function (res) {
				if (bindxToken.value) {
					Binding.unbind({
						token: res.token,
						eventType: 'timing'
					});
				}
			}
		);
		// #endif
	}
	
</script>

<style scoped>
	.tmTabsPane{
		transition-delay: 0;
		transition-timing-function: linear;
		transition-property: transform;
		transition-duration: 0.2s;
	}
	.anilineBar{
		transition-delay: 0;
		transition-timing-function: linear;
		transition-property: transform;
		transition-duration: 0.2s;
	}
</style>

