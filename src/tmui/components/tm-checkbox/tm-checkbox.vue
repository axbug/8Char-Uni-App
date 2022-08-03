<template>
    <view class="flex flex-row" :class="[_disabled?'opacity-5':'']">
        <view @click="hanlerClick"  class="flex flex-row flex-row-center-start flex-1">
           
                <tm-sheet
                :linear="props.linear"
                :linearDeep="props.linearDeep"
                :followTheme="props.followTheme"
                :followDark="props.followDark"
                :dark="props.dark"
                :shadow="props.shadow"
                :userInteractionEnabled="false"
                :width="props.size" 
                :height="props.size" 
                :text="(!props.indeterminate&&!_checked)||_disabled" 
                :border="props.border" 
                :borderStyle="props.borderStyle" 
                :transprent="props.transprent"
                :padding="[0,0]"
                :margin="[16,8]"
                :color="_disabled?'white':props.color"
                :round="props.round"
                _class="flex-row flex-row-center-center"
                
                >
                    <view  v-if="!props.closeAni">
                        <tm-translate   :duration="100" v-if="_checked&&!props.indeterminate" name="zoom"  style="line-height: 1;" >
                            <tm-icon  :font-size="props.size*0.54" :name="props.icon" ></tm-icon>
                        </tm-translate>
                        <tm-translate v-if="props.indeterminate" :duration="100"  name="zoom"  style="line-height: 1;" >
                            <tm-icon  :font-size="props.size*0.54" name="tmicon-minus" ></tm-icon>
                        </tm-translate>
                    </view>
                    <view   v-if="props.closeAni">
                        <tm-icon  v-if="_checked&&!props.indeterminate" :font-size="props.size*0.54" :name="props.icon" ></tm-icon>
                        <tm-icon  v-if="props.indeterminate" :font-size="props.size*0.54" name="tmicon-minus" ></tm-icon>
                    </view>
                </tm-sheet>
                <slot>
                    <tm-text  :userInteractionEnabled="false" :font-size="props.fontSize" :label="props.label"></tm-text>
                </slot>
        </view>
    </view>
</template>
<script lang="ts" setup>
/**
 * 复选框
 * @description 复选框可以单独使用，也可以配合复选框组tm-checkbox-group使用。
 */
import tmSheet from '../tm-sheet/tm-sheet.vue';
import tmIcon from '../tm-icon/tm-icon.vue';
import tmText from '../tm-text/tm-text.vue';
import tmTranslate from '../tm-translate/tm-translate.vue';
import tmCheckboxGropup from '../tm-checkbox-group/tm-checkbox-group.vue';
import { custom_props } from '../../tool/lib/minxs';
import { ref ,computed,watch ,inject ,getCurrentInstance, watchEffect, ComponentInternalInstance } from 'vue';
const CheckboxGropup = ref<InstanceType<typeof tmCheckboxGropup> | null>(null)
const {proxy} = <ComponentInternalInstance>getCurrentInstance();
const emits = defineEmits(['update:modelValue','change','click'])
const props = defineProps({
    ...custom_props,
	followTheme: {
		type: [Boolean,String],
		default: true
	},
    size:{
        type:Number,
        default:42
    },
    transprent:{
        type:Boolean,
        default:false
    },
    color:{
        type:String,
        default:'primary'
    },
    round:{
        type:Number,
        default:2
    },
    border:{
        type:Number,
        default:2
    },
    //选项值，选中后返回的值。
    value:{
        type:[String,Number,Boolean],
        default:true,
    },
    /**
     * v-model双向绑定，如果选中后以数组形式给出value值。
     */
    modelValue:{
        type:[String,Number,Boolean],
        default:false
    },
    label:{
        type:[String,Number],
        default:''
    },
    //默认是否选中状态。不受上方的modelValue控制，直接选中。
    defaultChecked:{
        type:[Boolean],
        default:false
    },
     //选中前的勾子。返回false将阻止选中。也可以返回 Promise异步
    beforChecked:{
        type:[Function,String,Boolean],
        default:()=>{
            return false;
        }
    },
    disabled:{
        type:Boolean,
        default:false
    },
    fontSize:{
        type:Number,
        default:28
    },
    //半选中状态。
    indeterminate:{
        type:[Boolean,String],
        default:false
    },
    //是否关闭动画 ，对于大批量的数据时，建议关闭动画。
    closeAni:{
        type:[Boolean,String],
        default:false
    },
     /**
     * 自定义选中的图标名称
     */
    icon:{
        type:String,
        default:"tmicon-check"
    }
})

const _checked = ref(props.defaultChecked??false)
const _groupCheckedVal = inject('tmCheckedBoxVal',computed(()=>[]));
const tmCheckedBoxDisabled = inject('tmCheckedBoxDisabled',computed(()=>false));
const tmCheckedBoxMax = inject('tmCheckedBoxMax',computed(()=>false));
const _disabled = computed(()=>props.disabled||tmCheckedBoxDisabled.value)
//父级方法。
let parent:any = <InstanceType<typeof tmCheckboxGropup> | null>proxy?.$parent
while (parent) {
    if(parent?.checkBoxkeyId=='tmCheckBoxGroup'||!parent){
        break;
    }else{
        parent = parent?.$parent??undefined
    }
}
if(parent){
    parent.pushKey(props.value)
}

/** -----------form专有------------ */
//父级方法。
const tmFormFun = inject("tmFormFun",computed(()=>""))
watch(tmFormFun,()=>{
    if(tmFormFun.value=='reset'){
       emits('update:modelValue',"")
       if(parent){
           parent?.delKey(props.value)
       }
       _checked.value = false
    }
})

/** -----------end------------ */

function vailChecked(){
    let checked_val = false;
    if(props.modelValue===props.value&&typeof props.value !=='undefined' && props.value!=='' && props.modelValue !==''){
        checked_val = true;
    }
    let index  = _groupCheckedVal.value.findIndex(el=>el===props.value)
    if(index>-1){
        checked_val = true;
    }
    return checked_val;
}
if(vailChecked()){
    _checked.value = true;
    emits('update:modelValue',props.value)
}
async function hanlerClick(){
    if(_disabled.value) {
        return;
    }
    if(tmCheckedBoxMax.value&&!_checked.value){
        uni.showToast({title:'超最大选择',icon:'error'})
        return;
    }
     if (typeof props.beforChecked === 'function') {
        uni.showLoading({title:"...",mask:true})
        let p = await props.beforChecked();
        if(typeof p === 'function'){
            p = await p();
        }
        uni.hideLoading();
        if (!p) return;
    }
    _checked.value = !_checked.value;
    if(_checked.value){
        emits('update:modelValue',props.value)
        if(parent){
            parent.addKey(props.value)
        }
    }else{
        emits('update:modelValue',false)
        if(parent){
            parent.delKey(props.value)
        }
    }
    emits('change',_checked.value)
}
watch([()=>props.modelValue,_groupCheckedVal],()=>{
    _checked.value = vailChecked()
    
})

</script>
