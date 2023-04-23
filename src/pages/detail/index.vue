<template>
  <view style="height: 100vh;">
    <view id="header" style="position: fixed;width: 100%;">
      <yx-nav-header></yx-nav-header>
      <header-view></header-view>
      <u-subsection
          v-model="tabsOption.current"
          :animation="false"
          :list="tabsOption.list"
          active-color="#2979ff"
          bg-color="#FFFFFF"
          style="border-radius: unset;"
      ></u-subsection>
    </view>
    <scroll-view scroll-y class="u-abso" :style="{
      top:headerHeight + 'px',
      width:'100%',
      height:contentHeight,
    }">
      <detail v-if="tabsOption.current === 0"></detail>
      <basic v-else-if="tabsOption.current === 1"></basic>
      <major v-else-if="tabsOption.current === 2"></major>
      <live v-else-if="tabsOption.current === 3"></live>
    </scroll-view>
  </view>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, computed} from 'vue';
import HeaderView from './components/index/common/header/header.vue'
import Basic from './components/index/basic/basic.vue'
import Live from './components/index/live/live.vue'
import Detail from './components/index/detail/detail.vue';
import Major from './components/index/major/major.vue'
import {toHome} from "@/utils/router";
import {useDetailStore} from "@/store/detail";

const detailStore = useDetailStore()
const tabsOption = reactive({
  list: [
    {key: 0, name: '命主信息',},
    {key: 1, name: '基本命盘',},
    {key: 2, name: '专业细盘',},
    {key: 3, name: '在线批命',}
  ],
  current: 0
});

const headerHeight = ref(0);
const contentHeight = computed(()=>{
  return `calc(100vh - ${Math.ceil(headerHeight.value)}px)`
})

onMounted(() => {
  if (!detailStore.timestamp) toHome()

  ComputedScrollHeight();
});

const ComputedScrollHeight = () => {
  uni.$u.getRect('#header').then(data => {
    headerHeight.value = data.height;
    nextTick();
  })
};
</script>
