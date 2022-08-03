<template>
    <tm-sheet :margin="props.margin" :padding="props.padding"  >
        <view :class="['flex',tmFormLayout=='horizontal'?'flex-row flex-row-center-start':'flex-col']">
			<view v-if="_label" :style="[{width:tmFormLabelWidth+'rpx'}]" class="mr-32 flex flex-col" 
            :class="[tmFormLabelAlign=='right'?'flex-col-center-end':'',tmFormLayout!='horizontal'?'mb-24':'']">
				<tm-text :color="tmFormFun=='validate'&&item.isRequiredError==true?'red':''" :font-size="30" :label="_label"></tm-text>
			</view>
			<view class="flex-1" :style="[tmFormLayout=='horizontal'?{width: '0px'}:'']">
			    <view>
					<slot></slot>
				</view>
			</view>
		</view>
		<view class="pt-12" v-if="tmFormFun=='validate'&&item.isRequiredError==true&&props.showError">
			<tm-text color="red" :font-size="22" :label="item.message"></tm-text>
		</view>
		<view v-if="tmFormBorder">
			<view :class="[`mt-${props.margin[1]*2}`]"></view>
			<tm-divider :margin="[0,0]" ></tm-divider>
		</view>
    </tm-sheet>
</template>
<script lang="ts" setup>
/**
 * 表单项目
 * @description 只能放置在tm-from里面，不限层级。但不能嵌套使用。
 */
import { computed, PropType, provide,ref,getCurrentInstance, onUnmounted,Ref ,inject, ComponentInternalInstance } from "vue";
import tmSheet from "../tm-sheet/tm-sheet.vue"
import tmText from "../tm-text/tm-text.vue"
import tmDivider from "../tm-divider/tm-divider.vue"
import { rulesItem ,inputPushItem} from "./interface";
import { formItem } from "./../tm-form/interface";
const {proxy} = <ComponentInternalInstance>getCurrentInstance();
const tmFormComnameFormItem = "tmFormComnameFormItem"
const props = defineProps({
    label:{
        type:String,
        default:""
    },
	margin:{
		type:Array as PropType<Array<number>>,
		default:()=>[12,12]
	},
	padding:{
		type:Array as PropType<Array<number>>,
		default:()=>[0,0]
	},
    //如果在forom绑定的model为深层对象，这里的名称需要如下:
    //比如model = {a:2,b:{c:333}}
    //如果想绑定c,则field = "b.c"
    field:{
        type:String,
        default:""
    },
    //表彰底部的单项注意说明。
    help:{
        type:String,
        default:""
    },
    //是否必填
    required:{
        type:Boolean,
        default:false
    },
    //检验规则
    rules:{
        type:[Object ,Array] as PropType<Array<rulesItem>|rulesItem>,
        default:()=>{
            return [{validator:false,required:false}];
        }
    },
    //显示下划线。
	border:{
		type:Boolean,
		default:null
	},
	showError:{
		type:Boolean,
		default:true
	}
	
})
const item:Ref<formItem> = ref({
    label:"",//标签名称。
    field:props.field,//字段名称key.
    value:null,
    isRequiredError:true,//true,错误，false正常 检验状态
    message:"",//检验信息提示语。
    id:uni.$tm.u.getUid(1),//表单唯一标识id
    componentsName:"",//表单组件类型。
})
const tmFormLabelWidth = inject("tmFormLabelWidth",computed(()=>100))
const tmFormLabelAlign = inject("tmFormLabelAlign",computed(()=>"left"))
const tmFormLayout = inject("tmFormLayout",computed(()=>"horizontal"))
const tmFormBorder_inject = inject("tmFormBorder",computed(()=>true))
const tmFormBorder = computed(()=>{
    if(props.border!==null&&typeof props.border === 'boolean') return props.border;
    return tmFormBorder_inject.value
})
const _label = computed(()=>props.label)
//父级方法。
let parent = proxy?.$parent
while (parent) {
    if (parent?.tmFormComnameId == 'tmFormId' || !parent) {
        break;
    } else {
        parent = parent?.$parent ?? undefined
    }
}
//预先推送。
pushCom();
//卸载后需要清空。
onUnmounted(()=>{
    delCom();
})
provide('tmFormItemRules',computed(()=>{
	let defaultrs:Array<rulesItem> = []
	if(Array.isArray(props?.rules)){
		props?.rules.forEach(el=>{
            defaultrs.push(
                {
                    message:el?.message??"请填写必要的内容",
                    required:el?.required??props.required,
                    validator:el?.validator??false
                }
            )
        })
	}else{
		defaultrs = [{
		    message:props?.rules?.message??"请填写必要的内容",
		    required:props.rules?.required??props.required,
		    validator:props.rules?.validator??false
		}]
	}
	
    return defaultrs;
}))
//向父级推表单类组件。
function pushCom(itemComval?:inputPushItem){
    if(parent){
        item.value = {...item.value,...(itemComval??{})};
        parent.pushKey({...item.value})
    }
}
function delCom(){
    if(parent){
       parent.delKey(item.value)
    }
}

const tmFormFun = inject("tmFormFun",computed(()=>""))
defineExpose({pushCom,delCom,tmFormComnameFormItem})
</script>

<style>

</style>