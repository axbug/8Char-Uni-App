<template>
  <u-modal
      v-model="config.show"
      :title="config.label"
      :title-style="{
        paddingTop:'.5em',
      }"
      :show-confirm-button="false"
      :show-cancel-button="false"
      :mask-close-able="true"
      @confirm="onClose"
      @cancel="onClose"
  >
    <scroll-view scroll-y="true" style="height: 700rpx;">
      <view class="u-p-20">
        <template v-for="item in detail">
          <view class="title u-m-y-10">{{item.title}}</view>
          <view class="content u-m-t-10 u-m-b-30"><text decode>{{item.content}}</text></view>
        </template>
      </view>
    </scroll-view>
  </u-modal>
</template>

<script setup>
import {ref,computed} from "vue";
import {useTipsStore} from "@/store/tips";

const config = ref({
  show:false,
  type:"",
  label:"",
  detail:{}
})

const store = useTipsStore()

async function setDetail(type,label){
  config.value.label = label;
  const detail = store[type].find(item => item.label === label)
  config.value.detail = detail;
  if(detail?.label) config.value.show = true;
}

const detail = computed(()=>{
  const data = config.value.detail;
  const map = {
    tip:"精评",
    formula:"古决",
    func:"十神功能",
    seek:"查法",
  }
  const list = [];
  for(let key in data){
    if(map[key]){
      list.push({
        title:map[key],
        content:data[key]
      })
    }else if(key === "books"){
      list.push(...data[key])
    }
  }
  return list;
})

const onClose = () => config.value.show = false;

defineExpose({
  setDetail,
})
</script>

<style lang="scss" scoped>
.title{
  color:$u-type-warning-dark;
  font-size: 32rpx;
  font-weight: 800;
}

.content{
  color:$u-content-color;
  font-size: 26rpx;
}
</style>
