<template>
  <yx-sheet :margin="[0, 0]" :padding="[0, 10]">
    <view class="u-flex u-row-center u-col-center">
      <view class="u-flex u-row-center u-col-start">
        <view id="index-main-header-left" class="u-m-r-30 u-row-center" style="width: 160rpx;">
          <view class="u-flex u-row-center u-col-center">
            <u-avatar :height="88" :src="detail.pic" :width="88"></u-avatar>
          </view>
          <view class="u-m-t-10 u-flex u-row-center u-col-center">
            <view class="yx-text-weight-b u-font-24 u-line-1">{{ isHide ? '*'.repeat(detail.realname.length) : detail.realname }}</view>
            <u-icon
                :font-size="24"
                :name="isHide ? 'eye-fill' : 'eye-off'"
                class="u-p-l-10"
                @click="isHide = !isHide"
            ></u-icon>
          </view>
        </view>
        <view id="index-main-header-right">
          <view class="u-flex u-m-b-20">
            <view class="yx-text-weight-b">{{ detail.lunar }}</view>
            <view class="yx-text-weight-b u-type-primary-dark u-m-l-6">{{ detail.type }}</view>
          </view>
          <view class="yx-text-weight-b">{{ detail.solar }}</view>
        </view>
      </view>
    </view>
  </yx-sheet>
</template>

<script setup>
import {deleteFirstElement} from '@/utils/transform';
import {useDetailStore} from "@/store/detail";
import {computed, ref} from "vue";
import {LunarUtil} from "lunar-javascript";
import {getUrl} from "@/utils/file";

const isHide = ref(false);
const detailStore = useDetailStore();

const detail = computed(()=>{
  const type = detailStore.gender===1?"乾造":"坤造"
  return {
    pic:GetChineseZodiac(detailStore.zodiac),
    lunar:`阴历：${detailStore.datetime.lunar}`,
    solar:`阳历：${detailStore.datetime.solar}`,
    realname:detailStore.realname,
    type:`(${type})`,
  }
})

function GetChineseZodiac(sx){
  const index = deleteFirstElement(LunarUtil.SHENGXIAO).indexOf(sx);
  let path;
  if (index !== -1) {
    path = `/zodiac/${index}.svg`
  } else {
    path = `/site/logo.svg`
  }
  return getUrl(`static/icon${path}`);
}
</script>
