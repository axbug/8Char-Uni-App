<template>
  <view :style="[{height:_height+'rpx'}]" >
	  <tm-sheet no-level @click="emits('title-click')" color="grey-3"   v-if="_title!==''" :height="_titleHeight" _class="flex flex-col flex-col-center-start" 
	  :margin="[props.margin[0],0]" :padding="[props.padding[0],0]">
	       <tm-text :userInteractionEnabled="false" :font-size="24" _class="text-weight-b opacity-6" :label="_title"></tm-text>
	   </tm-sheet>
	  <tm-sheet @click="itemClick" color="white" :border="1" borderDirection="bottom" :height="_height"  :margin="props.margin" :padding="props.padding">
	      <view :userInteractionEnabled="false" hover-class="opacity-5" v-if="_title===''" class="flex-1 flex flex-col flex-col-center-start" >
	  		  <slot></slot>
	  	  </view>
	  </tm-sheet>
  </view>
</template>

<script lang="ts" setup>
	/**
	 * 列表索引项目
	 * @description 索引列表项目，内部只能放置在tm-indexes组件中。
	 */
import { computed,PropType,ref,getCurrentInstance, onUnmounted } from 'vue';
import tmSheet from '../tm-sheet/tm-sheet.vue';
import tmText from '../tm-text/tm-text.vue';
const {proxy} = getCurrentInstance();
const emits = defineEmits(["click","title-click"])
const props = defineProps({
    margin:{
        type:Array as PropType<Array<number>>,
        default:()=>[0,0]
    },
    padding:{
        type:Array as PropType<Array<number>>,
        default:()=>[32,0]
    },
    height:{
        type:Number,
        default:100,
    },
	//如果title不为空，此组件就会当分类标题来显示，并隐藏内容。
    title:{
        type:[String,Number],
        default:''
    }
})

const _title = computed(()=>props.title)
const _titleHeight = 50
const readId = uni.$tm.u.getUid(1);
const _height = computed(()=>{
	if(_title.value==='') return props.height;
	return _titleHeight;
})
//父级方法。
let parent = proxy.$parent

while (parent) {
    if(parent?.compentNameId=='tmIndexesId'||!parent){
        break;
    }else{
        parent = parent?.$parent??undefined
    }
}
if(parent){
    parent.pushKey(_height.value,readId,_title.value)
}
onUnmounted(()=>parent.delKey(_height.value,readId))
function itemClick(){
	emits("click")
}
</script>

<style>

</style>