<template>
  <view class="u-flex">
    <view
        v-for="item in detailStore.element.pro_decl"
        :key="item"
        :class="GetWangShuaiClass(item)"
        style="color: #f8f8f8;width: 20%;"
    >
      {{ item }}
    </view>
  </view>
</template>

<script setup>
import {useDetailStore} from "@/store/detail";
import {ELEMENT} from "@/config/map";

const detailStore = useDetailStore();
const props = defineProps({
  auto: {
    type: Boolean,
    default: false
  }
});

function GetWangShuaiClass(str) {
  let type = 'primary';
  if (props.auto) {
    const ws = str[0];
    const index = ELEMENT.labels.indexOf(ws);
    if (index !== -1) {
      type = ELEMENT.types[index].trim();
    }
  }
  return [`u-type-${type}-bg`, 'yx-text-weight-b', 'u-text-center', 'u-p-y-6']
}
</script>
