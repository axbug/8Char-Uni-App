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
import {LunarUtil, Solar} from "lunar-javascript"
import {useDetailStore} from "@/store/detail";
import {deleteFirstElement} from "@/utils/transform";
import {TAISUI_RELATION} from "@/config/offset";
import {useTendStore} from "@/store/tend";
import { ref } from "vue"

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
    uni.showToast({
      icon: "none",
      title: "当前时间不在大运范围内!"
    })
  } else {
    for (let i = 0; i < originalList.length; i++) {
      const minYear = originalList[i].getStartYear()
      const maxYear = originalList[i].getEndYear()
      if (currenYear >= minYear && currenYear <= maxYear) {
        const yearList = originalList[i].getLiuNian()
        tendStore.currentIndex = i
        tendStore.resolveDaYun()
        for (let i = 0; i < yearList.length; i++) {
          if (yearList[i].getYear() === currenYear) {
            tendStore.yearIndex = i
            tendStore.resolveLiuYear()
            const monthList = tendStore.monthList
            const currenTimestmap = new Date().getTime()
            for (let i = 0; i < monthList.length; i++) {
              const year = monthList[i].year
              const _year = i < 10 ? year : year + 1;
              const _date = (i < 11 ? year : year + 1) + '/' + monthList[i].date;
              const nextDate = _year + '/' + monthList[i].nextJieqiDate;
              const _timestmap = new Date(_date).getTime()
              const nextTimestmap = new Date(nextDate).getTime()
              if (_timestmap <= currenTimestmap && nextTimestmap > currenTimestmap) {
                tendStore.monthIndex = i
                tendStore.resolveLiuDay()
                const dayList = tendStore.dayList
                const currenDate = Solar.fromDate(new Date()).toYmd().replace(/-/g, '/')
                for (let i = 0; i < dayList.length; i++) {
                  if (currenDate === dayList[i].date) {
                    tendStore.dayIndex = i
                    tendStore.resolveLiuTime()
                    const solar = Solar.fromDate(new Date())
                    const timeBottom = solar.getLunar().getTimeZhi()
                    tendStore.timeIndex = deleteFirstElement(LunarUtil.ZHI).indexOf(timeBottom)
                  }
                }
              }
            }
          }
        }
      }
    }
    scroll.value.pullScrollLeft();
  }
}
</script>
