<template>
<!-- v-if="tmCascaderShowIndex==_level" -->
    <view  class="flex" >
        <scroll-view v-if="tmCascaderShowIndex==props.level" :style="[{ height: `${props.height}rpx` }]" scroll-y>
            <view v-for="(item,index) in _value" :key="index">
                <nodeCellVue :followTheme="props.followTheme" :level="props.level"   :data="item"></nodeCellVue>
               
            </view>
        </scroll-view>
        <BaseCascader :followTheme="props.followTheme" :level="_level" v-if="nextChildData.length>0" :height="props.height" :color="props.color" :data="nextChildData" ></BaseCascader>
    </view>
</template>
<script lang="ts" setup>
import { computed, ref,Ref, watch,getCurrentInstance, inject, toRaw, watchEffect } from 'vue';
import BaseCascader from './base-cascader.vue';
import BaseNode from './base-node.vue';
import nodeCellVue from './node-cell.vue';
import {childrenData} from "./interface"
const props = defineProps({
	followTheme: {
		type: [Boolean,String],
		default: true
	},
    /**
     * 导入的数据
     */
    data:{
        type:Array,
        default:()=>[],
        required:true
    },
    height:{
        type:Number,
        default:0,
        required:true
    },
    color:{
        type:String,
        default:'primary'
    },
    level:{
        type:Number,
        default:0
    }
    
})
const _value = computed(():Array<childrenData>=><Array<childrenData>>props.data);
const _level = props.level+1;
const tmCascaderShowIndex = inject('tmCascaderShowIndex',computed(()=>0))
const ParentActivedLs = inject('tmCascaderValue',computed(()=>[]))
const nextChildData = ref([]);
watchEffect(()=>{
    if(ParentActivedLs.value[props.level]){
        let nowobj = _value.value.filter(el=>el.id==ParentActivedLs.value[props.level])
        if(nowobj.length>0){
            if(typeof nowobj[0]?.children == 'object'&& Array.isArray(nowobj[0]?.children)&&nowobj[0]?.children.length>0){
                nextChildData.value = nowobj[0]?.children;
            }
            
        }
    }
})

</script>
