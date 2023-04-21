<template>
  <view
      style="box-shadow: rgba(51, 51, 51, 0.07) 0 0.15625rem 0.375rem;"
      :style="[
        {
          marginLeft: _margin[0] + 'rpx',
          marginTop: _margin[1] + 'rpx',
          marginRight: _margin[2] + 'rpx',
          marginBottom: _margin[3] + 'rpx',
          paddingLeft: _padding[0] + 'rpx',
          paddingTop: _padding[1] + 'rpx',
          paddingRight: _padding[2] + 'rpx',
          paddingBottom: _padding[3] + 'rpx',
        },
        {
          background: props.bgColor,
          borderRadius: _round,
          border: props.border,
        }
      ]"
      @click="onClick"
  >
    <slot></slot>
  </view>
</template>

<script setup>
import {computed} from "vue";

const emits = defineEmits([
  "click",
]);

const props = defineProps({
  margin: {
    type: Array,
    default: () => [32],
  },
  padding: {
    type: Array,
    default: () => [24],
  },
  bgColor:{
    type:String,
    default: "#FFFFFF"
  },
  border:{
    type:String,
    default:"0px solid rgb(230, 230, 230)"
  },
  round: {
    type: [Number],
    default: 0
  },
})

const _margin = computed(() => {
  if (props.margin.length === 1)
    return [props.margin[0], props.margin[0], props.margin[0], props.margin[0]];
  if (props.margin.length === 2)
    return [props.margin[0], props.margin[1], props.margin[0], props.margin[1]];
  if (props.margin.length === 3)
    return [props.margin[0], props.margin[1], props.margin[2], 0];
  if (props.margin.length === 4)
    return [props.margin[0], props.margin[1], props.margin[2], props.margin[3]];
  return [0, 0, 0, 0];
});

const _padding = computed(() => {
  if (props.padding.length === 1)
    return [props.padding[0], props.padding[0], props.padding[0], props.padding[0]];
  if (props.padding.length === 2)
    return [props.padding[0], props.padding[1], props.padding[0], props.padding[1]];
  if (props.padding.length === 3)
    return [props.padding[0], props.padding[1], props.padding[2], 0];
  if (props.padding.length === 4)
    return [props.padding[0], props.padding[1], props.padding[2], props.padding[3]];
  return [0, 0, 0, 0];
});

const _round = computed(()=>{
  const r = isNaN(parseInt(String(props.round))) ? 4 : props.round;
  return (r*0.125) + "em"
})

function onClick(e) {
  emits("click", e);
}
</script>
