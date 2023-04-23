<template>
  <view class="u-p-b-30">
    <yx-sheet v-if="bookStore.weigh_bone.poetry" :margin="[20, 20]" :padding="[30, 30]" :round="3" :shadow="10">
      <view class="u-flex u-m-b-16">
        <view class="u-flex-6 u-row-center u-col-top">
          <view class="yx-text-weight-b">
            <u-icon name="hourglass-half-fill"></u-icon><text class="u-m-l-10">袁天罡称骨</text>
          </view>
        </view>
        <view class="u-flex-6 u-flex u-row-right">
          <text class="u-main-color">
            <u-icon :label="'重量: ' + bookStore.weigh_bone.total" label-color="#303133" name="rmb-circle-fill"></u-icon>
          </text>
        </view>
      </view>
      <template v-for="(item, index) in ['poetry', 'explain', 'title']">
        <view v-if="bookStore.weigh_bone[item]">
          <view
              :class="index === 0 ? 'u-m-y-14' : 'u-m-t-28'"
              class="yx-text-weight-b u-font-26"
          >{{ ['歌诀', '解析', '点评'][index] }}
          </view>
          <text
              :class="{
              'yx-text-weight-b': index === 0,
              'u-font-28' : index !== 1,
              'u-font-24' : index === 1,
            }"
              class="u-m-t-8"
              decode
          >{{ bookStore.weigh_bone[item] }}
          </text>
        </view>
      </template>
    </yx-sheet>
  </view>
</template>

<script setup>
import {useBookStore} from "@/store/book";

const bookStore = useBookStore();
</script>
