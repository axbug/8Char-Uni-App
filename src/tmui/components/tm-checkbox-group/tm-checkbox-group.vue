<template>
  <view class="flex" :class="[props.direction=='row'?'flex-row flex-row-center-start':'flex-col']" :style="{flexWrap:'wrap'}">
  <slot></slot>
  </view>
</template>
<script lang="ts" setup>
import { computed , nextTick, provide ,ref ,watch ,getCurrentInstance,inject, toRaw, ComponentInternalInstance } from 'vue';
import { inputPushItem, rulesItem } from "./../tm-form-item/interface"
const emits = defineEmits(['update:modelValue','change'])
const {proxy} = <ComponentInternalInstance>getCurrentInstance()
const props = defineProps({
    disabled:{
        type:Boolean,
        default:false
    },
    //最大选中数量。
    max:{
        type:Number,
        default:999
    },
    defaultValue:{
        type:Array,
        default:()=>[]
    },
    modelValue:{
        type:Array,
        default:()=>[]
    },
    direction:{
        type:String,
        default:'row' //row横排，col为竖排。
    }
})
let _cacheBoxList:Array<string|number|boolean> = [];
//去重
const _mValue = ref([...new Set([...props.defaultValue,...props.modelValue])])
//组件唯一标识。
const checkBoxkeyId = 'tmCheckBoxGroup';
watch(()=>props.modelValue,()=>{
    _mValue.value = props.modelValue;
},{deep:true})
const _maxChecked = computed(()=>_mValue.value.length>=props.max??0)
function pushKey(key:string|number|boolean){
    _cacheBoxList.push(key);
}
nextTick(()=>{
    //只取有用的交集数据，不在列表中的需要过滤掉。
    let a = new Set(_mValue.value);
    let b = new Set(_cacheBoxList);
    const _filter_key = new Set([...b].filter(x=>a.has(x)))
    _mValue.value = [..._filter_key];
    emits('update:modelValue',_mValue.value)
})
function addKey(key:string|number|boolean){
    let seletedKeys = new Set(_mValue.value)
    seletedKeys.add(key)
    _mValue.value=[...seletedKeys];
    emits('change',_mValue.value)
    emits('update:modelValue',_mValue.value)
	pushFormItem()
}
function delKey(key:string|number|boolean){
     let seletedKeys = new Set(_mValue.value)
    seletedKeys.delete(key)
    _mValue.value=[...seletedKeys]
    emits('change',_mValue.value)
    emits('update:modelValue',_mValue.value)
	pushFormItem()
}
/** -----------form专有------------ */
const rulesObj = inject("tmFormItemRules",computed<Array<rulesItem>>(()=>{
    return [
        {
            message:"请选择",
            required:false,
            validator:false
        }
    ]
}))
//父级方法。
let parentFormItem:any = proxy?.$parent
while (parentFormItem) {
    if (parentFormItem?.tmFormComnameFormItem == 'tmFormComnameFormItem' || !parentFormItem) {
        break;
    } else {
        parentFormItem = parentFormItem?.$parent ?? undefined
       
    }
}
const validate =(rules:Array<rulesItem>)=>{
    rules = rules.map(el=>{
        if(typeof el.validator === "function" && el.required===true){
            return el
        }else if(typeof el.validator === "boolean" && el.required===true){
            return {
                ...el,
                validator:(val:string|number)=>{
                    return String(val).length == 0?false:true
                }
            }
        }else{
            return {
                ...el,
                validator:(val:string|number)=>{
                    return true
                }
            }
        }
        
    })
    let rules_filter:Array<rulesItem> = rules.filter(el=>{
        return typeof el.validator === "function" && el.required===true
    })
    let rules_fun:Array<Promise<rulesItem>> = rules_filter.map(el=>{
        return new Promise(async (res,rej)=>{
            if(typeof el.validator ==='function'){
                let vr = await el.validator(_mValue.value)
                if(vr){
                    res({
                        message:String(el.message),
                        validator:true
                    })
                }else{
                    rej({
                        message:el.message,
                        validator:false
                    })
                }
            }else{
                res({
                    message:el.message,
                    validator:true
                })
            }
        })
    })
    return Promise.all(rules_fun)
}
async function pushFormItem(isCheckVail = true){
    if (parentFormItem) {
        if (isCheckVail) {
            validate(toRaw(rulesObj.value)).then(ev => {
                parentFormItem.pushCom({
                    value: _mValue.value,
                    isRequiredError: false,//true,错误，false正常 检验状态
                    componentsName: 'tm-checkbox-group',//表单组件类型。
                    message: ev.length==0?"":ev[0].message,//检验信息提示语。
                })
            }).catch(er => {
                parentFormItem.pushCom({
                    value: _mValue.value,
                    isRequiredError: true,//true,错误，false正常 检验状态
                    componentsName: 'tm-checkbox-group',//表单组件类型。
                    message: er.message,//检验信息提示语。
                })
                
            })
        }
    }
}
pushFormItem()

/** -----------end------------ */

provide("tmCheckedBoxDisabled",computed(()=>props.disabled))
provide("tmCheckedBoxVal",computed(()=>_mValue.value))
provide("tmCheckedBoxMax",_maxChecked)
defineExpose({pushKey:pushKey,addKey:addKey,delKey:delKey,checkBoxkeyId:checkBoxkeyId});
</script>
