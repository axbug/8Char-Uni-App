<template>
  <view>
    <view class="u-p-20">
      <view class="u-flex" style="justify-content: space-between;">
        <view>
          <view class="yx-text-weight-b u-font-24">{{ '起运：' + detailStore.startTendDate }}</view>
          <view class="yx-text-weight-b u-font-24">{{ '起运公历：' + detailStore.start_tend.date }}</view>
        </view>
        <view>
          <view class="u-flex u-row-right u-col-center">
            <view>
              <view class="yx-text-weight-b u-font-24">{{ CurrentAge() }}</view>
              <view class="yx-text-weight-b u-font-24">{{ TaiSuiStatus() }}</view>
            </view>
            <view class="u-m-l-20">
              <u-icon color="#fea600" name="calendar-fill" @click="SkipCurrentTime()"></u-icon>
            </view>
          </view>
        </view>
      </view>
    </view>
    <scroll-list ref="scroll"></scroll-list>
  </view>
</template>

<script setup>
import ScrollList from './scroll-list.vue';
import {useDetailStore} from "@/store/detail";
import {TAISUI_RELATION} from "@/config/offset";
import {useTendStore} from "@/store/tend";
import {ref} from "vue"

const tendStore = useTendStore();
const detailStore = useDetailStore()
const scroll = ref();

function TaiSuiStatus() {
  let key = tendStore.yearList[tendStore.yearIndex]?.pillar[1];
  key = key + detailStore.bottom.year
  return TAISUI_RELATION[key] ?? "未犯太岁";
}

function CurrentAge() {
  const index = tendStore.yearIndex
  if (tendStore.yearList[index]?.age) {
    return tendStore.yearList[index]?.age + "岁";
  }
  return ""
}

function SkipCurrentTime() {
  const originalList = tendStore.original
  const minYear = originalList[0].getStartYear()
  const maxYear = originalList[originalList.length - 1].getEndYear()
  const currenYear = new Date().getFullYear()
  if (currenYear < minYear || currenYear > maxYear) {
    uni.$u.toast("当前时间不在大运范围内!")
  } else {
    tendStore.SkipCurrentTime();
    scroll.value.pullScrollLeft();
  }
}
</script>
