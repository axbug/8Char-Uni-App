<template>
    <view class="flex flex-row flex-row-center-start" @click.stop="">
        <view v-for="(item,index) in _count" :key="item" :class="[`pr-${gutter}`,props.disabled?'opacity-5':'']">
            <tm-icon  :follow-dark="false" :color="(item<=_start?_color:'grey-2')" @click="startClick(item)" :font-size="props.size" :name="props.icon"  ></tm-icon>
        </view>
        <slot><TmText :dark="isDark"  v-if="showLabel" :color="_color" :label="_label"></TmText></slot>
    </view>    
</template>
<script lang="ts" setup>
import { computed,ref, watch,getCurrentInstance,inject, toRaw } from 'vue';
import tmIcon from '../tm-icon/tm-icon.vue';
import { inputPushItem, rulesItem } from "./../tm-form-item/interface"
import { custom_props,computedDark } from '../../tool/lib/minxs';
import { useTmpiniaStore } from '../../tool/lib/tmpinia';
import TmText from '../tm-text/tm-text.vue';
const store = useTmpiniaStore();
const emits = defineEmits(['click','change','update:modelValue'])
const {proxy} = getCurrentInstance();
const props = defineProps({
    ...custom_props,
    count:{
        type:Number,
        default:5
    },
    modelvalue:{
        type:Number,
        default:0
    },
    defaultValue:{
        type:Number,
        default:0
    },
    //只读式，样式无变化，可以触发点击事件，但同样无法切换数值。
    readonly:{
        type:Boolean,
        default:false
    },
    //禁用后无法点击和切换值
    disabled:{
        type:Boolean,
        default:false
    },
    icon:{
        type:String,
        default:'tmicon-collection-fill'
    },
    size:{
        type:Number,
        default:42
    },
    //可以是数据也可以是单独主题名称。如果出现多个主题名称时。颜色将会对应count出现。比如1星是红，2星是蓝。依此类推。
    color:{
        type:[Array,String],
        default:'orange'
    },
    //图标之间的间距
    gutter:{
        type:Number,
        default:16
    },
    	//是否跟随全局主题的变换而变换
	followTheme: {
		type: [Boolean, String],
		default: true
	},
	//暗黑
	dark: {
		type: [Boolean, String],
		default: false
	},
	//是否跟随主题全局切换暗黑模式。
	followDark: {
		type: [Boolean, String],
		default: true
	},
    //需要展示在右边的分值，默认为空即显示星数值。如果提供了其它值，就不显示默认的，比如9.6分
    label:{
        type:String,
        default:''
    },
    showLabel:{
        type:Boolean,
        default:false
    }
})

const _count = computed(()=>props.count)
const _start = ref(props.defaultValue)
// 设置响应式全局组件库配置表。
const tmcfg = computed(() => store.tmStore);
const isDark = computed(() => computedDark(props, tmcfg.value));
const _color = computed(()=>{
    if(props.followTheme&&tmcfg.value.color) return tmcfg.value.color;
    if(typeof props.color == 'string') return props.color;
    if(Array.isArray(props.color)){
        if(props.color[_start.value-1]){
            return props.color[_start.value-1]
        }

        return props.color[props.color.length-1];
    }
    return 'grey-2'
})
const _label = computed(()=>{
    if(props.label!='') return props.label;
    return _start.value+'.0';
})
watch(()=>props.modelvalue,()=>{
    let valueStart = props.modelvalue>=_count.value?_count.value:props.modelvalue
    _start.value =valueStart<=0?0:valueStart
})
function startClick(index:number){
    if(props.disabled) return;
    if(props.readonly){
         emits('click',index-1)
         return;
    }
    _start.value = index;
    emits('change',_start.value)
    emits('update:modelValue',_start.value)
    emits('click',index-1)
	pushFormItem()
}

/** -----------form专有------------ */
//父级方法。
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
                    return val == 0?false:true
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
                let vr = await el.validator(_start.value)
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
                    value: _start.value,
                    isRequiredError: false,//true,错误，false正常 检验状态
                    componentsName: 'tm-rate',//表单组件类型。
                    message: ev.length==0?"":ev[0].message,//检验信息提示语。
                })
            }).catch(er => {
                parentFormItem.pushCom({
                    value: _start.value,
                    isRequiredError: true,//true,错误，false正常 检验状态
                    componentsName: 'tm-rate',//表单组件类型。
                    message: er.message,//检验信息提示语。
                })
                
            })
        }
    }

    
}
pushFormItem()
const tmFormFun = inject("tmFormFun",computed(()=>""))
watch(tmFormFun,()=>{
    if(tmFormFun.value=='reset'){
		_start.value = 0
		emits('update:modelValue',_start.value)
		pushFormItem(false)
    }
})

/** -----------end------------ */

</script>