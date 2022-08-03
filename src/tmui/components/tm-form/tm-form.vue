<template>
  <tm-sheet :round="3" _class="flex flex-col overflow" :padding="props.padding" :margin="props.margin">
      <slot></slot>
  </tm-sheet>
</template>

<script lang="ts" setup>
/**
 * 表单
 * @description 注意，内部需要放置tm-form-item,不限层级，可随意布局。
 * 对以下表单类组件进行字段收集。
 * 	"tm-radio-group","tm-checkbox-box",
    "tm-input","tm-rate","tm-slider",
    "tm-segtab","tm-switch","tm-upload"
 */
import { computed, PropType, provide ,ref, watchEffect,Ref, toRaw,shallowReadonly, nextTick, isProxy } from "vue";
import { formItem } from "./interface";
import tmSheet from "../tm-sheet/tm-sheet.vue"
/**
 * 事件说明
 * @method submit 提交表单时触发。
 * @method reset 重置表单时触发
 * @method validate 校验表单时触发
 * @method clearValidate 清除校验状态时触发。
 */
const emits = defineEmits(["submit","reset","validate","clearValidate","update:modelValue"])
const props = defineProps({
    modelValue:{
        type:Object as PropType<Object>,
        default:()=>{
            return {};
        },
        required:true
    },
    margin:{
        type:Array as PropType<Array<number>>,
        default:()=>[32,24]
	},
	padding:{
		type:Array as PropType<Array<number>>,
		default:()=>[16,0]
	},
    //表单标签是竖还是横排列。
    //vertical,horizontal
    layout:{
        type:String,
        default:"horizontal"
    },
    //如果为0表示自动宽度。
    labelWidth:{
        type:Number,
        default:160
    },
    //标签对齐方式
    labelAlign:{
        type:String,
        default:"left"
    },
	//显示下划线。
	border:{
		type:Boolean,
		default:true
	}
})
const _modelVal = ref({})
//备份，重置时，使用。
const _backModelVal = {...props.modelValue}
watchEffect(()=>_modelVal.value = props.modelValue);
//收集的字段。状态。它与_modelVal是有区别的，用户提供的字段，不一定就会在页面中存在，需要与已经渲染的字段进行匹配
const _callBackModelVal:Ref<Array<formItem>> = ref([])
const tmFormComnameId = "tmFormId"
//允许被推送的组件清单类型.其它的组件不会被收集进行检验。
const safeFormCom = ref([
    "tm-radio-group","tm-checkbox-box",
    "tm-input","tm-rate","tm-slider",
    "tm-segtab","tm-switch","tm-upload"
    ])
//需要对子级，响应的方法。
// 这里为了更好的性能不再使用vue2版本中children方式，而是采用了provide方式与父子间传递。
const formFunCallBack = ref("")
provide("tmFormFun",computed(()=>formFunCallBack.value))
provide("tmFormLabelWidth",computed(()=>props.labelWidth))
provide("tmFormLabelAlign",computed(()=>props.labelAlign))
provide("tmFormLayout",computed(()=>props.layout))
provide("tmFormBorder",computed(()=>props.border))
let timid = 56321326898746;
function reset(){
    formFunCallBack.value = ""
    nextTick(()=>{
        formFunCallBack.value = 'reset'
        clearTimeout(timid)
        timid = setTimeout(function() {
            emits("reset")
            emits("update:modelValue",{..._backModelVal})
        }, 200);
    })
}
function clearValidate(){
    formFunCallBack.value = ""
    nextTick(()=>{
        formFunCallBack.value = 'clearValidate'
        nextTick(()=>{
            emits("clearValidate")
        })
    })
}
function submit(){
    //发送检验状态。
    formFunCallBack.value = ''
    nextTick(()=>{
        formFunCallBack.value = 'validate'
		let isPass = true;
		let par = toRaw(_callBackModelVal.value);
		uni.$tm.u.throttle(()=>{
			for(let i=0,len=par.length;i<len;i++){
			    if(par[i].isRequiredError==true){
			        isPass = false;
			        break;
			    }
			}
			let data = {..._modelVal.value};
			 par.forEach(el=>{
			   setObjectVal(data,el.field,el.value)
			})
			//validate是否检验通过。
			emits("submit",{data:data,validate:isPass})
		},200,false)
    })
}
//执行表单检验，不会返回任何值。
function validate(){
    formFunCallBack.value = ''
    nextTick(()=>{
        formFunCallBack.value = 'validate'
        nextTick(()=>{
            emits("reset")
        })
    })
}



function pushKey(item:formItem){
    if(item.componentsName==""&&!safeFormCom.value.includes(item.componentsName)) return;
    let idsIndex = _callBackModelVal.value.findIndex(el=>el.id==item.id);
    if(idsIndex==-1){
        _callBackModelVal.value.push(item);
    }else{
        _callBackModelVal.value[idsIndex] = item;
    }
    
}
function delKey(item:formItem){
    let idsIndex = _callBackModelVal.value.findIndex(el=>el.id==item.id);
    if(idsIndex>-1){
        _callBackModelVal.value.splice(idsIndex,1)
    }
}
function setObjectVal(obj:any, field="", val:any){
    if(field=="") return obj;
    var arr = field.split('.');
    while (arr.length > 1) {
        let key = String(arr.shift());
        obj = isProxy(obj[key])?toRaw(obj[key]):obj[key];
    }
   return obj[arr[0]] = isProxy(val)?toRaw(val):val;
}
/**
 * ref函数
 * @method submit 提交表单
 * @method reset 重置表单
 * @method validate 手动校验表单
 * @method clearValidate 清除校验状态
 */
defineExpose({reset,validate,clearValidate,submit,pushKey,delKey,tmFormComnameId})
</script>

<style>

</style>