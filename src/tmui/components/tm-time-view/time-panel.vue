<template>
	<!-- background:linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.6)),linear-gradient(0deg, rgba(255,255,255,0.95), rgba(255,255,255,0.6)) -->
<!-- :mask-style="isDark?'background:linear-gradient(0deg,rgba(0,0,0,0.4),rgba(0,0,0,0),rgba(0,0,0,0.4))':'background:rgba(255,255,255,0)'" -->
	<view class="flex-1 relative" :style="{height:props.height+'rpx'}">
		<!-- #ifndef APP-NVUE -->
		<picker-view  :value="[colIndex]" @change="colchange" :style="[{height:props.height+'rpx'}]"
		:mask-style="maskStyle"
		>
		    <picker-view-column
		    :style="[{height:props.height+'rpx'}]">
		        <view  v-for="(item,index) in tmArray" :key="index" class="flex"  style="justify-content: center;height:34px;align-items:center">
		            <TmText :font-size="30" :dark="isDark" v-if="props.timeType!='month'" :label="item+props.suffix"></TmText>
		            <TmText :font-size="30" :dark="isDark" v-if="props.timeType=='month'" :label="(item+1)+props.suffix"></TmText>
		        </view>
		    </picker-view-column>
		</picker-view>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<picker-view ref="picker"  :value="[colIndex]" @change="colchange" :style="[{height:props.height+'rpx'}]"
		>
		    <picker-view-column
		    :style="[{height:props.height+'rpx'}]">
		        <view  v-for="(item,index) in tmArray" :key="index" class="flex"  style="justify-content: center;height:34px;align-items:center">
		            <TmText :font-size="30" :dark="isDark" v-if="props.timeType!='month'" :label="item+props.suffix"></TmText>
		            <TmText :font-size="30" :dark="isDark" v-if="props.timeType=='month'" :label="(item+1)+props.suffix"></TmText>
		        </view>
		    </picker-view-column>
		</picker-view>
		<view v-if="isDark" :userInteractionEnabled="false" class="top absolute l-0 t-0" :style="{height:maskHeight+'px',width:maskWidth+'px'}"></view>
		<view v-if="isDark" :userInteractionEnabled="false" class="bottom absolute l-0 b-0" :style="{height:maskHeight+'px',width:maskWidth+'px'}"></view>
		<!-- #endif -->
	</view>
</template>
<script lang="ts" setup>
import { useTmpiniaStore } from '../../tool/lib/tmpinia';
import { computed, PropType, Ref,onUpdated, watchEffect,ref,getCurrentInstance,nextTick,onMounted,watch, toRaw } from 'vue';
import { showDetail,coltimeData,timeDetailType } from './interface'
import * as dayjs from "../../tool/dayjs/esm/index"
import isSameOrBefore from '../../tool/dayjs/esm/plugin/isSameOrBefore/index';
import isSameOrAfter from '../../tool/dayjs/esm/plugin/isSameOrAfter/index';
import isBetween from '../../tool/dayjs/esm/plugin/isBetween/index';
import TmText from '../tm-text/tm-text.vue';
// #ifdef APP-PLUS-NVUE
const dom = uni.requireNativePlugin('dom')
// #endif
dayjs.default.extend(isBetween)
dayjs.default.extend(isSameOrBefore)
dayjs.default.extend(isSameOrAfter)
const DayJs = dayjs.default;
const { proxy } = getCurrentInstance();
const store = useTmpiniaStore();
const props = defineProps({
    nowtime:{
        type:String,
        default:"",
        required:true
    },
    start:{
        type:String,
        default:"",
        required:true
    },
    end:{
        type:String,
        default:"",
        required:true
    },
    timeType:{
        type:String as PropType<timeDetailType>,
        default:'year',
        required:true
    },
    //禁用的部分日期，禁用的日期将不会被选中，就算滑到了该位置，也会回弹到之前的时间。
	disabledDate:{
		type:Array as PropType<Array<Number|String|Date>>,
		default:():Array<Number|String|Date>=>[]
	},
    height:{
        type:Number,
        default:600
	},
    //日期的后缀，
	suffix:{
		type:String,
		default:''
	},
})
//父级方法。
let parent = proxy.$parent
while (parent) {
    if (parent?.tmTimeViewName == 'tmTimeViewName' || !parent) {
        break;
    } else {
        parent = parent?.$parent ?? undefined
    }
}
const tmArray:Ref<Array<number>> = ref([]);
const _nowtimeValue = computed(()=>DayJs(props.nowtime))
const colIndex  = ref(0)
const isDark = computed(() => store.tmStore.dark);
const maskHeight = computed(()=>{
	return (uni.upx2px(props.height)-34)/2
})
const maskWidth = ref(0)
const maskStyle = computed(()=>{
		let str_white = 'background-image:linear-gradient(rgba(255,255,255,0.95),rgba(255,255,255,0.6)),linear-gradient(rgba(255,255,255,0.6),rgba(255,255,255,0.95))'
	let str_black = 'background-image:linear-gradient(rgba(17, 17, 17, 1.0),rgba(106, 106, 106, 0.2)),linear-gradient(rgba(106, 106, 106, 0.2),rgba(17, 17, 17, 1.0))'
	
	// #ifdef APP-NVUE
	str_black='background-image: linear-gradient(to bottom,rgba(30, 30, 30, 0.9),rgba(104, 104, 104, 0.6))'
	// #endif
	if(!isDark.value){
		return str_white
	}
	return str_black
})
// rangeTimeArray()
watch([()=>props.start,()=>props.end],()=>{
    rangeTimeArray();
})
watch([()=>props.nowtime],(newval,oldval)=>{
    //前面相册的时间段不需要更新。
    if( DayJs(String(oldval)).isSame(String(newval),props.timeType)){
        return;
    }
    rangeTimeArray();
})
onMounted(()=>{
	nvuegetClientRect()
    nextTick(()=>{
        setTimeout(()=>{
            rangeTimeArray()
        },60)
    })
})
onUpdated(()=>nvuegetClientRect())
function getIndexNow(){
    let index  = tmArray.value.findIndex(el=>el==_nowtimeValue.value[props.timeType]());
    if(index==-1) index=0;
    if(index>=tmArray.value.length) index = tmArray.value.length-1
	// #ifdef H5
	colIndex.value = -1
	// #endif
	colIndex.value = index
}
function rangeTimeArray(){
    let _start = DayJs(props.start);
    let _end = DayJs(props.end);
    let intdate = 0
    if(props.timeType=='date'){
        intdate = 1;
    }
    if(props.timeType=='year'){
        intdate = _start.year();
    }

    if(props.timeType=='year'){
       tmArray.value = rangeNumber(intdate,_end.year());
    }else if(props.timeType=='month'){
       setd(timeDetailType.year,false)
    }else if(props.timeType=='date'){
		
       setd(timeDetailType.month,false)
    }else if(props.timeType=='hour'){
       setd(timeDetailType.day,false)
    }else if(props.timeType=='minute'){
       setd(timeDetailType.hour,false)
    }else if(props.timeType=='second'){
       setd(timeDetailType.minute,false)
    }else if(props.timeType=='second'){
       setd(timeDetailType.second,false)
    }

    function setd(type:timeDetailType,isno=true){
        if(_nowtimeValue.value.isSameOrBefore(_start,type)){
            // 这是开始的数字。
            intdate = _start[props.timeType]();
			
            tmArray.value = rangeNumber(intdate,getEndNumber(_start,true));
        }else if(_nowtimeValue.value.isSameOrAfter(_end,type)){
            tmArray.value = rangeNumber(intdate,getEndNumber(_end,isno));
        }else if(_nowtimeValue.value.isBetween(_start,_end,props.timeType,'()')){
            tmArray.value = rangeNumber(intdate,getEndNumber(_nowtimeValue.value,true));
            
        }
    }
    
    nextTick(()=>getIndexNow())
}

function getEndNumber(d,isno=true){
    let _start = DayJs(props.start);
    let _end = DayJs(props.end);
    let jh = {
            year:_end.year(),
            month:11,
            date:d.daysInMonth(),
            hour:23,
            minute:59,
            second:59,
    }
    if(isno) return jh[props.timeType];
    return d[props.timeType]();
}
function rangeNumber(from=0,to=0){
	let range:Array<number> = []
	from = from >= 0 ? from : 1
	for (let i = from; i <= to; i++) {
		range.push(i)
	}
	return range
}

function colchange(e:any){
    if(tmArray.value.length==0) return;
    
    parent?.setNowtime(tmArray.value[e.detail.value[0]],props.timeType)
   
}

function nvuegetClientRect() {
    nextTick(function () {
        // #ifdef APP-PLUS-NVUE
        dom.getComponentRect(proxy.$refs.picker, function (res) {
            if (res?.size) {
                maskWidth.value = res.size.width;
				
                if (res.size.width == 0) {
                    nvuegetClientRect()
                }
            }
        })
        // #endif
        
    })

}
</script>
<style scoped>
	.top{
		background-image: linear-gradient(to bottom,rgba(17, 17, 17, 1),rgba(36, 36, 36, 0.6));  
	}
	.bottom{
		background-image: linear-gradient(to top,rgba(17, 17, 17, 1),rgba(36, 36, 36, 0.6));  
		
	}
</style>