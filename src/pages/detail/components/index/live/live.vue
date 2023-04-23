<template>
  <view class="u-p-y-30 u-p-x-20">
    <yx-sheet :margin="[0, 0]" :round="3" :shadow="2">
      <view v-if="!option.list.length">
        <view class="u-flex u-row-center">
          <u-image :height="400" :src="getUrl(`static/icon/other/coding.svg`)" :width="400"
                   class="u-m-t-40 u-m-b-30"></u-image>
        </view>
        <u-button :loading="option.loading" class="u-m-b-30" type="primary " @click="Computed">四 柱 解 析</u-button>
      </view>
      <view v-else>
        <view v-for="item in option.list" class="u-m-b-40">
          <view class="u-flex u-m-b-20">
            <text class="yx-text-weight-b u-font-28">{{ item.title }}</text>
          </view>

          <view v-for="litem in item.data">
            <view>
              <text class="yx-text-weight-b u-font-26">{{ litem.label }}</text>
            </view>
            <view class="u-m-t-10 u-m-b-20">
              <text class="u-font-26" decode>{{ litem.content }}</text>
            </view>
          </view>
        </view>
      </view>
    </yx-sheet>
  </view>
</template>

<script setup>
import {ref} from 'vue';
import {GetPrediction} from '@/api/default';
import {getUrl} from "@/utils/file";
import {useDetailStore} from "@/store/detail";

const option = ref({
  loading: false,
  list: []
});

const detailStore = useDetailStore()

function Computed() {
  uni.showLoading({
    title: "网络请求中！",
  })
  option.value.loading = true;
  GetPrediction(detailStore.defaultPayload).then(res => {
    option.value.loading = false;
    option.value.list = res;
    uni.hideLoading()
  }).catch(() => {
    option.value.loading = false;
    uni.hideLoading();
    setTimeout(() => {
      uni.$u.toast("网络请求失败！")
    }, 1000)
  })
}
</script>
