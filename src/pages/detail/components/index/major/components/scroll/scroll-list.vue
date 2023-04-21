<template>
  <view>
    <view v-for="(mitem, mindex) in TEND_STORE_FIELD" :key="mitem.index">
      <yx-sheet v-if="tendStore[mitem.list].length" :margin="[0, 0]" :padding="[8, 10]">
        <view :class="{ 'u-m-t-12': mindex === 0 }" class="u-p-l-16">
          <view>
            <view class="u-flex u-row-left u-col-center">
              <view>
                <text class="yx-text-weight-b u-font-28">{{ mitem.title }}</text>
              </view>
            </view>
          </view>
        </view>
        <scroll-view class="scroll-view u-flex u-p-t-10 u-p-b-16" :class="[`el-${mitem.type}`]" scroll-x="true" :scroll-left="locat[mitem.type]" @scroll="handleScroll(mitem.type,$event)">
          <view v-for="(ditem, dindex) in tendStore[mitem.list]" class="scroll-view-item">
            <view
                :class="{
								'scroll-view-item-active': tendStore[mitem.index] === dindex
							}"
                :style="{
								backgroundColor: tendStore[mitem.index] === dindex ? '#2979ff' : ''
							}"
                class="scroll-view-item-default"
                @click="ScrollItemClick(mindex, dindex)"
            >
              <template v-for="(imitem, imindex) in tendItemMapList[mindex].list">
                <view>
                  <text
                      :color="tendStore[mitem.index] === dindex ? 'white' : 'black'"
                      class="yx-text-weight-b u-font-22"
                  >{{ ditem[imitem] + tendItemMapList[mindex].suffix[imindex] }}
                  </text>
                </view>
              </template>
            </view>
          </view>
        </scroll-view>
      </yx-sheet>
    </view>
    <text v-if="tendStore.currentDate" class="u-m-t-20 u-m-l-10 u-font-26 yx-text-weight-b">{{ tendStore.currentDate }}</text>
  </view>
</template>

<script setup>
import {nextTick, ref} from "vue"
import {useTendStore} from "@/store/tend";
import {
  tendItemMapList,
  storeIndexList,
  storeMethodsList,
} from "./map";
import {TEND_STORE_FIELD} from "@/config/map";


const tendStore = useTendStore();
const locat = ref({
  dayun:0,
  year:0,
  month:0,
  day:0,
  time:0,
})

const handleScroll = (type,e) => {
  // #ifdef H5
  locat.value[type] = e.detail.scrollLeft
  // #endif
}

const ScrollItemClick = (e, index) => {
  tendStore[storeIndexList[e]] = index;
  if (e < 4) {
    tendStore[storeIndexList[e + 1]] = 0;
    tendStore[storeMethodsList[e]]();
  }
};

const pullScrollLeft = async () => {
  const num = tendStore.rowNum - 4;
  const types = TEND_STORE_FIELD.map(item=>item.type).slice(0,num)
  const indexs = TEND_STORE_FIELD.map(item=>item.index).slice(0,num)
  for(let i = 0;i<types.length;i++){
    const type = types[i]
    const index = tendStore[indexs[i]]
    const result = await uni.$u.getRect(`.el-${type} .scroll-view-item`)
    locat.value[type] = result?.width * index
  }
  await nextTick()
}

defineExpose({
  pullScrollLeft
})
</script>

<style lang="scss" scoped>
.scroll-view {
  width: 100%;
  padding: 0 10rpx;
  /* #ifndef APP-NVUE */
  white-space: nowrap;
  /* #endif */
  &-item {
    /* #ifndef APP-NVUE */
    display: inline-block;
    /* #endif */
    text-align: center;
    padding: 0;
    &-default {
      padding: 10rpx;
    }

    &-active {
      border-radius: 12rpx;
      color: #f8f8f8;
    }
  }
  &-item:last-child{
    margin-right: 20rpx;
  }
}
</style>
