<template>
  <u-popup closeable v-model="show" mode="bottom">
    <template v-for="type in ['top','','bottom']">
      <scroll-view
          v-if="['top','bottom'].includes(type)"
          scroll-y="true"
          class="u-p-y-30"
          :style="{
            height:type==='top'?'20vh':'40vh',
          }">
        <view v-for="(item) in props[type].mark">
          <view
              class="u-text-center u-tips-color u-p-b-20 u-p-l-20 yx-text-weight-n"
              :style="{
                width:coumputedLabelWidth(item.mark) + '%',
                marginLeft:coumputedLabelLeft(item.mark) + '%',
            }"
          >{{item.label}}</view>
          <view class="u-flex u-rela u-p-b-50">
            <view
                class="pillar-line u-abso"
                :style="{
                  width:coumputedLabelWidth(item.mark) + '%',
                  marginLeft:coumputedLabelLeft(item.mark) + '%',
                }"
            ></view>
            <view
                v-for="(mitem) in item.mark"
                class="u-abso pillar-round"
                :class="[
                    `u-type-${getElAttr(mitem.label)}-bg`,
                ]"
                :style="{
                  marginLeft:coumputedItemLeft(mitem) + '%',
                }"
            >{{mitem.label}}</view>
          </view>
        </view>
      </scroll-view>
      <view v-else class="u-flex u-text-center" v-for="(item,index) in content">
        <view
            v-for="label in item"
            :style="{ width: cellItemWidth + '%' }"
            :class="[
             index===0?'u-tips-color':'',
             index>0?`yx-text-weight-n u-m-y-6 u-font-40 u-type-${getElAttr(label)}`:'',
           ]"
        >{{label}}</view>
      </view>
    </template>
  </u-popup>
</template>

<script setup>
import {ref,computed} from "vue";
import {getElAttr} from "@/utils/transform";
const TITLE_LIST = ["年柱","月柱","日柱","时柱","大运","流年","流月","流日","流时"];

const props = defineProps({
  top:{
    type:Object,
    default:()=>{
      return {
        list:[],
        mark:[],
      }
    }
  },
  bottom:{
    type:Object,
    default:()=>{
      return {
        list:[],
        mark:[],
      }
    }
  },
})

const colNum = computed(()=> props.top.list.length)
const cellItemWidth = computed(() => 100 / colNum.value);

function coumputedLabelWidth (list){
  const diff = list[list.length - 1].index - list[0].index
  return diff * cellItemWidth.value
}

function coumputedLabelLeft (list){
  const diff = (2 * list[0].index + 1) / 2
  return diff * cellItemWidth.value
}

function coumputedItemLeft (item){
  return cellItemWidth.value * item.index + cellItemWidth.value / 2 - 2
}

const content = computed(()=>{
  return [
    TITLE_LIST.slice(0,colNum.value),
    props.top.list,
    props.bottom.list
  ]
})

const show = ref(false);

const showPopup = () => show.value = true;

defineExpose({
  showPopup,

})
</script>

<style lang="scss" scoped>
.pillar-round{
  padding: 1px 4px;
  border-radius: 100%;
  z-index: 1;
  color: #ffffff;
}
.pillar-line{
  height: 1px;
  background-color: $u-tips-color;
  z-index: -1;
}
</style>
