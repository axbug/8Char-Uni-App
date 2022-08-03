<template>
  <view class="flex" :class="[props.direction=='row'?'flex-row flex-row-center-start flex-wrap':'flex-col']">
  <slot></slot>
  </view>
</template>
<script lang="ts" setup>
/**
 * 单选框组
 * @description 单选框组中，只能放置tm-radio组件，且必须配合tm-radio组件一起使用，不可单独使用。
 */
import { computed , nextTick, provide ,ref ,watch ,getCurrentInstance ,inject, toRaw } from 'vue';
import { inputPushItem, rulesItem } from "./../tm-form-item/interface"
const emits = defineEmits(['update:modelValue','change'])
const {proxy} = getCurrentInstance();
const props = defineProps({
    disabled:{
        type:Boolean,
        default:false
    },
    defaultValue:{
        type:[String,Number,Boolean],
        default:''
    },
    modelValue:{
        type:[String,Number,Boolean],
        default:''
    },
    direction:{
        type:String,
        default:'row' //row横排，col为竖排。
    },
    //模式
    /**
     * radio:正常的单选样式。
     * button:按钮单选模式
     */
    model:{
        type:String,
        default:'radio' // radio,button
    }
})
let _cacheBoxList:Array<string|number|boolean> = [];
const _mValue = ref(props.defaultValue||props.modelValue)
//组件唯一标识。
const checkBoxkeyId = 'tmRadioBoxGroup';
watch(()=>props.modelValue,()=>{
    _mValue.value = props.modelValue;
},{deep:true})
function pushKey(key:string|number|boolean){
    _cacheBoxList.push(key);
}
nextTick(()=>{
    const _filter_key = _cacheBoxList.filter(el=>el==_mValue.value)
    if(_filter_key.length>0){
        _mValue.value = _filter_key[0];
    }
    emits('update:modelValue',_mValue.value)
})
//更新值、
function addKey(key:string|number|boolean){
    _mValue.value = key
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
let parentFormItem = proxy.$parent
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
                    return String(val).length == 0 || typeof val === null ?false:true
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
                    componentsName: 'tm-radio-group',//表单组件类型。
                    message: ev.length==0?"":ev[0].message,//检验信息提示语。
                })
            }).catch(er => {
                parentFormItem.pushCom({
                    value: _mValue.value,
                    isRequiredError: true,//true,错误，false正常 检验状态
                    componentsName: 'tm-radio-group',//表单组件类型。
                    message: er.message,//检验信息提示语。
                })
                
            })
        }
    }
}
pushFormItem()

/** -----------end------------ */
provide("tmRadioBoxDisabled",computed(()=>props.disabled))
provide("tmRadioBoxVal",computed(()=>_mValue.value))
provide("tmRadioBoxModel",computed(()=>props.model=='radio'))
defineExpose({pushKey:pushKey,addKey:addKey,checkBoxkeyId:checkBoxkeyId});
</script>
