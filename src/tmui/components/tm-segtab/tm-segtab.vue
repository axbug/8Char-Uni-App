<template>
    <view class="tm-segtab relative flex flex-col" ref="tm-segtab" :style="{ width: (props.width+props.gutter*2) + 'rpx' }">
        <tm-sheet
        :border="props.border"
        :linear="props.linear"
        :linear-deep="props.linearDeep"
        :no-level="true" :round="2" :height="props.height" :color="props.bgColor" :width="props.width"
            _class="flex-row relative" :padding="[props.gutter, props.gutter]" :margin="[0, 0]">
            <!-- #ifdef APP-NVUE -->
            <view v-if="_cId!==''" ref="tmBgEl" class="relative flex flex-row " :style="[{ width: (leftWidth+1) + 'px' }]">
                <!-- left:leftPos+'px',width:leftWidth+'px' -->
                <tm-sheet :follow-dark="props.followDark" :round="2"  class="flex-1" _class="flex-1" :color="props.color" :margin="[0, 0]"
                    :padding="[0, 0]"></tm-sheet>
            </view>
            <!-- #endif -->
            <!-- #ifndef APP-NVUE -->
            <view v-if="_cId!==''" class="relative flex flex-row  bgbtnpos"
                :style="[{ transform: 'translateX(' + leftPos + 'px)', width: (leftWidth+1) + 'px' }]">
                <!-- left:leftPos+'px',width:leftWidth+'px' -->
                <tm-sheet :follow-dark="props.followDark" :round="2" class="flex-1 flex flex-row" parenClass="flex-1" _class="flex-1 flex flex-row" :color="props.color" :margin="[0, 0]"
                    :padding="[0, 0]"></tm-sheet>
            </view>
            <!-- #endif -->
            <view class="absolute flex flex-row flex-row-center-start" :class="[`pa-${props.gutter}`,`l--${props.gutter/2}`]"
                :style="[{ width: `${props.width}rpx`, height: `${props.height - props.gutter}rpx` }]">
                <view @click="itemClick(index,item.id)" 
				:ref="'tab_'" 
				:class="['tab' + index]"
				:style="{height: `${props.height - props.gutter}rpx`}"
                    class="flex-1 flex flex-row flex-row-center-center" 
					v-for="(item, index) in _list" :key="index">
                    <tm-text :color="item.id===_cId?props.activeColor:''" :font-size="props.fontSize" :userInteractionEnabled="false" :label="item.text"></tm-text>
                </view>
            </view>
        </tm-sheet>
    </view>
</template>
<script lang="ts" setup>
/**
 * 分段器选项卡
 */
import { computed, PropType , toRaw, getCurrentInstance, ref, onMounted, nextTick, watch, Ref ,inject } from 'vue'
import { inputPushItem, rulesItem } from "./../tm-form-item/interface"

import tmSheet from '../tm-sheet/tm-sheet.vue';
import tmText from '../tm-text/tm-text.vue';
import {listitem} from './interface'
import { custom_props } from '../../tool/lib/minxs';
// #ifdef APP-PLUS-NVUE
const dom = uni.requireNativePlugin('dom')
const animation = uni.requireNativePlugin('animation')
// #endif
const { proxy } = getCurrentInstance();
const emits = defineEmits(["update:modelValue", "change", "click"])

const props = defineProps({
    ...custom_props,
    width: {
        type: Number,
        default: 600
    },
    height: {
        type: Number,
        default: 64
    },
    gutter: {
        type: Number,
        default: 2
    },
    list: {
        type: Array as PropType<Array<string | listitem>>,
        default: () => [],
        required: true
    },
    //v-model可以是index索引也可是对象id
    modelValue: {
        type: [Number,String],
        default: 0
    },
    //如果想以字段id来达到index选中效果。需要list为对象，并且提供唯一标识id字段。
    defaultValue: {
        type: [Number,String],
        default: 0
    },
    //在点击切换之前执行，返回false阻止切换，可以是Promise
    beforeChange: {
        type: [Function, Boolean],
        default: () => false
    },
    color: {
        type: String,
        default: 'white'
    },
    bgColor: {
        type: String,
        default: 'grey-3'
    },
    fontSize: {
        type: Number,
        default: 24
    },
    //被选中后的文字色
    activeColor:{
        type:String,
        default:'primary'
    }
})
const leftPos = ref(0)
const leftWidth = ref(0)
let timid = uni.$tm.u.getUid()
const _list = computed(()=>{
	let templist = [];
	for(let i=0,len=props.list.length;i<len;i++){
		let al:listitem = {text:'',id:i};
		let el = props.list[i];
		if(typeof el == 'string'||typeof el == 'number'){
		    al.text = el;
		}else if(typeof el == 'object'){
		    al.text = el?.text??""
		    
		    if(typeof el?.id !='undefined'){
		        al.id = el['id']
		    }
		}
		templist.push(al)
	}
	
    return templist;
})

//当前值。
const _cId:Ref<string|number> = ref(props.defaultValue ?? 0)
//如果list提供的是对象，想以id来选中定位，而不是inde索引则需要转换。
function zhunhuanid(val:string|number){
    let index = _list.value.findIndex(el=>el.id == val)
    return index;
}

async function itemClick(index: number,id:number|string) {
    emits("click", index)
    if (typeof props.beforeChange === 'function') {
        uni.showLoading({ title: '...', mask: true })
        let p = await props.beforeChange(index);
        if (typeof p === 'function') {
            p = await p(index);
        }
        uni.hideLoading()
        if (!p) return;
    }
    if (_cId.value === id) return;
   _cId.value = id;
    getDomRectBound(index)
    emits("change", _cId.value)
    emits("update:modelValue", _cId.value)
	pushFormItem()
}
watch([() => props.modelValue,()=>props.list], () => {
    _cId.value = props.modelValue;
},{deep:true})
watch([_cId], () => {
    initPos()
},{deep:true})
onMounted(() => {
   initPos()
})
//定位背景按钮位置。
function initPos(){
	let indexel = _list.value.findIndex(el=>el.id === _cId.value)
	clearTimeout(timid)
	timid = setTimeout(()=>{
	    nextTick(()=>getDomRectBound(indexel))
	},300)
}
function getEl(el) {
    if (typeof el === 'string' || typeof el === 'number') return el;
    if (WXEnvironment) {
        return el.ref;
    } else {
        return el instanceof HTMLElement ? el : el.$el;
    }
}
function getDomRectBound(idx: number) {
    // #ifdef APP-NVUE
    dom.getComponentRect(proxy.$refs['tm-segtab'], function (PARENAREDS) {
        if (PARENAREDS?.size) {
            let parentleft = Math.floor((PARENAREDS.size.left ?? 0));
            dom.getComponentRect(proxy.$refs['tab_'][idx], function (res) {
                if (res?.size) {
                    const { left, top, width } = res.size
                    let domx = getEl(proxy.$refs['tmBgEl']);
                    leftWidth.value = Math.floor((width ?? 0));
                    leftPos.value = Math.floor((left ?? 0) - uni.upx2px(props.gutter)-parentleft);
                    animation.transition(proxy.$refs['tmBgEl'], {
                        styles: {
                            transform: 'translateX('+leftPos.value +'px)',
                        },
                        duration: 200, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    },()=>{
                        
                    })
                }
            })

        }
    })
    // #endif
    // #ifndef APP-NVUE
    uni.createSelectorQuery().in(proxy).select('.tm-segtab').boundingClientRect((nodeParent) => {
        let parentleft = (nodeParent?.left ?? 0);
        uni.createSelectorQuery().in(proxy).select('.tab' + idx).boundingClientRect((node) => {
            if(!node) return;
            leftPos.value = (node?.left ?? 0) - uni.upx2px(props.gutter) - parentleft;
            leftWidth.value = (node?.width ?? 0) - 0
        }).exec()
    }).exec()
    // #endif
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
                    return val === "" ?false:true
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
                let vr = await el.validator(_cId.value)
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
                    value: _cId.value,
                    isRequiredError: false,//true,错误，false正常 检验状态
                    componentsName: 'tm-segtab',//表单组件类型。
                    message: ev.length==0?"":ev[0].message,//检验信息提示语。
                })
            }).catch(er => {
                parentFormItem.pushCom({
                    value: _cId.value,
                    isRequiredError: true,//true,错误，false正常 检验状态
                    componentsName: 'tm-segtab',//表单组件类型。
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
		_cId.value = ""
		emits('update:modelValue',"")
		pushFormItem(false)
    }
})

/** -----------end------------ */

</script>
<style scoped>
.bgbtnpos {
    transition-timing-function: ease;
    transition-duration: 0.2s;
    transition-property: left, width, transform;
    transition-delay: 0s;
}
</style>