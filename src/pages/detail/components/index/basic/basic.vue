<template>
  <view>
    <yx-sheet :margin="[0, 0]" :padding="[0, 0]" :round="3" :shadow="2">
      <tabel-view></tabel-view>
    </yx-sheet>
    <relation-view></relation-view>
    <book-view></book-view>
  </view>
</template>

<script setup>
import TabelView from './components/tabel/tabel.vue';
import BookView from './components/book/book.vue';
import RelationView from './components/relation/relation.vue'
</script>
