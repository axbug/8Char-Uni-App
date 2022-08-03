<template>
	<view ref="tmIndexes" :class="['overflow relative',`mx-${_margin[0]} my-${_padding[1]} px-${_margin[0]} py-${_padding[1]}`]"
		:style="[{height:`${_height}rpx`}]">
		<scroll-view :offset-accuracy="5" @scroll="scrollChnage" :scroll-with-animation="true" :scroll-top="_cureent_top" :scroll-y="true" :style="[
		    _width ? { width: _width + 'rpx' } : '',
		    _height ? { height: _height + 'rpx' } : '',
		]">
			<slot></slot>
		</scroll-view>
		<view class="absolute   flex flex-col flex-center t-0 r-24" :style="[{height:`${_height}rpx`,width:'60rpx'}]">
			<tm-sheet no-level :round="10" color="white" :shadow="2" :margin="[0,0]" :padding="[0,0]" :width="40" >
				<view @click="navClick(item)" hover-class="opacity-5"   class="flex-center flex"
					v-for="(item,index) in navright" :key="index" style="width: 40rpx;height: 40rpx;">
					<tm-text @click="navClick(item)" :followTheme="_cureent_id==item.id?props.followTheme:false" :color="_cureent_id==item.id?props.color:''" :font-size="20" :label="item.text"></tm-text>
				</view>
			</tm-sheet >
		</view>
		<view v-if="_showCenterTitle" class="absolute l-0 t-0 fulled" :style="[
			{
				top:(_height - 70)/2+'rpx',
			},
			_isNvue?{left:parentLeft+'px'}:{left:'calc(50% - 70rpx)',}
		]">
			<tm-sheet v-if="_cureent_item!=null" _class="flex flex-center" :shadow="5" :margin="[24,24]" :padding="[0,0]" 
			:width="100" :height="100" :round="20">
				<tm-text :followTheme="props.followTheme" :color="props.color" :font-size="36" :label="_cureent_item.text"></tm-text>
			</tm-sheet>
		</view>
		
		
	</view>
</template>

<script lang="ts" setup>
	/**
	 * 列表索引
	 * @description 索引列表，内部只能放置tm-indexes-item组件。
	 * @example
	 * <tm-indexes>
			<tm-indexes-item :title="index%10==0?index:''"  v-for="(item,index) in 60" :key="index">
				<tm-text label="想要什么的."></tm-text>
			</tm-indexes-item>
		</tm-indexes>
	 */
	import {
		computed,
		PropType,
		ref,
		Ref,
		nextTick,
		onMounted,
		getCurrentInstance
	} from 'vue';
	import tmSheet from '../tm-sheet/tm-sheet.vue';
	import tmText from '../tm-text/tm-text.vue';
	
	// #ifdef APP-PLUS-NVUE
	const dom = uni.requireNativePlugin('dom')
	// #endif
	const {proxy} = getCurrentInstance()
	const emits = defineEmits(["nav-click"])
	const props = defineProps({
		followTheme:{
			type:Boolean,
			default:true
		},
		width: {
			type: Number,
			default: 0
		},
		height: {
			type: Number,
			default: 700
		},
		margin: {
			type: Array as PropType < Array < number >> ,
			default: () => [0, 0]
		},
		padding: {
			type: Array as PropType < Array < number >> ,
			default: () => [0, 0]
		},
		color:{
			type:String,
			default:'primary'
		}
	})
	const _margin = computed(() => props.margin)
	const _padding = computed(() => props.padding)
	const _height = computed(() => props.height)
	const _width = computed(() => props.width)
	const _cureent_id = ref(0)
	const _cureent_item = ref(null)
	const _isNvue= ref(false)
	const _showCenterTitle = ref(false)
	let _timeid = uni.$tm.u.getUid(1)
	const _isClickNavIng = ref(false)//是否点按导航中
	const parentLeft = ref(0)

	// #ifdef APP-NVUE
	_isNvue.value = true;
	// #endif
	interface heightItem {
		height: number,
			id: number,
			text: string
	}
	const _cacheHeightArrays: Ref < Array < heightItem >> = ref([])
	const _cureent_top = ref(0)
	const compentNameId = "tmIndexesId";
	const navright = computed(() => {
		return _cacheHeightArrays.value.filter(el => el.text !== '')
	})
	
	function pushKey(height: number, id: number, text: string) {
		_cacheHeightArrays.value.push({
			height: height,
			id: id,
			text: text
		})
	}

	function delKey(height: number, id: number) {
		let index = _cacheHeightArrays.value.findIndex(el => el.id == id);
		if (index > -1) {
			_cacheHeightArrays.value.splice(index, 1)
		}
	}
	function scrollChnage(e){
		uni.$tm.u.debounce(function(){
			let nowitem = getPosItem(e.detail.scrollTop);
			if(nowitem){
				_cureent_id.value = nowitem.id;
				_cureent_item.value = nowitem;
			}
		},200)
		
	}
	onMounted(()=>nvuegetClientRect())
	function nvuegetClientRect() {
		// #ifdef APP-PLUS-NVUE
		nextTick(function() {
			
			dom.getComponentRect(proxy.$refs.tmIndexes, function(res) {
				if(res?.size){
					if(res.size.width>0){
						parentLeft.value = (res.size.width - uni.upx2px(70)) / 2;
					}
					if(res.size.height==0){
	                    nvuegetClientRect()
	                }
				}
				
			})
		})
		// #endif
	}
	function getPosItem(top:number){
		let avl = [];
		let nowitem = null
		navright.value.forEach(el2=>{
			let index = _cacheHeightArrays.value.findIndex(el => el.id == el2.id);
			if(index>-1){
				// if(index==_cacheHeightArrays.value.length-1){
				// 	index+=1;
				// }
				let ar = _cacheHeightArrays.value.slice(0, index)
				let atm = {top:0,item:el2}
				ar.forEach(el3 => atm.top += el3.height)
				
				atm.top = uni.upx2px(atm.top-50);
				avl.push(atm)
			}
		})
		
		let pavl = [...avl]
		let lastitem = pavl[pavl.length-1]
		if(top>=lastitem.top){
			return lastitem.item;
		}
		avl.reverse()
		for(let i=0;i<avl.length;i++){
			let item =  avl[i+1]
			if(top>=item.top){
				nowitem = item.item
				break;
			}
		}
		
		
		return nowitem;
	}
	function navClick(item: heightItem) {
		let index = _cacheHeightArrays.value.findIndex(el => el.id == item.id);
		let ar = _cacheHeightArrays.value.slice(0, index)
		if(index==-1||_cureent_id.value==item.id) return;
		_cureent_id.value = item.id
		_cureent_item.value = item;
		_cureent_top.value = 0;
		_showCenterTitle.value = true;
		clearTimeout(_timeid)
		_timeid = setTimeout(function() {
			_showCenterTitle.value = false;
		}, 800);
		nextTick(() => {
			let total = 0;
			ar.forEach(el => total += el.height)
			_cureent_top.value = uni.upx2px(total);
			
			emits("nav-click", item)
			
		})
	}
	defineExpose({
		compentNameId,
		pushKey,
		delKey
	})
</script>

<style>
</style>
