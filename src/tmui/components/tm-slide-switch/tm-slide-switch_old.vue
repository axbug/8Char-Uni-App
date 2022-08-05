<template>
  <view
    :style="`width:${attr.width}rpx;height:${attr.height}rpx `"
    class="overflow"
    :class="[attr.disabled ? 'opacity-7' : '']"
  >
    <movable-area
      :style="{
        width: attr.width * 2 + 'rpx',
        height: attr.height + 'rpx',
        transform: `translateX(-${_cellwidth}px)`,
      }"
    >
      <movable-view
        :animation="_animation"
        :style="{
          width: attr.width + 'rpx',
          height: attr.height + 'rpx',
        }"
        :x="_cellwidth"
        disabled
        direction="horizontal"
        class="flex flex-1 flex-row flex-between"
      >
        <view></view>
        <view class="flex flex-row flex-row-center-end">
          <tm-sheet
            no-level
            hover-class="opacity-7"
            @click="actionClick(item, index)"
            :margin="[0, 0]"
            :padding="[0, 0]"
            v-for="(item, index) in list"
            :key="index"
            :color="item.color"
            :height="attr.height"
            :width="item.width"
            _class="flex-center flex-row"
          >
            <tm-icon
              :font-size="26"
              _class="pr-8"
              v-if="item.icon"
              :userInteractionEnabled="false"
              :name="item.icon"
            ></tm-icon>
            <tm-text :userInteractionEnabled="false" :label="item.text"></tm-text>
          </tm-sheet>
        </view>
      </movable-view>
      <movable-view
        :animation="_animation"
        @click="onclick"
        @touchstart="startDrag"
        @mousedown="startDrag"
        @touchend="endDrag"
        @mouseleave="endDrag"
        @mouseup="endDrag"
        :disabled="_disabled"
        @change="onChange"
        :x="_mX"
        :style="{
          width: attr.width + 'rpx',
          height: attr.height + 'rpx',
        }"
        class="flex flex-1 flex-row flex-between absolute l-0 t-0"
        direction="horizontal"
      >
        <tm-sheet
          v-if="isRend"
          :shadow="0"
          :outlined="props.outlined"
          :borderStyle="props.borderStyle"
          :borderDirection="props.borderDirection"
          :linearDeep="props.linearDeep"
          :linear="props.linear"
          :round="props.round"
          :color="props.color"
          :text="_disabled"
          :transprent="props.transprent"
          :width="attr.width"
          :height="attr.height"
          :margin="[0, 0]"
          :padding="[0, 0]"
        >
          <slot></slot>
        </tm-sheet>
      </movable-view>
    </movable-area>
  </view>
</template>

<script lang="ts" setup>
/**
 * 左滑操作栏
 * @description  向左滑动显示底部操作按钮栏。
 */
import { computed, nextTick, onMounted, PropType, ref, watch, watchEffect } from "vue";
import { custom_props } from "../../tool/lib/minxs";
import { actionItem } from "./interface";
import tmSheet from "../tm-sheet/tm-sheet.vue";
import tmText from "../tm-text/tm-text.vue";
import tmIcon from "../tm-icon/tm-icon.vue";
const emits = defineEmits(["click", "action-click", "update:open-status"]);
const props = defineProps({
  ...custom_props,
  width: {
    type: Number,
    default: 750,
  },
  height: {
    type: Number,
    default: 88,
  },
  action: {
    type: Array as PropType<Array<actionItem>>,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  transprent: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "white",
  },
  round: {
    type: Number,
    default: 0,
  },
  //当前打开的状态，可以使用v-model:open-status
  openStatus: {
    type: Boolean,
    default: false,
  },
});
let timerId = NaN;
function debounce(func: Function, wait = 500, immediate = false) {
  // 清除定时器
  if (!isNaN(timerId)) clearTimeout(timerId);
  // 立即执行，此类情况一般用不到

  if (immediate) {
    var callNow = !timerId;
    timerId = setTimeout(() => {
      timerId = NaN;
    }, wait);

    if (callNow) typeof func === "function" && func();
  } else {
    // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
    timerId = setTimeout(() => {
      typeof func === "function" && func();
    }, wait);
  }
}
const attr = computed(() => {
  return {
    width: props.width,
    height: props.height,
    disabled: props.disabled,
  };
});
const _disabled = ref(props.disabled);
watchEffect(() => {
  _disabled.value = props.disabled;
});
//宽度。
const _cellwidth = computed(() => uni.upx2px(attr.value.width));
//总实际宽度。
const _cellwidthTotal = computed(() => _cellwidth.value * 2);
const list = computed(() => {
  let lp = props.action.map((el) => {
    return {
      text: el?.text ?? "",
      color: el?.color ?? "white",
      width: el?.width ?? 180,
      icon: el?.icon ?? "",
      ...el,
    };
  });
  return lp;
});
const maxWidth = computed(() => {
  let w = 0;
  for (let i = 0, len = list.value.length; i < len; i++) {
    w += list.value[i].width;
  }
  return uni.upx2px(w);
});
const _x = ref(_cellwidth.value);
const _old_x = ref(_cellwidth.value);
const _mX = ref(_cellwidth.value);
const _isDrag = ref(false);
const isRend = ref(false);
const _animation = ref(false);
const _isCloseAni = ref(true);
let isSwiperAni = false; //当前是否是在滑动当中的复位过程。
let isSwiperAni_x = 0;
let ChaJuli = 0;
let tid = 265988;
let Start_x = 0;
let maxLen = _cellwidth.value - maxWidth.value;
watchEffect(
  () => props.openStatus,
  () => oninit()
);
onMounted(() => {
  nextTick(() => (isRend.value = true));
  setTimeout(() => (_animation.value = true), 300);
});

function oninit() {
  if (props.openStatus) {
    _mX.value = _cellwidth.value;
    uni.$tm.u.debounce(() => {
      _old_x.value = maxLen;
      _mX.value = maxLen;
      Start_x = maxLen;
    }, 40);
  } else {
    _mX.value = _cellwidth.value;
    Start_x = _cellwidth.value;
  }
}
const onChange = (e: Event | TouchEvent) => {
  // #ifndef MP
  _mX.value = e.detail.x;
  if (_isDrag.value) {
    _old_x.value = _mX.value;
  }
  _isDrag.value = false;

  if (_mX.value < maxLen) {
    _disabled.value = true;
  }
  // #endif

  // #ifdef MP
  _x.value = e.detail.x;

  if ((_x.value <= maxLen || _x.value >= _cellwidth.value) && e.detail.source) {
    isSwiperAni = false;
  }
  if (_isDrag.value) {
    _old_x.value = _x.value;
  }
  _isDrag.value = false;
  if (_x.value < maxLen) {
    _disabled.value = true;
  }
  // #endif
};
const startDrag = (e: Event | TouchEvent) => {
  _isDrag.value = true;
};
const endDrag = () => {
  _isCloseAni.value = false;
  if (!attr.value.disabled) {
    _disabled.value = false;
  }
  if (attr.value.disabled) return;

  // #ifndef MP
  _mX.value -= 1;
  ChaJuli = Math.abs(_old_x.value) - Math.abs(_mX.value);
  debounce(
    () => {
      if (ChaJuli > 0) {
        //向左滑动。
        if (ChaJuli >= 10) {
          //恢复到原位。
          // _x.value = _cellwidth.value-maxWidth.value
          _old_x.value = _cellwidth.value - maxWidth.value;
          _mX.value = _old_x.value;
          emits("update:open-status", true);
        } else {
          _x.value = _cellwidth.value;
          _mX.value = _x.value;
          emits("update:open-status", false);
        }
      } else {
        //向右滑动。
        // _x.value = _cellwidth.value
        _old_x.value = _cellwidth.value;
        _mX.value = _cellwidth.value;
        emits("update:open-status", false);
      }
    },
    10,
    false
  );
  // #endif

  // #ifdef MP

  ChaJuli = Start_x - _x.value;
  if (ChaJuli > 0) {
    //向左滑动。
    if (ChaJuli >= 10) {
      //恢复到原位。
      _old_x.value = maxLen;
      _mX.value = _old_x.value;

      emits("update:open-status", true);
    } else {
      _mX.value = _cellwidth.value;
      emits("update:open-status", false);
    }
  } else {
    //向右滑动。
    // _x.value = _cellwidth.value
    _old_x.value = _cellwidth.value;
    _mX.value = _cellwidth.value;
    emits("update:open-status", false);
  }
  Start_x = _mX.value;
  // #endif
};
const onclick = (e: Event) => {
  emits("click", e);
};
const actionClick = (item: actionItem, index: number) => {
  emits("action-click", item, index);
};
</script>

<style></style>
