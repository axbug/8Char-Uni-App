<template>
  <yx-sheet :margin="[0, 0]" :padding="[18, 10]" :round="0">
    <view class="u-flex u-col-center">
      <view class="u-flex u-col-start">
        <view style="width: 160rpx;">
          <u-image
              :height="138"
              :src="getUrl('static/icon/site/logo.svg')"
              :width="138"
          ></u-image>
        </view>
        <view>
          <view class="yx-text-weight-b u-p-b-10 u-font-38">{{APP_SUB_NAME}}</view>
          <view>{{APP_DESCRIPTION}}</view>
        </view>
      </view>
    </view>
  </yx-sheet>
</template>

<script setup>
import {getUrl} from "@/utils/file";
import {APP_SUB_NAME,APP_DESCRIPTION} from "@/config";
</script>
