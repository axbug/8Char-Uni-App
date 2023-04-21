<template>
  <view>
    <u-tabs
        v-model="current"
        :list="bookStore.books"
        name="title"
        swiper
    ></u-tabs>
    <yx-sheet :margin="[0, 0]" :padding="[30, 10]">
      <view v-for="item in bookStore.books[current]?.content" class="u-m-b-40">
        <view v-if="item.title" class="u-p-b-10">
          <text class="yx-text-weight-b u-font-28 u-type-warning-dark">{{ item.title }}</text>
        </view>
        <view>
          <text class="u-font-28">{{ item.content }}</text>
        </view>
      </view>
    </yx-sheet>
  </view>
</template>

<script setup>
import {ref} from 'vue';
import {useBookStore} from '@/store/book';

const bookStore = useBookStore();

const current = ref(0)
</script>
