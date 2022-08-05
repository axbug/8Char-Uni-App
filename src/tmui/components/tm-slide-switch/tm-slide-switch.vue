<template>
  <!-- #ifndef APP-NVUE -->
  <view @touchmove.stop="">
    <view :data-prop="attr" v-if="!_disabled" @touchstart="action.startDrag" @touchmove="action.onDrag" @touchend="action.endDrag"
      @touchcancel="action.endDrag" :style="`width:${attr.width}px;height:${attr.height}px `" class="overflow relative"
      :class="[attr.disabled ? 'opacity-7' : '']">
      <view class="flex flex-row flex-row-center-between">
        <view id="left" :style="{ width: `${leftWidth}px`, height: `${attr.height}px` }">
          <slot name="left"></slot>
        </view>
        <view id="right" :style="{ width: `${rightWidth}px`, height: `${attr.height}px` }">
          <slot name="right"></slot>
        </view>
      </view>
      <view id="wrapper" class="absolute l-0 t-0" :style="`width:${attr.width}px;height:${attr.height}px;transform:${opened ? '' : 'translate3d( 0px, 0, 0)'
      }`">
        <tm-sheet @click="emits('click')" :shadow="0" :outlined="props.outlined" :borderStyle="props.borderStyle"
          unit="px" :borderDirection="props.borderDirection" :linearDeep="props.linearDeep" :linear="props.linear"
          :round="props.round" :color="props.color" :text="_disabled" :transprent="props.transprent" :width="attr.width"
          :height="attr.height" :margin="[0, 0]" :padding="[0, 0]">
          <slot></slot>
        </tm-sheet>
      </view>
    </view>

    <view v-if="_disabled" :style="`width:${attr.width}px;height:${attr.height}px `" class="overflow relative"
      :class="[attr.disabled ? 'opacity-7' : '']">
      <view class="flex flex-row flex-row-center-between">
        <view id="left" :style="{ width: `${leftWidth}px`, height: `${attr.height}px` }">
          <slot name="left"></slot>
        </view>
        <view id="right" :style="{ width: `${rightWidth}px`, height: `${attr.height}px` }">
          <slot name="right"></slot>
        </view>
      </view>
      <view id="wrapper" class="absolute l-0 t-0" :style="`width:${attr.width}px;height:${attr.height}px `">
        <tm-sheet @click="emits('click')" :shadow="0" :outlined="props.outlined" :borderStyle="props.borderStyle"
          unit="px" :borderDirection="props.borderDirection" :linearDeep="props.linearDeep" :linear="props.linear"
          :round="props.round" :color="props.color" :text="_disabled" :transprent="props.transprent" :width="attr.width"
          :height="attr.height" :margin="[0, 0]" :padding="[0, 0]">
          <slot></slot>
        </tm-sheet>
      </view>
    </view>
  </view>
  <!-- #endif -->
  <!-- #ifdef APP-NVUE -->
  <view :style="`width:${attr.width}px;height:${attr.height}px `" class="overflow relative"
    :class="[attr.disabled ? 'opacity-7' : '']">
    <view class="flex flex-row flex-row-center-between">
      <view id="left" :style="{ width: `${leftWidth}px`, height: `${attr.height}px` }">
        <slot name="left"></slot>
      </view>
      <view id="right" :style="{ width: `${rightWidth}px`, height: `${attr.height}px` }">
        <slot name="right"></slot>
      </view>
    </view>
    <view @click="emits('click')" @touchstart.stop="touchstart" id="wrapper" ref="tabsDom" class="absolute l-0 t-0"
      :style="`width:${attr.width}px;height:${attr.height}px;transform:${opened ? '' : 'translate3d( 0px, 0, 0)'
      }`">
      <tm-sheet :eventPenetrationEnabled="true" :shadow="0" :outlined="props.outlined" :borderStyle="props.borderStyle"
        unit="px" :borderDirection="props.borderDirection" :linearDeep="props.linearDeep" :linear="props.linear"
        :round="props.round" :color="props.color" :text="_disabled" :transprent="props.transprent" :width="attr.width"
        :height="attr.height" :margin="[0, 0]" :padding="[0, 0]">
        <slot></slot>
      </tm-sheet>
    </view>
  </view>
  <!-- #endif -->
</template>
<!-- #ifndef APP-NVUE -->
<script module="action" lang="wxs" src="./action.wxs"></script>
<!-- #endif -->
<script lang="ts" setup>
/**
 * 左滑操作栏
 * @description  向左滑动显示底部操作按钮栏。
 */
import {
  computed,
  nextTick,
  onMounted,
  ref,
  getCurrentInstance,
} from "vue";
import { custom_props } from "../../tool/lib/minxs";
import { defaultProps } from "./props";
import tmSheet from "../tm-sheet/tm-sheet.vue";
// @ts-ignore
// #ifdef APP-NVUE
var dom = weex.requireModule("dom");
const Binding = uni.requireNativePlugin("bindingx");
const animation = uni.requireNativePlugin("animation");
// #endif
const proxy = getCurrentInstance()?.proxy ?? null;
const bindxToken = ref(null);
const props = defineProps({
  ...custom_props,
  ...defaultProps,
});
const emits = defineEmits(["click", "update:open-status"]);

const _disabled = ref(props.disabled);
const opened = ref(false);
const closed = ref(false);

const leftWidth = computed(() => props.leftWidth);
const rightWidth = computed(() => props.rightWidth);
const attr = computed(() => {
  return {
    width: Math.ceil(uni.$tm.u.topx(props.width)),
    height: Math.ceil(uni.$tm.u.topx(props.height)),
    disabled: props.disabled,
    leftWidth: props.leftWidth,
    rightWidth: props.rightWidth,
    opened:opened.value,
    closed:closed.value
  };
});
function close() {
  opened.value = false;
  emits("update:open-status", false);
}
function closeOther() {
  // console.log(6666)
  // ARRAY.filter((item) => item !== this).forEach((item) => item.close());
}
function open(arg) {
  opened.value = true;
  emits("update:open-status", true);
  console.log('------')
}

function tap() {
  close();
}
function getLeftRightwidth() {
  // getLeftRightwidth
  return 500;
}
// nvue bingx
let nvue_now_left = 0;
function getEl(el: HTMLElement) {
  if (typeof el === "string" || typeof el === "number") return el;
  if (WXEnvironment) {
    return el.ref;
  } else {
    return el instanceof HTMLElement ? el : el.$el;
  }
}
function spinNvueAniEnd(start: number, end: number, isEnd = false, duration = 300) {
  // #ifdef APP-NVUE
  if (!proxy.$refs?.tabsDom) return;
  animation.transition(
    proxy.$refs.tabsDom,
    {
      styles: {
        transform: `translateX(${start + end}px)`,
        transformOrigin: "center center",
      },
      duration: duration, //ms
      timingFunction: "cubicBezier(0.18, 0.89, 0.32, 1)",
      delay: 0, //ms
    },
    () => {
      if (isEnd) {
        close();
      } else {
        open("right");
      }
    }
  );

  // #endif
}

function touchstart(e: TouchEvent) {
  if (_disabled.value) return;
  // #ifdef APP-NVUE
  if (!proxy.$refs?.tabsDom) return;

  let icon = getEl(proxy.$refs.tabsDom);
  let expression = ``;
  if (nvue_now_left < 0) {
    expression = `x<120&&x>=0?x-120:(x<0?-x:0)`;
  } else {
    expression = `(x<=0&&x>-120)?x+0:-x`;
  }
  let icon_bind = Binding.bind(
    {
      anchor: icon,
      eventType: "pan",
      props: [
        {
          element: icon,
          property: "transform.translateX",
          expression: expression,
        },
      ],
    },
    function (res) {
      if (res.state == "end") {
        let lx = Math.abs(res.deltaX);
        let left = res.deltaX >= 0 ? false : true;

        if (nvue_now_left == -attr.value.rightWidth) {
          if (res.deltaX == 0) {
            spinNvueAniEnd(res.deltaX, 0);
          } else if (res.deltaX < 0) {
            spinNvueAniEnd(res.deltaX, lx);
          } else {
            spinNvueAniEnd(res.deltaX, -lx);
          }
          opened.value = false;
          nvue_now_left = 0;
        } else {
          if (lx > 30 && left) {
            spinNvueAniEnd(res.deltaX, left ? -(attr.value.rightWidth - lx) : 0, true);
            opened.value = true;
            nvue_now_left = -attr.value.rightWidth;
          } else {
            spinNvueAniEnd(res.deltaX, -res.deltaX);
            opened.value = false;
            nvue_now_left = 0;
          }
        }
      } else if (res.state == "start") {
        // isMoveing.value = true
      }
    }
  );
  bindxToken.value = icon_bind.token;
  // #endif
}

onMounted(() => {
  // #ifdef APP-NVUE
  if (props.openStatus) {
    opened.value = true;
    nvue_now_left = -attr.value.rightWidth;
    nextTick(() => {
      spinNvueAniEnd(0, -attr.value.rightWidth);
    });
  }
  // #endif
});

defineExpose({ closeOther, close, open, getLeftRightwidth, rightWidth });

</script>

<style>

</style>
