<template>
  <view class="u-p-x-20 u-p-t-20">
    <yx-sheet v-if="detailStore.timestamp" :margin="[0, 0]" :padding="[30, 30]" :round="3" :shadow="10">
      <view v-if="detailStore.timestamp" class="u-flex u-m-b-16">
        <view class="u-flex u-row-center">
          <view class="u-p-r-16">
            <u-icon name="account-fill"></u-icon>
          </view>
          <text :font-size="28" class="yx-text-weight-b" label="">命主信息</text>
        </view>
      </view>
      <item-view v-for="item in detail" :detail="item"></item-view>
    </yx-sheet>
  </view>
</template>

<script setup>
import {computed} from 'vue';
import ItemView from './detail-item.vue';
import {useDetailStore} from "@/store/detail";

const detailStore = useDetailStore();

const detail = computed(() => {
  return [
    [`生肖：${detailStore.zodiac}`, `性别：${detailStore.gender===1 ? '男' : '女'}`],
    [`星座：${detailStore.constellation}`, `日空：${detailStore.empty.day}`],
    [`胎元：${detailStore.embryo[0]?.[0]} (${detailStore.embryo[0]?.[1]})`, `胎息：${detailStore.embryo[1]?.[0]} (${detailStore.embryo[1]?.[1]})`],
    [`命宫：${detailStore.embryo[2]?.[0]} (${detailStore.embryo[2]?.[1]})`, `身宫：${detailStore.embryo[3]?.[0]} (${detailStore.embryo[3]?.[1]})`],
    [`${detailStore.festival.pre.label}：${detailStore.festival.pre.time}`, `${detailStore.festival.next.label}：${detailStore.festival.next.time}`]
  ]
});
</script>
