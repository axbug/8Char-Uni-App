<template>
  <tm-sheet 
  :margin="props.margin" 
  :padding="[24,0]" 
  :width="_width" 
  :height="props.height" 
  :color="props.color"
  :_style="props._style"
  :followTheme="props.followTheme"
  :dark="props.dark"
  :round="props.round"
  :shadow="props.shadow"
  :outlined="props.outlined"
  :border="props.border"
  :borderStyle="props.borderStyle"
  :borderDirection="props.borderDirection"
  :text="props.text"
  :transprent="props.transprent"
  :linear="props.linear"
  :linearDeep="props.linearDeep"
  _class="flex flex-row flex-between">
    <view v-if="_icon" class="flex flex-row flex-row-center-start" style="width:50rpx">
      <tm-icon :font-size="28" :name="_icon" style="line-height:normal"></tm-icon>
    </view>
    <view class="flex-1 flex-row overflow" style="width:0px">
      <view ref="content" 
      :style="{animationDuration:_duration+'s',paddingLeft: (isNvue?0:_Left)+'rpx',width:_Left*list.length+'rpx'}" 
      class="aniRow flex-row flex-row-center-start">
        <view  class="flex-row flex-row-center-start" v-for="(item,index) in _list" :key="index" >
          <tm-text _class="pl-24 nowrap" :font-size="props.fontSize" :color="props.fontColor" @click="emits('click',index)"  :label="item"></tm-text>
        </view>
      </view>
    </view>
    <view v-if="props.showRight" class="flex flex-row flex-row-center-end" style="width:40rpx">
      <tm-icon :font-size="24" name="tmicon-angle-right" style="line-height:normal"></tm-icon>
    </view>
  </tm-sheet>
</template>

<script lang="ts" setup>
import tmSheet from '../tm-sheet/tm-sheet.vue';
import tmIcon from '../tm-icon/tm-icon.vue';
import tmText from '../tm-text/tm-text.vue';
import { custom_props } from '../../tool/lib/minxs';
import {ComponentInternalInstance, computed, getCurrentInstance, nextTick, onMounted, PropType, ref} from "vue"
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation')
// #endif
const {proxy} = <ComponentInternalInstance>getCurrentInstance()
const emits = defineEmits<{
  (e: 'click', index:number): void
}>()
const props = defineProps({
  ...custom_props,
  margin:{
    type:Array as PropType<Array<number>>,
    default:()=>[32,24]
  },
  transprent:{
    type:Boolean,
    default:false
  },
  text:{
    type:Boolean,
    default:true
  },
  width:{
    type:Number,
    default:726
  },
  height:{
    type:Number,
    default:70,
  },
  fontSize:{
    type:Number,
    default:26,
  },
  color:{
    type:String,
    default:"primary",
  },
  fontColor:{
    type:String,
    default:"",
  },
  icon:{
    type:String,
    default:"tmicon-info-circle",
  },
  //是否显示右边图标。
  showRight:{
    type:Boolean,
    default:false
  },
  shadow:{
    type:Number,
    default:0,
  },
  list:{
    type:[Array,String] as PropType<Array<string>|string>,
    default:()=>""
  },
  //单位s
  duration:{
    type:Number,
    default:10
  },
  border:{
    type:Number,
    default:0
  }
})
const _icon = computed(()=>props.icon)
const _list = computed<Array<string>>(()=>{
  if(typeof props.list === 'string'){
    return [props.list]
  }
  if(Array.isArray(props.list)){
    return props.list;
  }
  return []
})
const _duration = computed(()=>props.duration)
const _width = computed(()=> props.width - props.margin[0]*2 - 24)
const _Left = computed(()=>{
  if(_icon.value!==''){
    return _width.value - 124
  }
  return _width.value - 84
})
const isNvue = ref(false);
  //  #ifdef APP-NVUE
 isNvue.value = true
  // #endif
onMounted(()=>{
  //  #ifdef APP-NVUE
  setTimeout(function() {nvueani()}, 200);
  // #endif
})

function nvueani(){
  var testEl = proxy.$refs.content;
    animation.transition(testEl, {
        styles: {
            transform: 'translateX(-100%)',
            transformOrigin: 'center center'
        },
        duration: props.duration*1000, //ms
        timingFunction: 'linear',
        delay: 0 //ms
    },()=>{
        animation.transition(testEl, {
            styles: {
                transform: 'translateX('+uni.upx2px(_Left.value)+'px)',
                transformOrigin: 'center center'
            },
            duration: 0, //ms
            timingFunction: 'linear',
            delay: 1 //ms
        },()=>{
            nvueani()
        })

    })
}
</script>

<style scoped>
/* #ifndef APP-NVUE */
.aniRow{
  animation-name: roll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes roll {
  0%{
    transform: translateX(0);
  }
  100%{
    transform: translateX(-150%);
  }
}
/* #endif */
</style>