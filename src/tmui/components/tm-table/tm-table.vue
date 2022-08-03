<template>
    <view>
        <scroll-view v-if="_showHeader" :enable-flex="isNvue" :class="[isNvue ? 'flex-row flex' : 'tableHeader']" :scroll-x="true"
            :scroll-with-animation="false" :show-scrollbar="false" @scroll="tableScroll" @touchstart="scrollDong = 't'"
            @mouseup="scrollDong = 't'" :scroll-left="headerLeft"
            :style="{ width: `${defaultProps.width}rpx`, height: `${defaultProps.headerHeight}rpx` }">
            <!-- #ifndef APP-NVUE -->
            <view class="flex-1 flex-row flex-nowrap">
                <tm-sheet  :border="_showBottomBorder?1:0" border-direction="bottom" :color="item.bgColor" :text="item.light" 
					:_class="'flex flex-col ' + item.align"
                    :height="defaultProps.headerHeight-6" 
					:width="item.width-10" v-for="(item, index) in _col" 
					:key="index"
                    :margin="[0, 0]" :padding="[10, 6]"
					@click="headerClick(item.key,item.sort)"
					>
                    <view :style="{width:item.width-10+'rpx',height:defaultProps.headerHeight-6+'rpx'}" 
					class="flex flex-row-center-center flex-row"
					:class="[item.align]"
					>
						<view @click.stop="" class="flex-1 flex-center" style="width: 0px;">
							<tm-text @click="headerClick(item.key,item.sort)" _style="line-height:normal;" :font-size="26" _class="text-weight-b text-align-center" :label="item.title">
							</tm-text>
						</view>
						<view @click.stop="" v-if="item.sort" class="flex flex-col flex-col-center-center">
							<tm-icon :lineHeight='11' @click="headerClick(item.key,item.sort)" :_class='(item.sortType=="asce"||item.sortType=="none"?"":"opacity-6")' :font-size="20" name='tmicon-sort-up'></tm-icon>
							<tm-icon :lineHeight='11' @click="headerClick(item.key,item.sort)" :_class='(item.sortType=="desc"||item.sortType=="none"?"":"opacity-6")' :font-size="20" name='tmicon-sort-down'></tm-icon>
						</view>
					</view>
                </tm-sheet>
            </view>
            <!-- #endif -->
            <!-- #ifdef APP-NVUE -->
            <tm-sheet  :border="_showBottomBorder?1:0" border-direction="bottom" :color="item.bgColor" :text="item.light"
            	:_class="'flex flex-col ' + item.align"
                :height="defaultProps.headerHeight-6" 
            	:width="item.width-10" v-for="(item, index) in _col" 
            	:key="index"
                :margin="[0, 0]" :padding="[10, 6]"
            	@click="headerClick(item.key,item.sort)"
            	>
                <view 
				:userInteractionEnabled="false"
				:style="{width:item.width-10+'rpx',height:defaultProps.headerHeight-6+'rpx'}" 
            	class="flex flex-row-center-center flex-row"
            	:class="[item.align]"
            	>
            		<view  @click.stop="" class="flex-1 flex" style="width: 0px;">
            			<tm-text @click="headerClick(item.key,item.sort)"  _style="line-height:normal;" :font-size="26" _class="text-weight-b text-align-center" :label="item.title">
            			</tm-text>
            		</view>
            		<view  @click.stop=""  v-if="item.sort" class="flex flex-col flex-col-center-center">
            			<tm-icon :lineHeight='11' @click="headerClick(item.key,item.sort)"  :_class='(item.sortType=="asce"||item.sortType=="none"?"":"opacity-6")' :font-size="20" name='tmicon-sort-up'></tm-icon>
            			<tm-icon :lineHeight='11' @click="headerClick(item.key,item.sort)"  :_class='(item.sortType=="desc"||item.sortType=="none"?"":"opacity-6")' :font-size="20" name='tmicon-sort-down'></tm-icon>
            		</view>
            	</view>
            </tm-sheet>
            <!-- #endif -->

        </scroll-view>

        <!-- #ifndef APP-NVUE -->
        <scroll-view :scroll-with-animation="false" @scroll="headerScroll($event, 0)" @touchstart="touchStartScroll(0)"
            @mouseup="touchStartScroll(0)" :scroll-x="true" :scroll-y="true" :scroll-left="tableLeft[0]"
            :style="[defaultProps.height ? { height: `${defaultProps.height}rpx` } : '', { width: `${defaultProps.width}rpx` }]">

            <view class="flex flex-row flex-nowrap" v-for="(item2, index2) in _tabel" :key="index2" :margin="[0, 0]">
                <tm-sheet  
				:border="_showBottomBorder?1:0" 
				border-direction="bottom" v-for="(item, index) in item2.data" 
				:key="index" 
				:margin="[0, 0]"
                :color="item.color" 
				:text="item.light"
                    :_class="'flex flex-row ' + item2.align" :height="defaultProps.cellHeight-6" :width="item.width-10"
                    :padding="[10, 6]">
                   <tm-text v-if="item.type=='text'" :font-size="24" :label="item.text"></tm-text>
                   <tm-button @click="rowClick(index2,index)" :margin="[0,0]" size="small" :color="_col[index]?.bgColor" 
				   :width="item.width-16" v-if="item.type=='button'" :font-size="24" :label="item.text"></tm-button>
                </tm-sheet>
            </view>

        </scroll-view>

        <!-- #endif -->

        <!-- #ifdef APP-NVUE -->
        <scroll-view :scroll-with-animation="false" :enable-flex="isNvue" :class="[isNvue ? 'flex-col flex' : '']"
            :scroll-y="true"
            :style="[defaultProps.height ? { height: `${defaultProps.height}rpx` } : '', { width: `${defaultProps.width}rpx` }]">
            <scroll-view :scroll-with-animation="false" @scroll="headerScroll($event, index2)"
                @touchstart="touchStartScroll(index2)" @mouseup="touchStartScroll(index2)"
                :scroll-left="tableLeft[index2]" :show-scrollbar="false" :enable-flex="isNvue"
                :class="[isNvue ? 'flex-row flex' : '']" :scroll-x="true" :style="[
                    { width: `${defaultProps.width}rpx` }
                ]" v-for="(item2, index2) in _tabel" :key="index2" :margin="[0, 0]">
                <view class="flex flex-row flex-nowrap">
                    <tm-sheet :border="_showBottomBorder?1:0" border-direction="bottom" v-for="(item, index) in item2.data" :key="index" :margin="[0, 0]"
                       :color="item.color"
                       :text="item.light"
                        :_class="'flex ' + item2.align" :height="defaultProps.cellHeight-6" :width="item.width-10"
                        :padding="[10, 6]">
                        <tm-text v-if="item.type=='text'" :font-size="24" :label="item.text"></tm-text>
                        <tm-button  @click="rowClick(index2,index)" :margin="[0,0]" size="small" :color="_col[index]?.bgColor" :width="item.width-16" v-if="item.type=='button'" :font-size="24" :label="item.text"></tm-button>
						
                    </tm-sheet>
                </view>
            </scroll-view>
        </scroll-view>
        <!-- #endif -->




    </view>
</template>
<script lang="ts" setup>
/**
 * 表格
 * @description 本组件定位为简单展示使用，非专业表格组件，请知悉！
 * 大多数场景展示基本是简单的表格展示而非复杂的表格组件，因此这个场景使用还是很合理的。
 */
import type { headresItem, cellItem,dataTypeArray } from "./interface";
import { computed, nextTick, onMounted, PropType, Ref, ref, toRaw, watchEffect,watch } from "vue";
import tmSheet from "../tm-sheet/tm-sheet.vue";
import tmText from "../tm-text/tm-text.vue";
import tmIcon from "../tm-icon/tm-icon.vue";
import tmButton from "../tm-button/tm-button.vue";
const emits = defineEmits(['rowClick'])
const props = defineProps({
    showHeader:{
        type:Boolean,
        default:true
    },
    header: {
        type: Array as PropType<Array<headresItem>>,
        default: () => [],
    },
    tableData: {
        type: Array as PropType<Array<cellItem>>,
        default: () => [],
        required:true
    },
    width: {
        type: Number,
        default: 750
    },
    //如果提供了高度，将产生上下滑动的表格。
    height: {
        type: Number,
        default: 0
    },
    //单元格的高度。
    cellHeight: {
        type: Number,
        default: 72
    },
    //头部的高度。
    headerHeight: {
        type: Number,
        default: 88
    },
    showBottomBorder:{
        type:Boolean,
        default:true
    }
})
const defaultProps = computed(() => {
    return {
        width: props.width,
        height: props.height,
        cellHeight: props.cellHeight,
        headerHeight: props.headerHeight
    }
})
const _col: Ref<Array<headresItem>> = ref([]);
const _tabel: Ref<Array<cellItem>> = ref([]);
const _showBottomBorder = computed(()=>props.showBottomBorder)
const _showHeader = computed(()=>props.showHeader)
const isNvue = ref(false);
// #ifdef APP-NVUE
isNvue.value = true;
// #endif

const headerLeft = ref(0);

const tableLeft: Ref<Array<number>> = ref([...new Array(props.tableData.length).fill(0)]);

let scrollDong = ref('')
let scrollIndex = ref(NaN)
function headerScroll(e: Event, index: number) {
    if (scrollDong.value != 'h') return;
    nextTick(() => {
        if (scrollIndex.value === index) {
            headerLeft.value = e.detail.scrollLeft
            tableLeft.value = tableLeft.value.map((el, idx) => {
                return idx !== index ? headerLeft.value : el;
            })
        }
    })

}
function tableScroll(e: Event) {
    if (scrollDong.value != 't') return;
    nextTick(() => {
        tableLeft.value = [...new Array(props.tableData.length).fill(e.detail.scrollLeft)];
    })
}

function touchStartScroll(index) {
    scrollIndex.value = index;
    scrollDong.value = 'h';
}

onMounted(()=>{
	nextTick(()=>setColData())
})
watch([()=>props.tableData,()=>props.header],()=>{
	setColData()
},{deep:true})
function setColData() {
    _col.value = [];
    _tabel.value = [];
	let defaultSort = 'none';
    props.header.forEach((el, index) => {
		//这里的目的是，当有一列数据默认有排序，那么它后面全部默认都不能排序了，只能优先排序第一个数据。后期需要界面点击切换。
		let defaultSort = el?.sortType??'none';
		if(defaultSort!='none'){
			defaultSort = 'none'
		}
        _col.value.push({
            title: el?.title ?? "",
            width: el?.width ?? 145,
            align: "flex-row-center-" + (el?.align||"center"),
            sort: el?.sort ?? false,
            bgColor: el?.bgColor ?? 'white',
            cellColor: el?.cellColor ?? 'white',
            light: el?.light ?? false,
            key: el?.key ?? String(index),
			sortType:defaultSort
        })
    })

    props.tableData.forEach((el, index) => {
        let d = el?.data ?? {};
        let keys = Object.keys(d);
        for(let ik=0,len=keys.length;ik<len;ik++){
            if(typeof _col.value[ik] == 'undefined'){
                _col.value.push({
                    title: String(ik),
                    width: el?.width ?? 145,
                    align: "flex-col-center-" + (el?.align||"center"),
                    sort: false,
                    bgColor: 'white',
                    cellColor: 'white',
                    light: false,
                    key:String(ik),
					sortType:'none'
                })
            }
        }
        let datakey = Object.keys(d);
		let dataRuslt:Array<dataTypeArray> = [];
		dataRuslt =  _col.value.map((el2,index)=>{
			let color = 'white'
			let light = false
			if(typeof d[el2.key] !=='object'){
				color = el?.color||_col.value[index]?.cellColor||color
				light = el?.light||_col.value[index]?.light||light
			}else{
				color = d[el2.key]?.color||el?.color||_col.value[index]?.color||color;
				light = d[el2.key]?.light||el?.light||_col.value[index]?.light||light;
			}
			let cel:dataTypeArray = {
				key:el2.key,
				text:typeof d[el2.key]!=='object'?d[el2.key]:d[el2.key]?.text??"",
				type:typeof d[el2.key]!=='object'?"text":d[el2.key]?.type??"text",
				width:_col.value[index]?.width??145,
				light:light,
				color:color,
			}
			if(typeof d[el.key] === 'object'){
				cel = {...cel,...d[el.key]}
			}
			return cel
		})
		_tabel.value.push({
            data:dataRuslt,
            align: el?.align ?? _col.value[index]?.align??"flex-row-center-center",
            key: el?.key ?? String(index)
        })
    })
	
}
function headerClick(key:string,isSort=false){
	if(!isSort) return;
	let valueArray = _col.value.filter(el=>el.key==key)
	let keyDesc = valueArray[0].sortType;
	if(!keyDesc||keyDesc=='none'){
		sort(key,'desc')
		return;
	}
	if(keyDesc=='none'){
		sort(key,'desc')
		return;
	}
	if(keyDesc=='desc'){
		sort(key,'asce')
		return;
	}
	if(keyDesc=='asce'){
		sort(key,'none')
		return;
	}
}
//descKey需要排序的字段。
function sort(descKey="",type='none'){
	uni.showLoading({
		title:"...",
		mask:true
	})
	// 排序
	if(type=='none'||descKey===""){
		setColData();
		uni.hideLoading()
		return;
	}
	let lsTemp = _tabel.value.map((item,index)=>{
		let valueArray = item.data.filter(el=>el.key==descKey)
		return {
			oldIndex:index,
			value:valueArray[0].text
		}
	})
	
	//降序
	if(type=='desc'){
		lsTemp.sort((a,b)=>a.value-b.value)
	}
	//升序。
	if(type=='asce'){
		lsTemp.sort((a,b)=>b.value-a.value)
	}
	const backTable = toRaw(_tabel.value)
	
	nextTick(()=>{
		_col.value = _col.value.map(el=>{
			return {...el,sortType:el.key==descKey?type:el.sortType}
		})
		_tabel.value = lsTemp.map((el)=>{
			return backTable[el.oldIndex]
		})
		uni.hideLoading()
	})
	
}

function rowClick(rowIndex:number,colIndex:number){
	emits("rowClick",rowIndex,colIndex)
}

</script>
<style>
</style>