<template>
  <view
    class="flex flex-row"
    :style="[{ width: `${props.width}rpx`, height: `${props.height}rpx` }]"
  >
    <tmSheet
      text
      :transprent="props.circular"
      :followTheme="false"
      _class="flex flex-row"
      :color="props.bgColor"
      :margin="[0, 0]"
      :padding="[0, 0]"
    >
      <view
        :class="[
          !props.circular ? `` : `round-${10}`,
          'overflow',
          props.disabled || isJianDisabled ? 'opacity-5' : '',
        ]"
      >
        <tmSheet
          :followTheme="props.followTheme"
          :round="props.circular ? 10 : props.round"
          :linear="props.linear"
          :linear-deep="props.linearDeep"
          @click="setStep('-')"
          @longpress="longpressEvent('-')"
          @touchend="endlongpressEvent('-')"
          _class="flex-center"
          :color="props.color"
          :margin="[0, 0]"
          :padding="[0, 0]"
          :height="height"
          :width="props.height"
        >
          <tm-icon
            :userInteractionEnabled="false"
            :font-size="22"
            name="tmicon-minus"
          ></tm-icon>
        </tmSheet>
      </view>
      <input
        :disabled="props.disabledInput || props.disabled"
        @input="inputVal"
        v-model="setVal"
        auto-blur
        :style="[
          {
            height: `${props.height}rpx`,
            textAlign: 'center',
            fontSize: props.fontSize + 'rpx',
            width: `${props.width - 120}rpx`,
            color: tmcomputed.textColor,
          },
        ]"
        type="number"
      />

      <view
        :class="[
          !props.circular ? `` : `round-${10}`,
          'overflow',
          props.disabled || isAddDisabled ? 'opacity-5' : '',
        ]"
      >
        <tmSheet
          :followTheme="props.followTheme"
          :round="props.circular ? 10 : props.round"
          :linear="props.linear"
          :linear-deep="props.linearDeep"
          @click="setStep('+')"
          @longpress="longpressEvent('+')"
          @touchend="endlongpressEvent('+')"
          :_class="'flex-center'"
          :color="props.color"
          :margin="[0, 0]"
          :padding="[0, 0]"
          :height="height"
          :width="props.height"
        >
          <tm-icon
            :userInteractionEnabled="false"
            :font-size="22"
            name="tmicon-plus"
          ></tm-icon>
        </tmSheet>
      </view>
    </tmSheet>
  </view>
</template>
<script lang="ts" setup>
/**
 * 步进器
 * @description 可以根据所需要的步骤进行增加和减少。
 */
import { computed, Ref, ref, nextTick, watch } from "vue";
import { custom_props, computedTheme, computedDark } from "../../tool/lib/minxs";
import { cssstyle, tmVuetify } from "../../tool/lib/interface";
import tmSheet from "../tm-sheet/tm-sheet.vue";
import tmIcon from "../tm-icon/tm-icon.vue";
import { useTmpiniaStore } from "../../tool/lib/tmpinia";
const store = useTmpiniaStore();
const props = defineProps({
  ...custom_props,
  //是否跟随全局主题的变换而变换
  followTheme: {
    type: [Boolean, String],
    default: true,
  },
  width: {
    type: [Number],
    default: 210,
  },
  height: {
    type: [Number],
    default: 52,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  //禁用输入功能
  disabledInput: {
    type: [Boolean],
    default: false,
  },
  black: {
    type: [Boolean, String],
    default: null,
  },

  // 步幅，默认1
  step: {
    type: Number,
    default: 1,
  },
  //固定小数点位数，0表示整数
  fixed: {
    type: Number,
    default: 0,
  },
  //按钮的主题
  color: {
    type: String,
    default: "grey-4", //grey-2
  },
  bgColor: {
    type: String,
    default: "grey-4",
  },
  linear: {
    type: String,
    default: "",
  },
  linearDeep: {
    type: String,
    default: "light",
  },
  round: {
    type: [String, Number],
    default: 2,
  },
  fontSize: {
    type: [String, Number],
    default: 28,
  },
  //圆形按钮。
  circular: {
    type: [Boolean],
    default: false,
  },
  max: {
    type: [Number],
    default: 999,
  },
  min: {
    type: [Number],
    default: 0,
  },
  //按钮增加或者 减少前执行，返回 fase取消当前操作。
  beforeEnter: {
    type: [Function, Boolean],
    default: true,
  },
  modelValue: {
    type: Number,
    default: null,
  },
  defaultValue: {
    type: Number,
    default: null,
  },
});
const emits = defineEmits(["update:modelValue", "change"]);
const setVal: Ref<number> = ref(props.defaultValue ?? 0);
// 设置响应式全局组件库配置表。
const tmcfg = computed<tmVuetify>(() => store.tmStore);
//是否暗黑模式。
const isDark = computed(() => computedDark(props, tmcfg.value));
//计算主题
const tmcomputed = computed<cssstyle>(() =>
  computedTheme({ ...props, color: props.bgColor, text: true }, isDark.value, tmcfg.value)
);

let timeid: number = NaN;
let timeid2: number = NaN;

const isJianDisabled = computed(() => {
  if (setVal.value <= props.min) return true;
  return false;
});

const isAddDisabled = computed(() => {
  if (setVal.value >= props.max) return true;
  return false;
});
watch(
  () => props.modelValue,
  () => {
    setVal.value = forMart(props.modelValue);
  }
);

function strWidth(len: number) {
  let v = "";
  for (let i = 0; i < len - 1; i++) {
    v += "0";
  }
  return v;
}
async function setStep(ty: string) {
  if (props.disabled) return;
  if (typeof props.beforeEnter === "function") {
    uni.showLoading({
      title: "...",
      mask: true,
    });
    let p = await props.beforeEnter(ty);
    if (typeof p === "function") {
      p = await p(ty);
    }
    uni.hideLoading();
    if (!p) return false;
  }
  var val: string | number = !setVal.value ? 0 : setVal.value;

  if (props.fixed > 0) {
    val = val.toFixed(props.fixed);

    if (!val) {
      val = "0." + strWidth(props.fixed) + props.step;
    }
    val = Number(val);
    let _setval: string | number = "0." + strWidth(props.fixed) + props.step;
    _setval = Number(String(_setval));

    if (ty == "+") {
      val += _setval;
      if (val > props.max) {
        val = props.max;
      }
    } else {
      val -= _setval;
      if (val < props.min) {
        val = props.min;
      }
    }
  } else {
    val = val.toFixed(props.fixed);
    val = parseInt(val);
    if (ty == "+") {
      val += props.step;
      if (val > props.max) {
        val = props.max;
      }
    } else {
      val -= props.step;
      if (val < props.min) {
        val = props.min;
      }
    }
  }
  val = Number(val.toFixed(props.fixed));
  if (val < 0) {
    if (val <= props.min) {
      val = props.min;
    }
    clearInterval(timeid);
  } else if (val >= props.max) {
    val = props.max;
    clearInterval(timeid);
  }
  nextTick(function () {
    const realVal = val;
    setVal.value = Number(realVal ? realVal : 0);
    let valss: any =
      isNaN(setVal.value) || typeof setVal.value == "undefined" ? "" : setVal.value;
    emits("update:modelValue", valss);
    emits("change", valss);
  });
}

function inputVal(e) {
  var val = parseFloat(e.detail.value);
  clearTimeout(timeid2);
  timeid2 = setTimeout(function () {
    jianchData(forMart(val));
  }, 150);
}

function jianchData(val: number) {
  if (props.fixed > 0) {
    val = Number(val.toFixed(props.fixed));
    if (isNaN(val) || !val) {
      val = Number("0." + strWidth(props.fixed) + props.step);
    }
  } else if (props.fixed == 0) {
    val = Number(val.toFixed(0));
  }

  if (val < props.min) {
    val = Number(props.min);
  }
  if (val > props.max) {
    val = Number(props.max);
  }
  setVal.value = val;
  emits("update:modelValue", val);
  emits("change", val);
}
function longpressEvent(ty: string) {
  if (props.disabled) return;
  clearInterval(timeid);
  timeid = setInterval(async function () {
    await setStep(ty);
  }, 250);
}
function endlongpressEvent(ty: string) {
  clearInterval(timeid);
}

function forMart(val: string | number): number {
  let v = Number(val);
  if (isNaN(v)) return 0;
  return v;
}
</script>
<style scoped>
.inputInit {
}
</style>
