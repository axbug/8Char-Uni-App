<template>
	<view class="flex flex-row" >
		<timePanelVue v-if="showCol.year" :suffix="props.showSuffix.year" :height="props.height" :disabledDate="props.disabledDate" :time-type="timeDetailType.year" :start="_startTime" :end="_endTime" :nowtime="_nowtimeValue" class="flex-1"></timePanelVue>
		<timePanelVue v-if="showCol.month" :suffix="props.showSuffix.month" :height="props.height" :disabledDate="props.disabledDate" :time-type="timeDetailType.month" :start="_startTime" :end="_endTime" :nowtime="_nowtimeValue" class="flex-1"></timePanelVue>
		<timePanelVue v-if="showCol.day" :suffix="props.showSuffix.day" :height="props.height" :disabledDate="props.disabledDate" :time-type="timeDetailType.day" :start="_startTime" :end="_endTime" :nowtime="_nowtimeValue" class="flex-1"></timePanelVue>
		<timePanelVue v-if="showCol.hour" :suffix="props.showSuffix.hour" :height="props.height" :disabledDate="props.disabledDate" :time-type="timeDetailType.hour" :start="_startTime" :end="_endTime" :nowtime="_nowtimeValue" class="flex-1"></timePanelVue>
		<timePanelVue v-if="showCol.minute" :suffix="props.showSuffix.minute" :height="props.height" :disabledDate="props.disabledDate" :time-type="timeDetailType.minute" :start="_startTime" :end="_endTime" :nowtime="_nowtimeValue" class="flex-1"></timePanelVue>
		<timePanelVue v-if="showCol.second" :suffix="props.showSuffix.second" :height="props.height" :disabledDate="props.disabledDate" :time-type="timeDetailType.second" :start="_startTime" :end="_endTime" :nowtime="_nowtimeValue" class="flex-1"></timePanelVue>
	</view>
</template>

<script lang="ts" setup>
/**
 * 时间选择
 * @description 嵌入在页面的时间选择器。
 */
import { computed, PropType, watchEffect,ref, toRaw,onMounted,nextTick, watch } from 'vue';
import { showDetail,coltimeData,timeDetailType } from './interface'
import * as dayjs from "../../tool/dayjs/esm/index"
import timePanelVue from './time-panel.vue';

const emits = defineEmits(['update:modelValue','update:modelStr','change'])
const tmTimeViewName = "tmTimeViewName"
const DayJs = dayjs.default;
const props = defineProps({
	//这里是动态返回时间戳。这是一个标准的时间，不管showDetail是如何设置都将不影响这里的输出。
	modelValue:{
		type:[Number,String,Date],
		default:''
	},
	//这里和modelValue不一样，它只代表格式化输出显示，因此这里可能并不是一个有效的时间值。
	/**
	 * 比如:format为"MM/DD",那这里就会显示12/10这样的时间格式，因此并不是一个正确的时间，
	 * 这里主要是为了方便表单上页面的显示控制输入。如果真要保存到数据库，你应该保存modelValue的值。
	 */
	modelStr:{
		type:[String],
		default:''
	},
	defaultValue:{
		type:[Number,String,Date],
		default:''
	},
	//禁用的部分日期，禁用的日期将不会被选中，就算滑到了该位置，也会回弹到之前的时间。
	/**
	 * 现在暂时只禁用到天，也就是一个时间到天这如果==下面的禁用日期，就会选不中。
	 */
	disabledDate:{
		type:Array as PropType<Array<Number|String|Date>>,
		default:():Array<Number|String|Date>=>[]
	},
	//展示格式。最终影响到modelStr输出格式的内容。
	format:{
		type:String,
		default:"YYYY/MM/DD"
	},
	//需要展现的时间格式类型
	showDetail:{
		type:Object as PropType<showDetail>,
		default:()=>{
			return {
				year:true,
				month:true,
				day:true,
				hour:false,
				minute:false,
				second:false
			}
		}
	},
	//日期的后缀，
	showSuffix:{
		type:Object,
		default:()=>{
			return {
				year:'年',
				month:'月',
				day:'日',
				hour:'时',
				minute:'分',
				second:'秒'
			}
		}
	},
	start:{
		type:[Number,String,Date],
		default:'2008/01/01 00:00:00'
	},
	end:{
		type:[Number,String,Date],
		default:''
	},
	height:{
		type:Number,
		default:300
	}
})

const _nowtime = ref(DayJs(props.defaultValue).isValid()?DayJs(props.defaultValue):DayJs());
const _nowtimeValue = computed(()=>_nowtime.value.format())

const _startTime = computed(()=>{
	return DayJs(props.start).isValid()?DayJs(props.start).format():DayJs('2008/01/01 00:00:00').format();
})
const _endTime = computed(()=>{
	return DayJs(props.end).isValid()?DayJs(props.end).format():DayJs().format();
})

const showCol = computed(()=>props.showDetail)

function setNowtime(data:number,type:timeDetailType){
	 let d= DayJs(toRaw(_nowtime.value));
	 
	 const old = _nowtimeValue.value;
	_nowtime.value  =  DayJs(d[type](data))
	if(isDisabledDate(_nowtime.value.format())){
		nextTick(()=>_nowtime.value  =  DayJs(old))
		return;
	}
	emits('update:modelValue',_nowtime.value.format("YYYY/MM/DD HH:mm:ss"))
	emits('update:modelStr',_nowtime.value.format(props.format))
	emits('change',_nowtime.value.format(props.format))
}
//检测当前选中的时间是否处于被禁用的日期中。
function isDisabledDate(nowtime:string){
	let d = DayJs(nowtime)
    let len = props.disabledDate.filter(el=>{
        return d.isSame(el,timeDetailType.day)
    })
    return len.length>0;
}
watch(()=>props.modelValue,(newval,oldval)=>{
	if(DayJs(props.modelValue).isValid()==false||!oldval) return;
	_nowtime.value = DayJs(props.modelValue)
	emits('update:modelStr',_nowtime.value.format(props.format))
})

onMounted(()=>{
	nextTick(()=>{
		emits('update:modelValue',_nowtime.value.format(props.format))
		emits('update:modelStr',_nowtime.value.format(props.format))
	})
})
defineExpose({tmTimeViewName,setNowtime})
</script>

<style>

</style>
