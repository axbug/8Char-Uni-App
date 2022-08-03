<template>

    <view class="flex flex-col flex-col-top-start">
        <view class="flex flex-row flex-row-top-start" style="flex-wrap:wrap" :style="{width:width+'rpx'}">
            <view  class="ma-5" v-for="(item,index) in _filelist" :key="index" :style="{width:(itemWidth-10)+'rpx'}">
                <tm-sheet :round="2" color="primary" text :transprent="true" :padding="[0,0]" :margin="[0,0]" class=" "  >
                    <tm-image :round="2"  :allowDelete="false" @delete="deletedFile(item)"  extra delete :src="item.url" :width="itemWidth-10" :height="itemHeight-10">
                        <template v-slot:extra>
                            <view :style="{background:'rgba(0, 0, 0, 0.7)',width:(itemWidth-10)+'rpx'}" :class="[`round-b-${2}`]" class="py-4 px-4 flex flex-row flex-row-center-start">
                                <tm-icon :font-size="23" v-if="item.statusCode==0||item.statusCode==1" color="grey-3"  name="tmicon-clock-fill"></tm-icon>
                                <tm-text v-if="item.statusCode==0||item.statusCode==1" color="grey-3"  _class="pl-5" :font-size="23" :label="item.status"></tm-text>
                                <tm-icon :font-size="23" v-if="item.statusCode==2||item.statusCode==4" color="red" name="tmicon-times-circle-fill"></tm-icon>
                                <tm-text v-if="item.statusCode==2||item.statusCode==4" color="red"  _class="pl-5" :font-size="23" :label="item.status"></tm-text>
                                <tm-icon :font-size="23" v-if="item.statusCode==3" color="green" name="tmicon-check-circle-fill"></tm-icon>
                                <tm-text v-if="item.statusCode==3"  color="green" _class="pl-5" :font-size="23" :label="item.status"></tm-text>
                            </view>
                        </template>
                    </tm-image>
                </tm-sheet>
            </view>
            <view  @click="chooseFile" v-if="!_disabledAdd"  class="ma-5" :style="{width:(itemWidth-10)+'rpx'}">
                <tm-sheet :eventPenetrationEnabled="true" :followTheme="props.followTheme" :round="2"  color="primary" text :padding="[0,0]" :margin="[0,0]" _class="flex-center" :height="itemHeight-10" >
                    <slot name="icon">
						 <tm-icon :font-size="42" :userInteractionEnabled="false" name="tmicon-plus"></tm-icon>
					</slot>
                </tm-sheet>
            </view>

        </view>
    </view>
    
</template>
<script lang="ts" setup>
/**
 * 上传
 * @description 图片上传组件。
 */
import { computed ,ref,PropType, Ref, watch,toRaw, nextTick,getCurrentInstance,inject  } from 'vue'
import { inputPushItem, rulesItem } from "./../tm-form-item/interface"
import {file,fileConfig,statusCode,uploadfile} from "./upload"
import tmImage from '../tm-image/tm-image.vue';
import tmText from '../tm-text/tm-text.vue';
import tmIcon from '../tm-icon/tm-icon.vue';
import tmSheet from '../tm-sheet/tm-sheet.vue';
const {proxy} = getCurrentInstance();
const props = defineProps({
	//是否跟随全局主题的变换而变换
	followTheme: {
		type: [Boolean, String],
		default: true
	},
    width:{
        type:Number,
        default:700
    },
    //一行排列几个。
    rows:{
        type:Number,
        default:5
    },
    //图片的高度
    imageHeight:{
        type:Number,
        default:140
    },
    defaultValue:{
        type:Array as PropType<Array<file>>,
        default:()=>[]
    },
    //可以是双向绑定
    modelValue:{
        type:Array as PropType<Array<file>>,
        default:()=>[]
    },
    color:{
        type:String,
        default:"primary"
    },
    header:{
        type:Object,
        default:()=>{}
    },
    formData:{
        type:Object,
        default:()=>{}
    },
    maxFile:{
        type:Number,
        default:9
    },
    maxSize:{
        type:Number,
        default:10*1024*1024
    },
    url:{
        type:String,
        default:"",
        required:true
    },
    autoUpload:{
        type:Boolean,
        default:true
    },
    disabled:{
        type:Boolean,
        default:false
    },
    //删除前执行，如果返回false,将阻止删除。
    onRemove:{
        type:[Function,Boolean],
        default:()=>{
            return (item:file)=>true
        }
    },
    //开始上传前执行，如果返false，将阻止上传，
    onStart:{
        type:[Function,Boolean],
        default:()=>{
            return (item:file)=>true
        }
    },
    //上传成功后，从服务器响应后立即执行，此时，还未更改当前文件上传的状态，是成功还是失败
    //如果此时返回false,将会让文件状态从成功改为上传失败，尽管 从服务器正确返回，但仍然显示失败。
    onSuccessAfter:{
        type:[Function,Boolean],
        default:()=>{
            return (item:file)=>true
        }
    },
    //选择文件前执行，如果此时返回false,将阻止选择文件。你可以在这里做一些上传前的配置。
    beforeChooese:{
        type:[Function,Boolean],
        default:()=>{
            return (item:file)=>true
        }
    }
})
/**
 * emits 事件说明
 * @method succcess 一个文件上传成功后立即执行， 返回：file,fileList
 * @method fail 一个文件上传失败后立即执行， 返回：file,fileList
 * @method complete 所有文件上传完成， 返回：file,fileList
 * @method change 文件列表增加或者减少,文件状态的改变， 返回：fileList
 * @method remove 一个文件被移除时触发。file,fileList
 * @method uploadComplete i当前任务所有文件上传结束时触发。fileList
 */
const emits = defineEmits(["success","fail","complete","change","remove","uploadComplete","update:modelValue"])

const itemWidth = computed(()=>{
    return props.width / props.rows
})
const itemHeight = computed(()=>{
    return props.imageHeight
})
const _filelist:Ref<Array<file>> = ref([])
const _disabledAdd = computed(()=>{
    return props.disabled||_filelist.value.length>=props.maxFile;
})
const _uploadObj = new uploadfile({hostUrl:props.url,autoUpload:props.autoUpload,fileList:addSuccess(props.defaultValue),header:props.header,formData:props.formData,maxFile:props.maxFile,maxSize:props.maxSize})
_filelist.value = [..._uploadObj.filelist];
emits("update:modelValue",_filelist.value)
watch([()=>props.header,()=>props.maxFile,()=>props.maxSize,()=>props.formData],()=>{
    _uploadObj.setConfig({hostUrl:props.url,header:props.header,formData:props.formData,maxFile:props.maxFile,maxSize:props.maxSize})
},{deep:true})
//添加已上传文件列表。
function addSuccess(fileList:Array<file>= []){
    fileList =  toRaw(fileList)
    let fl = fileList.map(e=>{
        let _itemfile:file = {url:""};
        if(typeof e == 'string'){
            _itemfile.url = e;
        }else{
            _itemfile = {...e};
        }
        _itemfile = {..._itemfile,statusCode:statusCode.success,status:'上传成功',progress:100}
        return _itemfile
    })
    return fl;
}

//选择图片前执行。
_uploadObj.beforeChooesefile = async function () {
    _uploadObj.setConfig({maxFile:props.maxFile - _filelist.value.length})
    if (typeof props.beforeChooese === 'function') {
        let p = await props.beforeChooese();
        if(typeof p === 'function'){
            p = await p();
        }
        if (!p) return false;
    }
    return true
}
//上传成功后，即将更新文件状态前执行，如果返回false，文件将标记为失败，尽管已经上传成功。
_uploadObj.beforeSuccess = async function (item:file) {
    if (typeof props.onSuccessAfter === 'function') {
        let p = await props.onSuccessAfter(item);
        if(typeof p === 'function'){
            p = await p(item);
        }
        if (!p) return false;
    }
    return true
}
//开始上传前执行。
_uploadObj.beforeStart = async function (item:file) {
    if (typeof props.onStart === 'function') {
        let p = await props.onStart(item);
        if(typeof p === 'function'){
            p = await p(item);
        }
        if (!p) return false;
    }
    return true
}
//任何一个文件上传结束时都会触发。
_uploadObj.complete = function(item:file){
	_filelist.value = [..._uploadObj.filelist]
    emits("complete",toRaw(item),toRaw(_filelist.value));
    emits("update:modelValue",_filelist.value)
	pushFormItem(true)
}
//自动监听加入已上传文件到列表中。
watch(()=>props.modelValue,()=>{
	let fl = Array.isArray(props.modelValue)?props.modelValue:[];
	if(fl.length==0){
		_filelist.value = [];
		_uploadObj.filelist = [];
	}else{
		_uploadObj.addFile(addSuccess(fl))
		_filelist.value = [..._uploadObj.filelist]
	}
})
_uploadObj.uploadComplete = function(filelist){
    emits("uploadComplete",filelist);
}
_uploadObj.success = function(item,fileList){
     let index =  _filelist.value.findIndex(el=>el.uid==item.uid)
    if(index>-1){
		 _filelist.value.splice(index,1,item)
		 emits("success",toRaw(item),toRaw(_filelist.value))
		 emits("change",toRaw(_filelist.value))
		
	}
}
_uploadObj.fail = function(item){
	let index =  _filelist.value.findIndex(el=>el.uid==item.uid)
	if(index>-1){
		 _filelist.value.splice(index,1,item)
		 emits("fail",toRaw(item),toRaw(_filelist.value))
		 emits("change",toRaw(_filelist.value))
	}
	
}
function chooseFile(){
    _uploadObj.chooesefile().then(fileList=>{
        _filelist.value.push(...fileList)
        emits("update:modelValue",_filelist.value)
    })
}

async function deletedFile(item:file){
    if (typeof props.onRemove === 'function') {
        let p = await props.onRemove(item);
        if(typeof p === 'function'){
            p = await p(item);
        }
        if (!p) return false;
    }
  const delfilelist = _uploadObj.delete(item);
   _filelist.value = [...delfilelist];
   emits("remove",toRaw(item))
   emits("update:modelValue",_filelist.value)
   emits("change",toRaw(_filelist.value))
   pushFormItem()
    
}

function clear(){
    _uploadObj.filelist = [];
    _filelist.value = [];
    emits("update:modelValue",[])
    pushFormItem()
}
//fileId标识id.
function del(fileId:number|string){
    let index = _uploadObj.filelist.findIndex(el=>el.uid == fileId);
    if(index>-1){
        const item = _uploadObj.filelist[index];
        const delfilelist = _uploadObj.delete(item);
        _filelist.value = [...delfilelist];
        emits("remove",toRaw(item))
        emits("update:modelValue",_filelist.value)
        emits("change",toRaw(_filelist.value))
        pushFormItem()
    }
}
function getFailList(){
    return _uploadObj.filelist.filter(el=>el.statusCode != statusCode.fail&&el.statusCode != statusCode.max);
}
function getSuccessList(){
    return _uploadObj.filelist.filter(el=>el.statusCode != statusCode.success);
}
function clearFail(){
    const list= _uploadObj.filelist.filter(el=>el.statusCode != statusCode.fail&&el.statusCode != statusCode.max);
     _uploadObj.filelist = list;
     _filelist.value = [...list]
     emits("update:modelValue",_filelist.value)
}
/**
 * ref 手动调用的方法
 * start 开始上传
 * stop 停止上传
 * clear 清除所有文件
 * del 删除某一项文件。
 * getFailList 获取上传失败的文件列表。
 * getSuccessList 获取上传成功的文件列表
 * clearFail 清除上传失败的文件（只要标识不是成功的都会删除）
 */
defineExpose({start:()=>{
	_uploadObj.start()
},stop:()=>{
	_uploadObj.stop()
},
clear,del,getFailList,clearFail
})

/** -----------form专有------------ */
//父级方法。
const rulesObj = inject("tmFormItemRules",computed<Array<rulesItem>>(()=>{
    return [
        {
            message:"请选择图片上传",
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
    let successFile = _filelist.value.filter(el=>el.statusCode===3);
    rules = rules.map(el=>{
        if(typeof el.validator === "function" && el.required===true){
            return el
        }else if(typeof el.validator === "boolean" && el.required===true){
            return {
                ...el,
                validator:(val:Array<file>)=>{
                    return val.length == 0?false:true
                }
            }
        }else{
            return {
                ...el,
                validator:(val:Array<file>)=>{
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
                let vr = await el.validator(successFile)
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
            let successFile = _filelist.value.filter(el=>el.statusCode===3);
            validate(toRaw(rulesObj.value)).then(ev => {
                parentFormItem.pushCom({
                    value: successFile,
                    isRequiredError: false,//true,错误，false正常 检验状态
                    componentsName: 'tm-rate',//表单组件类型。
                    message: ev.length==0?"":ev[0].message,//检验信息提示语。
                })
            }).catch(er => {
                parentFormItem.pushCom({
                    value: successFile,
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
		_filelist.value = [];
		_uploadObj.filelist = [];
		emits('update:modelValue',[])
		pushFormItem(false)
    }
	if(tmFormFun.value=='validate'){
		pushFormItem(true)
	}
	if(tmFormFun.value=='clearValidate'){
		pushFormItem(false)
	}
	
})

/** -----------end------------ */
</script>