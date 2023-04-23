<template>
  <view>
    <view @click="showRelation">
      <yx-sheet :margin="[30,20]" :padding="[0,20]" :round="3" :shadow="2">
        <view class="yx-text-weight-b u-text-center">智能四柱图示</view>
      </yx-sheet>

      <view v-for="item in list" class="u-flex u-col-top u-m-x-30 u-m-y-20 box">
        <view class="u-p-y-10 yx-text-weight-b u-text-center left">
          {{item.title}}
        </view>
        <view class="u-p-l-10 u-p-r-20 right">
          <text>{{item.content.length>0?item.content.join(";"):'无合冲关系'}}</text>
        </view>
      </view>
    </view>

    <yx-pillar-relation ref="relation" :top="detail.top" :bottom="detail.bottom"></yx-pillar-relation>
  </view>
</template>

<script setup>
import {computed, ref} from "vue"
import {useDetailStore} from "@/store/detail";
import YxPillarRelation from "@/yxbug-cn/yx-pillar-relation/yx-pillar-relation";
import {PILLAR_FIELD} from "@/config/map";

const detailStore = useDetailStore();

const list = computed(()=>{
  const li = [];
  li.push({
    title:"天干留意",
    content:[...new Set(detailStore.tb_relation.top.map(item => item.title))]
  })
  li.push({
    title:"地支留意",
    content:[...new Set(detailStore.tb_relation.bottom.map(item => item.title))]
  })
  return li;
})

const relation = ref()

const showRelation = () => {
  relation.value.showPopup();
}

const detail = computed(()=>{
  const data = {
    top:{
      list:[],
      mark:detailStore.tb_relation.top,
    },
    bottom:{
      list:[],
      mark:detailStore.tb_relation.bottom,
    },
  }
  for(let key of PILLAR_FIELD){
    data.top.list.push(detailStore.top[key])
    data.bottom.list.push(detailStore.bottom[key])
  }

  return data;
})
</script>

<style lang="scss" scoped>
.box{
  width: 100%;
  .left{
    background: #ffffff;
    border-radius: 6px;
    width: 12%;
    min-width:6em;
  }

  .right{
    width: 73%;
  }
}
</style>
